import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import ServiceRequest from "../models/ServiceRequest.js";

await mongoose.connect(process.env.MONGO_URI);

const result = await ServiceRequest.deleteMany({ title: { $exists: false } });
console.log(`Deleted ${result.deletedCount} old requests without title`);

await mongoose.disconnect();
