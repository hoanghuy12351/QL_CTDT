import type { Request, Response } from "express";
import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware.js";
import { requireRole } from "../../common/middlewares/role.middleware.js";
import { validate } from "../../common/middlewares/validate.middleware.js";
import { asyncHandler } from "../../common/utils/async-handler.js";
import { sendCreated, sendSuccess } from "../../common/utils/response.js";
import { dinhMucGiangVienService } from "./dinh-muc-giang-vien.service.js";
import {
  createDinhMucSchema,
  generateDinhMucSchema,
  idParamSchema,
  listDinhMucQuerySchema,
  updateDinhMucSchema,
  type CreateDinhMucInput,
  type GenerateDinhMucInput,
  type ListDinhMucQuery,
  type UpdateDinhMucInput,
} from "./dinh-muc-giang-vien.validation.js";

const router = Router();

router.use(authMiddleware, requireRole("quan_tri", "giao_vu"));

router.get(
  "/",
  validate({ query: listDinhMucQuerySchema }),
  asyncHandler(async (req: Request, res: Response) => {
    const query = req.validated?.query as ListDinhMucQuery;
    const result = await dinhMucGiangVienService.list(query);
    return sendSuccess(res, "Lay danh sach dinh muc giang vien thanh cong", result);
  }),
);

router.post(
  "/generate",
  validate({ body: generateDinhMucSchema }),
  asyncHandler(async (req: Request, res: Response) => {
    const body = req.validated?.body as GenerateDinhMucInput;
    const result = await dinhMucGiangVienService.generate(body);
    return sendSuccess(res, "Sinh dinh muc giang vien thanh cong", result);
  }),
);

router.get(
  "/:id",
  validate({ params: idParamSchema }),
  asyncHandler(async (req: Request, res: Response) => {
    const params = req.validated?.params as { id: number };
    const result = await dinhMucGiangVienService.detail(params.id);
    return sendSuccess(res, "Lay chi tiet dinh muc giang vien thanh cong", result);
  }),
);

router.post(
  "/",
  validate({ body: createDinhMucSchema }),
  asyncHandler(async (req: Request, res: Response) => {
    const body = req.validated?.body as CreateDinhMucInput;
    const result = await dinhMucGiangVienService.create(body);
    return sendCreated(res, "Tao dinh muc giang vien thanh cong", result);
  }),
);

router.put(
  "/:id",
  validate({ params: idParamSchema, body: updateDinhMucSchema }),
  asyncHandler(async (req: Request, res: Response) => {
    const params = req.validated?.params as { id: number };
    const body = req.validated?.body as UpdateDinhMucInput;
    const result = await dinhMucGiangVienService.update(params.id, body);
    return sendSuccess(res, "Cap nhat dinh muc giang vien thanh cong", result);
  }),
);

router.delete(
  "/:id",
  validate({ params: idParamSchema }),
  asyncHandler(async (req: Request, res: Response) => {
    const params = req.validated?.params as { id: number };
    const result = await dinhMucGiangVienService.remove(params.id);
    return sendSuccess(res, "Xoa dinh muc giang vien thanh cong", result);
  }),
);

export default router;
