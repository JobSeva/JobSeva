import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

import { AppError } from "../common/errors";
import { env } from "../config/env";
import { AuthenticatedRequest, AuthTokenPayload } from "../types/auth";
import { Role } from "../types/domain";

const extractBearerToken = (authorizationHeader?: string): string | null => {
  if (!authorizationHeader) {
    return null;
  }

  const [scheme, token] = authorizationHeader.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return null;
  }

  return token;
};

export const requireAuth = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): void => {
  const token = extractBearerToken(req.headers.authorization);
  if (!token) {
    next(new AppError(401, "Authentication required", "AUTH_REQUIRED"));
    return;
  }

  try {
    const payload = jwt.verify(token, env.jwtAccessSecret) as AuthTokenPayload;
    if (payload.type !== "access") {
      throw new AppError(401, "Invalid token type", "INVALID_TOKEN");
    }

    req.auth = {
      userId: payload.sub,
      role: payload.role,
    };

    next();
  } catch {
    next(new AppError(401, "Invalid or expired token", "INVALID_TOKEN"));
  }
};

export const requireRole = (...roles: Role[]) => {
  return (
    req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction,
  ): void => {
    if (!req.auth) {
      next(new AppError(401, "Authentication required", "AUTH_REQUIRED"));
      return;
    }

    if (!roles.includes(req.auth.role)) {
      next(new AppError(403, "Forbidden", "FORBIDDEN"));
      return;
    }

    next();
  };
};
