import User from "../models/User.js";
import Project from "../models/Project.js";
import Service from "../models/Service.js";
import ServiceRequest from "../models/ServiceRequest.js";
import bcrypt from "bcryptjs";

/**
 * Dashboard stats
 */
export const getDashboard = async (req, res) => {
  try {
    const [totalClients, totalEmployees, totalProjects, pendingRequests, projectsByStatus] =
      await Promise.all([
        User.countDocuments({ role: "CLIENT" }),
        User.countDocuments({ role: "EMPLOYEE" }),
        Project.countDocuments(),
        ServiceRequest.countDocuments({ status: "PENDING" }),
        Project.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      ]);

    res.json({ totalClients, totalEmployees, totalProjects, pendingRequests, projectsByStatus });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get all projects (with client & employee details)
 */
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("clientId", "name email companyName")
      .populate("employeeIds", "name email designation department")
      .populate("serviceId", "name description");
    res.json(projects);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Create project manually
 */
export const createProject = async (req, res) => {
  try {
    const { name, description, clientId, employeeIds, status } = req.body;
    const project = await Project.create({ name, description, clientId, employeeIds, status });
    res.status(201).json(project);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Update project (name, description, status, employees, client)
 */
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("clientId", "name email companyName")
      .populate("employeeIds", "name email designation department");
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Delete project
 */
export const deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get all employees
 */
export const getEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: "EMPLOYEE" }).select("-password");
    res.json(employees);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get all clients
 */
export const getClients = async (req, res) => {
  try {
    const clients = await User.find({ role: "CLIENT" }).select("-password");
    res.json(clients);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Admin edit own profile
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
    const { name, password } = req.body;
    const update = { name };
    if (password) update.password = await bcrypt.hash(password, 10);
    Object.keys(update).forEach((k) => update[k] === undefined && delete update[k]);
    const user = await User.findByIdAndUpdate(req.user.id, update, { new: true }).select("-password");
    res.json(user);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
