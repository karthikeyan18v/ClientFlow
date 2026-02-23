import express from "express";
import auth from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";

import {
  createUser,
  getUsers,
  deleteUser,
} from "../controllers/user.controller.js";

const router = express.Router();

/**
 * Admin only routes
 */
router.post("/", auth, allowRoles("ADMIN"), createUser);
router.get("/", auth, allowRoles("ADMIN"), getUsers);
router.delete("/:id", auth, allowRoles("ADMIN"), deleteUser);

export default router;