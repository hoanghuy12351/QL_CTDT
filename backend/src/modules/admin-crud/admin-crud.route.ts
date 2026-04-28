import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware.js";
import { requireRole } from "../../common/middlewares/role.middleware.js";
import { validate } from "../../common/middlewares/validate.middleware.js";
import { asyncHandler } from "../../common/utils/async-handler.js";
import { adminCrudController } from "./admin-crud.controller.js";
import {
  createBodySchema,
  listQuerySchema,
  resourceIdParamSchema,
  resourceParamSchema,
  updateBodySchema,
} from "./admin-crud.validation.js";

const router = Router();

router.use(authMiddleware, requireRole("quan_tri", "giao_vu"));

router.get(
  "/:resource",
  validate({ params: resourceParamSchema, query: listQuerySchema }),
  asyncHandler(adminCrudController.list),
);

router.get(
  "/:resource/:id",
  validate({ params: resourceIdParamSchema }),
  asyncHandler(adminCrudController.detail),
);

router.post(
  "/:resource",
  validate({ params: resourceParamSchema, body: createBodySchema }),
  asyncHandler(adminCrudController.create),
);

router.put(
  "/:resource/:id",
  validate({ params: resourceIdParamSchema, body: updateBodySchema }),
  asyncHandler(adminCrudController.update),
);

router.delete(
  "/:resource/:id",
  validate({ params: resourceIdParamSchema }),
  asyncHandler(adminCrudController.delete),
);

export default router;
