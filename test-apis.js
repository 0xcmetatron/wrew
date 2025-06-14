// Script para probar las APIs de burn y reward
// Ejecutar con: node test-apis.js

const BASE_URL = process.env.API_URL || "http://localhost:3000";

// Datos de prueba
const testData = {
  publicKey: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263", // Ejemplo
  tokenMint: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263", // BONK mint
  amount: 1000000, // 10 BONK (5 decimales)
  decimals: 5,
  tokenSymbol: "BONK",
};

async function testBurnAPI() {
  console.log("🔥 Testing Burn API...");

  try {
    const response = await fetch(`${BASE_URL}/api/burn`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        publicKey: testData.publicKey,
        tokenMint: testData.tokenMint,
        amount: testData.amount,
        decimals: testData.decimals,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("✅ Burn API Success:");
      console.log("- Transaction created:", !!data.transaction);
      console.log("- Message:", data.message);
      console.log("- RPC Endpoint:", data.rpcEndpoint);
      return data.transaction;
    } else {
      console.log("❌ Burn API Error:");
      console.log("- Status:", response.status);
      console.log("- Error:", data.error);
      console.log("- Details:", data.details);
    }
  } catch (error) {
    console.log("❌ Burn API Network Error:", error.message);
  }

  return null;
}

async function testRewardAPI(burnSignature = "demo_signature_123") {
  console.log("\n💰 Testing Reward API...");

  try {
    const response = await fetch(`${BASE_URL}/api/reward`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        publicKey: testData.publicKey,
        burnSignature: burnSignature,
        tokenSymbol: testData.tokenSymbol,
        burnAmount: testData.amount,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("✅ Reward API Success:");
      console.log("- Success:", data.success);
      console.log("- Reward Amount:", data.rewardAmount, "SOL");
      console.log("- Message:", data.message);
      console.log("- Reward Signature:", data.rewardSignature);
      console.log("- Demo Mode:", data.demo || false);
    } else {
      console.log("❌ Reward API Error:");
      console.log("- Status:", response.status);
      console.log("- Error:", data.error);
      console.log("- Details:", data.details);
    }
  } catch (error) {
    console.log("❌ Reward API Network Error:", error.message);
  }
}

async function main() {
  console.log("🚀 Testing BonkBurn APIs");
  console.log("Base URL:", BASE_URL);
  console.log("=".repeat(50));

  // Test burn API
  const transaction = await testBurnAPI();

  // Test reward API
  await testRewardAPI();

  console.log("\n" + "=".repeat(50));
  console.log("🎉 API Tests Complete!");

  if (transaction) {
    console.log("\n📝 Next steps:");
    console.log("1. Sign the transaction with a wallet");
    console.log("2. Submit to Solana network");
    console.log("3. Get the transaction signature");
    console.log("4. Call reward API with the signature");
  }
}

// Ejecutar tests
main().catch(console.error);
