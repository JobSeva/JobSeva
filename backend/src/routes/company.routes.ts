import { Router } from "express";
import { z } from "zod";

import { companyController } from "../controllers/company.controller";
import { asyncHandler } from "../middleware/async-handler";
import { requireAuth, requireRole } from "../middleware/auth";
import { validate } from "../middleware/validate";

const profileFieldsSchema = {
  name: z.string().min(2).max(120),
  logo: z.string().min(1).max(12),
  tagline: z.string().max(180),
  about: z.string().max(5000),
  industry: z.string().max(120),
  size: z.string().max(60),
  founded: z.number().int().min(1800).max(new Date().getFullYear()),
  headquarters: z.string().max(120),
  website: z.string().url(),
  email: z.string().email(),
  phone: z.string().max(30),
  linkedin: z.string().url().optional(),
  twitter: z.string().url().optional(),
  instagram: z.string().url().optional(),
  recruiterName: z.string().min(2).max(120),
  recruiterDesignation: z.string().max(120),
  isHiring: z.boolean(),
  openPositions: z.number().int().min(0).max(10000),
  onboardingCompleted: z.boolean().optional(),
};

const onboardingSchema = z.object(profileFieldsSchema);

const updateProfileSchema = z
  .object({
    name: profileFieldsSchema.name.optional(),
    logo: profileFieldsSchema.logo.optional(),
    tagline: profileFieldsSchema.tagline.optional(),
    about: profileFieldsSchema.about.optional(),
    industry: profileFieldsSchema.industry.optional(),
    size: profileFieldsSchema.size.optional(),
    founded: profileFieldsSchema.founded.optional(),
    headquarters: profileFieldsSchema.headquarters.optional(),
    website: profileFieldsSchema.website.optional(),
    email: profileFieldsSchema.email.optional(),
    phone: profileFieldsSchema.phone.optional(),
    linkedin: profileFieldsSchema.linkedin.optional(),
    twitter: profileFieldsSchema.twitter.optional(),
    instagram: profileFieldsSchema.instagram.optional(),
    recruiterName: profileFieldsSchema.recruiterName.optional(),
    recruiterDesignation: profileFieldsSchema.recruiterDesignation.optional(),
    isHiring: profileFieldsSchema.isHiring.optional(),
    openPositions: profileFieldsSchema.openPositions.optional(),
    onboardingCompleted: z.boolean().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  });

const logoSchema = z.object({
  logo: z.string().min(1).max(12),
});

const companyRouter = Router();

companyRouter.use(requireAuth, requireRole("company"));

companyRouter.post(
  "/onboarding",
  validate({ body: onboardingSchema }),
  asyncHandler(companyController.onboarding),
);
companyRouter.get("/profile", asyncHandler(companyController.getProfile));
companyRouter.put(
  "/profile",
  validate({ body: updateProfileSchema }),
  asyncHandler(companyController.updateProfile),
);
companyRouter.post(
  "/profile/logo",
  validate({ body: logoSchema }),
  asyncHandler(companyController.updateLogo),
);
companyRouter.get("/dashboard", asyncHandler(companyController.dashboard));

export { companyRouter };
