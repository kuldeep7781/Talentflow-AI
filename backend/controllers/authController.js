import * as authService from "../services/authService.js";
export async function register(req, res) {
  const result = await authService.registerCandidate(req.body);
  res.status(201).json({ success: true, data: result });
}
export async function login(req, res) {
  const result = await authService.login(req.body);
  res.json({ success: true, data: result });
}
export async function me(req, res) {
  res.json({ success: true, data: req.user });
}
