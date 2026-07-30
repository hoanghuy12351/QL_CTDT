import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";

const userInclude = {
  giangVien: {
    include: {
      boMon: true,
    },
  },
};

export const adminUsersRepository = {
  findMany(input: {
    skip: number;
    limit: number;
    keyword?: string;
    vaiTro?: "quan_tri" | "giang_vien";
    trangThai?: "hoat_dong" | "tam_khoa" | "bi_khoa";
  }) {
    const where: Prisma.nguoiDungWhereInput = {
      ...(input.vaiTro ? { vaiTro: input.vaiTro } : {}),
      ...(input.trangThai ? { trangThai: input.trangThai } : {}),
      ...(input.keyword
        ? {
            OR: [
              { email: { contains: input.keyword } },
              { hoTen: { contains: input.keyword } },
              {
                giangVien: {
                  some: {
                    OR: [
                      { maGiangVien: { contains: input.keyword } },
                      { hoTen: { contains: input.keyword } },
                    ],
                  },
                },
              },
            ],
          }
        : {}),
    };

    return Promise.all([
      prisma.nguoiDung.findMany({
        where,
        include: userInclude,
        orderBy: { nguoiDungId: "desc" },
        skip: input.skip,
        take: input.limit,
      }),
      prisma.nguoiDung.count({ where }),
    ]);
  },

  findById(id: number) {
    return prisma.nguoiDung.findUnique({
      where: { nguoiDungId: id },
      include: userInclude,
    });
  },

  findByEmail(email: string) {
    return prisma.nguoiDung.findUnique({ where: { email } });
  },

  findLecturer(id: number) {
    return prisma.giangVien.findUnique({
      where: { giangVienId: id },
      include: { nguoiDung: true },
    });
  },

  createWithOptionalLecturer(data: {
    user: Prisma.nguoiDungUncheckedCreateInput;
    giangVienId?: number;
  }) {
    return prisma.$transaction(async (tx) => {
      const user = await tx.nguoiDung.create({ data: data.user });

      if (data.giangVienId) {
        await tx.giangVien.update({
          where: { giangVienId: data.giangVienId },
          data: {
            nguoiDungId: user.nguoiDungId,
            email: user.email,
            hoTen: user.hoTen,
          },
        });
      }

      return tx.nguoiDung.findUniqueOrThrow({
        where: { nguoiDungId: user.nguoiDungId },
        include: userInclude,
      });
    });
  },

  updateWithOptionalLecturer(input: {
    id: number;
    user: Prisma.nguoiDungUncheckedUpdateInput;
    giangVienId?: number | null;
  }) {
    return prisma.$transaction(async (tx) => {
      const user = await tx.nguoiDung.update({
        where: { nguoiDungId: input.id },
        data: input.user,
      });

      if (input.giangVienId !== undefined) {
        await tx.giangVien.updateMany({
          where: { nguoiDungId: user.nguoiDungId },
          data: { nguoiDungId: null },
        });

        if (input.giangVienId) {
          await tx.giangVien.update({
            where: { giangVienId: input.giangVienId },
            data: {
              nguoiDungId: user.nguoiDungId,
              email: user.email,
              hoTen: user.hoTen,
            },
          });
        }
      }

      return tx.nguoiDung.findUniqueOrThrow({
        where: { nguoiDungId: user.nguoiDungId },
        include: userInclude,
      });
    });
  },
};
