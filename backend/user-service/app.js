// app.js - EduVerse Backend (Key Vault Integrated)
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { DefaultAzureCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";

dotenv.config();
const app = express();
app.use(express.json());

// Function to load secrets securely from Azure Key Vault
async function loadSecrets() {
  try {
    const vaultName = process.env.KEY_VAULT_NAME || "eduversekeyvault";
    const vaultUrl = `https://${vaultName}.vault.azure.net`;
    const credential = new DefaultAzureCredential();
    const client = new SecretClient(vaultUrl, credential);

    // Fetch secrets
    const mongoSecret = await client.getSecret("MONGO-URI");
    const storageSecret = await client.getSecret("AZURE-STORAGE-CONNECTION");

    // Store them as environment variables
    process.env.MONGO_URI = mongoSecret.value;
    process.env.AZURE_STORAGE_CONNECTION = storageSecret.value;

    console.log("✅ Secrets loaded successfully from Azure Key Vault");
  } catch (error) {
    console.error("❌ Error loading secrets from Key Vault:", error);
  }
}

// Start server only after secrets are loaded
async function startServer() {
  await loadSecrets();

  // Connect to MongoDB (Cosmos)
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to Cosmos DB (Mongo API)");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

startServer();
