import { NextFunction, Request, Response } from "express";

import { AppError } from "../common/errors";
import { env } from "../config/env";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        ...(err.details !== undefined ? { details: err.details } : {}),
      },
    });
    return;
  }

  const message =
    err instanceof Error ? err.message : "Unexpected server error";

  res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: env.nodeEnv === "production" ? "Internal server error" : message,
    },
  });
};
