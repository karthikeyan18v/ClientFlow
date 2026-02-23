import express from "express";
import auth from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";

const router = express.Router();

router.get("/admin", auth, allowRoles("ADMIN"), (req, res) => {
  res.json({ message: "Admin route working 🚀" });
});

export default router;