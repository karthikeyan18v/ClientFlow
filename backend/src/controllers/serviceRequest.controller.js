import ServiceRequest from "../models/ServiceRequest.js";
import Project from "../models/Project.js";

/**
 * CLIENT submits a request
 */
export const createRequest = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const existing = await ServiceRequest.findOne({ clientId: req.user.id, title, status: "PENDING" });
    if (existing) return res.status(400).json({ message: "You already have a pending request with this title" });

    const request = await ServiceRequest.create({ clientId: req.user.id, title, description });
    res.status(201).json(request);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * CLIENT views own requests
 */
export const getMyRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ clientId: req.user.id }).sort({ createdAt: -1 });
    res.json(requests);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ADMIN views all requests
 */
export const getRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find()
      .populate("clientId", "name email companyName")
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ADMIN approves request → AUTO CREATE PROJECT
 */
export const approveRequest = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.status !== "PENDING") return res.status(400).json({ message: "Request already processed" });

    request.status = "APPROVED";
    await request.save();

    const project = await Project.create({
      name: request.title,
      description: request.description || "Auto-created from client request",
      clientId: request.clientId,
    });

    res.json({ message: "Approved & project created", project });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ADMIN rejects request
 */
export const rejectRequest = async (req, res) => {
  try {
    const { reason } = req.body;
    const request = await ServiceRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.status !== "PENDING") return res.status(400).json({ message: "Request already processed" });

    request.status = "REJECTED";
    request.rejectionReason = reason;
    await request.save();

    res.json({ message: "Request rejected" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
