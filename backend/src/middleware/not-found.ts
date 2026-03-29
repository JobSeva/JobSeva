import { NextFunction, Request, Response } from "express";

import { AppError } from "../common/errors";

export const notFound = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  next(
    new AppError(
      404,
      `Route not found: ${req.method} ${req.originalUrl}`,
      "NOT_FOUND",
    ),
  );
};
