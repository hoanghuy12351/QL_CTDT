import type {
  Prisma,
  keHoachLopHocPhanNguonTao,
  keHoachLopHocPhanTienDo,
  nhomHocPhanLoaiNhom,
  phanCongGiangDayVaiTro,
} from "@prisma/client";
import { prisma } from "../../lib/prisma.js";

export const keHoachRepository = {
  listTrainingPlans(input: {
    skip: number;
    limit: number;
    keyword?: string;
  }) {
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
  }) {
    return prisma.keHoachDaoTao.create({
      data: input,
      include: {
        namHoc: true,
        khoa: true,
        keHoachHocKy: true,
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
        _count: {
          select: {
            keHoachHocKy: true,
            tuanDaoTao: true,
          },
        },
      },
    });
  },

  countTrainingPlanChildren(id: number) {
    return Promise.all([
      prisma.keHoachHocKy.count({ where: { keHoachId: id } }),
      prisma.tuanDaoTao.count({ where: { keHoachId: id } }),
    ]);
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

  findSuggestedSubjects(input: {
    lopIds: number[];
    hocKyDuKien?: number;
  }) {
    return prisma.tienDoHocPhanLop.findMany({
      where: {
        lopId: { in: input.lopIds },
        trangThai: { in: ["chua_hoc", "tam_hoan"] },
        ...(input.hocKyDuKien ? { hocKyDuKien: input.hocKyDuKien } : {}),
      },
      include: {
        lop: true,
        chuongTrinhHocPhan: {
          include: {
            hocPhan: true,
            chuongTrinhDaoTao: true,
          },
        },
      },
      orderBy: [
        { hocKyDuKien: "asc" },
        { chuongTrinhHocPhan: { thuTu: "asc" } },
      ],
    });
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
        ...(input.keHoachHocKyId ? { keHoachHocKyId: input.keHoachHocKyId } : {}),
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

  findProgressForOpenSubjects(items: Array<{ lopId: number; hocPhanId: number }>) {
    if (items.length === 0) return Promise.resolve([]);

    return prisma.tienDoHocPhanLop.findMany({
      where: {
        trangThai: "chua_hoc",
        OR: items.map((item) => ({
          lopId: item.lopId,
          chuongTrinhHocPhan: {
            hocPhanId: item.hocPhanId,
          },
        })),
      },
      include: {
        lop: true,
        chuongTrinhHocPhan: {
          include: {
            hocPhan: true,
          },
        },
      },
    });
  },

  async createClassSubjectPlans(input: {
    keHoachHocKyId: number;
    items: Array<{
      lopId: number;
      hocPhanId: number;
      chuongTrinhHocPhanId?: number;
      tienDo: keHoachLopHocPhanTienDo;
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
            tienDo: item.tienDo,
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
            tienDo: item.tienDo,
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
        const groupSize = Math.ceil(planSiSo / groupCount);

        for (let index = 1; index <= groupCount; index += 1) {
          groups.push({
            maNhom: groupCount === 1 ? "TH" : `TH${index}`,
            tenNhom: groupCount === 1 ? "Thuc hanh" : `Thuc hanh ${index}`,
            loaiNhom: "thuc_hanh",
            siSo: index === groupCount ? planSiSo - groupSize * (groupCount - 1) : groupSize,
            soTiet: plan.hocPhan.soTietThucHanh,
          });
        }
      }

      if (groups.length === 0) {
        groups.push({
          maNhom: "CHUNG",
          tenNhom: "Nhom chung",
          loaiNhom: plan.hocPhan.loaiHocPhan === "do_an" ? "do_an" : "ly_thuyet",
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
            hocPhan: true,
          },
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

  createAssignment(input: {
    nhomHocPhanId: number;
    giangVienId: number;
    vaiTro: phanCongGiangDayVaiTro;
    soTietPhanCong: number;
    heSoLop: number;
    soTietQuyDoi: number;
    ghiChu?: string;
  }) {
    return prisma.phanCongGiangDay.create({
      data: {
        ...input,
        trangThai: "da_phan_cong",
      },
      include: {
        giangVien: true,
        nhomHocPhan: true,
      },
    });
  },

  findAssignment(id: number) {
    return prisma.phanCongGiangDay.findUnique({
      where: { phanCongId: id },
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
      const result = [];

      for (const item of input.lich) {
        result.push(
          await tx.lichDayTheoTuan.upsert({
            where: {
              phanCongId_tuanId: {
                phanCongId: input.phanCongId,
                tuanId: item.tuanId,
              },
            },
            update: {
              phongHocId: item.phongHocId,
              soTiet: item.soTiet,
              noiDungGiangDay: item.noiDungGiangDay,
              ghiChu: item.ghiChu,
            },
            create: {
              phanCongId: input.phanCongId,
              tuanId: item.tuanId,
              phongHocId: item.phongHocId,
              soTiet: item.soTiet,
              noiDungGiangDay: item.noiDungGiangDay,
              ghiChu: item.ghiChu,
            },
          }),
        );
      }

      return result;
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
