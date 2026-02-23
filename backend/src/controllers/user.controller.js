import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { sendClientWelcomeEmail, sendEmployeeWelcomeEmail } from "../utils/mailer.js";

/**
 * Admin creates Employee or Client
 */
export const createUser = async (req, res) => {
  try {
    const {
      name, email, password, role,
      // Client fields
      companyName, companyAddress, companyPhone, companyWebsite, gstNumber, contactPerson,
      // Employee fields
      phone, department, designation, joiningDate, employeeId,
    } = req.body;

    if (role === "ADMIN") {
      return res.status(403).json({ message: "Cannot create admin" });
    }

    if (!["CLIENT", "EMPLOYEE"].includes(role)) {
      return res.status(400).json({ message: "Role must be CLIENT or EMPLOYEE" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = { name, email, password: hashedPassword, role };

    if (role === "CLIENT") {
      Object.assign(userData, { companyName, companyAddress, companyPhone, companyWebsite, gstNumber, contactPerson });
    } else {
      const count = await User.countDocuments({ role: "EMPLOYEE" });
      const autoEmployeeId = `EMP${String(count + 1).padStart(4, "0")}`;
      Object.assign(userData, { phone, department, designation, joiningDate, employeeId: autoEmployeeId });
    }

    const user = await User.create(userData);

    try {
      if (role === "CLIENT") await sendClientWelcomeEmail(user, password);
      else await sendEmployeeWelcomeEmail(user, password);
    } catch (mailErr) {
      console.warn("Email send failed:", mailErr.message);
    }

    res.status(201).json({ message: "User created successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * Admin gets all users
 */
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Admin deletes user
 */
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
