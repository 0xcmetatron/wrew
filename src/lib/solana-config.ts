// Optimized Solana configuration without heavy polyfills
import { Connection, clusterApiUrl } from "@solana/web3.js";

// RPC endpoints configuration
const RPC_ENDPOINTS = {
  mainnet:
    "https://mainnet.helius-rpc.com/?api-key=942e3a40-34f7-4b22-b9a5-2b1d5c171c37",
  devnet: clusterApiUrl("devnet"),
  testnet: clusterApiUrl("testnet"),
};

// Create optimized connection with proper configuration
export function createSolanaConnection(
  network: keyof typeof RPC_ENDPOINTS = "mainnet",
) {
  return new Connection(RPC_ENDPOINTS[network], {
    commitment: "confirmed",
    wsEndpoint: undefined, // Disable websocket to reduce resource usage
    disableRetryOnRateLimit: false,
    confirmTransactionInitialTimeout: 60000,
  });
}

// Default connection instance
export const connection = createSolanaConnection();

// Utility functions for common operations
export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function formatTokenAmount(amount: number, decimals: number): string {
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

// Constants for token filtering
export const MINIMUM_TOKEN_BALANCE = 1000;
export const METADATA_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
export const REQUEST_TIMEOUT = 15000; // 15 seconds
