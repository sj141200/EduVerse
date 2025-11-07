import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import videoRoutes from "./routes/video.js";
import { SecretClient } from "@azure/keyvault-secrets";
import { DefaultAzureCredential } from "@azure/identity";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const keyVaultUrl = process.env.KEY_VAULT_URL;
const credential = new DefaultAzureCredential();
const client = new SecretClient(keyVaultUrl, credential);

let mongoURI = "";
let azureStorageConnection = "";

async function loadSecrets() {
  try {
    const mongoSecret = await client.getSecret("MONGO-URI");
    const storageSecret = await client.getSecret("AZURE-STORAGE-CONNECTION");
    mongoURI = mongoSecret.value;
    azureStorageConnection = storageSecret.value;
    console.log("✅ Secrets loaded from Azure Key Vault");
    connectDB();
  } catch (err) {
    console.error("❌ Error loading secrets:", err.message);
  }
}

async function connectDB() {
  try {
    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
  }
}

app.get("/", (req, res) => res.send("🎬 EduVerse Video Service Running..."));
app.use("/api/videos", videoRoutes);

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`🚀 Video Service running on port ${PORT}`));
loadSecrets();
export { azureStorageConnection };
