import "dotenv/config";
import "../config/dns.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/User.js";
await mongoose.connect(process.env.MONGO_URI);



const users = [
  { name: "TalentFlow HR", email: process.env.SEED_HR_EMAIL, password: process.env.SEED_HR_PASSWORD, role: "HR" },
  { name: "TalentFlow Interviewer", email: process.env.SEED_INTERVIEWER_EMAIL, password: process.env.SEED_INTERVIEWER_PASSWORD, role: "INTERVIEWER" },
];
for (const item of users) {
  if (!item.email || !item.password) { console.log(`Skipping ${item.role}: seed credentials not configured`); continue; }
  const passwordHash = await bcrypt.hash(item.password, 12);
  await User.updateOne({ email: item.email.toLowerCase() }, { $set: { name: item.name, email: item.email.toLowerCase(), passwordHash, role: item.role, isActive: true } }, { upsert: true });
  console.log(`Provisioned ${item.role}: ${item.email}`);
}
await mongoose.disconnect();
