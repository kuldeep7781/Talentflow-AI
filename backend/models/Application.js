import mongoose from "mongoose";
const applicationSchema = new mongoose.Schema({
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate", required: true, index: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true, index: true },
  status: { type: String, enum: ["Applied", "Screening", "Shortlisted", "Rejected", "Hired", "Withdrawn"], default: "Applied", index: true },
  resumePath: { type: String, required: true },
  parsedResume: { type: mongoose.Schema.Types.Mixed, default: {} },
  matchResult: { type: mongoose.Schema.Types.Mixed, default: null },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  appliedAt: { type: Date, default: Date.now },
}, { timestamps: true });
applicationSchema.index({ candidateId:  1, jobId: 1 }, { unique: true });
applicationSchema.index({ status: 1, createdAt: -1 });
export default mongoose.model("Application", applicationSchema);
