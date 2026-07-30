import { Prisma } from "@prisma/client";
import { HTTP_STATUS } from "../../common/constants/http-status.js";
import { buildPaginationMeta, getPagination } from "../../common/helpers/pagination.js";
import { AppError } from "../../common/utils/app-error.js";
import { hashPassword } from "../../common/utils/password.js";
import { mapAvailableLecturer, mapLecturerAccount } from "./tai-khoan-giang-vien.mapper.js";
import { lecturerAccountRepository } from "./tai-khoan-giang-vien.repository.js";
import type {
  CreateLecturerAccountInput,
  LecturerAccountListQuery,
  UpdateLecturerAccountInput,
} from "./tai-khoan-giang-vien.validation.js";

const ensureLecturerAccountRole = (role: string) => {
  if (role !== "giang_vien") {
    throw new AppError(
      "Tai khoan nay khong phai tai khoan giang vien",
      HTTP_STATUS.BAD_REQUEST,
    );
  }
};

const mapPrismaError = (error: unknown): never => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      throw new AppError("Email dang duoc su dung", HTTP_STATUS.CONFLICT);
    }

    if (error.code === "P2025") {
      throw new AppError("Khong tim thay tai khoan", HTTP_STATUS.NOT_FOUND);
    }
  }

  throw error;
};

export const lecturerAccountService = {
  async list(query: LecturerAccountListQuery) {
    const { page, limit, skip } = getPagination(query);
    const result = await lecturerAccountRepository.list({
      ...query,
      skip,
      take: limit,
    });

    return {
      items: result.items.map(mapLecturerAccount),
      pagination: buildPaginationMeta(page, limit, result.totalItems),
    };
  },

  async availableLecturers() {
    const lecturers = await lecturerAccountRepository.findAvailableLecturers();
    return lecturers.map(mapAvailableLecturer);
  },

  async create(input: CreateLecturerAccountInput) {
    const lecturer = await lecturerAccountRepository.findLecturerById(input.giangVienId);

    if (!lecturer) {
      throw new AppError("Khong tim thay ho so giang vien", HTTP_STATUS.NOT_FOUND);
    }

    if (lecturer.nguoiDung) {
      throw new AppError(
        "Giang vien nay da co tai khoan dang nhap",
        HTTP_STATUS.CONFLICT,
      );
    }

    const existedUser = await lecturerAccountRepository.findUserByEmail(input.email);

    if (existedUser) {
      throw new AppError("Email dang duoc su dung", HTTP_STATUS.CONFLICT);
    }

    try {
      const created = await lecturerAccountRepository.createAccountForLecturer({
        giangVienId: input.giangVienId,
        email: input.email,
        passwordHash: await hashPassword(input.password),
        trangThai: input.trangThai ?? "hoat_dong",
      });

      if (!created) {
        throw new AppError("Khong tim thay ho so giang vien", HTTP_STATUS.NOT_FOUND);
      }

      return mapLecturerAccount(created);
    } catch (error) {
      mapPrismaError(error);
    }
  },

  async update(nguoiDungId: number, input: UpdateLecturerAccountInput) {
    const user = await lecturerAccountRepository.findUserById(nguoiDungId);

    if (!user) {
      throw new AppError("Khong tim thay tai khoan", HTTP_STATUS.NOT_FOUND);
    }

    ensureLecturerAccountRole(user.vaiTro);

    if (!user.giangVien.length) {
      throw new AppError(
        "Tai khoan nay chua lien ket voi ho so giang vien",
        HTTP_STATUS.CONFLICT,
      );
    }

    if (input.email && input.email !== user.email) {
      const existedUser = await lecturerAccountRepository.findUserByEmail(input.email);

      if (existedUser && existedUser.nguoiDungId !== nguoiDungId) {
        throw new AppError("Email dang duoc su dung", HTTP_STATUS.CONFLICT);
      }
    }

    try {
      const updated = await lecturerAccountRepository.updateLecturerAccount({
        nguoiDungId,
        email: input.email,
        passwordHash: input.password ? await hashPassword(input.password) : undefined,
        trangThai: input.trangThai,
      });

      if (!updated) {
        throw new AppError(
          "Tai khoan nay chua lien ket voi ho so giang vien",
          HTTP_STATUS.CONFLICT,
        );
      }

      return mapLecturerAccount(updated);
    } catch (error) {
      mapPrismaError(error);
    }
  },
};
