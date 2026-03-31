import { Router } from "express";
import { z } from "zod";
import { ngoProfileController } from "../controllers/ngo-profile.controller";
import { asyncHandler } from "../middleware/async-handler";
import { requireAuth, requireRole } from "../middleware/auth";
import { validate } from "../middleware/validate";

const updateProfileSchema = z.object({
    description: z.string().max(1000).optional(),
    location: z.string().max(120).optional(),
    phone: z.string().max(30).optional(),
    website: z.string().url().max(120).optional().or(z.string().length(0)),
}).refine(data => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
});

const uploadLogoSchema = z.object({
    logoUrl: z.string().url(),
});

const ngoProfileRouter = Router();

ngoProfileRouter.use(requireAuth, requireRole("ngo"));

ngoProfileRouter.get("/", asyncHandler(ngoProfileController.get));
ngoProfileRouter.put("/", validate({ body: updateProfileSchema }), asyncHandler(ngoProfileController.update));
ngoProfileRouter.post("/logo", validate({ body: uploadLogoSchema }), asyncHandler(ngoProfileController.uploadLogo));

export { ngoProfileRouter };
