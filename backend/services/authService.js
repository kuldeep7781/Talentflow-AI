import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Candidate from "../models/Candidate.js";

export async function registerCandidate({ name, email, password }) {
  if (!name?.trim() || !email?.trim() || !password || password.length < 8) {
    const error = new Error("Name, valid email and password (at least 8 characters) are required"); error.statusCode = 400; throw error;
  }
  const normalizedEmail = email.trim().toLowerCase();
  if (await User.exists({ email: normalizedEmail })) { const error = new Error("An account with this email already exists"); error.statusCode = 409; throw error; }
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name: name.trim(), email: normalizedEmail, passwordHash, role: "CANDIDATE" });
  const candidate = await Candidate.create({ userId: user._id, name: user.name, email: user.email });
  return issueSession(user, candidate);
}

export async function login({ email, password }) {
  const user = await User.findOne({ email: email?.trim().toLowerCase() }).select("+passwordHash");
  if (!user || !await bcrypt.compare(password || "", user.passwordHash)) { const error = new Error("Invalid email or password"); error.statusCode = 401; throw error; }
  if (!user.isActive) { const error = new Error("Account is disabled"); error.statusCode = 403; throw error; }
  const candidate = user.role === "CANDIDATE" ? await Candidate.findOne({ userId: user._id }) : null;
  return issueSession(user, candidate);
}

function issueSession(user, candidate = null) {
  const token = jwt.sign({ sub: user._id.toString(), role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "8h" });
  return { token, user: { id: user._id, name: user.name, email: user.email, role: user.role, candidateId: candidate?._id || null } };
}
