import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to Azure Cosmos DB"))
  .catch(err => console.error("❌ Connection failed:", err));


