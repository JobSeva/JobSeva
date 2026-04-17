import { Router } from "express";
import { z } from "zod";

import { companyJobsController } from "../controllers/company-jobs.controller";
import { asyncHandler } from "../middleware/async-handler";
import { requireAuth, requireRole } from "../middleware/auth";
import { validate } from "../middleware/validate";

const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

const jobPayloadSchema = z.object({
  title: z.string().min(1).max(200),
  location: z.string().min(1).max(200),
  salaryMin: z.coerce.number().int().min(0).max(1000000000),
  salaryMax: z.coerce.number().int().min(0).max(1000000000),
  type: z.enum(["full-time", "part-time", "contract"]),
  remote: z.boolean().default(false),
  skills: z.array(z.string()).optional().default([]),
  description: z.string().min(1).max(20000),
  responsibilities: z.array(z.string()).optional().default([]),
  education: z.string().max(500).optional().or(z.literal("")),
  experience: z.string().max(500).optional().or(z.literal("")),
  workMode: z.enum(["remote", "hybrid", "onsite"]).optional().default("onsite"),
  openings: z.coerce.number().int().min(1).max(100000).optional().default(1),
  deadline: z.string().optional().or(z.literal("")).optional(),
});

const updateJobPayloadSchema = z
  .object({
    title: jobPayloadSchema.shape.title.optional(),
    location: jobPayloadSchema.shape.location.optional(),
    salaryMin: jobPayloadSchema.shape.salaryMin.optional(),
    salaryMax: jobPayloadSchema.shape.salaryMax.optional(),
    type: jobPayloadSchema.shape.type.optional(),
    remote: jobPayloadSchema.shape.remote.optional(),
    skills: jobPayloadSchema.shape.skills.optional(),
    description: jobPayloadSchema.shape.description.optional(),
    responsibilities: jobPayloadSchema.shape.responsibilities.optional(),
    education: jobPayloadSchema.shape.education.optional(),
    experience: jobPayloadSchema.shape.experience.optional(),
    workMode: jobPayloadSchema.shape.workMode.optional(),
    openings: jobPayloadSchema.shape.openings.optional(),
    deadline: jobPayloadSchema.shape.deadline.optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  });

const paramsJobSchema = z.object({
  jobId: z.string().min(1),
});

const paramsApplicationSchema = z.object({
  applicationId: z.string().min(1),
});

const applicationStatusSchema = z.object({
  status: z.enum(["applied", "shortlisted", "interview", "hired", "rejected"]),
});

const applicationRatingSchema = z.object({
  rating: z.number().min(1).max(5),
  note: z.string().max(500).optional(),
});

const companyJobsRouter = Router();

companyJobsRouter.use(requireAuth, requireRole("company"));

companyJobsRouter.get(
  "/jobs",
  validate({ query: listQuerySchema }),
  asyncHandler(companyJobsController.list),
);
companyJobsRouter.post(
  "/jobs",
  validate({ body: jobPayloadSchema }),
  asyncHandler(companyJobsController.create),
);
companyJobsRouter.get(
  "/jobs/:jobId",
  validate({ params: paramsJobSchema }),
  asyncHandler(companyJobsController.getById),
);
companyJobsRouter.put(
  "/jobs/:jobId",
  validate({ params: paramsJobSchema, body: updateJobPayloadSchema }),
  asyncHandler(companyJobsController.update),
);
companyJobsRouter.delete(
  "/jobs/:jobId",
  validate({ params: paramsJobSchema }),
  asyncHandler(companyJobsController.remove),
);
companyJobsRouter.get(
  "/jobs/:jobId/applicants",
  validate({ params: paramsJobSchema }),
  asyncHandler(companyJobsController.listApplicants),
);
companyJobsRouter.put(
  "/applications/:applicationId/status",
  validate({ params: paramsApplicationSchema, body: applicationStatusSchema }),
  asyncHandler(companyJobsController.updateApplicationStatus),
);
companyJobsRouter.put(
  "/applications/:applicationId/rating",
  validate({ params: paramsApplicationSchema, body: applicationRatingSchema }),
  asyncHandler(companyJobsController.updateApplicationRating),
);
companyJobsRouter.get(
  "/applicants",
  asyncHandler(companyJobsController.listAllApplicants),
);

companyJobsRouter.delete(
  "/applications/:applicationId",
  validate({ params: paramsApplicationSchema }),
  asyncHandler(companyJobsController.deleteApplication),
);

export { companyJobsRouter };
