import express from "express";
import auth from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";
import {
  getDashboard,
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
  getEmployees,
  getClients,
  getProfile,
  editProfile,
} from "../controllers/admin.controller.js";

const router = express.Router();

const isAdmin = [auth, allowRoles("ADMIN")];

router.get("/dashboard", ...isAdmin, getDashboard);
router.get("/employees", ...isAdmin, getEmployees);
router.get("/clients", ...isAdmin, getClients);
router.get("/projects", ...isAdmin, getAllProjects);
router.post("/projects", ...isAdmin, createProject);
router.put("/projects/:id", ...isAdmin, updateProject);
router.delete("/projects/:id", ...isAdmin, deleteProject);
router.get("/profile", ...isAdmin, getProfile);
router.put("/profile", ...isAdmin, editProfile);

export default router;
