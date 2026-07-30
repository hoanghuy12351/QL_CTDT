import type {
  Prisma,
  phanCongGiangDayTrangThai,
  keHoachLopHocPhanNguonTao,
  nhomHocPhanLoaiNhom,
  phanCongGiangDayVaiTro,
} from "@prisma/client";
import { prisma } from "../../lib/prisma.js";

export const keHoachRepository = {
  findSchoolYearForWeekGeneration(namHocId: number) {
    return prisma.namHoc.findUnique({
      where: { namHocId },
      select: {
        namHocId: true,
        maNamHoc: true,
        ngayBatDau: true,
        ngayKetThuc: true,
      },
    });
  },

  findSemester(hocKyId: number) {
    return prisma.hocKy.findUnique({
      where: { hocKyId },
    });
  },

  listActiveSemesters() {
    return prisma.hocKy.findMany({
      where: { trangThai: "dang_ap_dung" },
      orderBy: [{ thuTuTrongNam: "asc" }, { hocKyId: "asc" }],
    });
  },

  listTrainingPlans(input: { skip: number; limit: number; keyword?: string }) {
    const where: Prisma.keHoachDaoTaoWhereInput = input.keyword
      ? {
          OR: [
            { maKeHoach: { contains: input.keyword } },
            { tenKeHoach: { contains: input.keyword } },
            { namHoc: { maNamHoc: { contains: input.keyword } } },
            { khoa: { tenKhoa: { contains: input.keyword } } },
          ],
        }
      : {};

    return Promise.all([
      prisma.keHoachDaoTao.findMany({
        where,
        include: {
          namHoc: true,
          khoa: true,
          keHoachHocKy: {
            include: {
              hocKy: true,
              _count: {
                select: { keHoachLopHocPhan: true },
              },
            },
            orderBy: { keHoachHocKyId: "desc" },
          },
          _count: {
            select: {
              keHoachHocKy: true,
              tuanDaoTao: true,
            },
          },
        },
        orderBy: { keHoachId: "desc" },
        skip: input.skip,
        take: input.limit,
      }),
      prisma.keHoachDaoTao.count({ where }),
    ]);
  },

  findTrainingPlan(id: number) {
    return prisma.keHoachDaoTao.findUnique({
      where: { keHoachId: id },
      include: {
        namHoc: true,
        khoa: true,
        keHoachHocKy: {
          include: {
            hocKy: true,
            keHoachLopHocPhan: {
              include: {
                lop: true,
                hocPhan: true,
              },
              orderBy: { keHoachLopHocPhanId: "desc" },
            },
            _count: {
              select: { keHoachLopHocPhan: true },
            },
          },
          orderBy: { keHoachHocKyId: "desc" },
        },
        _count: {
          select: {
            keHoachHocKy: true,
            tuanDaoTao: true,
          },
        },
      },
    });
  },

  createTrainingPlan(input: {
    maKeHoach: string;
    tenKeHoach: string;
    namHocId: number;
    khoaId: number;
    trangThai?: "du_thao" | "da_duyet" | "dang_thuc_hien" | "da_dong";
    ghiChu?: string | null;
    nguoiTaoId?: number;
    tuanDaoTao?: Array<{
      soTuan: number;
      tenTuan?: string | null;
      ngayBatDau: Date;
      ngayKetThuc: Date;
      loaiTuan: "hoc";
      ghiChu?: string | null;
    }>;
    keHoachHocKy?: Array<{
      hocKyId: number;
      tenKeHoachHocKy?: string | null;
      trangThai?: "du_thao" | "dang_thuc_hien" | "da_dong";
      ghiChu?: string | null;
    }>;
  }) {
    return prisma.keHoachDaoTao.create({
      data: {
        maKeHoach: input.maKeHoach,
        tenKeHoach: input.tenKeHoach,
        namHocId: input.namHocId,
        khoaId: input.khoaId,
        trangThai: input.trangThai,
        ghiChu: input.ghiChu,
        nguoiTaoId: input.nguoiTaoId,
        tuanDaoTao: input.tuanDaoTao?.length
          ? {
              create: input.tuanDaoTao,
            }
          : undefined,
        keHoachHocKy: input.keHoachHocKy?.length
          ? {
              create: input.keHoachHocKy,
            }
          : undefined,
      },
      include: {
        namHoc: true,
        khoa: true,
        keHoachHocKy: {
          include: {
            hocKy: true,
            _count: {
              select: { keHoachLopHocPhan: true },
            },
          },
          orderBy: { keHoachHocKyId: "desc" },
        },
        tuanDaoTao: {
          orderBy: { soTuan: "asc" },
        },
        _count: {
          select: {
            keHoachHocKy: true,
            tuanDaoTao: true,
          },
        },
      },
    });
  },

  updateTrainingPlan(
    id: number,
    input: {
      maKeHoach?: string;
      tenKeHoach?: string;
      namHocId?: number;
      khoaId?: number;
      trangThai?: "du_thao" | "da_duyet" | "dang_thuc_hien" | "da_dong";
      ghiChu?: string | null;
    },
  ) {
    return prisma.keHoachDaoTao.update({
      where: { keHoachId: id },
      data: input,
      include: {
        namHoc: true,
        khoa: true,
        keHoachHocKy: true,
        tuanDaoTao: {
          orderBy: { soTuan: "asc" },
        },
        _count: {
          select: {
            keHoachHocKy: true,
            tuanDaoTao: true,
          },
        },
      },
    });
  },

  changeTrainingPlanStatus(
    id: number,
    status: "du_thao" | "da_duyet" | "dang_thuc_hien" | "da_dong",
  ) {
    return prisma.keHoachDaoTao.update({
      where: { keHoachId: id },
      data: { trangThai: status },
      include: {
        namHoc: true,
        khoa: true,
        keHoachHocKy: {
          include: {
            hocKy: true,
            _count: {
              select: { keHoachLopHocPhan: true },
            },
          },
          orderBy: { keHoachHocKyId: "desc" },
        },
        _count: {
          select: {
            keHoachHocKy: true,
            tuanDaoTao: true,
          },
        },
      },
    });
  },

  countSemesterPlansForTrainingPlan(id: number) {
    return Promise.all([
      prisma.keHoachHocKy.count({ where: { keHoachId: id } }),
      prisma.keHoachHocKy.count({
        where: {
          keHoachId: id,
          trangThai: { not: "du_thao" },
        },
      }),
      prisma.keHoachHocKy.count({
        where: {
          keHoachId: id,
          trangThai: { not: "da_dong" },
        },
      }),
    ]);
  },

  countTrainingPlanChildren(id: number) {
    return Promise.all([
      prisma.keHoachHocKy.count({ where: { keHoachId: id } }),
      prisma.tuanDaoTao.count({ where: { keHoachId: id } }),
    ]);
  },

  countWeeklyScheduleUsingTrainingPlanWeeks(keHoachId: number) {
    return prisma.lichDayTheoTuan.count({
      where: {
        tuanDaoTao: {
          keHoachId,
        },
      },
    });
  },

  async replaceTrainingPlanWeeks(
    keHoachId: number,
    weeks: Array<{
      soTuan: number;
      tenTuan?: string | null;
      ngayBatDau: Date;
      ngayKetThuc: Date;
      loaiTuan: "hoc";
      ghiChu?: string | null;
    }>,
  ) {
    return prisma.$transaction(async (tx) => {
      await tx.tuanDaoTao.deleteMany({
        where: { keHoachId },
      });

      if (weeks.length > 0) {
        await tx.tuanDaoTao.createMany({
          data: weeks.map((week) => ({
            keHoachId,
            soTuan: week.soTuan,
            tenTuan: week.tenTuan,
            ngayBatDau: week.ngayBatDau,
            ngayKetThuc: week.ngayKetThuc,
            loaiTuan: week.loaiTuan,
            ghiChu: week.ghiChu,
          })),
        });
      }

      return tx.keHoachDaoTao.findUnique({
        where: { keHoachId },
        include: {
          namHoc: true,
          khoa: true,
          keHoachHocKy: true,
          tuanDaoTao: {
            orderBy: { soTuan: "asc" },
          },
          _count: {
            select: {
              keHoachHocKy: true,
              tuanDaoTao: true,
            },
          },
        },
      });
    });
  },

  deleteTrainingPlan(id: number) {
    return prisma.keHoachDaoTao.delete({
      where: { keHoachId: id },
      include: {
        namHoc: true,
        khoa: true,
      },
    });
  },

  listSemesterPlans(input: {
    skip: number;
    limit: number;
    keyword?: string;
    keHoachId?: number;
  }) {
    const where: Prisma.keHoachHocKyWhereInput = {
      ...(input.keHoachId ? { keHoachId: input.keHoachId } : {}),
      ...(input.keyword
        ? {
            OR: [
              { tenKeHoachHocKy: { contains: input.keyword } },
              { hocKy: { tenHocKy: { contains: input.keyword } } },
              { keHoachDaoTao: { tenKeHoach: { contains: input.keyword } } },
            ],
          }
        : {}),
    };

    return Promise.all([
      prisma.keHoachHocKy.findMany({
        where,
        include: {
          keHoachDaoTao: { include: { namHoc: true, khoa: true } },
          hocKy: true,
          _count: {
            select: { keHoachLopHocPhan: true },
          },
        },
        orderBy: { keHoachHocKyId: "desc" },
        skip: input.skip,
        take: input.limit,
      }),
      prisma.keHoachHocKy.count({ where }),
    ]);
  },

  findClassesForSuggestion(lopIds: number[]) {
    return prisma.lop.findMany({
      where: {
        lopId: { in: lopIds },
      },
      include: {
        khoaHoc: true,
      },
    });
  },

  async findSuggestedSubjects(input: {
    classSemesters: Array<{ lopId: number; hocKyDuKien: number }>;
  }) {
    const results: Array<{
      lopId: number;
      lop: unknown;
      chuongTrinhHocPhanId: number;
      hocKyDuKien: number;
      tienDoDuKien: string | null;
      trangThai: string | null;
      chuongTrinhHocPhan: {
        chuongTrinhHocPhanId: number;
        chuongTrinhId: number;
        hocPhanId: number;
        hocKyDuKien: number;
        hocPhan: unknown;
        chuongTrinhDaoTao: unknown;
      };
    }> = [];

    for (const item of input.classSemesters) {
      const activeCurriculum = await prisma.lopChuongTrinh.findFirst({
        where: {
          lopId: item.lopId,
          trangThai: "dang_ap_dung",
        },
        include: {
          lop: { include: { khoaHoc: true } },
        },
        orderBy: { lopChuongTrinhId: "desc" },
      });

      if (!activeCurriculum) continue;

      const openedSubjects = await prisma.keHoachLopHocPhan.findMany({
        where: {
          lopId: item.lopId,
          trangThai: { not: "da_huy" },
        },
        select: { hocPhanId: true },
      });
      const openedSubjectIds = openedSubjects.map((subject) => subject.hocPhanId);

      const curriculumCourses = await prisma.chuongTrinhHocPhan.findMany({
        where: {
          chuongTrinhId: activeCurriculum.chuongTrinhId,
          hocKyDuKien: item.hocKyDuKien,
          ...(openedSubjectIds.length
            ? { hocPhanId: { notIn: openedSubjectIds } }
            : {}),
        },
        include: {
          hocPhan: {
            include: {
              boMon: true,
            },
          },
          chuongTrinhDaoTao: true,
        },
        orderBy: [{ thuTu: "asc" }, { chuongTrinhHocPhanId: "asc" }],
      });

      for (const course of curriculumCourses) {
        results.push({
          lopId: item.lopId,
          lop: activeCurriculum.lop,
          chuongTrinhHocPhanId: course.chuongTrinhHocPhanId,
          hocKyDuKien: course.hocKyDuKien,
          tienDoDuKien: "ca_ky",
          trangThai: "chua_hoc",
          chuongTrinhHocPhan: course,
        });
      }
    }

    return results;
  },

  findKeHoachHocKy(id: number) {
    return prisma.keHoachHocKy.findUnique({
      where: { keHoachHocKyId: id },
      include: {
        keHoachDaoTao: { include: { namHoc: true, khoa: true } },
        hocKy: true,
        _count: {
          select: { keHoachLopHocPhan: true },
        },
      },
    });
  },

  createSemesterPlan(input: {
    keHoachId: number;
    hocKyId: number;
    tenKeHoachHocKy?: string;
    trangThai?: "du_thao" | "dang_thuc_hien" | "da_dong";
    ghiChu?: string | null;
  }) {
    return prisma.keHoachHocKy.create({
      data: input,
      include: {
        keHoachDaoTao: { include: { namHoc: true, khoa: true } },
        hocKy: true,
        _count: {
          select: { keHoachLopHocPhan: true },
        },
      },
    });
  },

  updateSemesterPlan(
    id: number,
    input: {
      keHoachId?: number;
      hocKyId?: number;
      tenKeHoachHocKy?: string;
      trangThai?: "du_thao" | "dang_thuc_hien" | "da_dong";
      ghiChu?: string | null;
    },
  ) {
    return prisma.keHoachHocKy.update({
      where: { keHoachHocKyId: id },
      data: input,
      include: {
        keHoachDaoTao: { include: { namHoc: true, khoa: true } },
        hocKy: true,
        _count: {
          select: { keHoachLopHocPhan: true },
        },
      },
    });
  },

  changeSemesterPlanStatus(
    id: number,
    status: "du_thao" | "dang_thuc_hien" | "da_dong",
  ) {
    return prisma.keHoachHocKy.update({
      where: { keHoachHocKyId: id },
      data: { trangThai: status },
      include: {
        keHoachDaoTao: { include: { namHoc: true, khoa: true } },
        hocKy: true,
        _count: {
          select: { keHoachLopHocPhan: true },
        },
      },
    });
  },

  approveSemesterPlan(id: number) {
    return prisma.$transaction(async (tx) => {
      await tx.keHoachLopHocPhan.updateMany({
        where: {
          keHoachHocKyId: id,
          trangThai: "du_thao",
        },
        data: { trangThai: "da_len_ke_hoach" },
      });

      await tx.phanCongGiangDay.updateMany({
        where: {
          trangThai: "du_thao",
          nhomHocPhan: {
            keHoachLopHocPhan: {
              keHoachHocKyId: id,
            },
          },
        },
        data: { trangThai: "da_phan_cong" },
      });

      return tx.keHoachHocKy.update({
        where: { keHoachHocKyId: id },
        data: { trangThai: "dang_thuc_hien" },
        include: {
          keHoachDaoTao: { include: { namHoc: true, khoa: true } },
          hocKy: true,
          _count: {
            select: { keHoachLopHocPhan: true },
          },
        },
      });
    });
  },

  async findSemesterPlanApprovalSummary(keHoachHocKyId: number) {
    const [
      openedSubjectCount,
      openedSubjectWithoutGroupCount,
      groupCount,
      groupWithoutAssignmentCount,
      assignmentCount,
      assignmentWithoutWeeklyScheduleCount,
    ] = await Promise.all([
      prisma.keHoachLopHocPhan.count({ where: { keHoachHocKyId } }),
      prisma.keHoachLopHocPhan.count({
        where: {
          keHoachHocKyId,
          nhomHocPhan: { none: {} },
        },
      }),
      prisma.nhomHocPhan.count({
        where: {
          keHoachLopHocPhan: { keHoachHocKyId },
        },
      }),
      prisma.nhomHocPhan.count({
        where: {
          keHoachLopHocPhan: { keHoachHocKyId },
          phanCongGiangDay: { none: {} },
        },
      }),
      prisma.phanCongGiangDay.count({
        where: {
          nhomHocPhan: {
            keHoachLopHocPhan: { keHoachHocKyId },
          },
        },
      }),
      prisma.phanCongGiangDay.count({
        where: {
          nhomHocPhan: {
            keHoachLopHocPhan: { keHoachHocKyId },
          },
          lichDayTheoTuan: { none: {} },
        },
      }),
    ]);

    return {
      openedSubjectCount,
      openedSubjectWithoutGroupCount,
      groupCount,
      groupWithoutAssignmentCount,
      assignmentCount,
      assignmentWithoutWeeklyScheduleCount,
    };
  },

  listOpenedSubjects(keHoachHocKyId: number) {
    return prisma.keHoachLopHocPhan.findMany({
      where: { keHoachHocKyId },
      include: {
        lop: true,
        hocPhan: true,
        chuongTrinhHocPhan: true,
        nhomHocPhan: true,
      },
      orderBy: [{ lop: { maLop: "asc" } }, { hocPhan: { maHocPhan: "asc" } }],
    });
  },

  listGroups(input: {
    skip: number;
    limit: number;
    keyword?: string;
    keHoachHocKyId?: number;
    lopId?: number;
    hocPhanId?: number;
    loaiNhom?: nhomHocPhanLoaiNhom;
  }) {
    const where: Prisma.nhomHocPhanWhereInput = {
      ...(input.loaiNhom ? { loaiNhom: input.loaiNhom } : {}),
      ...(input.keyword
        ? {
            OR: [
              { maNhom: { contains: input.keyword } },
              { tenNhom: { contains: input.keyword } },
              {
                keHoachLopHocPhan: {
                  hocPhan: { tenHocPhan: { contains: input.keyword } },
                },
              },
              {
                keHoachLopHocPhan: {
                  lop: { maLop: { contains: input.keyword } },
                },
              },
            ],
          }
        : {}),
      keHoachLopHocPhan: {
        ...(input.keHoachHocKyId
          ? { keHoachHocKyId: input.keHoachHocKyId }
          : {}),
        ...(input.lopId ? { lopId: input.lopId } : {}),
        ...(input.hocPhanId ? { hocPhanId: input.hocPhanId } : {}),
      },
    };

    return Promise.all([
      prisma.nhomHocPhan.findMany({
        where,
        include: {
          keHoachLopHocPhan: {
            include: {
              lop: true,
              hocPhan: true,
              keHoachHocKy: {
                include: { hocKy: true, keHoachDaoTao: true },
              },
            },
          },
          _count: {
            select: { phanCongGiangDay: true },
          },
        },
        orderBy: [
          { keHoachLopHocPhan: { lop: { maLop: "asc" } } },
          { keHoachLopHocPhan: { hocPhan: { maHocPhan: "asc" } } },
          { maNhom: "asc" },
        ],
        skip: input.skip,
        take: input.limit,
      }),
      prisma.nhomHocPhan.count({ where }),
    ]);
  },

  listGroupsByClassSubjectPlan(keHoachLopHocPhanId: number) {
    return prisma.nhomHocPhan.findMany({
      where: { keHoachLopHocPhanId },
      include: {
        keHoachLopHocPhan: {
          include: {
            lop: true,
            hocPhan: true,
          },
        },
        _count: {
          select: { phanCongGiangDay: true },
        },
      },
      orderBy: { maNhom: "asc" },
    });
  },

  async findProgressForOpenSubjects(
    items: Array<{
      lopId: number;
      hocPhanId: number;
      chuongTrinhHocPhanId?: number;
    }>,
  ) {
    const results: Array<{
      lopId: number;
      lop: { siSo?: number | null };
      chuongTrinhHocPhanId: number;
      hocKyDuKien: number;
      tienDoDuKien: string | null;
      chuongTrinhHocPhan: {
        chuongTrinhHocPhanId: number;
        hocPhanId: number;
        hocKyDuKien: number;
        hocPhan: {
          soTietThucHanh?: Prisma.Decimal | number | null;
        };
        chuongTrinhDaoTao: unknown;
      };
    }> = [];

    for (const item of items) {
      const activeCurriculum = await prisma.lopChuongTrinh.findFirst({
        where: {
          lopId: item.lopId,
          trangThai: "dang_ap_dung",
        },
        include: {
          lop: true,
        },
        orderBy: { lopChuongTrinhId: "desc" },
      });

      if (!activeCurriculum) continue;

      const curriculumCourse = await prisma.chuongTrinhHocPhan.findFirst({
        where: {
          chuongTrinhId: activeCurriculum.chuongTrinhId,
          hocPhanId: item.hocPhanId,
          ...(item.chuongTrinhHocPhanId
            ? { chuongTrinhHocPhanId: item.chuongTrinhHocPhanId }
            : {}),
        },
        include: {
          hocPhan: true,
          chuongTrinhDaoTao: true,
        },
      });

      if (!curriculumCourse) continue;

      const alreadyOpened = await prisma.keHoachLopHocPhan.findFirst({
        where: {
          lopId: item.lopId,
          hocPhanId: item.hocPhanId,
          trangThai: { not: "da_huy" },
        },
      });

      if (alreadyOpened) continue;

      results.push({
        lopId: item.lopId,
        lop: activeCurriculum.lop,
        chuongTrinhHocPhanId: curriculumCourse.chuongTrinhHocPhanId,
        hocKyDuKien: curriculumCourse.hocKyDuKien,
        tienDoDuKien: "ca_ky",
        chuongTrinhHocPhan: curriculumCourse,
      });
    }

    return results;
  },

  async createClassSubjectPlans(input: {
    keHoachHocKyId: number;
    items: Array<{
      lopId: number;
      hocPhanId: number;
      chuongTrinhHocPhanId?: number;
      siSo: number;
      coThucHanh: boolean;
      coChiaNhomThucHanh: boolean;
      soNhomThucHanh: number;
      nguonTao: keHoachLopHocPhanNguonTao;
      lyDoThem?: string;
    }>;
  }) {
    return prisma.$transaction(async (tx) => {
      const created = [];

      for (const item of input.items) {
        const plan = await tx.keHoachLopHocPhan.upsert({
          where: {
            keHoachHocKyId_lopId_hocPhanId: {
              keHoachHocKyId: input.keHoachHocKyId,
              lopId: item.lopId,
              hocPhanId: item.hocPhanId,
            },
          },
          update: {
            chuongTrinhHocPhanId: item.chuongTrinhHocPhanId,
            siSo: item.siSo,
            coThucHanh: item.coThucHanh,
            coChiaNhomThucHanh: item.coChiaNhomThucHanh,
            soNhomThucHanh: item.soNhomThucHanh,
            nguonTao: item.nguonTao,
            lyDoThem: item.lyDoThem,
            trangThai: "da_len_ke_hoach",
          },
          create: {
            keHoachHocKyId: input.keHoachHocKyId,
            lopId: item.lopId,
            hocPhanId: item.hocPhanId,
            chuongTrinhHocPhanId: item.chuongTrinhHocPhanId,
            siSo: item.siSo,
            coThucHanh: item.coThucHanh,
            coChiaNhomThucHanh: item.coChiaNhomThucHanh,
            soNhomThucHanh: item.soNhomThucHanh,
            nguonTao: item.nguonTao,
            lyDoThem: item.lyDoThem,
            trangThai: "da_len_ke_hoach",
          },
        });

        created.push(plan);
      }

      return created;
    });
  },

  findClassSubjectPlan(id: number) {
    return prisma.keHoachLopHocPhan.findUnique({
      where: { keHoachLopHocPhanId: id },
      include: {
        lop: true,
        hocPhan: true,
        nhomHocPhan: true,
        keHoachHocKy: {
          include: {
            hocKy: true,
            keHoachDaoTao: true,
          },
        },
      },
    });
  },

  createGroup(input: {
    keHoachLopHocPhanId: number;
    maNhom: string;
    tenNhom: string;
    loaiNhom: nhomHocPhanLoaiNhom;
    siSo: number;
    soTiet: number;
    ghiChu?: string | null;
  }) {
    return prisma.nhomHocPhan.create({
      data: input,
      include: {
        keHoachLopHocPhan: {
          include: {
            lop: true,
            hocPhan: true,
          },
        },
        _count: {
          select: { phanCongGiangDay: true },
        },
      },
    });
  },

  updateGroup(
    id: number,
    input: {
      maNhom?: string;
      tenNhom?: string;
      siSo?: number;
      soTiet?: number;
      ghiChu?: string | null;
    },
  ) {
    return prisma.nhomHocPhan.update({
      where: { nhomHocPhanId: id },
      data: input,
      include: {
        keHoachLopHocPhan: {
          include: {
            lop: true,
            hocPhan: true,
          },
        },
        _count: {
          select: { phanCongGiangDay: true },
        },
      },
    });
  },

  findGroupBlockers(id: number) {
    return Promise.all([
      prisma.phanCongGiangDay.count({ where: { nhomHocPhanId: id } }),
      prisma.lichDayTheoTuan.count({
        where: {
          phanCongGiangDay: {
            nhomHocPhanId: id,
          },
        },
      }),
    ]);
  },

  deleteGroup(id: number) {
    return prisma.nhomHocPhan.delete({
      where: { nhomHocPhanId: id },
      include: {
        keHoachLopHocPhan: {
          include: {
            lop: true,
            hocPhan: true,
          },
        },
      },
    });
  },

  async createGroupsForPlan(input: {
    keHoachLopHocPhanId: number;
    taoNhomLyThuyet?: boolean;
    coChiaNhomThucHanh: boolean;
    soNhomThucHanh: number;
  }) {
    return prisma.$transaction(async (tx) => {
      const plan = await tx.keHoachLopHocPhan.findUnique({
        where: { keHoachLopHocPhanId: input.keHoachLopHocPhanId },
        include: { hocPhan: true, lop: true },
      });

      if (!plan) return null;

      const planSiSo = plan.siSo || plan.lop.siSo || 0;

      const groups: Array<{
        maNhom: string;
        tenNhom: string;
        loaiNhom: nhomHocPhanLoaiNhom;
        siSo: number;
        soTiet: number;
      }> = [];

      if (plan.hocPhan.soTietLyThuyet > 0 && input.taoNhomLyThuyet !== false) {
        groups.push({
          maNhom: "LT",
          tenNhom: "Ly thuyet",
          loaiNhom: "ly_thuyet",
          siSo: planSiSo,
          soTiet: plan.hocPhan.soTietLyThuyet,
        });
      }

      if (plan.hocPhan.soTietThucHanh > 0) {
        const groupCount = input.coChiaNhomThucHanh
          ? Math.max(input.soNhomThucHanh, 1)
          : 1;

        const baseGroupSize =
          groupCount > 0 ? Math.floor(planSiSo / groupCount) : planSiSo;
        const remainder = groupCount > 0 ? planSiSo % groupCount : 0;

        for (let index = 1; index <= groupCount; index += 1) {
          const groupSize = baseGroupSize + (index <= remainder ? 1 : 0);

          groups.push({
            maNhom: groupCount === 1 ? "TH" : `TH${index}`,
            tenNhom: groupCount === 1 ? "Thuc hanh" : `Thuc hanh ${index}`,
            loaiNhom: "thuc_hanh",
            siSo: groupSize,
            soTiet: plan.hocPhan.soTietThucHanh,
          });
        }
      }

      if (groups.length === 0) {
        groups.push({
          maNhom: "CHUNG",
          tenNhom: "Nhom chung",
          loaiNhom:
            plan.hocPhan.loaiHocPhan === "do_an_du_an"
              ? "do_an"
              : plan.hocPhan.loaiHocPhan === "do_an_khoa_luan_tot_nghiep"
                ? "tot_nghiep"
                : plan.hocPhan.loaiHocPhan === "thuc_tap"
                  ? "thuc_tap"
                  : "ly_thuyet",
          siSo: planSiSo,
          soTiet: plan.hocPhan.tongSoTiet,
        });
      }

      const created = [];

      for (const group of groups) {
        created.push(
          await tx.nhomHocPhan.create({
            data: {
              keHoachLopHocPhanId: input.keHoachLopHocPhanId,
              ...group,
            },
            include: {
              keHoachLopHocPhan: {
                include: {
                  lop: true,
                  hocPhan: true,
                },
              },
              _count: {
                select: { phanCongGiangDay: true },
              },
            },
          }),
        );
      }

      await tx.keHoachLopHocPhan.update({
        where: { keHoachLopHocPhanId: input.keHoachLopHocPhanId },
        data: {
          coChiaNhomThucHanh: input.coChiaNhomThucHanh,
          soNhomThucHanh: input.coChiaNhomThucHanh ? input.soNhomThucHanh : 0,
        },
      });

      return created;
    });
  },

  findGroup(id: number) {
    return prisma.nhomHocPhan.findUnique({
      where: { nhomHocPhanId: id },
      include: {
        keHoachLopHocPhan: {
          include: {
            lop: true,
            hocPhan: true,
            keHoachHocKy: {
              include: {
                hocKy: true,
                keHoachDaoTao: true,
              },
            },
          },
        },
        _count: {
          select: { phanCongGiangDay: true },
        },
      },
    });
  },

  findTeacherCanTeach(giangVienId: number, hocPhanId: number) {
    return prisma.giangVienHocPhan.findUnique({
      where: {
        giangVienId_hocPhanId: {
          giangVienId,
          hocPhanId,
        },
      },
    });
  },

  listTeachersCanTeachCourse(hocPhanId: number) {
    return prisma.giangVienHocPhan.findMany({
      where: { hocPhanId },
      include: {
        giangVien: {
          include: {
            boMon: true,
          },
        },
      },
      orderBy: [
        {
          giangVien: {
            hoTen: "asc",
          },
        },
        { giangVienId: "asc" },
      ],
    });
  },

  createAssignment(input: {
    nhomHocPhanId: number;
    giangVienId: number;
    vaiTro: phanCongGiangDayVaiTro;
    soTietPhanCong: number;
    heSoLop: number;
    soTietQuyDoi: number;
    trangThai?: phanCongGiangDayTrangThai;
    ghiChu?: string;
  }) {
    return prisma.phanCongGiangDay.create({
      data: {
        nhomHocPhanId: input.nhomHocPhanId,
        giangVienId: input.giangVienId,
        vaiTro: input.vaiTro,
        soTietPhanCong: input.soTietPhanCong,
        heSoLop: input.heSoLop,
        soTietQuyDoi: input.soTietQuyDoi,
        trangThai: input.trangThai ?? "da_phan_cong",
        ghiChu: input.ghiChu,
      },
      include: {
        giangVien: {
          include: {
            boMon: true,
            phanCongGiangDay: {
              where: { trangThai: { not: "da_huy" } },
              select: { soTietQuyDoi: true },
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
                    keHoachDaoTao: true,
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
      },
    });
  },

  listAssignments(input: {
    skip: number;
    limit: number;
    keyword?: string;
    keHoachHocKyId?: number;
    lopId?: number;
    hocPhanId?: number;
    giangVienId?: number;
    nhomHocPhanId?: number;
    vaiTro?: phanCongGiangDayVaiTro;
    trangThai?: phanCongGiangDayTrangThai;
  }) {
    const where: Prisma.phanCongGiangDayWhereInput = {
      ...(input.giangVienId ? { giangVienId: input.giangVienId } : {}),
      ...(input.nhomHocPhanId ? { nhomHocPhanId: input.nhomHocPhanId } : {}),
      ...(input.vaiTro ? { vaiTro: input.vaiTro } : {}),
      ...(input.trangThai ? { trangThai: input.trangThai } : {}),
      ...(input.keyword
        ? {
            OR: [
              { giangVien: { hoTen: { contains: input.keyword } } },
              { giangVien: { maGiangVien: { contains: input.keyword } } },
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
                    hocPhan: { tenHocPhan: { contains: input.keyword } },
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
            ],
          }
        : {}),
      nhomHocPhan: {
        keHoachLopHocPhan: {
          ...(input.keHoachHocKyId
            ? { keHoachHocKyId: input.keHoachHocKyId }
            : {}),
          ...(input.lopId ? { lopId: input.lopId } : {}),
          ...(input.hocPhanId ? { hocPhanId: input.hocPhanId } : {}),
        },
      },
    };

    return Promise.all([
      prisma.phanCongGiangDay.findMany({
        where,
        include: {
          giangVien: {
            include: {
              boMon: true,
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
                      keHoachDaoTao: true,
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
        },
        orderBy: [
          {
            nhomHocPhan: {
              keHoachLopHocPhan: {
                lop: { maLop: "asc" },
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
  findAssignmentWeeklyScheduleDetail(id: number) {
    return prisma.phanCongGiangDay.findUnique({
      where: { phanCongId: id },
      include: {
        giangVien: {
          include: {
            boMon: true,
            phanCongGiangDay: {
              where: { trangThai: { not: "da_huy" } },
              select: { soTietQuyDoi: true },
            },
          },
        },
        lichDayTheoTuan: {
          include: {
            tuanDaoTao: true,
            phongHoc: true,
          },
          orderBy: {
            tuanDaoTao: {
              soTuan: "asc",
            },
          },
        },
        nhomHocPhan: {
          include: {
            keHoachLopHocPhan: {
              include: {
                lop: true,
                hocPhan: true,
                chuongTrinhHocPhan: true,
                keHoachHocKy: {
                  include: {
                    hocKy: true,
                    keHoachDaoTao: {
                      include: {
                        namHoc: true,
                        tuanDaoTao: {
                          where: {
                            loaiTuan: "hoc",
                          },
                          orderBy: {
                            soTuan: "asc",
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
        _count: {
          select: {
            lichDayTheoTuan: true,
          },
        },
      },
    });
  },
  findAssignment(id: number) {
    return prisma.phanCongGiangDay.findUnique({
      where: { phanCongId: id },
      include: {
        giangVien: {
          include: {
            boMon: true,
            phanCongGiangDay: {
              where: { trangThai: { not: "da_huy" } },
              select: { soTietQuyDoi: true },
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
                    keHoachDaoTao: true,
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
      },
    });
  },

  updateAssignment(
    id: number,
    input: {
      giangVienId?: number;
      vaiTro?: phanCongGiangDayVaiTro;
      soTietPhanCong?: number;
      heSoLop?: number;
      soTietQuyDoi?: number;
      trangThai?: phanCongGiangDayTrangThai;
      ghiChu?: string;
    },
  ) {
    return prisma.phanCongGiangDay.update({
      where: { phanCongId: id },
      data: input,
      include: {
        giangVien: {
          include: {
            boMon: true,
            phanCongGiangDay: {
              where: { trangThai: { not: "da_huy" } },
              select: { soTietQuyDoi: true },
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
                    keHoachDaoTao: true,
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
      },
    });
  },

  deleteAssignment(id: number) {
    return prisma.phanCongGiangDay.delete({
      where: { phanCongId: id },
      include: {
        giangVien: {
          include: {
            boMon: true,
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
                    keHoachDaoTao: true,
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
      },
    });
  },

  async upsertWeeklySchedules(input: {
    phanCongId: number;
    lich: Array<{
      tuanId: number;
      phongHocId?: number;
      soTiet: number;
      noiDungGiangDay?: string;
      ghiChu?: string;
    }>;
  }) {
    return prisma.$transaction(async (tx) => {
      await tx.lichDayTheoTuan.deleteMany({
        where: {
          phanCongId: input.phanCongId,
        },
      });

      if (input.lich.length > 0) {
        await tx.lichDayTheoTuan.createMany({
          data: input.lich.map((item) => ({
            phanCongId: input.phanCongId,
            tuanId: item.tuanId,
            phongHocId: item.phongHocId,
            soTiet: item.soTiet,
            noiDungGiangDay: item.noiDungGiangDay,
            ghiChu: item.ghiChu,
          })),
        });
      }

      return tx.lichDayTheoTuan.findMany({
        where: { phanCongId: input.phanCongId },
        include: {
          tuanDaoTao: true,
          phongHoc: true,
        },
        orderBy: {
          tuanDaoTao: {
            soTuan: "asc",
          },
        },
      });
    }, { timeout: 15000 });
  },

  findSemesterReportData(keHoachHocKyId: number) {
    return prisma.keHoachHocKy.findUnique({
      where: { keHoachHocKyId },
      include: {
        hocKy: true,
        keHoachDaoTao: {
          include: {
            namHoc: true,
            khoa: true,
            tuanDaoTao: {
              orderBy: { soTuan: "asc" },
            },
          },
        },
        keHoachLopHocPhan: {
          include: {
            lop: true,
            hocPhan: true,
            chuongTrinhHocPhan: {
              include: {
                tienDoHocPhanLop: true,
              },
            },
            nhomHocPhan: {
              include: {
                phanCongGiangDay: {
                  include: {
                    giangVien: true,
                    lichDayTheoTuan: {
                      include: {
                        tuanDaoTao: true,
                        phongHoc: true,
                      },
                      orderBy: {
                        tuanDaoTao: {
                          soTuan: "asc",
                        },
                      },
                    },
                  },
                  orderBy: [
                    { giangVien: { hoTen: "asc" } },
                    { phanCongId: "asc" },
                  ],
                },
              },
              orderBy: [{ loaiNhom: "asc" }, { maNhom: "asc" }],
            },
          },
          orderBy: [
            { lop: { maLop: "asc" } },
            { hocPhan: { maHocPhan: "asc" } },
          ],
        },
      },
    });
  },

  findReportByClass(query: { keHoachHocKyId: number; lopId: number }) {
    return prisma.keHoachLopHocPhan.findMany({
      where: {
        keHoachHocKyId: query.keHoachHocKyId,
        lopId: query.lopId,
      },
      include: {
        lop: true,
        hocPhan: true,
        nhomHocPhan: {
          include: {
            phanCongGiangDay: {
              include: {
                giangVien: true,
                lichDayTheoTuan: {
                  include: { tuanDaoTao: true, phongHoc: true },
                  orderBy: { tuanDaoTao: { soTuan: "asc" } },
                },
              },
            },
          },
        },
      },
    });
  },

  findReportByTeacher(query: { keHoachHocKyId: number; giangVienId: number }) {
    return prisma.phanCongGiangDay.findMany({
      where: {
        giangVienId: query.giangVienId,
        nhomHocPhan: {
          keHoachLopHocPhan: {
            keHoachHocKyId: query.keHoachHocKyId,
          },
        },
      },
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
        lichDayTheoTuan: {
          include: { tuanDaoTao: true, phongHoc: true },
          orderBy: { tuanDaoTao: { soTuan: "asc" } },
        },
      },
    });
  },
};
