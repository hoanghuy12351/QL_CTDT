import type { Request, Response } from "express";
import { sendCreated, sendSuccess } from "../../common/utils/response.js";
import { hocPhanService } from "./hocphan.service.js";
import type {
  HocPhanCreateInput,
  HocPhanListQuery,
  HocPhanUpdateInput,
} from "./hocphan.validation.js";

type HocPhanIdParam = {
  id: number;
};

export const hocPhanController = {
  async list(req: Request, res: Response) {
    const query = req.validated?.query as HocPhanListQuery;
    const result = await hocPhanService.list(query);
    return sendSuccess(res, "Lay danh sach hoc phan thanh cong", result);
  },

  async detail(req: Request, res: Response) {
    const params = req.validated?.params as HocPhanIdParam;
    const result = await hocPhanService.detail(params.id);
    return sendSuccess(res, "Lay chi tiet hoc phan thanh cong", result);
  },

  async create(req: Request, res: Response) {
    const body = req.validated?.body as HocPhanCreateInput;
    const result = await hocPhanService.create(body);
    return sendCreated(res, "Tao hoc phan thanh cong", result);
  },

  async update(req: Request, res: Response) {
    const params = req.validated?.params as HocPhanIdParam;
    const body = req.validated?.body as HocPhanUpdateInput;
    const result = await hocPhanService.update(params.id, body);
    return sendSuccess(res, "Cap nhat hoc phan thanh cong", result);
  },

  async delete(req: Request, res: Response) {
    const params = req.validated?.params as HocPhanIdParam;
    const result = await hocPhanService.delete(params.id);
    return sendSuccess(res, "Xoa hoc phan thanh cong", result);
  },
};

