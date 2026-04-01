import { Router } from "express";
import { z } from "zod";

import { authController } from "../controllers/auth.controller";
import { asyncHandler } from "../middleware/async-handler";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";

const emailSchema = z.string().email().max(160);
const passwordSchema = z.string().min(8).max(100);

const roleSchema = z.enum(["seeker", "company", "admin", "ngo"]);

const signupSchema = z.object({
  name: z.string().min(2).max(120),
  email: emailSchema,
  password: passwordSchema,
  role: roleSchema,
  companyName: z.string().max(120).optional(),
});

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  role: roleSchema.optional(),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(10),
});

const verifyEmailSchema = z.object({
  token: z.string().min(1),
});

const resendVerificationSchema = z.object({
  email: emailSchema,
});

const updatePasswordSchema = z.object({
  currentPassword: passwordSchema,
  nextPassword: passwordSchema,
});

const settingsSchema = z
  .object({
    emailNotifications: z.boolean().optional(),
    marketingEmails: z.boolean().optional(),
    darkMode: z.boolean().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one setting must be provided",
  });

const authRouter = Router();

// Signup / Register aliases
authRouter.post(
  "/signup",
  validate({ body: signupSchema }),
  asyncHandler(authController.signup),
);
authRouter.post(
  "/register",
  validate({ body: signupSchema }),
  asyncHandler(authController.signup),
);

authRouter.post(
  "/login",
  validate({ body: loginSchema }),
  asyncHandler(authController.login),
);

authRouter.post(
  "/verify-email",
  validate({ body: verifyEmailSchema }),
  asyncHandler(authController.verifyEmail),
);

// GET for when user clicks the verification link directly in email
authRouter.get(
  "/verify-email",
  asyncHandler(async (req, res) => {
    const token = req.query.token as string;
    if (!token) {
      // Redirect to frontend error page
      return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:8080"}/verify-email?error=missing_token`);
    }
    try {
      const { authService } = await import("../services/auth.service");
      await authService.verifyEmail(token);
      return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:8080"}/verify-email?success=true`);
    } catch (err: any) {
      return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:8080"}/verify-email?error=invalid_token`);
    }
  }),
);

authRouter.post(
  "/resend-verification",
  validate({ body: resendVerificationSchema }),
  asyncHandler(authController.resendVerification),
);
authRouter.post(
  "/refresh",
  validate({ body: refreshSchema }),
  asyncHandler(authController.refresh),
);
authRouter.post(
  "/logout",
  validate({ body: refreshSchema }),
  asyncHandler(authController.logout),
);
authRouter.get("/me", requireAuth, asyncHandler(authController.me));
authRouter.put(
  "/password",
  requireAuth,
  validate({ body: updatePasswordSchema }),
  asyncHandler(authController.updatePassword),
);
authRouter.put(
  "/settings",
  requireAuth,
  validate({ body: settingsSchema }),
  asyncHandler(authController.updateSettings),
);

export { authRouter };
