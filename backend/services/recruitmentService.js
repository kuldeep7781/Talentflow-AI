import Candidate from "../models/Candidate.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import Interview from "../models/Interview.js";
import User from "../models/User.js";
import { parseResume, matchCandidate } from "./aiService.js";
import { saveResume } from "../utils/fileStorage.js";

export async function listJobs(query = {}) {
  const filter = {};
  // Public job discovery must never expose Draft or Closed positions.
  filter.status = "Open";
  if (query.search) filter.$text = { $search: query.search };
  const page = Math.max(1, Number(query.page) || 1); const limit = Math.min(50, Math.max(1, Number(query.limit) || 10));
  const [items, total] = await Promise.all([Job.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit), Job.countDocuments(filter)]);
  return { items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
}
export async function createJob(data, userId) { return Job.create({ ...data, createdBy: userId }); }
export async function updateJob(id, data) { return Job.findByIdAndUpdate(id, data, { new: true, runValidators: true }); }
export async function listApplications(query = {}) {
  const filter = {}; if (query.status) filter.status = query.status; if (query.jobId) filter.jobId = query.jobId;
  const page = Math.max(1, Number(query.page) || 1); const limit = Math.min(50, Math.max(1, Number(query.limit) || 10));
  const [items, total] = await Promise.all([Application.find(filter).populate("candidateId", "name email skills experience").populate("jobId", "title department location").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit), Application.countDocuments(filter)]);
  return { items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
}
export async function applyToJob(candidate, jobId, file) {
  const job = await Job.findOne({ _id: jobId, status: "Open" });
  if (!job) { const error = new Error("This job is not currently accepting applications"); error.statusCode = 404; throw error; }
  const parsedResume = await parseResume(file.buffer, file.originalname);
  const matchResult = await matchCandidate(parsedResume, job);
  const resumePath = await saveResume(file);
  return Application.create({ candidateId: candidate._id, jobId, resumePath, parsedResume, matchResult });
}
export async function listMyApplications(candidateId) { return Application.find({ candidateId }).populate("jobId", "title department location status").sort({ createdAt: -1 }); }
export async function updateApplicationStatus(id, status, userId) {
  const allowed = ["Screening", "Shortlisted", "Rejected", "Hired"];
  if (!allowed.includes(status)) { const error = new Error("Invalid application status"); error.statusCode = 400; throw error; }
  return Application.findByIdAndUpdate(id, { status, reviewedBy: userId }, { new: true, runValidators: true }).populate("candidateId jobId");
}
export async function listMyInterviews(user) {
  const filter = user.role === "INTERVIEWER" ? { interviewerId: user._id } : {};
  return Interview.find(filter).populate({ path: "applicationId", populate: [{ path: "candidateId", select: "name email skills" }, { path: "jobId", select: "title department" }] }).populate("interviewerId", "name email").sort({ scheduledAt: 1 });
}
export async function scheduleInterview(data, userId) {
  const interviewer = await User.findOne({ _id: data.interviewerId, role: "INTERVIEWER", isActive: true });
  if (!interviewer) { const error = new Error("A valid active interviewer must be assigned"); error.statusCode = 400; throw error; }
  const scheduledAt = new Date(data.scheduledAt);
  if (Number.isNaN(scheduledAt.getTime()) || scheduledAt <= new Date()) { const error = new Error("Interview must be scheduled for a future date and time"); error.statusCode = 400; throw error; }
  const application = await Application.findById(data.applicationId);
  if (!application) { const error = new Error("Application not found"); error.statusCode = 404; throw error; }
  if (application.status !== "Shortlisted") { const error = new Error("Only shortlisted applications can be scheduled for an interview"); error.statusCode = 409; throw error; }
  return Interview.create({ ...data, scheduledAt, createdBy: userId });
}
export async function submitFeedback(interviewId, interviewerId, feedback) {
  const interview = await Interview.findOne({ _id: interviewId, interviewerId });
  if (!interview) { const error = new Error("Assigned interview not found"); error.statusCode = 404; throw error; }
  if (interview.status === "Completed" || interview.status === "Cancelled") { const error = new Error("Feedback cannot be changed for a completed or cancelled interview"); error.statusCode = 409; throw error; }
  const rating = Number(feedback.rating);
  const recommendations = ["Strong Yes", "Yes", "Hold", "No"];
  if (!Number.isInteger(rating) || rating < 1 || rating > 5 || !feedback.strengths?.trim() || !recommendations.includes(feedback.recommendation)) {
    const error = new Error("A rating from 1 to 5, strengths and a valid recommendation are required"); error.statusCode = 400; throw error;
  }
  interview.feedback = { ...feedback, rating, submittedAt: new Date() }; interview.status = "Completed"; await interview.save(); return interview;
}
export async function getDashboardStats() {
  const [jobs, applications, interviews, byStatus] = await Promise.all([
    Job.countDocuments({ status: "Open" }), Application.countDocuments(), Interview.countDocuments({ status: "Scheduled" }),
    Application.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }, { $sort: { _id: 1 } }]),
  ]);
  return { openJobs: jobs, totalApplications: applications, upcomingInterviews: interviews, applicationsByStatus: byStatus };
}
export async function getCandidateForUser(userId) { return Candidate.findOne({ userId }); }

export async function listInterviewers() {
  return User.find({ role: "INTERVIEWER", isActive: true }).select("name email").sort({ name: 1 });
}
