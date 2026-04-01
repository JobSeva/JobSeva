import { Router } from "express";
import { z } from "zod";

import { seekerProfileController } from "../controllers/seeker-profile.controller";
import { asyncHandler } from "../middleware/async-handler";
import { requireAuth, requireRole } from "../middleware/auth";
import { validate } from "../middleware/validate";

const updateProfileSchema = z
  .object({
    headline: z.string().max(120).optional(),
    bio: z.string().max(1000).optional(),
    location: z.string().max(120).optional(),
    phone: z.string().max(30).optional(),
    skills: z.array(z.string().min(1).max(40)).max(40).optional(),
    languages: z.array(z.string().min(1).max(40)).max(20).optional(),
    linkedinUrl: z.string().url().or(z.literal("")).optional(),
    githubUrl: z.string().url().or(z.literal("")).optional(),
    portfolioUrl: z.string().url().or(z.literal("")).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  });

const uploadAvatarSchema = z.object({
  avatarUrl: z.string().url(),
});

const uploadResumeSchema = z.object({
  resumeUrl: z.string().url(),
});

const experienceSchema = z.object({
  title: z.string().min(2).max(120),
  company: z.string().min(2).max(120),
  period: z.string().min(2).max(60),
});

const experienceParamsSchema = z.object({
  experienceId: z.string().min(1),
});

const educationSchema = z.object({
  school: z.string().min(2).max(120),
  degree: z.string().min(2).max(120),
  field: z.string().min(2).max(120),
  period: z.string().min(2).max(60),
});

const educationParamsSchema = z.object({
  educationId: z.string().min(1),
});

const seekerProfileRouter = Router();

seekerProfileRouter.use(requireAuth, requireRole("seeker"));

seekerProfileRouter.get("/", asyncHandler(seekerProfileController.get));
seekerProfileRouter.put(
  "/",
  validate({ body: updateProfileSchema }),
  asyncHandler(seekerProfileController.update),
);
seekerProfileRouter.post(
  "/avatar",
  validate({ body: uploadAvatarSchema }),
  asyncHandler(seekerProfileController.uploadAvatar),
);
seekerProfileRouter.post(
  "/resume",
  validate({ body: uploadResumeSchema }),
  asyncHandler(seekerProfileController.uploadResume),
);
seekerProfileRouter.delete(
  "/resume",
  asyncHandler(seekerProfileController.deleteResume),
);
seekerProfileRouter.post(
  "/experience",
  validate({ body: experienceSchema }),
  asyncHandler(seekerProfileController.addExperience),
);
seekerProfileRouter.put(
  "/experience/:experienceId",
  validate({ params: experienceParamsSchema, body: experienceSchema }),
  asyncHandler(seekerProfileController.updateExperience),
);
seekerProfileRouter.delete(
  "/experience/:experienceId",
  validate({ params: experienceParamsSchema }),
  asyncHandler(seekerProfileController.deleteExperience),
);
seekerProfileRouter.post(
  "/education",
  validate({ body: educationSchema }),
  asyncHandler(seekerProfileController.addEducation),
);
seekerProfileRouter.put(
  "/education/:educationId",
  validate({ params: educationParamsSchema, body: educationSchema }),
  asyncHandler(seekerProfileController.updateEducation),
);
seekerProfileRouter.delete(
  "/education/:educationId",
  validate({ params: educationParamsSchema }),
  asyncHandler(seekerProfileController.deleteEducation),
);

export { seekerProfileRouter };
