import multer from "multer";
const storage = multer.memoryStorage();
export const resumeUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, callback) => {
    const validMime = file.mimetype === "application/pdf";
    const validExtension = file.originalname.toLowerCase().endsWith(".pdf");
    if (!validMime || !validExtension) return callback(new Error("Only PDF resumes are supported"));
    callback(null, true);
  },
});
