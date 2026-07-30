import type { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import type { LecturerAccountListQuery } from "./tai-khoan-giang-vien.validation.js";

const buildKeywordWhere = (keyword?: string): Prisma.giangVienWhereInput => {
  const normalizedKeyword = keyword?.trim();

  if (!normalizedKeyword) return {};

  return {
    OR: [
      { maGiangVien: { contains: normalizedKeyword } },
      { hoTen: { contains: normalizedKeyword } },
      { email: { contains: normalizedKeyword } },
      { soDienThoai: { contains: normalizedKeyword } },
      { hocVi: { contains: normalizedKeyword } },
      { chucDanh: { contains: normalizedKeyword } },
      { boMon: { tenBoMon: { contains: normalizedKeyword } } },
      { nguoiDung: { email: { contains: normalizedKeyword } } },
      { nguoiDung: { hoTen: { contains: normalizedKeyword } } },
    ],
  };
};

const lecturerInclude = {
  boMon: true,
  nguoiDung: {
    select: {
      nguoiDungId: true,
      email: true,
      hoTen: true,
      vaiTro: true,
      trangThai: true,
      ngayTao: true,
      ngayCapNhat: true,
    },
  },
} satisfies Prisma.giangVienInclude;

export const lecturerAccountRepository = {
  async list(params: LecturerAccountListQuery & { skip: number; take: number }) {
    const where = buildKeywordWhere(params.keyword);

    const [items, totalItems] = await prisma.$transaction([
      prisma.giangVien.findMany({
        where,
        include: lecturerInclude,
        orderBy: [{ nguoiDungId: "desc" }, { giangVienId: "desc" }],
        skip: params.skip,
        take: params.take,
      }),
      prisma.giangVien.count({ where }),
    ]);

    return { items, totalItems };
  },

  findAvailableLecturers() {
    return prisma.giangVien.findMany({
      where: {
        nguoiDungId: null,
        trangThai: "dang_giang_day",
      },
      include: { boMon: true },
      orderBy: [{ hoTen: "asc" }, { giangVienId: "desc" }],
      take: 500,
    });
  },

  findLecturerById(giangVienId: number) {
    return prisma.giangVien.findUnique({
      where: { giangVienId },
      include: lecturerInclude,
    });
  },

  findUserById(nguoiDungId: number) {
    return prisma.nguoiDung.findUnique({
      where: { nguoiDungId },
      include: {
        giangVien: {
          include: { boMon: true },
        },
      },
    });
  },

  findUserByEmail(email: string) {
    return prisma.nguoiDung.findUnique({
      where: { email },
    });
  },

  createAccountForLecturer(input: {
    giangVienId: number;
    email: string;
    passwordHash: string;
    trangThai: "hoat_dong" | "tam_khoa" | "bi_khoa";
  }) {
    return prisma.$transaction(async (tx) => {
      const lecturer = await tx.giangVien.findUnique({
        where: { giangVienId: input.giangVienId },
      });

      if (!lecturer) return null;

      const user = await tx.nguoiDung.create({
        data: {
          email: input.email,
          matKhauHash: input.passwordHash,
          hoTen: lecturer.hoTen,
          vaiTro: "giang_vien",
          trangThai: input.trangThai,
        },
      });

      return tx.giangVien.update({
        where: { giangVienId: input.giangVienId },
        data: {
          nguoiDungId: user.nguoiDungId,
          email: input.email,
        },
        include: lecturerInclude,
      });
    });
  },

  updateLecturerAccount(input: {
    nguoiDungId: number;
    email?: string;
    passwordHash?: string;
    trangThai?: "hoat_dong" | "tam_khoa" | "bi_khoa";
  }) {
    return prisma.$transaction(async (tx) => {
      const updateData: Prisma.nguoiDungUpdateInput = {
        ngayCapNhat: new Date(),
      };

      if (input.email !== undefined) updateData.email = input.email;
      if (input.passwordHash !== undefined) updateData.matKhauHash = input.passwordHash;
      if (input.trangThai !== undefined) updateData.trangThai = input.trangThai;

      const user = await tx.nguoiDung.update({
        where: { nguoiDungId: input.nguoiDungId },
        data: updateData,
      });

      const lecturer = await tx.giangVien.findFirst({
        where: { nguoiDungId: input.nguoiDungId },
      });

      if (!lecturer) return null;

      return tx.giangVien.update({
        where: { giangVienId: lecturer.giangVienId },
        data: {
          email: user.email,
        },
        include: lecturerInclude,
      });
    });
  },
};
