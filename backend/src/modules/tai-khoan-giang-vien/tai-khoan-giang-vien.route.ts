import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware.js";
import { requireRole } from "../../common/middlewares/role.middleware.js";
import { validate } from "../../common/middlewares/validate.middleware.js";
import { asyncHandler } from "../../common/utils/async-handler.js";
import { lecturerAccountController } from "./tai-khoan-giang-vien.controller.js";
import {
  createLecturerAccountSchema,
  lecturerAccountIdParamSchema,
  lecturerAccountListQuerySchema,
  updateLecturerAccountSchema,
} from "./tai-khoan-giang-vien.validation.js";

const router = Router();

router.use(authMiddleware, requireRole("quan_tri", "giao_vu"));

router.get(
  "/",
  validate({ query: lecturerAccountListQuerySchema }),
  asyncHandler(lecturerAccountController.list),
);

router.get(
  "/giang-vien-chua-co-tai-khoan",
  asyncHandler(lecturerAccountController.availableLecturers),
);

router.post(
  "/",
  validate({ body: createLecturerAccountSchema }),
  asyncHandler(lecturerAccountController.create),
);

router.put(
  "/:id",
  validate({ params: lecturerAccountIdParamSchema, body: updateLecturerAccountSchema }),
  asyncHandler(lecturerAccountController.update),
);

export default router;
