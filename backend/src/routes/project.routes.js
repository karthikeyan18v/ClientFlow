import express from "express";
import auth from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";
import { assignEmployees } from "../controllers/project.controller.js";

const router = express.Router();

router.put("/:id/assign", auth, allowRoles("ADMIN"), assignEmployees);

export default router;