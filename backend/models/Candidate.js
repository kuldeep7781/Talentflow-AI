import mongoose from "mongoose";
const candidateSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, sparse: true, index: true },
  name: { type: String, required: true, trim: true, minlength: 2 },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  skills: { type: [String], default: [] },
  experience: { type: Number, min: 0, default: 0 },
  education: { type: [String], default: [] },
  resumePath: { type: String },
  status: { type: String, enum: ["Available", "Interviewing", "Hired", "Rejected"], default: "Available" },
}, { timestamps: true });
export default mongoose.model("Candidate", candidateSchema);
