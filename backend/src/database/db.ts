import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config();


export const connect_db = async () => {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('Database URL is not present in .env file!');
    }
    await mongoose.connect(process.env.DATABASE_URL);
    
    console.log('Database connected successfully!');

  } catch (err: any) {
    console.log('Database connection failed!');
    process.exit(1);
  }
}