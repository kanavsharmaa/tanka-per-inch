import mongoose from "mongoose";
import { DB_Name } from "../constants.js";

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI)
  throw new Error("Please provide MONGODB_URI in the environment variables");

export const connectToDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${MONGO_URI}/${DB_Name}`
    );
    console.log("Connected to MongoDB");
    // console.log("Connection Instance: ", connectionInstance);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
