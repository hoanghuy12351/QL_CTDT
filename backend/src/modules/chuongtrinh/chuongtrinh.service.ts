import { Prisma } from "@prisma/client";
import { buildPaginationMeta, getPagination } from "../../common/helpers/pagination.js";
import { HTTP_STATUS } from "../../common/constants/http-status.js";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../common/utils/app-error.js";
import { serializeData } from "../../common/utils/serialize.js";
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

  async create(input: CreateCurriculumInput) {
    try {
      const item = await prisma.chuongTrinhDaoTao.create({
        data: input,
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
      const item = await prisma.chuongTrinhDaoTao.update({
        where: { chuongTrinhId: id },
        data: {
          ...input,
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
      const item = await prisma.chuongTrinhHocPhan.create({
        data: {
          chuongTrinhId: curriculumId,
          ...input,
        },
        include: courseInclude,
      });

      return serializeData(item);
    } catch (error) {
      mapPrismaError(error);
    }
  },

  async updateCourse(entryId: number, input: UpdateCurriculumCourseInput) {
    try {
      const item = await prisma.chuongTrinhHocPhan.update({
        where: { chuongTrinhHocPhanId: entryId },
        data: input,
        include: courseInclude,
      });

      return serializeData(item);
    } catch (error) {
      mapPrismaError(error);
    }
  },

  async deleteCourse(entryId: number) {
    try {
      const item = await prisma.chuongTrinhHocPhan.delete({
        where: { chuongTrinhHocPhanId: entryId },
        include: courseInclude,
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

    const existsClass = await prisma.lop.findUnique({
      where: { lopId: input.lopId },
      select: { lopId: true },
    });

    if (!existsClass) {
      throw new AppError("Khong tim thay lop", HTTP_STATUS.NOT_FOUND);
    }

    const result = await prisma.$transaction(async (tx) => {
      const assignment = await tx.lopChuongTrinh.upsert({
        where: {
          lopId_chuongTrinhId: {
            lopId: input.lopId,
            chuongTrinhId: curriculumId,
          },
        },
        update: {
          ngayApDung: normalizeDate(input.ngayApDung),
          trangThai: "dang_ap_dung",
          ghiChu: input.ghiChu,
        },
        create: {
          lopId: input.lopId,
          chuongTrinhId: curriculumId,
          ngayApDung: normalizeDate(input.ngayApDung),
          trangThai: "dang_ap_dung",
          ghiChu: input.ghiChu,
        },
        include: assignmentInclude,
      });

      const courses = await tx.chuongTrinhHocPhan.findMany({
        where: { chuongTrinhId: curriculumId },
        select: {
          chuongTrinhHocPhanId: true,
          hocKyDuKien: true,
          tienDo: true,
        },
      });

      const existingProgress = await tx.tienDoHocPhanLop.findMany({
        where: {
          lopId: input.lopId,
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
          lopId: input.lopId,
          chuongTrinhHocPhanId: course.chuongTrinhHocPhanId,
          hocKyDuKien: course.hocKyDuKien,
          tienDoDuKien: course.tienDo ?? "ca_ky",
          trangThai: "chua_hoc" as const,
        }));

      if (progressData.length > 0) {
        await tx.tienDoHocPhanLop.createMany({
          data: progressData,
        });
      }

      return {
        assignment,
        totalCourses: courses.length,
        createdProgress: progressData.length,
        skippedProgress: courses.length - progressData.length,
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
        { tienDoDuKien: "asc" },
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
