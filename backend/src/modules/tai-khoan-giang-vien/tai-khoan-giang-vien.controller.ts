import type { Request, Response } from "express";
import { sendCreated, sendSuccess } from "../../common/utils/response.js";
import { lecturerAccountService } from "./tai-khoan-giang-vien.service.js";
import type {
  CreateLecturerAccountInput,
  LecturerAccountIdParam,
  LecturerAccountListQuery,
  UpdateLecturerAccountInput,
} from "./tai-khoan-giang-vien.validation.js";

export const lecturerAccountController = {
  async list(req: Request, res: Response) {
    const query = req.validated?.query as LecturerAccountListQuery;
    const result = await lecturerAccountService.list(query ?? {});
    return sendSuccess(res, "Lay danh sach tai khoan giang vien thanh cong", result);
  },

  async availableLecturers(_req: Request, res: Response) {
    const result = await lecturerAccountService.availableLecturers();
    return sendSuccess(res, "Lay danh sach giang vien chua co tai khoan thanh cong", result);
  },

  async create(req: Request, res: Response) {
    const input = req.validated?.body as CreateLecturerAccountInput;
    const result = await lecturerAccountService.create(input);
    return sendCreated(res, "Tao tai khoan giang vien thanh cong", result);
  },

  async update(req: Request, res: Response) {
    const params = req.validated?.params as LecturerAccountIdParam;
    const input = req.validated?.body as UpdateLecturerAccountInput;
    const result = await lecturerAccountService.update(params.id, input);
    return sendSuccess(res, "Cap nhat tai khoan giang vien thanh cong", result);
  },
};
