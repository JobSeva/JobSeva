import multer from "multer";
import path from "path";
import fs from "fs";
import { AppError } from "../common/errors";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/resumes/";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req: any, file, cb) => {
    const userId = req.auth?.userId || "anonymous";
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `resume-${userId}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError(400, "Invalid file type. Only PDF, DOC, and DOCX are allowed.", "INVALID_FILE_TYPE"), false);
  }
};

export const uploadResumeMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
}).single("resume");
