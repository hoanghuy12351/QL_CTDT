import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware.js";
import { validate } from "../../common/middlewares/validate.middleware.js";
import { asyncHandler } from "../../common/utils/async-handler.js";
import { authController } from "./auth.controller.js";
import { loginSchema, registerSchema } from "./auth.validation.js";

const router = Router();

router.post(
  "/register",
  validate({ body: registerSchema }),
  asyncHandler(authController.register),
);

router.post(
  "/login",
  validate({ body: loginSchema }),
  asyncHandler(authController.login),
);

router.get("/me", authMiddleware, asyncHandler(authController.me));

router.post("/logout", authMiddleware, asyncHandler(authController.logout));

export default router;
