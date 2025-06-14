// Streamlined API implementation for BonkBurn
// Re-exports from realApi for consistency

export {
  type TokenInfo,
  type TokenMetadata,
  type BurnResult,
  type RewardResult,
  realBonkBurnAPI as bonkBurnAPI,
} from "./realApi";

// Export the main API instance as default
export { realBonkBurnAPI as default } from "./realApi";
