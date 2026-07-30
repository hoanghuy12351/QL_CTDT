import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";

const lecturerAssignmentInclude = {
  giangVien: {
    include: {
      boMon: true,
    },
  },
  lichDayTheoTuan: {
    include: {
      tuanDaoTao: true,
      phongHoc: true,
    },
    orderBy: {
      tuanDaoTao: {
        soTuan: "asc" as const,
      },
    },
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
              keHoachDaoTao: {
                include: {
                  namHoc: true,
                },
              },
            },
          },
        },
      },
    },
  },
  _count: {
    select: {
      lichDayTheoTuan: true,
    },
  },
};

export const lecturerRepository = {
  findLecturerByUserId(userId: number) {
    return prisma.giangVien.findFirst({
      where: { nguoiDungId: userId },
      include: { boMon: true, nguoiDung: true },
    });
  },

  findAssignments(input: {
    lecturerId: number;
    skip: number;
    limit: number;
    keyword?: string;
    keHoachHocKyId?: number;
    trangThai?: "du_thao" | "da_phan_cong" | "da_xac_nhan" | "da_huy";
  }) {
    const where: Prisma.phanCongGiangDayWhereInput = {
      giangVienId: input.lecturerId,
      ...(input.trangThai ? { trangThai: input.trangThai } : {}),
      ...(input.keyword
        ? {
            OR: [
              { nhomHocPhan: { maNhom: { contains: input.keyword } } },
              { nhomHocPhan: { tenNhom: { contains: input.keyword } } },
              {
                nhomHocPhan: {
                  keHoachLopHocPhan: {
                    lop: { maLop: { contains: input.keyword } },
                  },
                },
              },
              {
                nhomHocPhan: {
                  keHoachLopHocPhan: {
                    hocPhan: { maHocPhan: { contains: input.keyword } },
                  },
                },
              },
              {
                nhomHocPhan: {
                  keHoachLopHocPhan: {
                    hocPhan: { tenHocPhan: { contains: input.keyword } },
                  },
                },
              },
            ],
          }
        : {}),
      nhomHocPhan: {
        keHoachLopHocPhan: {
          ...(input.keHoachHocKyId
            ? { keHoachHocKyId: input.keHoachHocKyId }
            : {}),
        },
      },
    };

    return Promise.all([
      prisma.phanCongGiangDay.findMany({
        where,
        include: lecturerAssignmentInclude,
        orderBy: [
          {
            nhomHocPhan: {
              keHoachLopHocPhan: {
                keHoachHocKy: { keHoachHocKyId: "desc" },
              },
            },
          },
          {
            nhomHocPhan: {
              keHoachLopHocPhan: {
                hocPhan: { maHocPhan: "asc" },
              },
            },
          },
          { nhomHocPhan: { maNhom: "asc" } },
          { phanCongId: "asc" },
        ],
        skip: input.skip,
        take: input.limit,
      }),
      prisma.phanCongGiangDay.count({ where }),
    ]);
  },

  countActiveAssignments(lecturerId: number) {
    return prisma.phanCongGiangDay.count({
      where: {
        giangVienId: lecturerId,
        trangThai: { not: "da_huy" },
      },
    });
  },

  countConfirmedAssignments(lecturerId: number) {
    return prisma.phanCongGiangDay.count({
      where: {
        giangVienId: lecturerId,
        trangThai: "da_xac_nhan",
      },
    });
  },

  sumWorkload(lecturerId: number) {
    return prisma.phanCongGiangDay.aggregate({
      where: {
        giangVienId: lecturerId,
        trangThai: { not: "da_huy" },
      },
      _sum: {
        soTietPhanCong: true,
        soTietQuyDoi: true,
      },
    });
  },

  findUpcomingWeeklySchedules(input: { lecturerId: number; limit: number }) {
    return prisma.lichDayTheoTuan.findMany({
      where: {
        phanCongGiangDay: {
          giangVienId: input.lecturerId,
          trangThai: { not: "da_huy" },
        },
      },
      include: {
        tuanDaoTao: true,
        phongHoc: true,
        phanCongGiangDay: {
          include: {
            nhomHocPhan: {
              include: {
                keHoachLopHocPhan: {
                  include: {
                    lop: true,
                    hocPhan: true,
                    keHoachHocKy: {
                      include: {
                        hocKy: true,
                        keHoachDaoTao: {
                          include: { namHoc: true },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: [
        { tuanDaoTao: { ngayBatDau: "asc" } },
        { tuanDaoTao: { soTuan: "asc" } },
        { lichTuanId: "asc" },
      ],
      take: input.limit,
    });
  },
};
