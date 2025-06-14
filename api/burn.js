// Vercel serverless function for token burning
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import {
  createBurnInstruction,
  getAssociatedTokenAddress,
} from "@solana/spl-token";

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
    const { publicKey, tokenMint, amount, decimals } = req.body;

    // Validate required parameters
    if (!publicKey || !tokenMint || !amount || decimals === undefined) {
      return res.status(400).json({
        error:
          "Missing required parameters: publicKey, tokenMint, amount, decimals",
      });
    }

    // Validate public keys
    let userPublicKey, mintPublicKey;
    try {
      userPublicKey = new PublicKey(publicKey);
      mintPublicKey = new PublicKey(tokenMint);
    } catch (error) {
      return res.status(400).json({
        error: "Invalid public key format",
      });
    }

    console.log("Creating burn transaction:", {
      publicKey,
      tokenMint,
      amount,
      decimals,
    });

    // Get the user's associated token account
    const userTokenAccount = await getAssociatedTokenAddress(
      mintPublicKey,
      userPublicKey,
    );

    // Create burn instruction
    const burnInstruction = createBurnInstruction(
      userTokenAccount, // token account
      mintPublicKey, // mint
      userPublicKey, // owner
      BigInt(amount), // amount as BigInt
    );

    // Create transaction
    const transaction = new Transaction();
    transaction.add(burnInstruction);

    // Get recent blockhash
    const { blockhash } = await connection.getLatestBlockhash("confirmed");
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = userPublicKey;

    // Serialize transaction
    const serializedTransaction = transaction.serialize({
      requireAllSignatures: false,
      verifySignatures: false,
    });

    // Convert to base64
    const base64Transaction = Buffer.from(serializedTransaction).toString(
      "base64",
    );

    // Return success response
    return res.status(200).json({
      transaction: base64Transaction,
      message: "Burn transaction created successfully",
      rpcEndpoint: connection.rpcEndpoint,
      burnAmount: amount,
      tokenMint: tokenMint,
    });
  } catch (error) {
    console.error("Error creating burn transaction:", error);

    return res.status(500).json({
      error: "Failed to create burn transaction",
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
