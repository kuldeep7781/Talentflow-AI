import mongoose from "mongoose";
const interviewSchema = new mongoose.Schema({
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: "Application", required: true, index: true },
  interviewerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  scheduledAt: { type: Date, required: true, index: true },
  durationMinutes: { type: Number, min: 15, max: 240, default: 60 },
  interviewType: { type: String, enum: ["Technical", "HR", "Managerial", "Other"], default: "Technical" },
  meetingLink: { type: String, trim: true },
  status: { type: String, enum: ["Scheduled", "Completed", "Cancelled"], default: "Scheduled" },
  feedback: { rating: { type: Number, min: 1, max: 5 }, strengths: String, concerns: String, recommendation: { type: String, enum: ["Strong Yes", "Yes", "Hold", "No"] }, submittedAt: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });
interviewSchema.index({ interviewerId: 1, scheduledAt: 1 });
export default mongoose.model("Interview", interviewSchema);
