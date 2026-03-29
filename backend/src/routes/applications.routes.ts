import { Router } from "express";
import { z } from "zod";

import { applicationsController } from "../controllers/applications.controller";
import { asyncHandler } from "../middleware/async-handler";
import { requireAuth, requireRole } from "../middleware/auth";
import { validate } from "../middleware/validate";

const listQuerySchema = z.object({
  status: z
    .enum(["applied", "shortlisted", "interview", "hired", "rejected"])
    .optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

const createSchema = z.object({
  jobId: z.string().min(1),
});

const paramsSchema = z.object({
  applicationId: z.string().min(1),
});

const applicationsRouter = Router();

applicationsRouter.use(requireAuth, requireRole("seeker"));

applicationsRouter.get(
  "/",
  validate({ query: listQuerySchema }),
  asyncHandler(applicationsController.list),
);
applicationsRouter.post(
  "/",
  validate({ body: createSchema }),
  asyncHandler(applicationsController.create),
);
applicationsRouter.get(
  "/:applicationId",
  validate({ params: paramsSchema }),
  asyncHandler(applicationsController.getById),
);
applicationsRouter.delete(
  "/:applicationId",
  validate({ params: paramsSchema }),
  asyncHandler(applicationsController.withdraw),
);

export { applicationsRouter };
