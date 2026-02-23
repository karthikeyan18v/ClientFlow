import Project from "../models/Project.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

const VALID_STATUSES = ["NOT_STARTED", "IN_PROGRESS", "ON_HOLD", "COMPLETED"];

/**
 * EMPLOYEE: View assigned projects
 */
export const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ employeeIds: req.user.id })
      .populate("clientId", "name email companyName companyPhone")
      .populate("employeeIds", "name email designation department");
    res.json(projects);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * EMPLOYEE: Update status of an assigned project
 */
export const updateProjectStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${VALID_STATUSES.join(", ")}` });
    }

    const project = await Project.findOne({ _id: req.params.id, employeeIds: req.user.id });
    if (!project) return res.status(404).json({ message: "Project not found or not assigned to you" });

    project.status = status;
    await project.save();
    res.json(project);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * EMPLOYEE: Edit own profile
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const editProfile = async (req, res) => {
  try {
    const { name, phone, department, designation, password } = req.body;
    const update = { name, phone, department, designation };
    if (password) update.password = await bcrypt.hash(password, 10);
    Object.keys(update).forEach((k) => update[k] === undefined && delete update[k]);
    const user = await User.findByIdAndUpdate(req.user.id, update, { new: true }).select("-password");
    res.json(user);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * EMPLOYEE: Get clients from assigned projects (to message them)
 */
export const getMyClients = async (req, res) => {
  try {
    const projects = await Project.find({ employeeIds: req.user.id })
      .populate("clientId", "name email companyName companyPhone");

    const clientMap = new Map();
    projects.forEach((p) => {
      if (p.clientId) clientMap.set(p.clientId._id.toString(), p.clientId);
    });

    res.json([...clientMap.values()]);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
