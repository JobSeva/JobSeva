import { Router, Response } from "express";
import { requireAuth } from "../middleware/auth";
import { uploadResumeMiddleware } from "../middleware/upload.middleware";
import { seekerProfileService } from "../services/seeker-profile.service";
import { AuthenticatedRequest } from "../types/auth";
import { asyncHandler } from "../middleware/async-handler";
import { success } from "../common/http";
import { AppError } from "../common/errors";

const userRouter = Router();

userRouter.post(
  "/upload-resume",
  requireAuth,
  uploadResumeMiddleware,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.file) {
      throw new AppError(400, "No file uploaded.", "NO_FILE");
    }

    const userId = req.auth!.userId;
    const resumeUrl = `/uploads/resumes/${req.file.filename}`;

    // Update the seeker profile with the new resume URL
    const profile = await seekerProfileService.uploadResume(userId, resumeUrl);

    res.status(200).json(success({ 
      message: "Resume uploaded successfully",
      resumeUrl,
      profile 
    }));
  })
);

userRouter.get(
  "/resume/:userId",
  requireAuth,
  asyncHandler(async (req: any, res: Response) => {
    const { userId } = req.params;
    const profile = await seekerProfileService.get(userId);

    if (!profile.resumeUrl) {
      throw new AppError(404, "Resume not found", "RESUME_NOT_FOUND");
    }

    res.status(200).json(success({ resumeUrl: profile.resumeUrl }));
  })
);

export { userRouter };
