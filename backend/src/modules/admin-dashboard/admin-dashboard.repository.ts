import { prisma } from "../../lib/prisma.js";

export const adminDashboardRepository = {
  async getCounts() {
    const [
      tongLop,
      tongGiangVien,
      tongHocPhan,
      tongChuongTrinh,
      tongKeHoach,
      tongPhanCong,
    ] = await Promise.all([
      prisma.lop.count(),
      prisma.giangVien.count(),
      prisma.hocPhan.count(),
      prisma.chuongTrinhDaoTao.count(),
      prisma.keHoachDaoTao.count(),
      prisma.phanCongGiangDay.count(),
    ]);

    return {
      tongLop,
      tongGiangVien,
      tongHocPhan,
      tongChuongTrinh,
      tongKeHoach,
      tongPhanCong,
    };
  },

  async getRecentPlans() {
    return prisma.keHoachDaoTao.findMany({
      take: 5,
      orderBy: { keHoachId: "desc" },
      include: {
        namHoc: true,
        khoa: true,
      },
    });
  },

  async getRecentAssignments() {
    return prisma.phanCongGiangDay.findMany({
      take: 5,
      orderBy: { phanCongId: "desc" },
      include: {
        giangVien: true,
        nhomHocPhan: {
          include: {
            keHoachLopHocPhan: {
              include: {
                lop: true,
                hocPhan: true,
              },
            },
          },
        },
      },
    });
  },
};
