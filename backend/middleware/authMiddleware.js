import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");
    if (scheme !== "Bearer" || !token) return res.status(401).json({ message: "Authentication required" });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub).select("name email role isActive");
    if (!user || !user.isActive) return res.status(401).json({ message: "Account is unavailable" });
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") return res.status(401).json({ message: "Invalid or expired access token" });
    next(error);
  }
}

export const allowRoles = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Authentication required" });
  if (!roles.includes(req.user.role)) return res.status(403).json({ message: "You do not have permission to perform this action" });
  next();
};
