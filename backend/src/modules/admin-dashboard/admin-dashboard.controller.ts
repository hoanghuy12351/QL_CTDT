import type { Request, Response } from "express";
import { sendSuccess } from "../../common/utils/response.js";
import { adminDashboardService } from "./admin-dashboard.service.js";

export const adminDashboardController = {
  async overview(_req: Request, res: Response) {
    const result = await adminDashboardService.overview();
    return sendSuccess(res, "Lay tong quan quan tri thanh cong", result);
  },
};
