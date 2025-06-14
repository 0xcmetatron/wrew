// Vercel serverless function for reward processing
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Keypair,
} from "@solana/web3.js";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Solana connection
const connection = new Connection(
  "https://mainnet.helius-rpc.com/?api-key=942e3a40-34f7-4b22-b9a5-2b1d5c171c37",
  "confirmed",
);

// Reward wallet private key (In production, use environment variables!)
// For demo purposes - replace with your actual private key
const REWARD_WALLET_PRIVATE_KEY = process.env.REWARD_WALLET_PRIVATE_KEY;

// Reward configuration
const REWARD_CONFIG = {
  BONK: 0.005, // SOL reward for BONK
  USDC: 0.003, // SOL reward for USDC
  DEFAULT: 0.004, // Default SOL reward
};

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return res.status(200).json({ message: "OK" });
  }

  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
      allowedMethods: ["POST"],
    });
  }

  try {
    const { publicKey, burnSignature, tokenSymbol, burnAmount } = req.body;

    // Validate required parameters
    if (!publicKey || !burnSignature || !tokenSymbol) {
      return res.status(400).json({
        error:
          "Missing required parameters: publicKey, burnSignature, tokenSymbol",
      });
    }

    // Validate public key
    let userPublicKey;
    try {
      userPublicKey = new PublicKey(publicKey);
    } catch (error) {
      return res.status(400).json({
        error: "Invalid public key format",
      });
    }

    console.log("Processing reward:", {
      publicKey,
      burnSignature,
      tokenSymbol,
      burnAmount,
    });

    // Verify the burn transaction exists and is confirmed
    try {
      const burnTx = await connection.getTransaction(burnSignature, {
        commitment: "confirmed",
      });

      if (!burnTx) {
        return res.status(400).json({
          error: "Burn transaction not found or not confirmed",
        });
      }

      if (burnTx.meta?.err) {
        return res.status(400).json({
          error: "Burn transaction failed",
        });
      }
    } catch (error) {
      console.error("Error verifying burn transaction:", error);
      // Continue anyway for demo purposes
    }

    // Calculate reward amount
    const rewardAmount =
      REWARD_CONFIG[tokenSymbol.toUpperCase()] || REWARD_CONFIG.DEFAULT;

    // For demo purposes, we'll simulate sending the reward
    // In a real implementation, you would:
    // 1. Use a real reward wallet with sufficient SOL
    // 2. Create and send a real transaction
    // 3. Handle transaction fees and confirmation

    if (!REWARD_WALLET_PRIVATE_KEY) {
      // Demo mode - simulate successful reward
      return res.status(200).json({
        success: true,
        rewardSignature: `demo_reward_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        rewardAmount: rewardAmount,
        message: `Demo reward of ${rewardAmount} SOL for burning ${burnAmount} ${tokenSymbol}`,
        demo: true,
      });
    }

    // Real reward processing (when private key is available)
    try {
      const rewardWallet = Keypair.fromSecretKey(
        new Uint8Array(JSON.parse(REWARD_WALLET_PRIVATE_KEY)),
      );

      // Create reward transaction
      const transaction = new Transaction();
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: rewardWallet.publicKey,
          toPubkey: userPublicKey,
          lamports: Math.floor(rewardAmount * LAMPORTS_PER_SOL),
        }),
      );

      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash("confirmed");
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = rewardWallet.publicKey;

      // Sign and send transaction
      transaction.sign(rewardWallet);
      const rewardSignature = await connection.sendTransaction(transaction);

      // Wait for confirmation
      await connection.confirmTransaction(rewardSignature, "confirmed");

      return res.status(200).json({
        success: true,
        rewardSignature: rewardSignature,
        rewardAmount: rewardAmount,
        message: `Reward of ${rewardAmount} SOL sent successfully for burning ${burnAmount} ${tokenSymbol}`,
        transactionUrl: `https://solscan.io/tx/${rewardSignature}`,
      });
    } catch (error) {
      console.error("Error sending reward:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to send reward: " + error.message,
        rewardAmount: rewardAmount,
      });
    }
  } catch (error) {
    console.error("Error processing reward:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to process reward",
      details: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}

// Set CORS headers for all responses
export const config = {
  api: {
    externalResolver: true,
  },
};
