import express from "express";
import auth from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";
import {
  getMyProjects,
  updateProjectStatus,
  editProfile,
  getProfile,
  getMyClients,
} from "../controllers/employee.controller.js";

const router = express.Router();
const isEmployee = [auth, allowRoles("EMPLOYEE")];

router.get("/projects", ...isEmployee, getMyProjects);
router.put("/projects/:id/status", ...isEmployee, updateProjectStatus);
router.get("/clients", ...isEmployee, getMyClients);
router.get("/profile", ...isEmployee, getProfile);
router.put("/profile", ...isEmployee, editProfile);

export default router;
