import type { Response } from "express";

export const sendSuccess = <T>(
  res: Response,
  message: string,
  data: T,
  statusCode = 200,
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendCreated = <T>(res: Response, message: string, data: T) => {
  return sendSuccess(res, message, data, 201);
};
