import { Response } from "express";

import { AppError } from "../common/errors";
import { success } from "../common/http";
import { seekerProfileService } from "../services/seeker-profile.service";
import { AuthenticatedRequest } from "../types/auth";

const requireSeekerAuth = (req: AuthenticatedRequest): string => {
  if (!req.auth || req.auth.role !== "seeker") {
    throw new AppError(403, "Seeker access required", "FORBIDDEN");
  }

  return req.auth.userId;
};

export const seekerProfileController = {
  async get(req: AuthenticatedRequest, res: Response): Promise<void> {
    const seekerId = requireSeekerAuth(req);
    const profile = seekerProfileService.get(seekerId);
    res.status(200).json(success(profile));
  },

  async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    const seekerId = requireSeekerAuth(req);
    const profile = seekerProfileService.update(seekerId, req.body);
    res.status(200).json(success(profile));
  },

  async uploadAvatar(req: AuthenticatedRequest, res: Response): Promise<void> {
    const seekerId = requireSeekerAuth(req);
    const { avatarUrl } = req.body as { avatarUrl: string };

    const profile = seekerProfileService.uploadAvatar(seekerId, avatarUrl);
    res.status(200).json(success(profile));
  },

  async uploadResume(req: AuthenticatedRequest, res: Response): Promise<void> {
    const seekerId = requireSeekerAuth(req);
    const { resumeUrl } = req.body as { resumeUrl: string };

    const profile = seekerProfileService.uploadResume(seekerId, resumeUrl);
    res.status(200).json(success(profile));
  },

  async deleteResume(req: AuthenticatedRequest, res: Response): Promise<void> {
    const seekerId = requireSeekerAuth(req);
    const profile = seekerProfileService.deleteResume(seekerId);
    res.status(200).json(success(profile));
  },

  async addExperience(req: AuthenticatedRequest, res: Response): Promise<void> {
    const seekerId = requireSeekerAuth(req);
    const profile = seekerProfileService.addExperience(seekerId, req.body);
    res.status(201).json(success(profile));
  },

  async updateExperience(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> {
    const seekerId = requireSeekerAuth(req);
    const { experienceId } = req.params;

    if (!experienceId) {
      throw new AppError(400, "experienceId is required", "VALIDATION_ERROR");
    }

    const profile = seekerProfileService.updateExperience(
      seekerId,
      experienceId,
      req.body,
    );
    res.status(200).json(success(profile));
  },

  async deleteExperience(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> {
    const seekerId = requireSeekerAuth(req);
    const { experienceId } = req.params;

    if (!experienceId) {
      throw new AppError(400, "experienceId is required", "VALIDATION_ERROR");
    }

    const profile = seekerProfileService.deleteExperience(
      seekerId,
      experienceId,
    );
    res.status(200).json(success(profile));
  },
};
