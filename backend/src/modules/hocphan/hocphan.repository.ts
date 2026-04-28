import type { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";

type FindAllInput = {
  skip: number;
  take: number;
  keyword?: string;
};

const buildWhere = (keyword?: string): Prisma.hocPhanWhereInput | undefined => {
  if (!keyword) return undefined;

  return {
    OR: [
      { maHocPhan: { contains: keyword } },
      { tenHocPhan: { contains: keyword } },
      { moTa: { contains: keyword } },
    ],
  };
};

export const hocPhanRepository = {
  async findAll({ skip, take, keyword }: FindAllInput) {
    const where = buildWhere(keyword);

    const [items, totalItems] = await Promise.all([
      prisma.hocPhan.findMany({
        where,
        skip,
        take,
        orderBy: { hocPhanId: "desc" },
        include: { boMon: true },
      }),
      prisma.hocPhan.count({ where }),
    ]);

    return { items, totalItems };
  },

  findById: (id: number) =>
    prisma.hocPhan.findUnique({
      where: { hocPhanId: id },
      include: { boMon: true },
    }),

  findByMaHocPhan: (maHocPhan: string) =>
    prisma.hocPhan.findUnique({
      where: { maHocPhan },
    }),

  create: (data: Prisma.hocPhanUncheckedCreateInput) =>
    prisma.hocPhan.create({
      data,
      include: { boMon: true },
    }),

  update: (id: number, data: Prisma.hocPhanUncheckedUpdateInput) =>
    prisma.hocPhan.update({
      where: { hocPhanId: id },
      data,
      include: { boMon: true },
    }),

  delete: (id: number) =>
    prisma.hocPhan.delete({
      where: { hocPhanId: id },
      include: { boMon: true },
    }),
};

