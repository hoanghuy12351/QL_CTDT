import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { env } from "../../config/env.js";
import { HTTP_STATUS } from "../constants/http-status.js";
import { AppError } from "../utils/app-error.js";

export const notFoundMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`Khong tim thay API: ${req.method} ${req.originalUrl}`, HTTP_STATUS.NOT_FOUND));
};

export const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (error instanceof ZodError) {
    return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({
      success: false,
      message: "Du lieu khong hop le",
      errors: error.issues,
    });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      errors: error.errors,
    });
  }

  const message = error instanceof Error ? error.message : "Loi he thong";

  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: env.nodeEnv === "development" ? message : "Loi he thong",
    errors: [],
  });
};
