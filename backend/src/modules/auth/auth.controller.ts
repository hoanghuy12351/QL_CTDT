import type { Request, Response } from "express";
import { sendCreated, sendSuccess } from "../../common/utils/response.js";
import { authService } from "./auth.service.js";
import type { LoginInput, RegisterInput } from "./auth.validation.js";

export const authController = {
  async register(req: Request, res: Response) {
    const result = await authService.register(
      req.validated?.body as RegisterInput,
    );
    return sendCreated(res, "Dang ky thanh cong", result);
  },

  async login(req: Request, res: Response) {
    const result = await authService.login(req.validated?.body as LoginInput);
    return sendSuccess(res, "Dang nhap thanh cong", result);
  },

  async me(req: Request, res: Response) {
    const result = await authService.me(req.user!.userId);
    return sendSuccess(res, "Lay thong tin tai khoan thanh cong", result);
  },

  async logout(_req: Request, res: Response) {
    const result = authService.logout();
    return sendSuccess(res, "Dang xuat thanh cong", result);
  },
};
