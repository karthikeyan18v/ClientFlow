import express from "express";
import auth from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";
import {
  getMyProjects,
  editProfile,
  getProfile,
  getMyEmployees,
} from "../controllers/client.controller.js";

const router = express.Router();

router.get("/projects", auth, allowRoles("CLIENT"), getMyProjects);
router.get("/employees", auth, allowRoles("CLIENT"), getMyEmployees);
router.get("/profile", auth, allowRoles("CLIENT"), getProfile);
router.put("/profile", auth, allowRoles("CLIENT"), editProfile);

export default router;
