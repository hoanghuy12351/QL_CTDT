import type { Request, Response } from "express";
import { Router } from "express";
import type { ZodType } from "zod";
import { authMiddleware } from "../../common/middlewares/auth.middleware.js";
import { requireRole } from "../../common/middlewares/role.middleware.js";
import { validate } from "../../common/middlewares/validate.middleware.js";
import { asyncHandler } from "../../common/utils/async-handler.js";
import { sendCreated, sendSuccess } from "../../common/utils/response.js";
import { adminCrudService } from "./admin-crud.service.js";
import {
  listQuerySchema,
  type ListQuery,
} from "./admin-crud.validation.js";

type ResourceIdParam = {
  id: number;
};

type CreateAdminResourceRouteInput = {
  resource: string;
  label: string;
  createSchema: ZodType;
  updateSchema: ZodType;
  idParamSchema: ZodType;
};

export const createAdminResourceRouter = ({
  resource,
  label,
  createSchema,
  updateSchema,
  idParamSchema,
}: CreateAdminResourceRouteInput) => {
  const router = Router();

  router.use(authMiddleware, requireRole("quan_tri", "giao_vu"));

  router.get(
    "/",
    validate({ query: listQuerySchema }),
    asyncHandler(async (req: Request, res: Response) => {
      const query = req.validated?.query as ListQuery;
      const result = await adminCrudService.list(resource, query);
      return sendSuccess(res, `Lay danh sach ${label} thanh cong`, result);
    }),
  );

  router.get(
    "/:id",
    validate({ params: idParamSchema }),
    asyncHandler(async (req: Request, res: Response) => {
      const params = req.validated?.params as ResourceIdParam;
      const result = await adminCrudService.detail(resource, params.id);
      return sendSuccess(res, `Lay chi tiet ${label} thanh cong`, result);
    }),
  );

  router.post(
    "/",
    validate({ body: createSchema }),
    asyncHandler(async (req: Request, res: Response) => {
      const body = req.validated?.body as Record<string, unknown>;
      const result = await adminCrudService.create(resource, body);
      return sendCreated(res, `Tao ${label} thanh cong`, result);
    }),
  );

  router.put(
    "/:id",
    validate({ params: idParamSchema, body: updateSchema }),
    asyncHandler(async (req: Request, res: Response) => {
      const params = req.validated?.params as ResourceIdParam;
      const body = req.validated?.body as Record<string, unknown>;
      const result = await adminCrudService.update(resource, params.id, body);
      return sendSuccess(res, `Cap nhat ${label} thanh cong`, result);
    }),
  );

  router.delete(
    "/:id",
    validate({ params: idParamSchema }),
    asyncHandler(async (req: Request, res: Response) => {
      const params = req.validated?.params as ResourceIdParam;
      const result = await adminCrudService.delete(resource, params.id);
      return sendSuccess(res, `Xoa ${label} thanh cong`, result);
    }),
  );

  return router;
};
