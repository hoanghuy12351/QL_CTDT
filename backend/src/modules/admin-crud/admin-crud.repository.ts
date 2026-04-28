import { prisma } from "../../lib/prisma.js";
import type { AdminResourceConfig } from "./admin-crud.types.js";

const getModel = (config: AdminResourceConfig) => {
  const model = (prisma as unknown as Record<string, unknown>)[config.modelKey];

  if (!model) {
    throw new Error(`Prisma model khong ton tai: ${config.modelKey}`);
  }

  return model as {
    findMany(args?: unknown): Promise<unknown[]>;
    count(args?: unknown): Promise<number>;
    findUnique(args: unknown): Promise<unknown | null>;
    create(args: unknown): Promise<unknown>;
    update(args: unknown): Promise<unknown>;
    delete(args: unknown): Promise<unknown>;
  };
};

const buildWhere = (config: AdminResourceConfig, keyword?: string) => {
  if (!keyword || config.searchFields.length === 0) return undefined;

  return {
    OR: config.searchFields.map((field) => ({
      [field]: {
        contains: keyword,
      },
    })),
  };
};

export const adminCrudRepository = {
  async findMany(config: AdminResourceConfig, input: { page: number; limit: number; skip: number; keyword?: string }) {
    const model = getModel(config);
    const where = buildWhere(config, input.keyword);

    const [items, totalItems] = await Promise.all([
      model.findMany({
        where,
        skip: input.skip,
        take: input.limit,
        orderBy: config.defaultOrderBy,
        include: config.include,
      }),
      model.count({ where }),
    ]);

    return { items, totalItems };
  },

  findById(config: AdminResourceConfig, id: number) {
    const model = getModel(config);

    return model.findUnique({
      where: { [config.idField]: id },
      include: config.include,
    });
  },

  create(config: AdminResourceConfig, data: Record<string, unknown>) {
    const model = getModel(config);

    return model.create({
      data,
      include: config.include,
    });
  },

  update(config: AdminResourceConfig, id: number, data: Record<string, unknown>) {
    const model = getModel(config);

    return model.update({
      where: { [config.idField]: id },
      data,
      include: config.include,
    });
  },

  delete(config: AdminResourceConfig, id: number) {
    const model = getModel(config);

    return model.delete({
      where: { [config.idField]: id },
    });
  },
};
