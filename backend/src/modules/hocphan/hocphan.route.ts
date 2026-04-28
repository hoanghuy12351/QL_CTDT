import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware.js";
import { requireRole } from "../../common/middlewares/role.middleware.js";
import { validate } from "../../common/middlewares/validate.middleware.js";
import { asyncHandler } from "../../common/utils/async-handler.js";
import { hocPhanController } from "./hocphan.controller.js";
import {
  createHocPhanSchema,
  hocPhanIdParamSchema,
  listHocPhanQuerySchema,
  updateHocPhanSchema,
} from "./hocphan.validation.js";

const router = Router();

router.use(authMiddleware, requireRole("quan_tri", "giao_vu"));

router.get(
  "/",
  validate({ query: listHocPhanQuerySchema }),
  asyncHandler(hocPhanController.list),
);

router.get(
  "/:id",
  validate({ params: hocPhanIdParamSchema }),
  asyncHandler(hocPhanController.detail),
);

router.post(
  "/",
  validate({ body: createHocPhanSchema }),
  asyncHandler(hocPhanController.create),
);

router.put(
  "/:id",
  validate({ params: hocPhanIdParamSchema, body: updateHocPhanSchema }),
  asyncHandler(hocPhanController.update),
);

router.delete(
  "/:id",
  validate({ params: hocPhanIdParamSchema }),
  asyncHandler(hocPhanController.delete),
);

export default router;
