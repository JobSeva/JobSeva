import { Response } from "express";
import { AppError } from "../common/errors";
import { success } from "../common/http";
import { ngoProfileService } from "../services/ngo-profile.service";
import { AuthenticatedRequest } from "../types/auth";

const requireNgoAuth = (req: AuthenticatedRequest): string => {
    if (!req.auth || req.auth.role !== "ngo") {
        throw new AppError(403, "NGO access required", "FORBIDDEN");
    }
    return req.auth.userId;
};

export const ngoProfileController = {
    async get(req: AuthenticatedRequest, res: Response): Promise<void> {
        const ngoId = requireNgoAuth(req);
        const profile = await ngoProfileService.get(ngoId);
        res.status(200).json(success(profile));
    },

    async update(req: AuthenticatedRequest, res: Response): Promise<void> {
        const ngoId = requireNgoAuth(req);
        const profile = await ngoProfileService.update(ngoId, req.body);
        res.status(200).json(success(profile));
    },

    async uploadLogo(req: AuthenticatedRequest, res: Response): Promise<void> {
        const ngoId = requireNgoAuth(req);
        const { logoUrl } = req.body as { logoUrl: string };
        const profile = await ngoProfileService.uploadLogo(ngoId, logoUrl);
        res.status(200).json(success(profile));
    },
};
