import { prisma } from "../../lib/prisma.js";

export const adminDashboardRepository = {
  async getCounts() {
    const [
      tongLop,
      tongGiangVien,
      tongHocPhan,
      tongChuongTrinh,
      tongKeHoachNam,
      tongKeHoachHocKy,
      tongNhomHocPhan,
      tongPhanCong,
      baoCaoSanSang,
    ] = await Promise.all([
      prisma.lop.count(),
      prisma.giangVien.count(),
      prisma.hocPhan.count(),
      prisma.chuongTrinhDaoTao.count(),
      prisma.keHoachDaoTao.count(),
      prisma.keHoachHocKy.count(),
      prisma.nhomHocPhan.count(),
      prisma.phanCongGiangDay.count(),
      prisma.keHoachHocKy.count({
        where: { trangThai: { not: "du_thao" } },
      }),
    ]);

    return {
      tongLop,
      tongGiangVien,
      tongHocPhan,
      tongChuongTrinh,
      tongKeHoachNam,
      tongKeHoachHocKy,
      tongNhomHocPhan,
      tongPhanCong,
      baoCaoSanSang,
    };
  },

  async getActionCounters() {
    const [
      lopChuaGanChuongTrinh,
      keHoachNamDuThao,
      keHoachHocKyDuThao,
      hocPhanMoChuaCoNhom,
      nhomChuaPhanCong,
      phanCongChuaCoLichTuan,
      tuanKhongHoc,
    ] = await Promise.all([
      prisma.lop.count({
        where: {
          lopChuongTrinh: {
            none: { trangThai: "dang_ap_dung" },
          },
        },
      }),
      prisma.keHoachDaoTao.count({ where: { trangThai: "du_thao" } }),
      prisma.keHoachHocKy.count({ where: { trangThai: "du_thao" } }),
      prisma.keHoachLopHocPhan.count({
        where: {
          nhomHocPhan: { none: {} },
        },
      }),
      prisma.nhomHocPhan.count({
        where: {
          phanCongGiangDay: { none: {} },
        },
      }),
      prisma.phanCongGiangDay.count({
        where: {
          lichDayTheoTuan: { none: {} },
        },
      }),
      prisma.tuanDaoTao.count({
        where: {
          loaiTuan: { in: ["nghi", "thi"] },
        },
      }),
    ]);

    return {
      lopChuaGanChuongTrinh,
      keHoachNamDuThao,
      keHoachHocKyDuThao,
      hocPhanMoChuaCoNhom,
      nhomChuaPhanCong,
      phanCongChuaCoLichTuan,
      tuanKhongHoc,
    };
  },

  getYearPlanStatusCounts() {
    return prisma.keHoachDaoTao.groupBy({
      by: ["trangThai"],
      _count: { _all: true },
    });
  },

  getSemesterPlanStatusCounts() {
    return prisma.keHoachHocKy.groupBy({
      by: ["trangThai"],
      _count: { _all: true },
    });
  },

  getRecentYearPlans() {
    return prisma.keHoachDaoTao.findMany({
      take: 5,
      orderBy: { keHoachId: "desc" },
      include: {
        namHoc: true,
        khoa: true,
        _count: {
          select: {
            keHoachHocKy: true,
            tuanDaoTao: true,
          },
        },
      },
    });
  },

  getRecentSemesterPlans() {
    return prisma.keHoachHocKy.findMany({
      take: 6,
      orderBy: { keHoachHocKyId: "desc" },
      include: {
        hocKy: true,
        keHoachDaoTao: {
          include: {
            namHoc: true,
            khoa: true,
          },
        },
        _count: {
          select: { keHoachLopHocPhan: true },
        },
      },
    });
  },

  getRecentAssignments() {
    return prisma.phanCongGiangDay.findMany({
      take: 6,
      orderBy: { phanCongId: "desc" },
      include: {
        giangVien: {
          include: { boMon: true },
        },
        nhomHocPhan: {
          include: {
            keHoachLopHocPhan: {
              include: {
                lop: true,
                hocPhan: true,
                keHoachHocKy: {
                  include: {
                    hocKy: true,
                    keHoachDaoTao: { include: { namHoc: true } },
                  },
                },
              },
            },
          },
        },
        _count: {
          select: { lichDayTheoTuan: true },
        },
      },
    });
  },

  async getLecturerWorkloads() {
    const workloads = await prisma.phanCongGiangDay.groupBy({
      by: ["giangVienId"],
      _sum: {
        soTietPhanCong: true,
        soTietQuyDoi: true,
      },
      _count: { _all: true },
    });

    const lecturerIds = workloads.map((item) => item.giangVienId);
    const lecturers = await prisma.giangVien.findMany({
      where: { giangVienId: { in: lecturerIds } },
      include: { boMon: true },
    });

    return workloads.map((workload) => ({
      ...workload,
      giangVien: lecturers.find(
        (lecturer) => lecturer.giangVienId === workload.giangVienId,
      ),
    }));
  },

  getWeeklyProgress() {
    return prisma.tuanDaoTao.findMany({
      take: 12,
      where: {
        keHoachDaoTao: {
          trangThai: { in: ["da_duyet", "dang_thuc_hien"] },
        },
      },
      orderBy: [{ keHoachId: "desc" }, { soTuan: "desc" }],
      include: {
        keHoachDaoTao: {
          include: {
            namHoc: true,
          },
        },
        lichDayTheoTuan: {
          select: { soTiet: true },
        },
      },
    });
  },
};
