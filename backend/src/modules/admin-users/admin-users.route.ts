import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware.js";
import { requireRole } from "../../common/middlewares/role.middleware.js";
import { validate } from "../../common/middlewares/validate.middleware.js";
import { asyncHandler } from "../../common/utils/async-handler.js";
import { adminUsersController } from "./admin-users.controller.js";
import {
  createUserSchema,
  listUsersQuerySchema,
  updateUserSchema,
  userIdParamSchema,
} from "./admin-users.validation.js";

const router = Router();

router.use(authMiddleware, requireRole("quan_tri"));

router.get(
  "/",
  validate({ query: listUsersQuerySchema }),
  asyncHandler(adminUsersController.list),
);

router.post(
  "/",
  validate({ body: createUserSchema }),
  asyncHandler(adminUsersController.create),
);

router.put(
  "/:id",
  validate({ params: userIdParamSchema, body: updateUserSchema }),
  asyncHandler(adminUsersController.update),
);

export default router;
