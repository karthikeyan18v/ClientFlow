import Message from "../models/Message.js";
import User from "../models/User.js";
import Project from "../models/Project.js";

/**
 * Get allowed contacts for the logged-in user
 */
export const getContacts = async (req, res) => {
  try {
    if (req.user.role === "ADMIN") {
      const users = await User.find({ _id: { $ne: req.user.id } }).select("name email role");
      return res.json(users);
    }

    if (req.user.role === "EMPLOYEE") {
      const projects = await Project.find({ employeeIds: req.user.id }).populate("clientId", "name email role");
      const admin = await User.find({ role: "ADMIN" }).select("name email role");
      const clientMap = new Map();
      projects.forEach((p) => { if (p.clientId) clientMap.set(p.clientId._id.toString(), p.clientId); });
      const contacts = [...admin, ...clientMap.values()];
      return res.json(contacts);
    }

    if (req.user.role === "CLIENT") {
      const projects = await Project.find({ clientId: req.user.id }).populate("employeeIds", "name email role");
      const admin = await User.find({ role: "ADMIN" }).select("name email role");
      const empMap = new Map();
      projects.forEach((p) => p.employeeIds?.forEach((e) => empMap.set(e._id.toString(), e)));
      const contacts = [...admin, ...empMap.values()];
      return res.json(contacts);
    }

    res.json([]);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Send a message
 * CLIENT can message ADMIN or assigned EMPLOYEE
 * ADMIN can message anyone
 * EMPLOYEE can message CLIENT or ADMIN
 */
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;

    if (!content?.trim()) return res.status(400).json({ message: "Message cannot be empty" });

    const receiver = await User.findById(receiverId);
    if (!receiver) return res.status(404).json({ message: "Receiver not found" });

    // EMPLOYEE can only message ADMIN or clients from assigned projects
    if (req.user.role === "EMPLOYEE") {
      if (receiver.role === "CLIENT") {
        const project = await Project.findOne({
          employeeIds: req.user.id,
          clientId: receiverId,
        });
        if (!project) return res.status(403).json({ message: "You can only message clients assigned to your projects" });
      } else if (receiver.role !== "ADMIN") {
        return res.status(403).json({ message: "Employees can only message admin or their project clients" });
      }
    }

    // CLIENT can only message ADMIN or their assigned employees
    if (req.user.role === "CLIENT") {
      if (receiver.role === "EMPLOYEE") {
        const project = await Project.findOne({
          clientId: req.user.id,
          employeeIds: receiverId,
        });
        if (!project) return res.status(403).json({ message: "You can only message employees assigned to your projects" });
      } else if (receiver.role !== "ADMIN") {
        return res.status(403).json({ message: "Clients can only message admin or assigned employees" });
      }
    }

    const message = await Message.create({
      senderId: req.user.id,
      receiverId,
      content: content.trim(),
    });

    res.status(201).json(message);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get conversation between logged-in user and another user
 */
export const getConversation = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: req.user.id, receiverId: userId },
        { senderId: userId, receiverId: req.user.id },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("senderId", "name role")
      .populate("receiverId", "name role");

    res.json(messages);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get all conversations (inbox) for logged-in user
 */
export const getInbox = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ senderId: req.user.id }, { receiverId: req.user.id }],
    })
      .sort({ createdAt: -1 })
      .populate("senderId", "name role")
      .populate("receiverId", "name role");

    // Return latest message per conversation partner
    const seen = new Set();
    const inbox = [];
    for (const msg of messages) {
      const partnerId =
        msg.senderId._id.toString() === req.user.id
          ? msg.receiverId._id.toString()
          : msg.senderId._id.toString();
      if (!seen.has(partnerId)) {
        seen.add(partnerId);
        inbox.push(msg);
      }
    }

    res.json(inbox);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
