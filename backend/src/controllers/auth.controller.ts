import { Request, Response } from "express";

import { success } from "../common/http";
import { authService } from "../services/auth.service";
import { AuthenticatedRequest } from "../types/auth";

export const authController = {
  async signup(req: Request, res: Response): Promise<void> {
    console.log("Signup Request Body:", req.body);
    const result = await authService.signup(req.body);
    res.status(201).json(success(result));
  },

  async login(req: Request, res: Response): Promise<void> {
    console.log("Login Request Body:", req.body);
    const result = await authService.login(req.body);
    res.status(200).json(success(result));
  },

  async refresh(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.body as { refreshToken: string };
    const tokens = await authService.refresh(refreshToken);
    res.status(200).json(success(tokens));
  },

  async logout(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.body as { refreshToken: string };
    await authService.logout(refreshToken);
    res.status(200).json(success({ message: "Logged out" }));
  },

  async verifyEmail(req: Request, res: Response): Promise<void> {
    const { token } = req.body as { token: string };
    await authService.verifyEmail(token);
    res.status(200).json(success({ message: "Email verified successfully" }));
  },

  async resendVerification(req: Request, res: Response): Promise<void> {
    const { email } = req.body as { email: string };
    await authService.resendVerification(email);
    res.status(200).json(success({ message: "Verification email resent" }));
  },

  async forgotPassword(req: Request, res: Response): Promise<void> {
    const { email } = req.body as { email: string };
    await authService.requestPasswordReset(email);
    res.status(200).json(
      success({
        message:
          "If an eligible account exists for this email, a reset link has been sent.",
      }),
    );
  },

  async resetPassword(req: Request, res: Response): Promise<void> {
    const { token, nextPassword } = req.body as {
      token: string;
      nextPassword: string;
    };
    await authService.resetPassword(token, nextPassword);
    res.status(200).json(success({ message: "Password reset successful" }));
  },

  async me(req: AuthenticatedRequest, res: Response): Promise<void> {
    const user = await authService.getMe(req.auth!.userId);
    res.status(200).json(success(user));
  },

  async updatePassword(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> {
    const { currentPassword, nextPassword } = req.body as {
      currentPassword: string;
      nextPassword: string;
    };

    await authService.updatePassword(
      req.auth!.userId,
      currentPassword,
      nextPassword,
    );
    res.status(200).json(success({ message: "Password updated" }));
  },

  async updateSettings(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> {
    const user = await authService.updateSettings(req.auth!.userId, req.body);
    res.status(200).json(success(user));
  },
};
