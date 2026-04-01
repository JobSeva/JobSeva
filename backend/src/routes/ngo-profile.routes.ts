import { Router } from "express";
import { z } from "zod";
import { ngoProfileController } from "../controllers/ngo-profile.controller";
import { asyncHandler } from "../middleware/async-handler";
import { requireAuth, requireRole } from "../middleware/auth";
import { validate } from "../middleware/validate";

const flexibleUrl = z.string().transform((val) => {
    if (!val || val.length === 0) return val;
    const lowerVal = val.toLowerCase();
    if (!lowerVal.startsWith("http://") && !lowerVal.startsWith("https://")) {
        return `https://${val}`;
    }
    return val;
}).pipe(z.string().url().or(z.string().length(0))).optional();

const updateProfileSchema = z.object({
    name: z.string().min(2).max(100).regex(/^[a-zA-Z0-9\s.,!?'"()\/&+-]+$/, "Name contains invalid characters").optional(),
    description: z.string().max(1000).optional(),
    tagline: z.string().max(200).regex(/^[a-zA-Z0-9\s.,!?'"()\/&+-]+$/, "Tagline contains invalid characters").optional(),
    location: z.string().max(120).regex(/^[a-zA-Z0-9\s.,!?'"()\/&+-]+$/, "Location contains invalid characters").optional(),
    phone: z.string().max(30).optional(),
    email: z.string().email().optional().or(z.string().length(0)),
    website: flexibleUrl,
    foundingYear: z.number().int().min(1800).max(new Date().getFullYear()).optional(),
    size: z.string().max(50).optional(),
    linkedin: flexibleUrl,
    twitter: flexibleUrl,
    instagram: flexibleUrl,
    logoUrl: flexibleUrl,
}).refine(data => {
    const keys = Object.keys(data).filter(k => (data as any)[k] !== undefined);
    return keys.length > 0;
}, {
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
