import { HTTP_STATUS } from "../../common/constants/http-status.js";
import { AppError } from "../../common/utils/app-error.js";
import { comparePassword, hashPassword } from "../../common/utils/password.js";
import { signAccessToken } from "../../common/utils/token.js";
import { mapAuthUser } from "./auth.mapper.js";
import { authRepository } from "./auth.repository.js";
import type { AuthResponse } from "./auth.types.js";
import type { LoginInput, RegisterInput } from "./auth.validation.js";

const buildAuthResponse = (
  user: Awaited<ReturnType<typeof authRepository.findByEmail>> extends infer T
    ? Exclude<T, null>
    : never,
): AuthResponse => {
  const token = signAccessToken({
    userId: user.nguoiDungId,
    email: user.email,
    role: user.vaiTro,
  });

  return {
    token,
    user: mapAuthUser(user),
  };
};

export const authService = {
  async register(input: RegisterInput) {
    const existedUser = await authRepository.findByEmail(input.email);

    if (existedUser) {
      throw new AppError("Email da ton tai", HTTP_STATUS.CONFLICT);
    }

    const user = await authRepository.create({
      email: input.email,
      matKhauHash: await hashPassword(input.password),
      hoTen: input.hoTen,
      vaiTro: "giao_vu",
    });

    return buildAuthResponse(user);
  },

  async login(input: LoginInput) {
    const user = await authRepository.findByEmail(input.email);

    if (!user) {
      throw new AppError(
        "Email hoac mat khau khong dung",
        HTTP_STATUS.UNAUTHORIZED,
      );
    }

    if (user.trangThai !== "hoat_dong") {
      throw new AppError(
        "Tai khoan dang bi khoa hoac tam khoa",
        HTTP_STATUS.FORBIDDEN,
      );
    }

    const isPasswordValid = await comparePassword(
      input.password,
      user.matKhauHash,
    );

    if (!isPasswordValid) {
      throw new AppError(
        "Email hoac mat khau khong dung",
        HTTP_STATUS.UNAUTHORIZED,
      );
    }

    return buildAuthResponse(user);
  },

  async me(userId: number) {
    const user = await authRepository.findById(userId);

    if (!user) {
      throw new AppError("Khong tim thay tai khoan", HTTP_STATUS.NOT_FOUND);
    }

    if (user.trangThai !== "hoat_dong") {
      throw new AppError(
        "Tai khoan dang bi khoa hoac tam khoa",
        HTTP_STATUS.FORBIDDEN,
      );
    }

    return mapAuthUser(user);
  },

  logout() {
    return null;
  },
};
