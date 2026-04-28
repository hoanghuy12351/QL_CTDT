import { Prisma } from "@prisma/client";
import { buildPaginationMeta, getPagination } from "../../common/helpers/pagination.js";
import { HTTP_STATUS } from "../../common/constants/http-status.js";
import { AppError } from "../../common/utils/app-error.js";
import { getAdminResourceConfig } from "./admin-crud.config.js";
import { mapAdminRecord } from "./admin-crud.mapper.js";
import { adminCrudRepository } from "./admin-crud.repository.js";
import type { ListQuery } from "./admin-crud.validation.js";

const getConfigOrThrow = (resource: string) => {
  const config = getAdminResourceConfig(resource);

  if (!config) {
    throw new AppError(`Tai nguyen khong duoc ho tro: ${resource}`, HTTP_STATUS.NOT_FOUND);
  }

  return config;
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

export const adminCrudService = {
  async list(resource: string, query: ListQuery) {
    const config = getConfigOrThrow(resource);
    const { page, limit, skip } = getPagination(query);
    const result = await adminCrudRepository.findMany(config, {
      page,
      limit,
      skip,
      keyword: query.keyword,
    });

    return {
      items: mapAdminRecord(result.items),
      pagination: buildPaginationMeta(page, limit, result.totalItems),
    };
  },

  async detail(resource: string, id: number) {
    const config = getConfigOrThrow(resource);
    const item = await adminCrudRepository.findById(config, id);

    if (!item) {
      throw new AppError("Khong tim thay du lieu", HTTP_STATUS.NOT_FOUND);
    }

    return mapAdminRecord(item);
  },

  async create(resource: string, data: Record<string, unknown>) {
    const config = getConfigOrThrow(resource);

    try {
      const item = await adminCrudRepository.create(config, data);
      return mapAdminRecord(item);
    } catch (error) {
      mapPrismaError(error);
    }
  },

  async update(resource: string, id: number, data: Record<string, unknown>) {
    const config = getConfigOrThrow(resource);
    await this.detail(resource, id);

    try {
      const item = await adminCrudRepository.update(config, id, data);
      return mapAdminRecord(item);
    } catch (error) {
      mapPrismaError(error);
    }
  },

  async delete(resource: string, id: number) {
    const config = getConfigOrThrow(resource);
    await this.detail(resource, id);

    try {
      const item = await adminCrudRepository.delete(config, id);
      return mapAdminRecord(item);
    } catch (error) {
      mapPrismaError(error);
    }
  },
};
