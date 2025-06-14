import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, AccountLayout } from "@solana/spl-token";
import { safeApiCall, isDevelopmentEnvironment } from "./network-utils";

export interface TokenMetadata {
  name: string;
  symbol: string;
  decimals: number;
  logo: string | null;
  isVerified: boolean;
  possibleSpam: boolean;
}

export interface TokenInfo {
  symbol: string;
  name: string;
  balance: number;
  mint: string;
  decimals: number;
  tokenAccount: string;
  logo: string | null;
  isVerified: boolean;
  possibleSpam: boolean;
}

export interface BurnResult {
  transaction: string;
  message: string;
  rpcEndpoint: string;
}

export interface RewardResult {
  success: boolean;
  rewardSignature?: string;
  rewardAmount: number;
  message: string;
}

// CORS headers for API calls
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Cache for token metadata to avoid repeated API calls
const metadataCache = new Map<string, any>();

// Function to get token metadata with caching
async function getTokenMetadata(mintAddress: string) {
  // Check cache first
  if (metadataCache.has(mintAddress)) {
    return metadataCache.get(mintAddress);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(
      `https://solana-gateway.moralis.io/token/mainnet/${mintAddress}/metadata`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          "X-API-Key":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImFhYjRkODU5LTNlNTUtNDVmNi1hNDU0LTIzNTQzMWU4OTgwMCIsIm9yZ0lkIjoiNDQ4MjgzIiwidXNlcklkIjoiNDYxMjI2IiwidHlwZUlkIjoiNDQzMDUxMDEtM2YyNy00ODllLWExZDktMGQyOTM2OTJiNzg2IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3NDc4MTI0NDgsImV4cCI6NDkwMzU3MjQ0OH0.vEnqCnbeAk8sUmVnObhbo3A59MtuVjPKv72AhwQG2Kg",
        },
        signal: controller.signal,
      },
    );

    clearTimeout(timeoutId);

    if (response.ok) {
      const metadata = await response.json();
      const result = {
        name: metadata.name || "Unknown Token",
        symbol: metadata.symbol || `TOKEN_${mintAddress.slice(0, 4)}`,
        decimals: parseInt(metadata.decimals) || 0,
        logo: metadata.logo || null,
        isVerified: metadata.isVerifiedContract || false,
        possibleSpam: metadata.possibleSpam || false,
      };

      // Cache the result
      metadataCache.set(mintAddress, result);
      return result;
    }
  } catch (error) {
    console.error(`Error fetching metadata for ${mintAddress}:`, error);
  }

  // Fallback metadata
  const fallback = {
    name: "Unknown Token",
    symbol: `TOKEN_${mintAddress.slice(0, 4)}`,
    decimals: 0,
    logo: null,
    isVerified: false,
    possibleSpam: false,
  };

  // Cache fallback too to avoid repeated failed requests
  metadataCache.set(mintAddress, fallback);
  return fallback;
}

class RealBonkBurnAPI {
  private connection: Connection;

  constructor() {
    // Use optimized connection configuration
    this.connection = new Connection(
      "https://mainnet.helius-rpc.com/?api-key=942e3a40-34f7-4b22-b9a5-2b1d5c171c37",
      {
        commitment: "confirmed",
        wsEndpoint: undefined, // Disable websocket for better performance
        disableRetryOnRateLimit: false,
        confirmTransactionInitialTimeout: 60000,
      },
    );
  }

  async fetchUserTokens(publicKey: string): Promise<TokenInfo[]> {
    try {
      console.log("Fetching tokens for wallet:", publicKey);

      const walletPublicKey = new PublicKey(publicKey);

      // Get all token accounts for the wallet with timeout
      const tokenAccountsPromise = this.connection.getTokenAccountsByOwner(
        walletPublicKey,
        {
          programId: TOKEN_PROGRAM_ID,
        },
      );

      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timeout")), 15000),
      );

      const tokenAccounts = (await Promise.race([
        tokenAccountsPromise,
        timeoutPromise,
      ])) as any;

      console.log("Found token accounts:", tokenAccounts.value.length);
      const tokens: TokenInfo[] = [];

      // Process token accounts in batches to avoid overwhelming the API
      const batchSize = 5;
      for (let i = 0; i < tokenAccounts.value.length; i += batchSize) {
        const batch = tokenAccounts.value.slice(i, i + batchSize);

        const batchPromises = batch.map(async (tokenAccount: any) => {
          try {
            const accountData = AccountLayout.decode(tokenAccount.account.data);
            const mintAddress = accountData.mint.toString();
            const balance = Number(accountData.amount);

            if (balance > 0) {
              // Get token metadata
              const metadata = await getTokenMetadata(mintAddress);

              // Skip spam tokens with very low balance
              if (metadata.possibleSpam && balance < 1000) {
                return null;
              }

              const formattedBalance =
                metadata.decimals > 0
                  ? balance / Math.pow(10, metadata.decimals)
                  : balance;

              return {
                symbol: metadata.symbol,
                name: metadata.name,
                balance: formattedBalance,
                mint: mintAddress,
                decimals: metadata.decimals,
                tokenAccount: tokenAccount.pubkey.toString(),
                logo: metadata.logo,
                isVerified: metadata.isVerified,
                possibleSpam: metadata.possibleSpam,
              };
            }
            return null;
          } catch (error) {
            console.error("Error processing token account:", error);
            return null;
          }
        });

        const batchResults = await Promise.allSettled(batchPromises);
        batchResults.forEach((result) => {
          if (result.status === "fulfilled" && result.value) {
            tokens.push(result.value);
          }
        });

        // Small delay between batches to avoid rate limiting
        if (i + batchSize < tokenAccounts.value.length) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }

      // Sort tokens: verified first, then by balance
      tokens.sort((a, b) => {
        if (a.isVerified && !b.isVerified) return -1;
        if (!a.isVerified && b.isVerified) return 1;
        return b.balance - a.balance;
      });

      console.log("Final tokens:", tokens);
      return tokens;
    } catch (error) {
      console.error("Error fetching tokens:", error);
      throw new Error("Failed to fetch your tokens. Please try again.");
    }
  }

  async createBurnTransaction(
    publicKey: string,
    tokenMint: string,
    amount: number,
    decimals: number,
  ): Promise<BurnResult> {
    console.log("Creating burn transaction:", {
      publicKey,
      tokenMint,
      amount,
      decimals,
    });

    // Use mock API only in local development
    if (
      isDevelopmentEnvironment() &&
      window.location.hostname === "localhost"
    ) {
      console.log("Local development detected, using mock API");
      const { mockAPIServer } = await import("./mockApiServer");
      return await mockAPIServer.mockBurn({
        publicKey,
        tokenMint,
        amount,
        decimals,
      });
    }

    // Always try the real Vercel API first (works both in dev and production)
    try {
      console.log("Calling Vercel API for burn transaction");

      const response = await fetch("/api/burn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
        body: JSON.stringify({
          publicKey,
          tokenMint,
          amount,
          decimals,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorData.details || errorMessage;
        } catch {
          // If response is HTML (404 page), extract meaningful info
          if (errorText.includes("404") || errorText.includes("Not Found")) {
            errorMessage =
              "API endpoint not found. Make sure the app is deployed correctly.";
          }
        }

        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log("Burn transaction created successfully:", result);
      return result;
    } catch (error) {
      console.error("Error calling Vercel API:", error);

      // Only fallback to mock in local development
      if (window.location.hostname === "localhost") {
        console.log("Falling back to mock API for local development");
        const { mockAPIServer } = await import("./mockApiServer");
        return await mockAPIServer.mockBurn({
          publicKey,
          tokenMint,
          amount,
          decimals,
        });
      }

      throw error;
    }
  }

  async processReward(
    publicKey: string,
    burnSignature: string,
    tokenSymbol: string,
    burnAmount: number,
  ): Promise<RewardResult> {
    console.log("Processing reward:", {
      publicKey,
      burnSignature,
      tokenSymbol,
      burnAmount,
    });

    // Use mock API only in local development
    if (
      isDevelopmentEnvironment() &&
      window.location.hostname === "localhost"
    ) {
      console.log("Local development detected, using mock API for rewards");
      const { mockAPIServer } = await import("./mockApiServer");
      return await mockAPIServer.mockReward({
        publicKey,
        burnSignature,
        tokenSymbol,
        burnAmount,
      });
    }

    // Always try the real Vercel API first (works both in dev and production)
    try {
      console.log("Calling Vercel API for reward processing");

      const response = await fetch("/api/reward", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
        body: JSON.stringify({
          publicKey,
          burnSignature,
          tokenSymbol,
          burnAmount,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorData.details || errorMessage;
        } catch {
          // If response is HTML (404 page), extract meaningful info
          if (errorText.includes("404") || errorText.includes("Not Found")) {
            errorMessage =
              "Reward API endpoint not found. Make sure the app is deployed correctly.";
          }
        }

        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log("Reward processed successfully:", result);
      return result;
    } catch (error) {
      console.error("Error calling reward API:", error);

      // Only fallback to mock in local development
      if (window.location.hostname === "localhost") {
        console.log(
          "Falling back to mock API for rewards in local development",
        );
        const { mockAPIServer } = await import("./mockApiServer");
        return await mockAPIServer.mockReward({
          publicKey,
          burnSignature,
          tokenSymbol,
          burnAmount,
        });
      }

      throw error;
    }
  }

  formatTokenAmount(amount: number, decimals: number): string {
    // If amount is already formatted (small number), use it directly
    if (amount < 1000 && decimals > 0) {
      if (amount < 0.001) {
        return amount.toExponential(2);
      }
      return amount.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: Math.min(decimals, 6),
      });
    }

    // If amount is raw token amount, format it
    if (decimals === 0) {
      return amount.toLocaleString();
    }

    const formatted = amount / Math.pow(10, decimals);
    if (formatted < 0.001) {
      return formatted.toExponential(2);
    }
    return formatted.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: Math.min(decimals, 6),
    });
  }

  shortenAddress(address: string, chars = 4): string {
    return `${address.slice(0, chars)}...${address.slice(-chars)}`;
  }
}

export const realBonkBurnAPI = new RealBonkBurnAPI();
