import Project from "../models/Project.js";
import ServiceRequest from "../models/ServiceRequest.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

/**
 * CLIENT: View own projects
 */
export const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ clientId: req.user.id })
      .populate("employeeIds", "name email designation department");
    res.json(projects);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * CLIENT: Request a new service
 */
export const requestService = async (req, res) => {
  try {
    const { serviceId } = req.body;
    const existing = await ServiceRequest.findOne({
      clientId: req.user.id,
      serviceId,
      status: "PENDING",
    });
    if (existing) return res.status(400).json({ message: "Request already pending" });

    const request = await ServiceRequest.create({ clientId: req.user.id, serviceId });
    res.status(201).json(request);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * CLIENT: View own service requests
 */
export const getMyRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ clientId: req.user.id })
      .populate("serviceId", "name description");
    res.json(requests);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * CLIENT: Edit own profile
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
    const {
      name, phone, companyName, companyAddress,
      companyPhone, companyWebsite, gstNumber, contactPerson,
      password,
    } = req.body;

    const update = {
      name, phone, companyName, companyAddress,
      companyPhone, companyWebsite, gstNumber, contactPerson,
    };

    if (password) {
      update.password = await bcrypt.hash(password, 10);
    }

    // Remove undefined keys
    Object.keys(update).forEach((k) => update[k] === undefined && delete update[k]);

    const user = await User.findByIdAndUpdate(req.user.id, update, { new: true }).select("-password");
    res.json(user);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * CLIENT: Get assigned employees for their projects
 */
export const getMyEmployees = async (req, res) => {
  try {
    const projects = await Project.find({ clientId: req.user.id })
      .populate("employeeIds", "name email designation department phone");

    const employeeMap = new Map();
    projects.forEach((p) =>
      p.employeeIds.forEach((e) => employeeMap.set(e._id.toString(), e))
    );

    res.json([...employeeMap.values()]);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
