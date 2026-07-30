import { Prisma } from "@prisma/client";
import { buildPaginationMeta, getPagination } from "../../common/helpers/pagination.js";
import { HTTP_STATUS } from "../../common/constants/http-status.js";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../common/utils/app-error.js";
import { serializeData } from "../../common/utils/serialize.js";
import { buildCurriculumExport } from "./chuongtrinh.excel.js";
import type {
  AssignClassInput,
  CreateCurriculumCourseInput,
  CreateCurriculumInput,
  CurriculumListQuery,
  UpdateCurriculumCourseInput,
  UpdateCurriculumInput,
  UpdateProgressInput,
} from "./chuongtrinh.validation.js";

const curriculumInclude = {
  nganh: true,
  boMon: true,
  chuyenNganh: true,
  khoaHoc: true,
  _count: {
    select: {
      chuongTrinhHocPhan: true,
      lopChuongTrinh: true,
    },
  },
} satisfies Prisma.chuongTrinhDaoTaoInclude;

const detailInclude = {
  ...curriculumInclude,
  chuongTrinhHocPhan: {
    include: {
      hocPhan: true,
    },
    orderBy: [{ hocKyDuKien: "asc" }, { thuTu: "asc" }, { chuongTrinhHocPhanId: "asc" }],
  },
  lopChuongTrinh: {
    include: {
      lop: true,
    },
    orderBy: [{ lopChuongTrinhId: "desc" }],
  },
} satisfies Prisma.chuongTrinhDaoTaoInclude;

const courseInclude = {
  chuongTrinhDaoTao: true,
  hocPhan: true,
} satisfies Prisma.chuongTrinhHocPhanInclude;

const assignmentInclude = {
  lop: true,
  chuongTrinhDaoTao: true,
} satisfies Prisma.lopChuongTrinhInclude;

const progressInclude = {
  lop: true,
  chuongTrinhHocPhan: {
    include: {
      hocPhan: true,
      chuongTrinhDaoTao: true,
    },
  },
  namHoc: true,
  hocKy: true,
} satisfies Prisma.tienDoHocPhanLopInclude;

const normalizeDate = (value?: string | null) => {
  if (!value) return new Date();
  return new Date(value);
};

const resolveInsertPosition = async (
  tx: Prisma.TransactionClient,
  input: {
    chuongTrinhId: number;
    hocKyDuKien: number;
    requestedPosition?: number | null;
    excludeEntryId?: number;
  },
) => {
  const aggregate = await tx.chuongTrinhHocPhan.aggregate({
    where: {
      chuongTrinhId: input.chuongTrinhId,
      hocKyDuKien: input.hocKyDuKien,
      ...(input.excludeEntryId
        ? { chuongTrinhHocPhanId: { not: input.excludeEntryId } }
        : {}),
    },
    _count: { chuongTrinhHocPhanId: true },
  });

  const lastPosition = aggregate._count.chuongTrinhHocPhanId;
  if (!input.requestedPosition || input.requestedPosition <= 0) {
    return lastPosition + 1;
  }

  return Math.min(input.requestedPosition, lastPosition + 1);
};

const normalizeCurriculumSemesterOrder = async (
  tx: Prisma.TransactionClient,
  input: {
    chuongTrinhId: number;
    hocKyDuKien: number;
    excludeEntryId?: number;
  },
) => {
  const courses = await tx.chuongTrinhHocPhan.findMany({
    where: {
      chuongTrinhId: input.chuongTrinhId,
      hocKyDuKien: input.hocKyDuKien,
      ...(input.excludeEntryId
        ? { chuongTrinhHocPhanId: { not: input.excludeEntryId } }
        : {}),
    },
    orderBy: [{ thuTu: "asc" }, { chuongTrinhHocPhanId: "asc" }],
    select: {
      chuongTrinhHocPhanId: true,
      thuTu: true,
    },
  });

  for (const [index, course] of courses.entries()) {
    const nextOrder = index + 1;
    if (course.thuTu === nextOrder) continue;

    await tx.chuongTrinhHocPhan.update({
      where: { chuongTrinhHocPhanId: course.chuongTrinhHocPhanId },
      data: { thuTu: nextOrder },
    });
  }
};

const normalizeVietnameseText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();

const departmentMajorRules = [
  {
    majorKeywords: ["ky thuat phan mem"],
    departmentKeywords: ["cong nghe phan mem"],
  },
  {
    majorKeywords: ["cong nghe thong tin"],
    departmentKeywords: ["he thong thong tin"],
  },
  {
    majorKeywords: ["khoa hoc may tinh", "tri tue nhan tao"],
    departmentKeywords: ["khoa hoc may tinh"],
  },
];

const inferDepartmentIdForMajor = async (nganhId?: number | null) => {
  if (!nganhId) return null;

  const major = await prisma.nganh.findUnique({
    where: { nganhId },
    select: { tenNganh: true, khoaId: true },
  });

  if (!major) return null;

  const normalizedMajorName = normalizeVietnameseText(major.tenNganh);
  const rule = departmentMajorRules.find((item) =>
    item.majorKeywords.some((keyword) => normalizedMajorName.includes(keyword)),
  );

  if (!rule) return null;

  const departments = await prisma.boMon.findMany({
    where: { khoaId: major.khoaId },
    select: { boMonId: true, tenBoMon: true },
  });

  return (
    departments.find((department) => {
      const normalizedDepartmentName = normalizeVietnameseText(
        department.tenBoMon,
      );

      return rule.departmentKeywords.some((keyword) =>
        normalizedDepartmentName.includes(keyword),
      );
    })?.boMonId ?? null
  );
};

const withInferredDepartment = async <
  T extends { nganhId?: number | null; boMonId?: number | null },
>(
  input: T,
) => {
  if (input.boMonId !== undefined) return input;

  const inferredBoMonId = await inferDepartmentIdForMajor(input.nganhId);
  return inferredBoMonId ? { ...input, boMonId: inferredBoMonId } : input;
};

const mapPrismaError = (error: unknown): never => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      throw new AppError("Du lieu bi trung", HTTP_STATUS.CONFLICT);
    }

    if (error.code === "P2003") {
      throw new AppError("Du lieu dang lien ket voi ban ghi khac", HTTP_STATUS.CONFLICT);
    }
  }

  throw error;
};

const ensureCurriculum = async (id: number) => {
  const curriculum = await prisma.chuongTrinhDaoTao.findUnique({
    where: { chuongTrinhId: id },
  });

  if (!curriculum) {
    throw new AppError("Khong tim thay chuong trinh dao tao", HTTP_STATUS.NOT_FOUND);
  }

  return curriculum;
};

const buildCurriculumWhere = (keyword?: string): Prisma.chuongTrinhDaoTaoWhereInput => {
  const trimmedKeyword = keyword?.trim();
  if (!trimmedKeyword) return {};

  return {
    OR: [
      { maChuongTrinh: { contains: trimmedKeyword } },
      { tenChuongTrinh: { contains: trimmedKeyword } },
      { trinhDoDaoTao: { contains: trimmedKeyword } },
      { hinhThucDaoTao: { contains: trimmedKeyword } },
      { nganh: { tenNganh: { contains: trimmedKeyword } } },
      { boMon: { tenBoMon: { contains: trimmedKeyword } } },
      { chuyenNganh: { tenChuyenNganh: { contains: trimmedKeyword } } },
      { khoaHoc: { tenKhoaHoc: { contains: trimmedKeyword } } },
    ],
  };
};

export const chuongTrinhService = {
  async list(query: CurriculumListQuery) {
    const { page, limit, skip } = getPagination(query);
    const where = buildCurriculumWhere(query.keyword);

    const [items, totalItems] = await Promise.all([
      prisma.chuongTrinhDaoTao.findMany({
        where,
        include: curriculumInclude,
        orderBy: [{ ngayCapNhat: "desc" }, { chuongTrinhId: "desc" }],
        skip,
        take: limit,
      }),
      prisma.chuongTrinhDaoTao.count({ where }),
    ]);

    return serializeData({
      items,
      pagination: buildPaginationMeta(page, limit, totalItems),
    });
  },

  async detail(id: number) {
    const item = await prisma.chuongTrinhDaoTao.findUnique({
      where: { chuongTrinhId: id },
      include: detailInclude,
    });

    if (!item) {
      throw new AppError("Khong tim thay chuong trinh dao tao", HTTP_STATUS.NOT_FOUND);
    }

    return serializeData(item);
  },

  async exportExcel(id: number) {
    const item = await prisma.chuongTrinhDaoTao.findUnique({
      where: { chuongTrinhId: id },
      include: {
        nganh: true,
        chuyenNganh: true,
        khoaHoc: true,
        lopChuongTrinh: {
          where: { trangThai: "dang_ap_dung" },
          include: { lop: true },
          orderBy: [{ lopChuongTrinhId: "asc" }],
        },
        chuongTrinhHocPhan: {
          include: { hocPhan: true },
          orderBy: [
            { hocKyDuKien: "asc" },
            { thuTu: "asc" },
            { chuongTrinhHocPhanId: "asc" },
          ],
        },
      },
    });

    if (!item) {
      throw new AppError("Khong tim thay chuong trinh dao tao", HTTP_STATUS.NOT_FOUND);
    }

    return buildCurriculumExport(item);
  },

  async create(input: CreateCurriculumInput) {
    try {
      const data = await withInferredDepartment(input);
      const item = await prisma.chuongTrinhDaoTao.create({
        data,
        include: curriculumInclude,
      });

      return serializeData(item);
    } catch (error) {
      mapPrismaError(error);
    }
  },

  async update(id: number, input: UpdateCurriculumInput) {
    await ensureCurriculum(id);

    try {
      const data = await withInferredDepartment(input);
      const item = await prisma.chuongTrinhDaoTao.update({
        where: { chuongTrinhId: id },
        data: {
          ...data,
          ngayCapNhat: new Date(),
        },
        include: curriculumInclude,
      });

      return serializeData(item);
    } catch (error) {
      mapPrismaError(error);
    }
  },

  async delete(id: number) {
    await ensureCurriculum(id);

    try {
      const item = await prisma.chuongTrinhDaoTao.delete({
        where: { chuongTrinhId: id },
        include: curriculumInclude,
      });

      return serializeData(item);
    } catch (error) {
      mapPrismaError(error);
    }
  },

  async listCourses(curriculumId: number) {
    await ensureCurriculum(curriculumId);

    const items = await prisma.chuongTrinhHocPhan.findMany({
      where: { chuongTrinhId: curriculumId },
      include: courseInclude,
      orderBy: [{ hocKyDuKien: "asc" }, { thuTu: "asc" }, { chuongTrinhHocPhanId: "asc" }],
    });

    return serializeData(items);
  },

  async addCourse(curriculumId: number, input: CreateCurriculumCourseInput) {
    await ensureCurriculum(curriculumId);

    try {
      const item = await prisma.$transaction(async (tx) => {
        await normalizeCurriculumSemesterOrder(tx, {
          chuongTrinhId: curriculumId,
          hocKyDuKien: input.hocKyDuKien,
        });

        const thuTu = await resolveInsertPosition(tx, {
          chuongTrinhId: curriculumId,
          hocKyDuKien: input.hocKyDuKien,
          requestedPosition: input.thuTu,
        });

        await tx.chuongTrinhHocPhan.updateMany({
          where: {
            chuongTrinhId: curriculumId,
            hocKyDuKien: input.hocKyDuKien,
            thuTu: { gte: thuTu },
          },
          data: {
            thuTu: { increment: 1 },
          },
        });

        return tx.chuongTrinhHocPhan.create({
          data: {
            chuongTrinhId: curriculumId,
            ...input,
            thuTu,
          },
          include: courseInclude,
        });
      });

      return serializeData(item);
    } catch (error) {
      mapPrismaError(error);
    }
  },

  async updateCourse(entryId: number, input: UpdateCurriculumCourseInput) {
    try {
      const item = await prisma.$transaction(async (tx) => {
        const existing = await tx.chuongTrinhHocPhan.findUnique({
          where: { chuongTrinhHocPhanId: entryId },
        });

        if (!existing) {
          throw new AppError("Khong tim thay hoc phan trong CTDT", HTTP_STATUS.NOT_FOUND);
        }

        const targetSemester = input.hocKyDuKien ?? existing.hocKyDuKien;
        const isMovingSemester = targetSemester !== existing.hocKyDuKien;
        const hasRequestedPosition = input.thuTu !== undefined;

        let nextPosition = existing.thuTu ?? 0;

        if (isMovingSemester || hasRequestedPosition) {
          await normalizeCurriculumSemesterOrder(tx, {
            chuongTrinhId: existing.chuongTrinhId,
            hocKyDuKien: existing.hocKyDuKien,
            excludeEntryId: entryId,
          });

          if (isMovingSemester) {
            await normalizeCurriculumSemesterOrder(tx, {
              chuongTrinhId: existing.chuongTrinhId,
              hocKyDuKien: targetSemester,
            });
          }

          nextPosition = await resolveInsertPosition(tx, {
            chuongTrinhId: existing.chuongTrinhId,
            hocKyDuKien: targetSemester,
            requestedPosition: hasRequestedPosition ? input.thuTu : undefined,
            excludeEntryId: isMovingSemester ? undefined : entryId,
          });

          await tx.chuongTrinhHocPhan.updateMany({
            where: {
              chuongTrinhId: existing.chuongTrinhId,
              hocKyDuKien: targetSemester,
              chuongTrinhHocPhanId: { not: entryId },
              thuTu: { gte: nextPosition },
            },
            data: { thuTu: { increment: 1 } },
          });
        }

        return tx.chuongTrinhHocPhan.update({
          where: { chuongTrinhHocPhanId: entryId },
          data: {
            ...input,
            hocKyDuKien: targetSemester,
            thuTu: nextPosition,
          },
          include: courseInclude,
        });
      });

      return serializeData(item);
    } catch (error) {
      mapPrismaError(error);
    }
  },

  async deleteCourse(entryId: number) {
    try {
      const item = await prisma.$transaction(async (tx) => {
        const existing = await tx.chuongTrinhHocPhan.findUnique({
          where: { chuongTrinhHocPhanId: entryId },
        });

        if (!existing) {
          throw new AppError("Khong tim thay hoc phan trong CTDT", HTTP_STATUS.NOT_FOUND);
        }

        const deleted = await tx.chuongTrinhHocPhan.delete({
          where: { chuongTrinhHocPhanId: entryId },
          include: courseInclude,
        });

        await normalizeCurriculumSemesterOrder(tx, {
          chuongTrinhId: existing.chuongTrinhId,
          hocKyDuKien: existing.hocKyDuKien,
        });

        return deleted;
      });

      return serializeData(item);
    } catch (error) {
      mapPrismaError(error);
    }
  },

  async listAssignments(curriculumId: number) {
    await ensureCurriculum(curriculumId);

    const items = await prisma.lopChuongTrinh.findMany({
      where: { chuongTrinhId: curriculumId },
      include: assignmentInclude,
      orderBy: [{ lopChuongTrinhId: "desc" }],
    });

    return serializeData(items);
  },

  async assignClass(curriculumId: number, input: AssignClassInput) {
    await ensureCurriculum(curriculumId);

    const classIds = Array.from(new Set(input.lopIds));
    const existingClasses = await prisma.lop.findMany({
      where: { lopId: { in: classIds } },
      select: { lopId: true },
    });

    if (existingClasses.length !== classIds.length) {
      throw new AppError("Khong tim thay mot hoac nhieu lop", HTTP_STATUS.NOT_FOUND);
    }

    const result = await prisma.$transaction(async (tx) => {
      const courses = await tx.chuongTrinhHocPhan.findMany({
        where: { chuongTrinhId: curriculumId },
        select: {
          chuongTrinhHocPhanId: true,
          hocKyDuKien: true,
        },
      });

      const assignments = [];
      let createdProgress = 0;
      let skippedProgress = 0;

      for (const lopId of classIds) {
        await tx.lopChuongTrinh.updateMany({
          where: {
            lopId,
            chuongTrinhId: { not: curriculumId },
            trangThai: "dang_ap_dung",
          },
          data: {
            trangThai: "ngung_ap_dung",
          },
        });

        const assignment = await tx.lopChuongTrinh.upsert({
          where: {
            lopId_chuongTrinhId: {
              lopId,
              chuongTrinhId: curriculumId,
            },
          },
          update: {
            ngayApDung: normalizeDate(input.ngayApDung),
            trangThai: "dang_ap_dung",
            ghiChu: input.ghiChu,
          },
          create: {
            lopId,
            chuongTrinhId: curriculumId,
            ngayApDung: normalizeDate(input.ngayApDung),
            trangThai: "dang_ap_dung",
            ghiChu: input.ghiChu,
          },
          include: assignmentInclude,
        });
        assignments.push(assignment);

        const existingProgress = await tx.tienDoHocPhanLop.findMany({
          where: {
            lopId,
            chuongTrinhHocPhan: {
              chuongTrinhId: curriculumId,
            },
          },
          select: { chuongTrinhHocPhanId: true },
        });

        const existingProgressSet = new Set(
          existingProgress.map((item) => item.chuongTrinhHocPhanId),
        );

        const progressData = courses
          .filter((course) => !existingProgressSet.has(course.chuongTrinhHocPhanId))
          .map((course) => ({
            lopId,
            chuongTrinhHocPhanId: course.chuongTrinhHocPhanId,
            hocKyDuKien: course.hocKyDuKien,
            trangThai: "chua_hoc" as const,
          }));

        if (progressData.length > 0) {
          await tx.tienDoHocPhanLop.createMany({
            data: progressData,
          });
        }

        createdProgress += progressData.length;
        skippedProgress += courses.length - progressData.length;
      }

      return {
        assignment: assignments[0],
        assignments,
        totalClasses: assignments.length,
        totalCourses: courses.length,
        createdProgress,
        skippedProgress,
      };
    });

    return serializeData(result);
  },

  async listProgress(curriculumId: number, lopId: number) {
    await ensureCurriculum(curriculumId);

    const items = await prisma.tienDoHocPhanLop.findMany({
      where: {
        lopId,
        chuongTrinhHocPhan: {
          chuongTrinhId: curriculumId,
        },
      },
      include: progressInclude,
      orderBy: [
        { hocKyDuKien: "asc" },
        { tienDoId: "asc" },
      ],
    });

    return serializeData(items);
  },

  async updateProgress(tienDoId: number, input: UpdateProgressInput) {
    try {
      const item = await prisma.tienDoHocPhanLop.update({
        where: { tienDoId },
        data: input,
        include: progressInclude,
      });

      return serializeData(item);
    } catch (error) {
      mapPrismaError(error);
    }
  },
};
