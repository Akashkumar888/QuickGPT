import mongoose from "mongoose";

const connectDB=async()=>{
  try {
    // MongoDB connection events
  mongoose.connection.on("connected", () => {
    console.log("✅ Database connected successfully.");
  });

  mongoose.connection.on("error", (err) => {
    console.error("❌ Database connection error:", err);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("⚠️ Database disconnected.");
  });

    await mongoose.connect(`${process.env.MONGODB_URI}/QuickGPT`);
  } catch (error) {
    console.error("❌ Initial connection failed:", error);
    process.exit(1);
  }
}

export default connectDB;