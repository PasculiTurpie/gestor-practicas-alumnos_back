import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI;

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB...");
  } catch (err) {
    console.error("❌ Could not connect to MongoDB:", err.message);
    process.exit(1); // detiene el proceso si no logra conectar
  }
};

