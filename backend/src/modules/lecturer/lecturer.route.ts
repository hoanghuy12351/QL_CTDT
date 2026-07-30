import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware.js";
import { requireRole } from "../../common/middlewares/role.middleware.js";
import { validate } from "../../common/middlewares/validate.middleware.js";
import { asyncHandler } from "../../common/utils/async-handler.js";
import { lecturerController } from "./lecturer.controller.js";
import { lecturerAssignmentListQuerySchema } from "./lecturer.validation.js";

const router = Router();

router.use(authMiddleware, requireRole("giang_vien"));

router.get("/dashboard", asyncHandler(lecturerController.dashboard));

router.get(
  "/assignments",
  validate({ query: lecturerAssignmentListQuerySchema }),
  asyncHandler(lecturerController.assignments),
);

router.get("/weekly-schedule", asyncHandler(lecturerController.weeklySchedule));

export default router;
