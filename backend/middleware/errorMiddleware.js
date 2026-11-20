export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  // Log a compact error record. Replace with structured Pino logging in the next release.
  console.error({ name: error.name, message: error.message, path: req.originalUrl, method: req.method });
  if (error.code === 11000) return res.status(409).json({ message: "A record with this value already exists" });
  if (error.name === "ValidationError") return res.status(400).json({ message: "Validation failed", details: Object.values(error.errors).map((item) => item.message) });
  if (error.name === "CastError") return res.status(400).json({ message: "Invalid resource identifier" });
  if (error.name === "MulterError" || error.message === "Only PDF resumes are supported") return res.status(400).json({ message: error.message });
  if (Number.isInteger(error.statusCode) && error.statusCode >= 400 && error.statusCode <= 599) return res.status(error.statusCode).json({ message: error.message });
  return res.status(500).json({ message: "Internal server error" });
}
