import { Response } from "express";

import { AppError } from "../common/errors";
import { success } from "../common/http";
import { companyJobsService } from "../services/company-jobs.service";
import { AuthenticatedRequest } from "../types/auth";
import { ApplicationStatus } from "../types/domain";

const requireCompanyAuth = (req: AuthenticatedRequest): string => {
  if (!req.auth || req.auth.role !== "company") {
    throw new AppError(403, "Company access required", "FORBIDDEN");
  }

  return req.auth.userId;
};

export const companyJobsController = {
  async list(req: AuthenticatedRequest, res: Response): Promise<void> {
    const companyUserId = requireCompanyAuth(req);
    const query = req.query as Record<string, string | undefined>;
    const page = query.page ? Math.max(1, Number(query.page) || 1) : 1;
    const limit = query.limit
      ? Math.min(100, Math.max(1, Number(query.limit) || 10))
      : 10;

    const result = await companyJobsService.list(companyUserId, page, limit);
    res.status(200).json(
      success(result.items, {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit),
      }),
    );
  },

  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    const companyUserId = requireCompanyAuth(req);
    const job = await companyJobsService.create(companyUserId, req.body);
    res.status(201).json(success(job));
  },

  async getById(req: AuthenticatedRequest, res: Response): Promise<void> {
    const companyUserId = requireCompanyAuth(req);
    const { jobId } = req.params;

    if (!jobId) {
      throw new AppError(400, "jobId is required", "VALIDATION_ERROR");
    }

    const job = await companyJobsService.getById(companyUserId, jobId);
    res.status(200).json(success(job));
  },

  async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    const companyUserId = requireCompanyAuth(req);
    const { jobId } = req.params;

    if (!jobId) {
      throw new AppError(400, "jobId is required", "VALIDATION_ERROR");
    }

    const job = await companyJobsService.update(companyUserId, jobId, req.body);
    res.status(200).json(success(job));
  },

  async remove(req: AuthenticatedRequest, res: Response): Promise<void> {
    const companyUserId = requireCompanyAuth(req);
    const { jobId } = req.params;

    if (!jobId) {
      throw new AppError(400, "jobId is required", "VALIDATION_ERROR");
    }

    await companyJobsService.remove(companyUserId, jobId);
    res.status(200).json(success({ message: "Job removed" }));
  },

  async listApplicants(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> {
    const companyUserId = requireCompanyAuth(req);
    const { jobId } = req.params;

    if (!jobId) {
      throw new AppError(400, "jobId is required", "VALIDATION_ERROR");
    }

    const applicants = await companyJobsService.listApplicants(companyUserId, jobId);
    res.status(200).json(success(applicants));
  },

  async updateApplicationStatus(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> {
    const companyUserId = requireCompanyAuth(req);
    const { applicationId } = req.params;

    if (!applicationId) {
      throw new AppError(400, "applicationId is required", "VALIDATION_ERROR");
    }

    const { status } = req.body as { status: ApplicationStatus };
    const application = await companyJobsService.updateApplicationStatus(
      companyUserId,
      applicationId,
      status,
    );

    res.status(200).json(success(application));
  },

  async updateApplicationRating(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> {
    const companyUserId = requireCompanyAuth(req);
    const { applicationId } = req.params;

    if (!applicationId) {
      throw new AppError(400, "applicationId is required", "VALIDATION_ERROR");
    }

    const { rating, note } = req.body as { rating: number; note?: string };
    const application = await companyJobsService.updateApplicationRating(
      companyUserId,
      applicationId,
      rating,
      note,
    );

    res.status(200).json(success(application));
  },

  async listAllApplicants(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> {
    const companyUserId = requireCompanyAuth(req);
    const applicants = await companyJobsService.listAllApplicants(companyUserId);
    res.status(200).json(success(applicants));
  },
};
