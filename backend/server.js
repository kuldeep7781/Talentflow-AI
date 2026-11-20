import "dotenv/config";
import "./config/dns.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import recruitmentRoutes from "./routes/recruitmentRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";
import { authenticate, allowRoles } from "./middleware/authMiddleware.js";
import { errorHandler } from "./middleware/errorMiddleware.js";



const app = express();
const PORT = process.env.PORT || 5000;
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32)
  throw new Error("JWT_SECRET must be configured with at least 32 characters");
app.use(helmet());
app.use(
  cors({
    origin: (process.env.CLIENT_ORIGIN || "http://localhost:5173").split(","),
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(
  "/api/auth",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    standardHeaders: "draft-8",
    legacyHeaders: false,
  }),
  authRoutes,
);
app.get("/api/health", (req, res) =>
  res.json({ status: "ok", service: "talentflow-api" }),
);
app.use("/api/ai", aiRoutes);
app.use("/api", recruitmentRoutes);
app.use("/api/candidates", authenticate, allowRoles("HR"), candidateRoutes);
app.use(errorHandler);

connectDB()
  .then(() =>
    app.listen(PORT, () =>
      console.log(`TalentFlow API listening on port ${PORT}`),
    ),
  )
  .catch((error) => {
    console.error("Unable to start API:", error.message);
    process.exit(1);
  });
