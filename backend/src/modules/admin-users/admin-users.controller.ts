import type { Request, Response } from "express";
import { sendSuccess } from "../../common/utils/response.js";
import { adminUsersService } from "./admin-users.service.js";
import type {
  CreateUserInput,
  ListUsersQuery,
  UpdateUserInput,
  UserIdParam,
} from "./admin-users.validation.js";

export const adminUsersController = {
  async list(req: Request, res: Response) {
    const result = await adminUsersService.list(req.validated?.query as ListUsersQuery);
    return sendSuccess(res, "Lấy danh sách tài khoản thành công", result);
  },

  async create(req: Request, res: Response) {
    const result = await adminUsersService.create(req.validated?.body as CreateUserInput);
    return sendSuccess(res, "Tạo tài khoản thành công", result, 201);
  },

  async update(req: Request, res: Response) {
    const params = req.validated?.params as UserIdParam;
    const result = await adminUsersService.update(
      params.id,
      req.validated?.body as UpdateUserInput,
    );
    return sendSuccess(res, "Cập nhật tài khoản thành công", result);
  },
};
