import express from "express";
import auth from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";
import { createRequest, getMyRequests, getRequests, approveRequest, rejectRequest } from "../controllers/serviceRequest.controller.js";

const router = express.Router();

router.post("/", auth, allowRoles("CLIENT"), createRequest);
router.get("/my", auth, allowRoles("CLIENT"), getMyRequests);
router.get("/", auth, allowRoles("ADMIN"), getRequests);
router.put("/:id/approve", auth, allowRoles("ADMIN"), approveRequest);
router.put("/:id/reject", auth, allowRoles("ADMIN"), rejectRequest);

export default router;
