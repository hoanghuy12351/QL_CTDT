import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware.js";
import { requireRole } from "../../common/middlewares/role.middleware.js";
import { asyncHandler } from "../../common/utils/async-handler.js";
import { adminDashboardController } from "./admin-dashboard.controller.js";

const router = Router();

router.get(
  "/overview",
  authMiddleware,
  requireRole("quan_tri", "giao_vu"),
  asyncHandler(adminDashboardController.overview),
);

export default router;
