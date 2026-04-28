import type { Request, Response } from "express";
import { sendCreated, sendSuccess } from "../../common/utils/response.js";
import { adminCrudService } from "./admin-crud.service.js";
import type { ListQuery, ResourceIdParam, ResourceParam } from "./admin-crud.validation.js";

export const adminCrudController = {
  async list(req: Request, res: Response) {
    const params = req.validated?.params as ResourceParam;
    const query = req.validated?.query as ListQuery;
    const result = await adminCrudService.list(params.resource, query);
    return sendSuccess(res, "Lay danh sach thanh cong", result);
  },

  async detail(req: Request, res: Response) {
    const params = req.validated?.params as ResourceIdParam;
    const result = await adminCrudService.detail(params.resource, params.id);
    return sendSuccess(res, "Lay chi tiet thanh cong", result);
  },

  async create(req: Request, res: Response) {
    const params = req.validated?.params as ResourceParam;
    const body = req.validated?.body as Record<string, unknown>;
    const result = await adminCrudService.create(params.resource, body);
    return sendCreated(res, "Tao moi thanh cong", result);
  },

  async update(req: Request, res: Response) {
    const params = req.validated?.params as ResourceIdParam;
    const body = req.validated?.body as Record<string, unknown>;
    const result = await adminCrudService.update(params.resource, params.id, body);
    return sendSuccess(res, "Cap nhat thanh cong", result);
  },

  async delete(req: Request, res: Response) {
    const params = req.validated?.params as ResourceIdParam;
    const result = await adminCrudService.delete(params.resource, params.id);
    return sendSuccess(res, "Xoa thanh cong", result);
  },
};
