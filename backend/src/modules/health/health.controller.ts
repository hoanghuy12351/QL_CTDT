import type { Request, Response } from "express";
import { sendSuccess } from "../../common/utils/response.js";
import { healthService } from "./health.service.js";

export const healthController = {
  check(_req: Request, res: Response) {
    return sendSuccess(res, "API dang hoat dong", healthService.check());
  },
};
