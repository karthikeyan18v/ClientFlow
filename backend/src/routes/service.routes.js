import express from "express";
import auth from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";
import { createService, getServices, deleteService } from "../controllers/service.controller.js";

const router = express.Router();

router.post("/", auth, allowRoles("ADMIN"), createService);
router.get("/", auth, getServices);
router.delete("/:id", auth, allowRoles("ADMIN"), deleteService);

export default router;