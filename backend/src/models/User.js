import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["ADMIN", "EMPLOYEE", "CLIENT"],
      default: "CLIENT",
    },

    // CLIENT fields
    companyName: { type: String },
    companyAddress: { type: String },
    companyPhone: { type: String },
    companyWebsite: { type: String },
    gstNumber: { type: String },
    contactPerson: { type: String },

    // EMPLOYEE fields
    phone: { type: String },
    department: { type: String },
    designation: { type: String },
    joiningDate: { type: Date },
    employeeId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);