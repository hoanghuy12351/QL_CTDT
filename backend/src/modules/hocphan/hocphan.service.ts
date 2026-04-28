import { Prisma } from "@prisma/client";
import { buildPaginationMeta, getPagination } from "../../common/helpers/pagination.js";
import { HTTP_STATUS } from "../../common/constants/http-status.js";
import { AppError } from "../../common/utils/app-error.js";
import { hocPhanRepository } from "./hocphan.repository.js";
import { mapHocPhan, mapHocPhanList } from "./hocphan.mapper.js";
import type {
  HocPhanCreateInput,
  HocPhanListQuery,
  HocPhanUpdateInput,
} from "./hocphan.validation.js";

const buildCreateData = (input: HocPhanCreateInput) => {
  const tongSoTiet =
    input.tongSoTiet ?? input.soTietLyThuyet + input.soTietThucHanh;

  return {
    ...input,
    tongSoTiet,
    ngayCapNhat: new Date(),
  };
};

type ExistingHocPhanLessonCount = {
  soTietLyThuyet: number;
  soTietThucHanh: number;
};

const buildUpdateData = (
  input: HocPhanUpdateInput,
  existing: ExistingHocPhanLessonCount,
) => {
  const shouldRecalculateTongSoTiet =
    input.tongSoTiet === undefined &&
    (input.soTietLyThuyet !== undefined ||
      input.soTietThucHanh !== undefined);

  return {
    ...input,
    tongSoTiet: shouldRecalculateTongSoTiet
      ? (input.soTietLyThuyet ?? existing.soTietLyThuyet) +
        (input.soTietThucHanh ?? existing.soTietThucHanh)
      : input.tongSoTiet,
    ngayCapNhat: new Date(),
  };
};

const ensureUniqueMaHocPhan = async (maHocPhan: string, currentId?: number) => {
  const existing = await hocPhanRepository.findByMaHocPhan(maHocPhan);

  if (existing && existing.hocPhanId !== currentId) {
    throw new AppError("Ma hoc phan da ton tai", HTTP_STATUS.CONFLICT);
  }
};

const ensureHocPhanExists = async (id: number) => {
  const item = await hocPhanRepository.findById(id);

  if (!item) {
    throw new AppError("Khong tim thay hoc phan", HTTP_STATUS.NOT_FOUND);
  }

  return item;
};

const mapPrismaError = (error: unknown): never => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      throw new AppError("Du lieu bi trung", HTTP_STATUS.CONFLICT);
    }

    if (error.code === "P2003") {
      throw new AppError("Du lieu dang duoc lien ket, khong the xoa", HTTP_STATUS.CONFLICT);
    }
  }

  throw error;
};

export const hocPhanService = {
  async list(query: HocPhanListQuery) {
    const { page, limit, skip } = getPagination(query);
    const result = await hocPhanRepository.findAll({
      skip,
      take: limit,
      keyword: query.keyword,
    });

    return {
      items: mapHocPhanList(result.items),
      pagination: buildPaginationMeta(page, limit, result.totalItems),
    };
  },

  async detail(id: number) {
    const item = await ensureHocPhanExists(id);
    return mapHocPhan(item);
  },

  async create(input: HocPhanCreateInput) {
    await ensureUniqueMaHocPhan(input.maHocPhan);

    try {
      const item = await hocPhanRepository.create(buildCreateData(input));
      return mapHocPhan(item);
    } catch (error) {
      mapPrismaError(error);
    }
  },

  async update(id: number, input: HocPhanUpdateInput) {
    const existing = await ensureHocPhanExists(id);

    if (input.maHocPhan) {
      await ensureUniqueMaHocPhan(input.maHocPhan, id);
    }

    try {
      const item = await hocPhanRepository.update(id, buildUpdateData(input, existing));
      return mapHocPhan(item);
    } catch (error) {
      mapPrismaError(error);
    }
  },

  async delete(id: number) {
    await ensureHocPhanExists(id);

    try {
      const item = await hocPhanRepository.delete(id);
      return mapHocPhan(item);
    } catch (error) {
      mapPrismaError(error);
    }
  },
};

