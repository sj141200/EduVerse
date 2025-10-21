import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
const app = express();
app.use(express.json());

// routes
import classroomRoutes from "./routes/classroomRoutes.js";
app.use("/api/classrooms", classroomRoutes);

// database connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to Azure Cosmos DB"))
  .catch((err) => console.log("❌ Database connection failed:", err.message));


app.get("/", (req, res) => {
  res.send("EduVerse Backend API is running successfully 🚀");
});



// server start
app.listen(process.env.PORT || 5000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
});


