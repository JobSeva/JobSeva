import { Response } from "express";

import { AppError } from "../common/errors";
import { success } from "../common/http";
import { savedJobsService } from "../services/saved-jobs.service";
import { AuthenticatedRequest } from "../types/auth";

const requireSeekerAuth = (req: AuthenticatedRequest): string => {
  if (!req.auth || req.auth.role !== "seeker") {
    throw new AppError(403, "Seeker access required", "FORBIDDEN");
  }

  return req.auth.userId;
};

export const savedJobsController = {
  async list(req: AuthenticatedRequest, res: Response): Promise<void> {
    const seekerId = requireSeekerAuth(req);
    const query = req.query as Record<string, string | undefined>;

    const page = query.page ? Math.max(1, Number(query.page) || 1) : 1;
    const limit = query.limit
      ? Math.min(100, Math.max(1, Number(query.limit) || 10))
      : 10;

    const result = await savedJobsService.list(seekerId, page, limit);

    res.status(200).json(
      success(result.items, {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit),
      }),
    );
  },

  async save(req: AuthenticatedRequest, res: Response): Promise<void> {
    const seekerId = requireSeekerAuth(req);
    const { jobId } = req.params;

    if (!jobId) {
      throw new AppError(400, "jobId is required", "VALIDATION_ERROR");
    }

    const item = await savedJobsService.save(seekerId, jobId);
    res.status(201).json(success(item));
  },

  async remove(req: AuthenticatedRequest, res: Response): Promise<void> {
    const seekerId = requireSeekerAuth(req);
    const { jobId } = req.params;

    if (!jobId) {
      throw new AppError(400, "jobId is required", "VALIDATION_ERROR");
    }

    await savedJobsService.remove(seekerId, jobId);
    res.status(200).json(success({ message: "Saved job removed" }));
  },
};
