import Service from "../models/Service.js";

export const createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const getServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteService = async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: "Service deleted" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};