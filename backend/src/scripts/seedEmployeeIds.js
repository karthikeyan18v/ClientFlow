import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import User from "../models/User.js";

await mongoose.connect(process.env.MONGO_URI);

const employees = await User.find({ role: "EMPLOYEE", employeeId: { $in: [null, undefined, ""] } });

for (let i = 0; i < employees.length; i++) {
  const count = await User.countDocuments({ role: "EMPLOYEE", employeeId: { $nin: [null, undefined, ""] } });
  employees[i].employeeId = `EMP${String(count + 1).padStart(4, "0")}`;
  await employees[i].save();
  console.log(`Assigned ${employees[i].employeeId} to ${employees[i].name}`);
}

console.log("Done");
await mongoose.disconnect();
