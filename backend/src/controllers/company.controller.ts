import { Response } from "express";

import { AppError } from "../common/errors";
import { success } from "../common/http";
import { companyProfileService } from "../services/company-profile.service";
import { AuthenticatedRequest } from "../types/auth";

const requireCompanyAuth = (req: AuthenticatedRequest): string => {
  if (!req.auth || req.auth.role !== "company") {
    throw new AppError(403, "Company access required", "FORBIDDEN");
  }

  return req.auth.userId;
};

export const companyController = {
  async onboarding(req: AuthenticatedRequest, res: Response): Promise<void> {
    const companyUserId = requireCompanyAuth(req);
    const profile = await companyProfileService.onboarding(
      companyUserId,
      req.body,
    );
    res.status(201).json(success(profile));
  },

  async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    const companyUserId = requireCompanyAuth(req);
    const profile = await companyProfileService.get(companyUserId);
    res.status(200).json(success(profile));
  },

  async updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    const companyUserId = requireCompanyAuth(req);
    const profile = await companyProfileService.update(companyUserId, req.body);
    res.status(200).json(success(profile));
  },

  async updateLogo(req: AuthenticatedRequest, res: Response): Promise<void> {
    const companyUserId = requireCompanyAuth(req);
    const { logo } = req.body as { logo: string };

    const profile = await companyProfileService.updateLogo(companyUserId, logo);
    res.status(200).json(success(profile));
  },

  async dashboard(req: AuthenticatedRequest, res: Response): Promise<void> {
    const companyUserId = requireCompanyAuth(req);
    const data = await companyProfileService.dashboard(companyUserId);
    res.status(200).json(success(data));
  },
};
