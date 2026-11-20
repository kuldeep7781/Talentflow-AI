import mongoose from "mongoose";
const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  department: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  employmentType: { type: String, enum: ["Full Time", "Part Time", "Contract", "Internship"], default: "Full Time" },
  description: { type: String, required: true },
  requiredSkills: { type: [String], default: [] },
  experienceRequired: { type: Number, min: 0, default: 0 },
  openings: { type: Number, min: 1, default: 1 },
  status: { type: String, enum: ["Draft", "Open", "Closed"], default: "Draft", index: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });
jobSchema.index({ status: 1, createdAt: -1 });
jobSchema.index({ title: "text", department: "text", description: "text" });
export default mongoose.model("Job", jobSchema);
