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
  async getPublic(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.auth) {
      throw new AppError(401, "Authentication required", "AUTH_REQUIRED");
    }

    const { seekerId } = req.params;

    if (!seekerId) {
      throw new AppError(400, "seekerId is required", "VALIDATION_ERROR");
    }

    const profile = await seekerProfileService.getPublicProfile(
      seekerId,
      req.auth.userId,
      req.auth.role,
    );

    res.status(200).json(success(profile));
  },

  async get(req: AuthenticatedRequest, res: Response): Promise<void> {
    const seekerId = requireSeekerAuth(req);
    const profile = await seekerProfileService.get(seekerId);
    res.status(200).json(success(profile));
  },

  async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    const seekerId = requireSeekerAuth(req);
    const profile = await seekerProfileService.update(seekerId, req.body);
    res.status(200).json(success(profile));
  },

  async uploadAvatar(req: AuthenticatedRequest, res: Response): Promise<void> {
    const seekerId = requireSeekerAuth(req);
    const { avatarUrl } = req.body as { avatarUrl: string };

    const profile = await seekerProfileService.uploadAvatar(
      seekerId,
      avatarUrl,
    );
    res.status(200).json(success(profile));
  },

  async uploadResume(req: AuthenticatedRequest, res: Response): Promise<void> {
    const seekerId = requireSeekerAuth(req);
    const { resumeUrl } = req.body as { resumeUrl: string };

    const profile = await seekerProfileService.uploadResume(
      seekerId,
      resumeUrl,
    );
    res.status(200).json(success(profile));
  },

  async deleteResume(req: AuthenticatedRequest, res: Response): Promise<void> {
    const seekerId = requireSeekerAuth(req);
    const profile = await seekerProfileService.deleteResume(seekerId);
    res.status(200).json(success(profile));
  },

  async addExperience(req: AuthenticatedRequest, res: Response): Promise<void> {
    const seekerId = requireSeekerAuth(req);
    const profile = await seekerProfileService.addExperience(
      seekerId,
      req.body,
    );
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

    const profile = await seekerProfileService.updateExperience(
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

    const profile = await seekerProfileService.deleteExperience(
      seekerId,
      experienceId,
    );
    res.status(200).json(success(profile));
  },

  async addEducation(req: AuthenticatedRequest, res: Response): Promise<void> {
    const seekerId = requireSeekerAuth(req);
    const profile = await seekerProfileService.addEducation(seekerId, req.body);
    res.status(201).json(success(profile));
  },

  async updateEducation(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> {
    const seekerId = requireSeekerAuth(req);
    const { educationId } = req.params;

    if (!educationId) {
      throw new AppError(400, "educationId is required", "VALIDATION_ERROR");
    }

    const profile = await seekerProfileService.updateEducation(
      seekerId,
      educationId,
      req.body,
    );
    res.status(200).json(success(profile));
  },

  async deleteEducation(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> {
    const seekerId = requireSeekerAuth(req);
    const { educationId } = req.params;

    if (!educationId) {
      throw new AppError(400, "educationId is required", "VALIDATION_ERROR");
    }

    const profile = await seekerProfileService.deleteEducation(
      seekerId,
      educationId,
    );
    res.status(200).json(success(profile));
  },

  async dashboard(req: AuthenticatedRequest, res: Response): Promise<void> {
    const seekerId = requireSeekerAuth(req);
    const data = await seekerProfileService.dashboard(seekerId);
    res.status(200).json(success(data));
  },
};
