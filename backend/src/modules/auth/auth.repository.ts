import type { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";

export const authRepository = {
  findByEmail(email: string) {
    return prisma.nguoiDung.findUnique({
      where: { email },
    });
  },

  findById(id: number) {
    return prisma.nguoiDung.findUnique({
      where: { nguoiDungId: id },
    });
  },

  create(data: Prisma.nguoiDungUncheckedCreateInput) {
    return prisma.nguoiDung.create({
      data,
    });
  },
};
