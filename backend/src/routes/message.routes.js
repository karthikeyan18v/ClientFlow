import express from "express";
import auth from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";
import { sendMessage, getConversation, getInbox, getContacts } from "../controllers/message.controller.js";

const router = express.Router();

const isAnyRole = [auth, allowRoles("ADMIN", "EMPLOYEE", "CLIENT")];

router.get("/contacts", ...isAnyRole, getContacts);
router.post("/", ...isAnyRole, sendMessage);
router.get("/inbox", ...isAnyRole, getInbox);
router.get("/:userId", ...isAnyRole, getConversation);

export default router;
