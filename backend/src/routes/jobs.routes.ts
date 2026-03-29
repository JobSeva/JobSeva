import { Router } from "express";

import { jobsController } from "../controllers/jobs.controller";
import { asyncHandler } from "../middleware/async-handler";
import { requireAuth, requireRole } from "../middleware/auth";

const jobsRouter = Router();

jobsRouter.get("/", asyncHandler(jobsController.list));
jobsRouter.get(
  "/recommendations",
  requireAuth,
  requireRole("seeker"),
  asyncHandler(jobsController.recommendations),
);
jobsRouter.get("/:jobId", asyncHandler(jobsController.getById));

export { jobsRouter };
