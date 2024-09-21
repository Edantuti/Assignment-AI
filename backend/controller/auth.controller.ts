import { Request, Response } from "express";
import User from "../models/user.model";
import { hashPassword, isPasswordCorrect } from "../utils";
import { generateToken } from "../utils";
import { MongooseError } from "mongoose";
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isValidPassword = await isPasswordCorrect(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken({ id: user._id, email: user.email });

    res.status(200).json({ token, message: "Login successful" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = generateToken({ id: newUser._id, email: newUser.email });

    res.status(201).json({ token, message: "Registration successful" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
