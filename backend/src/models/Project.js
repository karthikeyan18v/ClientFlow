import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },

    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    },

    employeeIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    status: {
      type: String,
      enum: ["NOT_STARTED", "IN_PROGRESS", "ON_HOLD", "COMPLETED"],
      default: "NOT_STARTED",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);