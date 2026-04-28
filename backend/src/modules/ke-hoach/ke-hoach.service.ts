import { Prisma } from "@prisma/client";
import { buildPaginationMeta, getPagination } from "../../common/helpers/pagination.js";
import { HTTP_STATUS } from "../../common/constants/http-status.js";
import { AppError } from "../../common/utils/app-error.js";
import { mapKeHoachData } from "./ke-hoach.mapper.js";
import { keHoachRepository } from "./ke-hoach.repository.js";
import type {
  BaoCaoTheoGiangVienQuery,
  BaoCaoTheoLopQuery,
  CapNhatLichTuanInput,
  CreateNhomHocPhanInput,
  CreateKeHoachDaoTaoInput,
  CreateKeHoachHocKyInput,
  GroupListQuery,
  GoiYHocPhanInput,
  ListQuery,
  MoHocPhanInput,
  PhanCongInput,
  TaoNhomNhanhInput,
  TaoNhomInput,
  UpdateNhomHocPhanInput,
  UpdateKeHoachDaoTaoInput,
  UpdateKeHoachHocKyInput,
} from "./ke-hoach.validation.js";

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

export const keHoachService = {
  async listTrainingPlans(query: ListQuery) {
    const { page, limit, skip } = getPagination(query);
    const [items, totalItems] = await keHoachRepository.listTrainingPlans({
      skip,
      limit,
      keyword: query.keyword,
    });

    return mapKeHoachData({
      items,
      pagination: buildPaginationMeta(page, limit, totalItems),
    });
  },

  async detailTrainingPlan(id: number) {
    const plan = await keHoachRepository.findTrainingPlan(id);

    if (!plan) {
      throw new AppError("Khong tim thay ke hoach dao tao", HTTP_STATUS.NOT_FOUND);
    }

    return mapKeHoachData(plan);
  },

  async createTrainingPlan(input: CreateKeHoachDaoTaoInput, userId?: number) {
    try {
      const result = await keHoachRepository.createTrainingPlan({
        ...input,
        nguoiTaoId: userId,
      });
      return mapKeHoachData(result);
    } catch (error) {
      mapPrismaError(error);
    }
  },

  async updateTrainingPlan(id: number, input: UpdateKeHoachDaoTaoInput) {
    await this.detailTrainingPlan(id);

    try {
      const result = await keHoachRepository.updateTrainingPlan(id, input);
      return mapKeHoachData(result);
    } catch (error) {
      mapPrismaError(error);
    }
  },

  async deleteTrainingPlan(id: number) {
    await this.detailTrainingPlan(id);
    const [semesterCount, weekCount] = await keHoachRepository.countTrainingPlanChildren(id);

    if (semesterCount > 0 || weekCount > 0) {
      throw new AppError(
        "Ke hoach da phat sinh hoc ky hoac tuan dao tao, vui long chuyen trang thai thay vi xoa",
        HTTP_STATUS.CONFLICT,
      );
    }

    try {
      const result = await keHoachRepository.deleteTrainingPlan(id);
      return mapKeHoachData(result);
    } catch (error) {
      mapPrismaError(error);
    }
  },

  async listSemesterPlans(query: ListQuery) {
    const { page, limit, skip } = getPagination(query);
    const [items, totalItems] = await keHoachRepository.listSemesterPlans({
      skip,
      limit,
      keyword: query.keyword,
      keHoachId: query.keHoachId,
    });

    return mapKeHoachData({
      items,
      pagination: buildPaginationMeta(page, limit, totalItems),
    });
  },

  async detailSemesterPlan(id: number) {
    const semesterPlan = await keHoachRepository.findKeHoachHocKy(id);

    if (!semesterPlan) {
      throw new AppError("Khong tim thay ke hoach hoc ky", HTTP_STATUS.NOT_FOUND);
    }

    return mapKeHoachData(semesterPlan);
  },

  async createSemesterPlan(input: CreateKeHoachHocKyInput) {
    try {
      const result = await keHoachRepository.createSemesterPlan(input);
      return mapKeHoachData(result);
    } catch (error) {
      mapPrismaError(error);
    }
  },

  async updateSemesterPlan(id: number, input: UpdateKeHoachHocKyInput) {
    await this.detailSemesterPlan(id);

    try {
      const result = await keHoachRepository.updateSemesterPlan(id, input);
      return mapKeHoachData(result);
    } catch (error) {
      mapPrismaError(error);
    }
  },

  async listOpenedSubjects(keHoachHocKyId: number) {
    const keHoachHocKy = await keHoachRepository.findKeHoachHocKy(keHoachHocKyId);

    if (!keHoachHocKy) {
      throw new AppError("Khong tim thay ke hoach hoc ky", HTTP_STATUS.NOT_FOUND);
    }

    const result = await keHoachRepository.listOpenedSubjects(keHoachHocKyId);
    return mapKeHoachData(result);
  },

  async listGroups(query: GroupListQuery) {
    const { page, limit, skip } = getPagination(query);
    const [items, totalItems] = await keHoachRepository.listGroups({
      skip,
      limit,
      keyword: query.keyword,
      keHoachHocKyId: query.keHoachHocKyId,
      lopId: query.lopId,
      hocPhanId: query.hocPhanId,
      loaiNhom: query.loaiNhom,
    });

    return mapKeHoachData({
      items,
      pagination: buildPaginationMeta(page, limit, totalItems),
    });
  },

  async listGroupsByClassSubjectPlan(keHoachLopHocPhanId: number) {
    const plan = await keHoachRepository.findClassSubjectPlan(keHoachLopHocPhanId);

    if (!plan) {
      throw new AppError("Khong tim thay ke hoach lop hoc phan", HTTP_STATUS.NOT_FOUND);
    }

    const result = await keHoachRepository.listGroupsByClassSubjectPlan(keHoachLopHocPhanId);
    return mapKeHoachData(result);
  },

  async createGroup(keHoachLopHocPhanId: number, input: CreateNhomHocPhanInput) {
    const plan = await keHoachRepository.findClassSubjectPlan(keHoachLopHocPhanId);

    if (!plan) {
      throw new AppError("Khong tim thay ke hoach lop hoc phan", HTTP_STATUS.NOT_FOUND);
    }

    if (input.loaiNhom === "thuc_hanh" && Number(plan.hocPhan.soTietThucHanh ?? 0) <= 0) {
      throw new AppError("Hoc phan nay khong co tiet thuc hanh", HTTP_STATUS.BAD_REQUEST);
    }

    if (input.loaiNhom === "ly_thuyet" && Number(plan.hocPhan.soTietLyThuyet ?? 0) <= 0) {
      throw new AppError("Hoc phan nay khong co tiet ly thuyet", HTTP_STATUS.BAD_REQUEST);
    }

    const maNhom = input.maNhom?.trim() || input.tenNhom.trim().replace(/\s+/g, "").toUpperCase();

    try {
      const result = await keHoachRepository.createGroup({
        keHoachLopHocPhanId,
        maNhom,
        tenNhom: input.tenNhom.trim(),
        loaiNhom: input.loaiNhom,
        siSo: input.siSo,
        soTiet: input.soTiet,
        ghiChu: input.ghiChu,
      });

      return mapKeHoachData(result);
    } catch (error) {
      mapPrismaError(error);
    }
  },

  async createGroupsQuick(keHoachLopHocPhanId: number, input: TaoNhomNhanhInput) {
    const plan = await keHoachRepository.findClassSubjectPlan(keHoachLopHocPhanId);

    if (!plan) {
      throw new AppError("Khong tim thay ke hoach lop hoc phan", HTTP_STATUS.NOT_FOUND);
    }

    const planSiSo = plan.siSo || plan.lop.siSo || 0;
    const hasPractice = Number(plan.hocPhan.soTietThucHanh ?? 0) > 0;
    const suggestedPracticeGroups = hasPractice
      ? Math.max(Math.ceil(planSiSo / input.siSoToiDaNhomThucHanh), 1)
      : 0;
    const practiceGroupCount = input.soNhomThucHanh || suggestedPracticeGroups;

    try {
      const result = await keHoachRepository.createGroupsForPlan({
        keHoachLopHocPhanId,
        taoNhomLyThuyet: input.taoNhomLyThuyet,
        coChiaNhomThucHanh: hasPractice && practiceGroupCount > 0,
        soNhomThucHanh: practiceGroupCount,
      });

      return mapKeHoachData({
        nhomDaTao: result,
        goiYSoNhomThucHanh: suggestedPracticeGroups,
      });
    } catch (error) {
      mapPrismaError(error);
    }
  },

  async updateGroup(id: number, input: UpdateNhomHocPhanInput) {
    const group = await keHoachRepository.findGroup(id);

    if (!group) {
      throw new AppError("Khong tim thay nhom hoc phan", HTTP_STATUS.NOT_FOUND);
    }

    const [, scheduleCount] = await keHoachRepository.findGroupBlockers(id);

    if (scheduleCount > 0 && input.soTiet !== undefined) {
      throw new AppError("Nhom da co lich day theo tuan, khong the sua so tiet", HTTP_STATUS.CONFLICT);
    }

    try {
      const result = await keHoachRepository.updateGroup(id, {
        ...input,
        maNhom: input.maNhom?.trim(),
        tenNhom: input.tenNhom?.trim(),
      });
      return mapKeHoachData(result);
    } catch (error) {
      mapPrismaError(error);
    }
  },

  async deleteGroup(id: number) {
    const group = await keHoachRepository.findGroup(id);

    if (!group) {
      throw new AppError("Khong tim thay nhom hoc phan", HTTP_STATUS.NOT_FOUND);
    }

    const [assignmentCount, scheduleCount] = await keHoachRepository.findGroupBlockers(id);

    if (assignmentCount > 0 || scheduleCount > 0) {
      throw new AppError(
        "Nhom da co phan cong hoac lich day, khong the xoa truc tiep",
        HTTP_STATUS.CONFLICT,
      );
    }

    try {
      const result = await keHoachRepository.deleteGroup(id);
      return mapKeHoachData(result);
    } catch (error) {
      mapPrismaError(error);
    }
  },

  async goiYHocPhan(input: GoiYHocPhanInput) {
    const keHoachHocKy = await keHoachRepository.findKeHoachHocKy(input.keHoachHocKyId);

    if (!keHoachHocKy) {
      throw new AppError("Khong tim thay ke hoach hoc ky", HTTP_STATUS.NOT_FOUND);
    }

    const suggested = await keHoachRepository.findSuggestedSubjects({
      lopIds: input.lopIds,
      hocKyDuKien: input.hocKyDuKien,
    });
    const opened = await keHoachRepository.listOpenedSubjects(input.keHoachHocKyId);
    const openedSet = new Set(opened.map((item) => `${item.lopId}-${item.hocPhanId}`));

    const matrix = new Map<number, {
      hocPhan: unknown;
      rows: Array<{
        lop: unknown;
        chuongTrinhHocPhanId: number;
        tienDo: string | null;
        hocKyDuKien: number;
        trangThai: string | null;
      }>;
    }>();

    for (const item of suggested) {
      const hocPhanId = item.chuongTrinhHocPhan.hocPhanId;
      if (openedSet.has(`${item.lopId}-${hocPhanId}`)) continue;

      const existed = matrix.get(hocPhanId);

      const row = {
        lop: item.lop,
        chuongTrinhHocPhanId: item.chuongTrinhHocPhanId,
        tienDo: item.tienDoDuKien,
        hocKyDuKien: item.hocKyDuKien,
        trangThai: item.trangThai,
      };

      if (!existed) {
        matrix.set(hocPhanId, {
          hocPhan: item.chuongTrinhHocPhan.hocPhan,
          rows: [row],
        });
      } else {
        existed.rows.push(row);
      }
    }

    return mapKeHoachData({
      keHoachHocKyId: input.keHoachHocKyId,
      lopIds: input.lopIds,
      items: Array.from(matrix.values()),
    });
  },

  async moHocPhan(input: MoHocPhanInput) {
    const keHoachHocKy = await keHoachRepository.findKeHoachHocKy(input.keHoachHocKyId);

    if (!keHoachHocKy) {
      throw new AppError("Khong tim thay ke hoach hoc ky", HTTP_STATUS.NOT_FOUND);
    }

    const progressItems = await keHoachRepository.findProgressForOpenSubjects(input.items);
    const progressMap = new Map(
      progressItems.map((item) => [
        `${item.lopId}-${item.chuongTrinhHocPhan.hocPhanId}`,
        item,
      ]),
    );

    const invalidItem = input.items.find(
      (item) => !progressMap.has(`${item.lopId}-${item.hocPhanId}`),
    );

    if (invalidItem) {
      throw new AppError(
        "Chi duoc mo hoc phan thuoc CTDT cua lop va dang o trang thai chua hoc",
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    const normalizedInput = {
      keHoachHocKyId: input.keHoachHocKyId,
      items: input.items.map((item) => {
        const progress = progressMap.get(`${item.lopId}-${item.hocPhanId}`)!;

        return {
          ...item,
          chuongTrinhHocPhanId:
            item.chuongTrinhHocPhanId ?? progress.chuongTrinhHocPhanId,
          tienDo: item.tienDo ?? progress.tienDoDuKien ?? "ca_ky",
          siSo: item.siSo || progress.lop.siSo || 0,
          coThucHanh:
            item.coThucHanh || Number(progress.chuongTrinhHocPhan.hocPhan.soTietThucHanh) > 0,
        };
      }),
    };

    const result = await keHoachRepository.createClassSubjectPlans(normalizedInput);
    return mapKeHoachData(result);
  },

  async taoNhomHocPhan(id: number, input: TaoNhomInput) {
    const plan = await keHoachRepository.findClassSubjectPlan(id);

    if (!plan) {
      throw new AppError("Khong tim thay ke hoach lop hoc phan", HTTP_STATUS.NOT_FOUND);
    }

    try {
      const groups = await keHoachRepository.createGroupsForPlan({
        keHoachLopHocPhanId: id,
        coChiaNhomThucHanh: input.coChiaNhomThucHanh,
        soNhomThucHanh: input.soNhomThucHanh,
      });

      return mapKeHoachData(groups);
    } catch (error) {
      mapPrismaError(error);
    }
  },

  async phanCongGiangVien(input: PhanCongInput) {
    const group = await keHoachRepository.findGroup(input.nhomHocPhanId);

    if (!group) {
      throw new AppError("Khong tim thay nhom hoc phan", HTTP_STATUS.NOT_FOUND);
    }

    const ability = await keHoachRepository.findTeacherCanTeach(
      input.giangVienId,
      group.keHoachLopHocPhan.hocPhanId,
    );

    const warnings: string[] = [];

    if (!ability) {
      warnings.push("Giang vien chua duoc khai bao co the day hoc phan nay");
    }

    if (group.loaiNhom === "ly_thuyet" && ability && !ability.coTheDayLyThuyet) {
      warnings.push("Giang vien khong duoc khai bao day ly thuyet hoc phan nay");
    }

    if (group.loaiNhom === "thuc_hanh" && ability && !ability.coTheDayThucHanh) {
      warnings.push("Giang vien khong duoc khai bao day thuc hanh hoc phan nay");
    }

    const soTietPhanCong = Number(group.soTiet ?? 0);
    const soTietQuyDoi = soTietPhanCong * input.heSoLop;

    const result = await keHoachRepository.createAssignment({
      nhomHocPhanId: input.nhomHocPhanId,
      giangVienId: input.giangVienId,
      vaiTro: input.vaiTro,
      soTietPhanCong,
      heSoLop: input.heSoLop,
      soTietQuyDoi,
      ghiChu: input.ghiChu,
    });

    return mapKeHoachData({
      assignment: result,
      warnings,
    });
  },

  async capNhatLichTheoTuan(input: CapNhatLichTuanInput) {
    const assignment = await keHoachRepository.findAssignment(input.phanCongId);

    if (!assignment) {
      throw new AppError("Khong tim thay phan cong giang day", HTTP_STATUS.NOT_FOUND);
    }

    const tongTiet = input.lich.reduce((total, item) => total + item.soTiet, 0);
    const soTietPhanCong = Number(assignment.soTietPhanCong);

    if (tongTiet !== soTietPhanCong) {
      throw new AppError(
        `Tong so tiet theo tuan (${tongTiet}) phai bang so tiet phan cong (${soTietPhanCong})`,
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    const result = await keHoachRepository.upsertWeeklySchedules(input);
    return mapKeHoachData(result);
  },

  async baoCaoTheoLop(query: BaoCaoTheoLopQuery) {
    const result = await keHoachRepository.findReportByClass(query);
    return mapKeHoachData(result);
  },

  async baoCaoTheoGiangVien(query: BaoCaoTheoGiangVienQuery) {
    const result = await keHoachRepository.findReportByTeacher(query);
    return mapKeHoachData(result);
  },
};
