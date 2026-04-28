import type { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "../constants/http-status.js";
import { AppError } from "../utils/app-error.js";
import { verifyAccessToken } from "../utils/token.js";

export const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    throw new AppError("Ban chua dang nhap", HTTP_STATUS.UNAUTHORIZED);
  }

  const token = authorization.replace("Bearer ", "").trim();

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    throw new AppError("Token khong hop le hoac da het han", HTTP_STATUS.UNAUTHORIZED);
  }
};
