import mongoose from "mongoose";

//function to connect to mongodb databse

export const connectDB = async () => {
  try {
        mongoose.connection.on("connected", () => console.log("Database connected"));

       const conn = await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`,)
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error);
   
  }
}