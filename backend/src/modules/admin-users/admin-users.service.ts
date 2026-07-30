import { HTTP_STATUS } from "../../common/constants/http-status.js";
import {
  buildPaginationMeta,
  getPagination,
} from "../../common/helpers/pagination.js";
import { AppError } from "../../common/utils/app-error.js";
import { hashPassword } from "../../common/utils/password.js";
import { adminUsersRepository } from "./admin-users.repository.js";
import type {
  CreateUserInput,
  ListUsersQuery,
  UpdateUserInput,
} from "./admin-users.validation.js";

const sanitizeUser = <T extends { matKhauHash?: string }>(user: T) => {
  const { matKhauHash: _matKhauHash, ...safeUser } = user;
  return safeUser;
};

const ensureLecturerCanBeLinked = async (
  giangVienId: number | undefined | null,
  currentUserId?: number,
) => {
  if (!giangVienId) return;

  const lecturer = await adminUsersRepository.findLecturer(giangVienId);

  if (!lecturer) {
    throw new AppError("Không tìm thấy hồ sơ giảng viên", HTTP_STATUS.NOT_FOUND);
  }

  if (
    lecturer.nguoiDungId &&
    (!currentUserId || lecturer.nguoiDungId !== currentUserId)
  ) {
    throw new AppError(
      "Hồ sơ giảng viên này đã được liên kết với tài khoản khác",
      HTTP_STATUS.CONFLICT,
    );
  }
};

export const adminUsersService = {
  async list(query: ListUsersQuery) {
    const { page, limit, skip } = getPagination(query);
    const [items, totalItems] = await adminUsersRepository.findMany({
      skip,
      limit,
      keyword: query.keyword,
      vaiTro: query.vaiTro,
      trangThai: query.trangThai,
    });

    return {
      items: items.map(sanitizeUser),
      pagination: buildPaginationMeta(page, limit, totalItems),
    };
  },

  async create(input: CreateUserInput) {
    const existedUser = await adminUsersRepository.findByEmail(input.email);

    if (existedUser) {
      throw new AppError("Email đã tồn tại", HTTP_STATUS.CONFLICT);
    }

    await ensureLecturerCanBeLinked(input.giangVienId);

    const user = await adminUsersRepository.createWithOptionalLecturer({
      user: {
        email: input.email,
        hoTen: input.hoTen,
        vaiTro: input.vaiTro,
        trangThai: input.trangThai ?? "hoat_dong",
        matKhauHash: await hashPassword(input.password),
      },
      giangVienId: input.vaiTro === "giang_vien" ? input.giangVienId : undefined,
    });

    return sanitizeUser(user);
  },

  async update(id: number, input: UpdateUserInput) {
    const currentUser = await adminUsersRepository.findById(id);

    if (!currentUser) {
      throw new AppError("Không tìm thấy tài khoản", HTTP_STATUS.NOT_FOUND);
    }

    if (input.email && input.email !== currentUser.email) {
      const existedUser = await adminUsersRepository.findByEmail(input.email);

      if (existedUser && existedUser.nguoiDungId !== id) {
        throw new AppError("Email đã tồn tại", HTTP_STATUS.CONFLICT);
      }
    }

    await ensureLecturerCanBeLinked(input.giangVienId, id);

    const user = await adminUsersRepository.updateWithOptionalLecturer({
      id,
      user: {
        ...(input.email ? { email: input.email } : {}),
        ...(input.hoTen ? { hoTen: input.hoTen } : {}),
        ...(input.vaiTro ? { vaiTro: input.vaiTro } : {}),
        ...(input.trangThai ? { trangThai: input.trangThai } : {}),
        ...(input.password
          ? { matKhauHash: await hashPassword(input.password) }
          : {}),
        ngayCapNhat: new Date(),
      },
      giangVienId:
        input.vaiTro === "giang_vien" || currentUser.vaiTro === "giang_vien"
          ? input.giangVienId
          : undefined,
    });

    return sanitizeUser(user);
  },
};
