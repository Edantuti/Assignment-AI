import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import { JWT_SECRET } from "./middleware/jwt.middleware";
const JWT_EXPIRES_IN = "1h";
const SALT_ROUNDS = 10;
const DB_URI = process.env.DB_URI;

export const isPasswordCorrect = async (
  enteredPassword: string,
  storedPassword: string,
): Promise<boolean> => {
  try {
    return await bcrypt.compare(enteredPassword, storedPassword);
  } catch (err) {
    console.error(err);
    throw new Error("Error comparing passwords");
  }
};
export const generateToken = (payload: object): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};
export const hashPassword = async (password: string): Promise<string> => {
  try {
    return await bcrypt.hash(password, SALT_ROUNDS);
  } catch (err) {
    console.error(err);
    throw new Error("Error hashing password");
  }
};

export const connectDB = async () => {
  try {
    if (!DB_URI) {
      console.error("DB_URI not declared.");
      return;
    }
    await mongoose.connect(DB_URI);
    console.log("MongoDB Connected successfully");
  } catch (error) {
    console.error("MongoDB Connection error:", error);
    return;
  }
};
