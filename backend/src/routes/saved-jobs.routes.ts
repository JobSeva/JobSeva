import { Router } from "express";
import { z } from "zod";

import { savedJobsController } from "../controllers/saved-jobs.controller";
import { asyncHandler } from "../middleware/async-handler";
import { requireAuth, requireRole } from "../middleware/auth";
import { validate } from "../middleware/validate";

const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

const paramsSchema = z.object({
  jobId: z.string().min(1),
});

const savedJobsRouter = Router();

savedJobsRouter.use(requireAuth, requireRole("seeker"));

savedJobsRouter.get(
  "/",
  validate({ query: listQuerySchema }),
  asyncHandler(savedJobsController.list),
);
savedJobsRouter.post(
  "/:jobId",
  validate({ params: paramsSchema }),
  asyncHandler(savedJobsController.save),
);
savedJobsRouter.delete(
  "/:jobId",
  validate({ params: paramsSchema }),
  asyncHandler(savedJobsController.remove),
);

export { savedJobsRouter };
