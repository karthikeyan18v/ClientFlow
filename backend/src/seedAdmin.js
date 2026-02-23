import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const existing = await User.findOne({ email: "admin@test.com" });

if (!existing) {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  await User.create({
    name: "Admin",
    email: "admin@test.com",
    password: hashedPassword,
    role: "ADMIN",
  });

  console.log("Admin created");
} else {
  console.log("Admin already exists");
}

process.exit();