import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import testRoutes from "./routes/test.routes.js";
import serviceRoutes from "./routes/service.routes.js";
import requestRoutes from "./routes/serviceRequest.routes.js";
import projectRoutes from "./routes/project.routes.js";
import userRoutes from "./routes/user.routes.js";
import clientRoutes from "./routes/client.routes.js";
import employeeRoutes from "./routes/employee.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import messageRoutes from "./routes/message.routes.js";

dotenv.config();
connectDB().then(async () => {
  const { default: User } = await import("./models/User.js");
  const { default: bcrypt } = await import("bcryptjs");
  const exists = await User.findOne({ email: "admin@test.com" });
  if (!exists) {
    await User.create({ name: "Admin", email: "admin@test.com", password: await bcrypt.hash("admin123", 10), role: "ADMIN" });
    console.log("Admin seeded");
  }
});

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    const allowed = [process.env.CLIENT_URL, "http://localhost:3000"];
    if (!origin || allowed.includes(origin) || origin.endsWith(".vercel.app")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
app.use(express.json());

app.get("/", (req, res) => res.send("Backend running 🚀"));

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/users", userRoutes);
app.use("/api/client", clientRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/messages", messageRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
