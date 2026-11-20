const AI_SERVICE_URL = (process.env.AI_SERVICE_URL || "http://127.0.0.1:8000").replace(/\/+$/, "");
const TIMEOUT_MS = 15000;
export class AIServiceError extends Error {
  constructor(message, statusCode, cause) { super(message, { cause }); this.name = "AIServiceError"; this.statusCode = statusCode; }
}
export async function checkAIServiceHealth() {
  return requestJSON(`${AI_SERVICE_URL}/health`);
}
export async function parseResume(buffer, filename) {
  const form = new FormData();
  form.append("file", new Blob([buffer], { type: "application/pdf" }), filename);
  return requestJSON(`${AI_SERVICE_URL}/api/v1/resumes/parse`, { method: "POST", body: form });
}
export async function matchCandidate(parsedResume, job) {
  return requestJSON(`${AI_SERVICE_URL}/api/v1/matching/score`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ resume: parsedResume, job: { title: job.title, description: job.description, required_skills: job.requiredSkills, experience_required: job.experienceRequired } }) });
}
async function requestJSON(url, options = {}) {
  let response;
  try { response = await fetch(url, { ...options, headers: { Accept: "application/json", ...options.headers }, signal: AbortSignal.timeout(TIMEOUT_MS) }); }
  catch (error) { if (error.name === "TimeoutError" || error.name === "AbortError") throw new AIServiceError("AI service request timed out", 504, error); throw new AIServiceError("AI service is currently unavailable", 503, error); }
  if (!response.ok) {
    let detail = `AI service returned HTTP ${response.status}`;
    try { const body = await response.json(); detail = body.detail || body.message || detail; } catch {}
    const statusCode = response.status >= 400 && response.status < 500 ? response.status : 502;
    throw new AIServiceError(detail, statusCode);
  }
  try { return await response.json(); } catch (error) { throw new AIServiceError("AI service returned an invalid response", 502, error); }
}
