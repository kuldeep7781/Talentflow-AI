import { checkAIServiceHealth } from "../services/aiService.js";
export async function getAIHealth(req, res) {
  const data = await checkAIServiceHealth();
  res.status(200).json({ success: true, message: "AI service is reachable", data });
}
