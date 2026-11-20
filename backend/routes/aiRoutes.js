import { Router } from "express";
import { getAIHealth } from "../controllers/aiController.js";
const router = Router();
router.get("/health", getAIHealth);
export default router;
