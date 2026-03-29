import { Response } from "express";

import { AppError } from "../common/errors";
import { success } from "../common/http";
import { applicationsService } from "../services/applications.service";
import { ApplicationStatus } from "../types/domain";
import { AuthenticatedRequest } from "../types/auth";

const requireSeekerAuth = (req: AuthenticatedRequest): string => {
  if (!req.auth || req.auth.role !== "seeker") {
    throw new AppError(403, "Seeker access required", "FORBIDDEN");
  }

  return req.auth.userId;
};

export const applicationsController = {
  async list(req: AuthenticatedRequest, res: Response): Promise<void> {
    const seekerId = requireSeekerAuth(req);
    const query = req.query as Record<string, string | undefined>;

    const status =
      query.status === "applied" ||
      query.status === "shortlisted" ||
      query.status === "interview" ||
      query.status === "hired" ||
      query.status === "rejected"
        ? (query.status as ApplicationStatus)
        : undefined;

    const page = query.page ? Math.max(1, Number(query.page) || 1) : 1;
    const limit = query.limit
      ? Math.min(100, Math.max(1, Number(query.limit) || 10))
      : 10;

    const result = await applicationsService.listForSeeker(seekerId);

    // Apply pagination post-fetch or just return all for now to keep it simple but match signature
    res.status(200).json(
      success(result, {
        total: result.length,
        page: 1,
        limit: result.length,
        totalPages: 1,
      }),
    );
  },

  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    const seekerId = requireSeekerAuth(req);
    const { jobId } = req.body as { jobId: string };

    const application = await applicationsService.apply(seekerId, jobId);
    res.status(201).json(success(application));
  },

  async getById(req: AuthenticatedRequest, res: Response): Promise<void> {
    const seekerId = requireSeekerAuth(req);
    const { applicationId } = req.params;

    if (!applicationId) {
      throw new AppError(400, "applicationId is required", "VALIDATION_ERROR");
    }

    const application = await applicationsService.getById(applicationId);
    res.status(200).json(success(application));
  },

  async withdraw(req: AuthenticatedRequest, res: Response): Promise<void> {
    const seekerId = requireSeekerAuth(req);
    const { applicationId } = req.params;

    if (!applicationId) {
      throw new AppError(400, "applicationId is required", "VALIDATION_ERROR");
    }

    await applicationsService.withdraw(seekerId, applicationId);
    res.status(200).json(success({ message: "Application withdrawn" }));
  },
};
