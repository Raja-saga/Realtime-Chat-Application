import mongoose from "mongoose";

//function to connect to mongodb databse

export const connectDB = async () => {
  try {

      mongoose.connection.once("connected", () => {
      console.log("✅ Database connection established.");
    });

        mongoose.connection.on("connected", () => console.log("Database connected"));

       const conn = await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`,)
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    console.error(error);
   
  }
}