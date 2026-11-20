import * as recruitment from "../services/recruitmentService.js";
import Candidate from "../models/Candidate.js";
import Application from "../models/Application.js";
import Interview from "../models/Interview.js";
import path from "node:path";

export async function getJobs(req, res) { res.json({ success: true, data: await recruitment.listJobs(req.query) }); }
export async function createJob(req, res) { res.status(201).json({ success: true, data: await recruitment.createJob(req.body, req.user._id) }); }
export async function updateJob(req, res) { const job = await recruitment.updateJob(req.params.id, req.body); if (!job) return res.status(404).json({ message: "Job not found" }); res.json({ success: true, data: job }); }
export async function deleteJob(req, res) { const job = await recruitment.updateJob(req.params.id, { status: "Closed" }); if (!job) return res.status(404).json({ message: "Job not found" }); res.json({ success: true, message: "Job closed", data: job }); }
export async function apply(req, res) {
  if (!req.file) return res.status(400).json({ message: "A PDF resume is required" });
  if (req.file.buffer.subarray(0, 5).toString("ascii") !== "%PDF-") {
    return res.status(415).json({ message: "Uploaded file content is not a valid PDF" });
  }
  const candidate = await Candidate.findOne({ userId: req.user._id });
  if (!candidate) return res.status(404).json({ message: "Candidate profile not found" });
  const application = await recruitment.applyToJob(candidate, req.params.jobId, req.file);
  res.status(201).json({ success: true, data: application });
}
export async function myApplications(req, res) { const candidate = await Candidate.findOne({ userId: req.user._id }); if (!candidate) return res.status(404).json({ message: "Candidate profile not found" }); res.json({ success: true, data: await recruitment.listMyApplications(candidate._id) }); }
export async function applications(req, res) { res.json({ success: true, data: await recruitment.listApplications(req.query) }); }
export async function updateApplicationStatus(req, res) { const result = await recruitment.updateApplicationStatus(req.params.id, req.body.status, req.user._id); if (!result) return res.status(404).json({ message: "Application not found" }); res.json({ success: true, data: result }); }
export async function interviews(req, res) { res.json({ success: true, data: await recruitment.listMyInterviews(req.user) }); }
export async function scheduleInterview(req, res) { const interview = await recruitment.scheduleInterview(req.body, req.user._id); res.status(201).json({ success: true, data: interview }); }
export async function feedback(req, res) { const interview = await recruitment.submitFeedback(req.params.id, req.user._id, req.body); res.json({ success: true, data: interview }); }
export async function dashboard(req, res) { res.json({ success: true, data: await recruitment.getDashboardStats() }); }

export async function interviewers(req, res) { res.json({ success: true, data: await recruitment.listInterviewers() }); }


export async function downloadApplicationResume(req, res) {
  const application = await Application.findById(req.params.id).select("resumePath");
  if (!application) return res.status(404).json({ message: "Application not found" });
  if (req.user.role === "INTERVIEWER") {
    const assigned = await Interview.exists({ applicationId: application._id, interviewerId: req.user._id });
    if (!assigned) return res.status(403).json({ message: "You are not assigned to this application" });
  }
  const uploadRoot = path.resolve(process.cwd(), "uploads", "resumes");
  const filePath = path.resolve(process.cwd(), application.resumePath || "");
  if (!filePath.startsWith(uploadRoot + path.sep)) return res.status(404).json({ message: "Resume file not found" });
  return res.sendFile(filePath, (error) => {
    if (error && !res.headersSent) res.status(error.statusCode || 404).json({ message: "Resume file not found" });
  });
}
