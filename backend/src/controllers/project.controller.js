import Project from "../models/Project.js";

/**
 * ADMIN assigns employees to a project
 */
export const assignEmployees = async (req, res) => {
  try {
    const { employeeIds } = req.body;
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { employeeIds },
      { new: true }
    )
      .populate("clientId", "name email companyName")
      .populate("employeeIds", "name email designation department");

    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
