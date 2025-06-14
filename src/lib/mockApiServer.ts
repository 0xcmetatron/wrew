// Mock API server responses for development
// This simulates your API endpoints locally

import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import {
  createBurnInstruction,
  getAssociatedTokenAddress,
} from "@solana/spl-token";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Mock API endpoints that simulate your server responses
export class MockAPIServer {
  private connection: Connection;

  constructor() {
    this.connection = new Connection(
      "https://mainnet.helius-rpc.com/?api-key=942e3a40-34f7-4b22-b9a5-2b1d5c171c37",
      {
        commitment: "confirmed",
        disableRetryOnRateLimit: true,
        confirmTransactionInitialTimeout: 60000,
      },
    );
  }

  // Mock burn endpoint
  async mockBurn(request: {
    publicKey: string;
    tokenMint: string;
    amount: number;
    decimals: number;
  }) {
    try {
      console.log("Mock API: Creating burn transaction for", request);

      console.log("🔥 Mock API: Creating burn transaction", request);

      const { publicKey, tokenMint, amount, decimals } = request;

      if (!publicKey || !tokenMint || amount === undefined || amount === null) {
        throw new Error("Missing required parameters for burn transaction");
      }

      // Validate public key format
      try {
        new PublicKey(publicKey);
        new PublicKey(tokenMint);
      } catch (error) {
        throw new Error("Invalid public key or token mint format");
      }

      // Simulate some processing time
      await new Promise((resolve) => setTimeout(resolve, 500));

      const userPublicKey = new PublicKey(publicKey);
      const mintPublicKey = new PublicKey(tokenMint);

      // Get the user's associated token account
      const userTokenAccount = await getAssociatedTokenAddress(
        mintPublicKey,
        userPublicKey,
      );

      // Create burn instruction
      const burnInstruction = createBurnInstruction(
        userTokenAccount,
        mintPublicKey,
        userPublicKey,
        amount,
      );

      // Create transaction
      const transaction = new Transaction();
      transaction.add(burnInstruction);

      // Get recent blockhash - no buffering
      const result = await this.connection.getLatestBlockhash("confirmed");
      transaction.recentBlockhash = result.blockhash;
      transaction.feePayer = userPublicKey;

      // Serialize transaction without Buffer dependency
      const serializedTransaction = transaction.serialize({
        requireAllSignatures: false,
        verifySignatures: false,
      });

      // Convert to base64 using native browser APIs
      const base64Transaction = btoa(
        String.fromCharCode(...serializedTransaction),
      );

      console.log("Mock API: Burn transaction created successfully");

      return {
        transaction: base64Transaction,
        message: "Mock burn transaction created successfully",
        rpcEndpoint: this.connection.rpcEndpoint,
      };
    } catch (error) {
      console.error("Mock API: Error creating burn transaction:", error);
      throw new Error(
        `Mock API burn failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      console.log("✅ Mock API: Burn transaction created successfully");

      return {
        transaction: serializedTransaction.toString("base64"),
        message: "Mock: Transaction created successfully",
        rpcEndpoint: this.connection.rpcEndpoint,
      };
    } catch (error) {
      console.error("❌ Mock API: Error creating burn transaction:", error);
      throw new Error(
        `Mock API: Failed to create burn transaction - ${error instanceof Error ? error.message : "Unknown error"}`,
>>>>>>> f2baa7371ab17fe613a23ed06ff2cb2b66cff4a2
      );
    }
  }

  // Mock reward endpoint
  async mockReward(request: {
    publicKey: string;
    burnSignature: string;
    tokenSymbol: string;
    burnAmount: number;
  }) {
    try {
      console.log("Mock API: Processing reward for", request);
      console.log("🎁 Mock API: Processing reward", request);

      const { publicKey, burnSignature, tokenSymbol, burnAmount } = request;

      if (!publicKey || !burnSignature) {
        throw new Error("Missing required parameters for reward processing");
      }

      // No buffering - immediate response
      const rewardAmount = 0.004; // Mock reward amount
      const mockRewardSignature = `mock_reward_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      console.log("✅ Mock API: Reward processed successfully");

      // Calculate mock reward based on token amount
      let rewardAmount = 0.004; // Default SOL reward

      // Vary reward slightly based on token symbol for realism
      if (tokenSymbol === "BONK") {
        rewardAmount = 0.005;
      } else if (tokenSymbol === "USDC") {
        rewardAmount = 0.003;
      }

      console.log("Mock API: Reward processed successfully");

      // Mock successful reward
      return {
        success: true,
        rewardSignature: "mock_reward_signature_" + Date.now(),
        rewardAmount: rewardAmount,
        message: `Mock reward of ${rewardAmount} SOL sent successfully for burning ${burnAmount} ${tokenSymbol}`,
      };
    } catch (error) {
      console.error("Mock API: Error processing reward:", error);
      return {
        success: false,
        message: `Mock API reward failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        rewardSignature: mockRewardSignature,
        rewardAmount: rewardAmount,
        message: `Mock: Reward of ${rewardAmount} SOL sent successfully for burning ${burnAmount} ${tokenSymbol}`,
      };
    } catch (error) {
      console.error("❌ Mock API: Error processing reward:", error);
      return {
        success: false,
        message: `Mock API: Failed to send reward - ${error instanceof Error ? error.message : "Unknown error"}`,
>>>>>>> f2baa7371ab17fe613a23ed06ff2cb2b66cff4a2
        rewardAmount: 0,
      };
    }
  }
}

export const mockAPIServer = new MockAPIServer();
