import type { Request, Response } from "express";
import { sendSuccess } from "../../common/utils/response.js";
import { lecturerService } from "./lecturer.service.js";
import type { LecturerAssignmentListQuery } from "./lecturer.validation.js";

const getCurrentUserId = (req: Request) => Number(req.user?.userId);

export const lecturerController = {
  async dashboard(req: Request, res: Response) {
    const result = await lecturerService.dashboard(getCurrentUserId(req));
    return sendSuccess(res, "Lay tong quan giang vien thanh cong", result);
  },

  async assignments(req: Request, res: Response) {
    const result = await lecturerService.listAssignments(
      getCurrentUserId(req),
      req.validated?.query as LecturerAssignmentListQuery,
    );

    return sendSuccess(res, "Lay danh sach phan cong cua giang vien thanh cong", result);
  },

  async weeklySchedule(req: Request, res: Response) {
    const result = await lecturerService.weeklySchedule(getCurrentUserId(req));
    return sendSuccess(res, "Lay lich day theo tuan cua giang vien thanh cong", result);
  },
};
