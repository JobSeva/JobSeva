import { NextFunction, Request, Response } from "express";
import { z, ZodTypeAny } from "zod";

import { AppError } from "../common/errors";

interface ValidateSchema {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
}

export const validate = (schema: ValidateSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }

      if (schema.query) {
        req.query = schema.query.parse(req.query) as Request["query"];
      }

      if (schema.params) {
        req.params = schema.params.parse(req.params);
      }

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(
          new AppError(
            400,
            "Validation failed",
            "VALIDATION_ERROR",
            error.flatten(),
          ),
        );
        return;
      }

      next(error);
    }
  };
};
