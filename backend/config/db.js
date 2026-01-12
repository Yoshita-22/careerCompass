// config/db.js
import mongoose from "mongoose";

export async function connectDB(mongoUri) {
  if (!mongoUri) throw new Error("MONGO_URI is required");

  try {
    // Optional: control strictQuery behaviour if you want
    // mongoose.set('strictQuery', false);

    const conn = await mongoose.connect(mongoUri);
    return conn;
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
}
