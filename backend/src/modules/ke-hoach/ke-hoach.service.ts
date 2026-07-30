import { Prisma } from "@prisma/client";
import {
  buildPaginationMeta,
  getPagination,
} from "../../common/helpers/pagination.js";
import { HTTP_STATUS } from "../../common/constants/http-status.js";
import { AppError } from "../../common/utils/app-error.js";
import { mapKeHoachData } from "./ke-hoach.mapper.js";
import { keHoachRepository } from "./ke-hoach.repository.js";
import {
  buildReportFileName,
  buildSemesterReportWorkbook,
} from "./ke-hoach.excel.js";
import type {
  ExcelExportResult,
  ReportWeek,
  SemesterReport,
  SemesterReportRow,
} from "./ke-hoach.report-types.js";
import type {
  AssignmentListQuery,
  BaoCaoHocKyQuery,
  BaoCaoTheoGiangVienQuery,
  BaoCaoTheoLopQuery,
  CapNhatLichTuanInput,
  CreateKeHoachDaoTaoInput,
  CreateKeHoachHocKyInput,
  CreateNhomHocPhanInput,
  GoiYHocPhanInput,
  GroupListQuery,
  ListQuery,
  MoHocPhanInput,
  PhanCongInput,
  TaoNhomInput,
  TaoNhomNhanhInput,
  UpdateKeHoachDaoTaoInput,
  UpdateKeHoachHocKyInput,
  UpdateNhomHocPhanInput,
  UpdatePhanCongInput,
} from "./ke-hoach.validation.js";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const toStartOfDay = (value: Date) =>
  new Date(value.getFullYear(), value.getMonth(), value.getDate());

const getMonthDayOrder = (value: Date) =>
  value.getMonth() * 31 + value.getDate();

const buildDateWithYear = (templateDate: Date, year: number) =>
  new Date(year, templateDate.getMonth(), templateDate.getDate());

const resolveSemesterRangeInSchoolYear = (input: {
  semester: {
    maHocKy?: string | null;
    tenHocKy?: string | null;
    ngayBatDau: Date | null;
    ngayKetThuc: Date | null;
  };
  schoolYear: {
    maNamHoc: string;
    ngayBatDau: Date | null;
    ngayKetThuc: Date | null;
  };
}) => {
  const { semester, schoolYear } = input;

  if (
    !semester.ngayBatDau ||
    !semester.ngayKetThuc ||
    !schoolYear.ngayBatDau ||
    !schoolYear.ngayKetThuc
  ) {
    return null;
  }

  const templateStart = toStartOfDay(semester.ngayBatDau);
  const templateEnd = toStartOfDay(semester.ngayKetThuc);
  const schoolYearStart = toStartOfDay(schoolYear.ngayBatDau);
  const schoolYearEnd = toStartOfDay(schoolYear.ngayKetThuc);

  if (schoolYearStart.getTime() > schoolYearEnd.getTime()) {
    return null;
  }

  const semesterStartOrder = getMonthDayOrder(templateStart);
  const semesterEndOrder = getMonthDayOrder(templateEnd);
  const schoolYearStartOrder = getMonthDayOrder(schoolYearStart);

  const semesterStartYear =
    semesterStartOrder >= schoolYearStartOrder
      ? schoolYearStart.getFullYear()
      : schoolYearEnd.getFullYear();
  const semesterEndYear =
    semesterEndOrder < semesterStartOrder
      ? semesterStartYear + 1
      : semesterStartYear;

  const semesterStart = buildDateWithYear(templateStart, semesterStartYear);
  const semesterEnd = buildDateWithYear(templateEnd, semesterEndYear);

  const rangeStart = new Date(
    Math.max(semesterStart.getTime(), schoolYearStart.getTime()),
  );
  const rangeEnd = new Date(
    Math.min(semesterEnd.getTime(), schoolYearEnd.getTime()),
  );

  if (rangeStart.getTime() > rangeEnd.getTime()) {
    return null;
  }

  return { rangeStart, rangeEnd };
};

const extractSemesterNumber = (...values: Array<string | null | undefined>) => {
  for (const value of values) {
    const matched = value?.match(/\d+/);
    if (!matched) continue;

    const parsed = Number(matched[0]);
    if (Number.isInteger(parsed) && parsed > 0) return parsed;
  }

  return undefined;
};


const getSemesterOrderInYear = (hocKy: unknown) => {
  const semester = hocKy as { thuTuTrongNam?: number | null; maHocKy?: string | null; tenHocKy?: string | null } | null;
  const orderFromCode = extractSemesterNumber(semester?.maHocKy, semester?.tenHocKy);
  if (orderFromCode) return orderFromCode;

  if (semester?.thuTuTrongNam && semester.thuTuTrongNam > 0) {
    return semester.thuTuTrongNam;
  }

  return undefined;
};

const getSchoolYearStartYear = (namHoc: unknown) => {
  const schoolYear = namHoc as { maNamHoc?: string | null; ngayBatDau?: Date | null } | null;
  const matched = schoolYear?.maNamHoc?.match(/\d{4}/);
  if (matched) return Number(matched[0]);

  if (schoolYear?.ngayBatDau instanceof Date) {
    return schoolYear.ngayBatDau.getFullYear();
  }

  return undefined;
};

const resolveClassSemesterMap = async (input: {
  lopIds: number[];
  keHoachHocKy: unknown;
  overrideHocKyDuKien?: number;
}) => {
  if (input.overrideHocKyDuKien) {
    return new Map(input.lopIds.map((lopId) => [lopId, input.overrideHocKyDuKien]));
  }

  const semesterPlan = input.keHoachHocKy as {
    hocKy?: unknown;
    keHoachDaoTao?: { namHoc?: unknown } | null;
  };
  const semesterOrder = getSemesterOrderInYear(semesterPlan.hocKy);
  const schoolYearStart = getSchoolYearStartYear(semesterPlan.keHoachDaoTao?.namHoc);

  if (!semesterOrder || !schoolYearStart) {
    throw new AppError(
      "Khong xac dinh duoc nam hoc hoac hoc ky trong nam cua ke hoach hoc ky",
      HTTP_STATUS.BAD_REQUEST,
    );
  }

  const classes = await keHoachRepository.findClassesForSuggestion(input.lopIds);
  const classMap = new Map(classes.map((lop) => [lop.lopId, lop]));
  const result = new Map<number, number>();

  for (const lopId of input.lopIds) {
    const lop = classMap.get(lopId);
    const cohortStart = lop?.khoaHoc?.namBatDau;

    if (!cohortStart) {
      throw new AppError(
        "Lop chua co khoa hoc hoac nam bat dau khoa hoc",
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    const hocKyTrongCTDT = (schoolYearStart - cohortStart) * 2 + semesterOrder;
    if (hocKyTrongCTDT < 1) {
      throw new AppError(
        "Khong xac dinh duoc hoc ky CTDT phu hop voi lop da chon",
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    result.set(lopId, hocKyTrongCTDT);
  }

  return result;
};

const getUpcomingSunday = (value: Date) => {
  const dayOfWeek = value.getDay();
  const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
  return new Date(value.getTime() + daysUntilSunday * MS_PER_DAY);
};

const buildTrainingWeeksFromSchoolYear = (schoolYear: {
  maNamHoc: string;
  ngayBatDau: Date | null;
  ngayKetThuc: Date | null;
}) => {
  if (!schoolYear.ngayBatDau || !schoolYear.ngayKetThuc) {
    throw new AppError(
      `Nam hoc ${schoolYear.maNamHoc} chua co ngay bat dau/ket thuc`,
      HTTP_STATUS.BAD_REQUEST,
    );
  }

  const start = toStartOfDay(schoolYear.ngayBatDau);
  const end = toStartOfDay(schoolYear.ngayKetThuc);

  if (start.getTime() > end.getTime()) {
    throw new AppError(
      `Nam hoc ${schoolYear.maNamHoc} co khoang ngay khong hop le`,
      HTTP_STATUS.BAD_REQUEST,
    );
  }

  const weeks: Array<{
    soTuan: number;
    tenTuan: string;
    ngayBatDau: Date;
    ngayKetThuc: Date;
    loaiTuan: "hoc";
  }> = [];

  let cursor = start;
  let weekNumber = 1;

  while (cursor.getTime() <= end.getTime()) {
    const weekStart = new Date(cursor);
    const weekEnd = new Date(
      Math.min(getUpcomingSunday(cursor).getTime(), end.getTime()),
    );

    weeks.push({
      soTuan: weekNumber,
      tenTuan: `Tuan ${weekNumber}`,
      ngayBatDau: weekStart,
      ngayKetThuc: weekEnd,
      loaiTuan: "hoc",
    });

    cursor = new Date(weekEnd.getTime() + MS_PER_DAY);
    weekNumber += 1;
  }

  return weeks;
};

type SemesterPlanWeekContext = {
  hocKy?: {
    maHocKy?: string | null;
    tenHocKy?: string | null;
    thuTuTrongNam?: number | null;
  } | null;
  keHoachDaoTao?: {
    namHoc?: {
      maNamHoc?: string | null;
      ngayBatDau?: Date | null;
      ngayKetThuc?: Date | null;
    } | null;
    tuanDaoTao?: Array<{
      tuanId: number;
      soTuan: number;
      tenTuan: string | null;
      ngayBatDau: Date | null;
      ngayKetThuc: Date | null;
      loaiTuan: string | null;
    }> | null;
  } | null;
};

const getSemesterTrainingWeeksFromPlan = (
  _semesterPlan: SemesterPlanWeekContext,
) => {
  // Nghiệp vụ mới đã bỏ phân bổ tuần/kế hoạch giảng theo tuần.
  // Báo cáo học kỳ không cần weeklyPeriods nữa, nên trả mảng rỗng
  // để tránh phụ thuộc ngayBatDau/ngayKetThuc của học kỳ.
  return [] as Array<{
    tuanId: number;
    soTuan: number;
    tenTuan: string | null;
    ngayBatDau: Date | null;
    ngayKetThuc: Date | null;
    loaiTuan: string | null;
  }>;
};

const getSemesterTrainingWeeks = (
  detail: NonNullable<
    Awaited<
      ReturnType<typeof keHoachRepository.findAssignmentWeeklyScheduleDetail>
    >
  >,
) => {
  return getSemesterTrainingWeeksFromPlan(
    detail.nhomHocPhan.keHoachLopHocPhan.keHoachHocKy,
  );
};

const toNumber = (value: unknown) => Number(value ?? 0);

const getCourseSizeCoefficient = (hocPhan: { heSoSiSo?: unknown }) => {
  const coefficient = toNumber(hocPhan.heSoSiSo);
  return coefficient > 0 ? coefficient : 1;
};

const getLecturerConvertedWorkload = (giangVien?: {
  phanCongGiangDay?: Array<{ soTietQuyDoi?: unknown }>;
}) =>
  giangVien?.phanCongGiangDay?.reduce(
    (total, assignment) => total + toNumber(assignment.soTietQuyDoi),
    0,
  ) ?? 0;

const reportRoleLabels: Record<string, string> = {
  chinh: "Chính",
  tro_giang: "Trợ giảng",
  thuc_hanh: "Thực hành",
  huong_dan_do_an: "Hướng dẫn đồ án",
  huong_dan_thuc_tap: "Hướng dẫn thực tập",
};

const reportGroupTypeLabels: Record<string, string> = {
  ly_thuyet: "Lý thuyết",
  thuc_hanh: "Thực hành",
  do_an: "Đồ án",
  thuc_tap: "Thực tập",
  tot_nghiep: "Tốt nghiệp",
};

const learningStatusLabels: Record<string, string> = {
  chua_hoc: "Chua hoc",
  da_len_ke_hoach: "Da len ke hoach",
  dang_hoc: "Dang hoc",
  da_hoc: "Da hoc",
  tam_hoan: "Tam hoan",
  da_huy: "Da huy",
};

const getLearningStatus = (openedSubject: {
  lopId: number;
  chuongTrinhHocPhan?: {
    tienDoHocPhanLop?: Array<{
      lopId: number;
      trangThai?: string | null;
    }>;
  } | null;
  trangThai?: string | null;
}) => {
  const status =
    openedSubject.chuongTrinhHocPhan?.tienDoHocPhanLop?.find(
      (item) => item.lopId === openedSubject.lopId,
    )?.trangThai ??
    openedSubject.trangThai ??
    "chua_hoc";

  return learningStatusLabels[status] ?? status;
};

type SemesterReportData = NonNullable<
  Awaited<ReturnType<typeof keHoachRepository.findSemesterReportData>>
>;

const buildWeeklyPeriods = (
  schedules: SemesterReportData["keHoachLopHocPhan"][number]["nhomHocPhan"][number]["phanCongGiangDay"][number]["lichDayTheoTuan"],
) => {
  const weeklyPeriods: Record<string, number> = {};

  schedules.forEach((schedule) => {
    weeklyPeriods[String(schedule.tuanId)] = toNumber(schedule.soTiet);
  });

  return weeklyPeriods;
};

const buildRoomNames = (
  schedules: SemesterReportData["keHoachLopHocPhan"][number]["nhomHocPhan"][number]["phanCongGiangDay"][number]["lichDayTheoTuan"],
) => {
  const rooms = new Set<string>();

  schedules.forEach((schedule) => {
    const room = schedule.phongHoc;
    const roomName = [room?.maPhong, room?.tenPhong]
      .filter(Boolean)
      .join(" - ");

    if (roomName) rooms.add(roomName);
  });

  return Array.from(rooms).join(", ");
};

const buildSemesterReport = (data: SemesterReportData): SemesterReport => {
  const weeks: ReportWeek[] = getSemesterTrainingWeeksFromPlan(data).map(
    (week) => ({
      tuanId: week.tuanId,
      soTuan: week.soTuan,
      tenTuan: week.tenTuan ?? `Tuần ${week.soTuan}`,
      ngayBatDau: week.ngayBatDau,
      ngayKetThuc: week.ngayKetThuc,
    }),
  );

  const rows: SemesterReportRow[] = [];

  data.keHoachLopHocPhan.forEach((openedSubject) => {
    const groups = openedSubject.nhomHocPhan;

    if (groups.length === 0) {
      rows.push({
        rowId: `opened-${openedSubject.keHoachLopHocPhanId}`,
        stt: rows.length + 1,
        phanCongId: null,
        giangVienId: null,
        maGiangVien: "",
        tenGiangVien: "",
        lopId: openedSubject.lopId,
        maLop: openedSubject.lop.maLop,
        tenLop: openedSubject.lop.tenLop,
        siSo: openedSubject.siSo ?? openedSubject.lop.siSo ?? 0,
        hocPhanId: openedSubject.hocPhanId,
        maHocPhan: openedSubject.hocPhan.maHocPhan,
        tenHocPhan: openedSubject.hocPhan.tenHocPhan,
        soTinChi: toNumber(openedSubject.hocPhan.soTinChi),
        tongSoTietHocPhan: openedSubject.hocPhan.tongSoTiet ?? 0,
        nhomHocPhanId: null,
        maNhom: "Chưa tạo nhóm",
        tenNhom: "",
        loaiNhom: "",
        vaiTro: "",
        soTietPhanCong: 0,
        heSoLop: 1,
        soTietQuyDoi: 0,
        trangThai: openedSubject.trangThai ?? "du_thao",
        trangThaiHocTap: getLearningStatus(openedSubject),
        phongHoc: "",
        ghiChu: openedSubject.ghiChu ?? "",
        weeklyPeriods: {},
      });
      return;
    }

    groups.forEach((group) => {
      if (group.phanCongGiangDay.length === 0) {
        rows.push({
          rowId: `group-${group.nhomHocPhanId}`,
          stt: rows.length + 1,
          phanCongId: null,
          giangVienId: null,
          maGiangVien: "",
          tenGiangVien: "",
          lopId: openedSubject.lopId,
          maLop: openedSubject.lop.maLop,
          tenLop: openedSubject.lop.tenLop,
          siSo: group.siSo ?? openedSubject.siSo ?? openedSubject.lop.siSo ?? 0,
          hocPhanId: openedSubject.hocPhanId,
          maHocPhan: openedSubject.hocPhan.maHocPhan,
          tenHocPhan: openedSubject.hocPhan.tenHocPhan,
          soTinChi: toNumber(openedSubject.hocPhan.soTinChi),
          tongSoTietHocPhan:
            openedSubject.hocPhan.tongSoTiet ?? group.soTiet ?? 0,
          nhomHocPhanId: group.nhomHocPhanId,
          maNhom: group.maNhom,
          tenNhom: group.tenNhom ?? "",
          loaiNhom: reportGroupTypeLabels[group.loaiNhom] ?? group.loaiNhom,
          vaiTro: "",
          soTietPhanCong: 0,
          heSoLop: 1,
          soTietQuyDoi: 0,
          trangThai: "chua_phan_cong",
          trangThaiHocTap: getLearningStatus(openedSubject),
          phongHoc: "",
          ghiChu: group.ghiChu ?? "",
          weeklyPeriods: {},
        });
        return;
      }

      group.phanCongGiangDay.forEach((assignment) => {
        rows.push({
          rowId: `assignment-${assignment.phanCongId}`,
          stt: rows.length + 1,
          phanCongId: assignment.phanCongId,
          giangVienId: assignment.giangVienId,
          maGiangVien: assignment.giangVien.maGiangVien ?? "",
          tenGiangVien: assignment.giangVien.hoTen,
          lopId: openedSubject.lopId,
          maLop: openedSubject.lop.maLop,
          tenLop: openedSubject.lop.tenLop,
          siSo: group.siSo ?? openedSubject.siSo ?? openedSubject.lop.siSo ?? 0,
          hocPhanId: openedSubject.hocPhanId,
          maHocPhan: openedSubject.hocPhan.maHocPhan,
          tenHocPhan: openedSubject.hocPhan.tenHocPhan,
          soTinChi: toNumber(openedSubject.hocPhan.soTinChi),
          tongSoTietHocPhan:
            openedSubject.hocPhan.tongSoTiet ?? group.soTiet ?? 0,
          nhomHocPhanId: group.nhomHocPhanId,
          maNhom: group.maNhom,
          tenNhom: group.tenNhom ?? "",
          loaiNhom: reportGroupTypeLabels[group.loaiNhom] ?? group.loaiNhom,
          vaiTro:
            reportRoleLabels[assignment.vaiTro ?? ""] ??
            assignment.vaiTro ??
            "",
          soTietPhanCong: toNumber(assignment.soTietPhanCong),
          heSoLop: toNumber(assignment.heSoLop) || 1,
          soTietQuyDoi: toNumber(assignment.soTietQuyDoi),
          trangThai: assignment.trangThai ?? "du_thao",
          trangThaiHocTap: getLearningStatus(openedSubject),
          phongHoc: buildRoomNames(assignment.lichDayTheoTuan),
          ghiChu: assignment.ghiChu ?? "",
          weeklyPeriods: buildWeeklyPeriods(assignment.lichDayTheoTuan),
        });
      });
    });
  });

  const lecturerIds = new Set(
    rows
      .map((row) => row.giangVienId)
      .filter((id): id is number => typeof id === "number"),
  );

  return {
    meta: {
      keHoachHocKyId: data.keHoachHocKyId,
      tenKeHoachHocKy:
        data.tenKeHoachHocKy ??
        `${data.keHoachDaoTao.tenKeHoach} - ${data.hocKy.tenHocKy}`,
      maKeHoach: data.keHoachDaoTao.maKeHoach,
      tenKeHoach: data.keHoachDaoTao.tenKeHoach,
      maNamHoc: data.keHoachDaoTao.namHoc.maNamHoc,
      tenHocKy: data.hocKy.tenHocKy,
      tenKhoa: data.keHoachDaoTao.khoa.tenKhoa,
      generatedAt: new Date(),
    },
    summary: {
      totalRows: rows.length,
      totalClasses: new Set(rows.map((row) => row.lopId)).size,
      totalLecturers: lecturerIds.size,
      totalSubjects: new Set(rows.map((row) => row.hocPhanId)).size,
      totalAssignedPeriods: rows.reduce(
        (total, row) => total + row.soTietPhanCong,
        0,
      ),
      totalConvertedPeriods: rows.reduce(
        (total, row) => total + row.soTietQuyDoi,
        0,
      ),
    },
    weeks,
    rows,
  };
};

const mapPrismaError = (error: unknown): never => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      throw new AppError("Du lieu bi trung", HTTP_STATUS.CONFLICT);
    }

    if (error.code === "P2003") {
      throw new AppError(
        "Du lieu dang lien ket voi ban ghi khac",
        HTTP_STATUS.CONFLICT,
      );
    }
  }

  throw error;
};

type TrainingPlanStatus = "du_thao" | "da_duyet" | "dang_thuc_hien" | "da_dong";

type TrainingPlanStatusAction = "approve" | "start" | "reopen" | "close";

const trainingPlanStatusLabels: Record<TrainingPlanStatus, string> = {
  du_thao: "du thao",
  da_duyet: "da duyet",
  dang_thuc_hien: "dang thuc hien",
  da_dong: "da dong",
};

const assertTrainingPlanEditable = (trainingPlan: {
  trangThai?: TrainingPlanStatus | null;
}) => {
  const status = trainingPlan.trangThai ?? "du_thao";

  if (status !== "du_thao") {
    throw new AppError(
      `Ke hoach nam hoc dang o trang thai ${trainingPlanStatusLabels[status]}, khong the chinh sua thong tin co ban. Vui long mo lai du thao truoc khi thay doi du lieu.`,
      HTTP_STATUS.CONFLICT,
    );
  }
};

type SemesterPlanStatus = "du_thao" | "da_duyet" | "dang_thuc_hien" | "da_dong";

const semesterStatusLabels: Record<string, string> = {
  du_thao: "du thao",
  da_duyet: "da duyet",
  dang_thuc_hien: "dang thuc hien",
  da_dong: "da dong",
};

const assertSemesterPlanEditable = (semesterPlan: {
  trangThai?: string | null;
}) => {
  const status = semesterPlan.trangThai ?? "du_thao";

  if (status !== "du_thao") {
    throw new AppError(
      `Ke hoach hoc ky dang o trang thai ${semesterStatusLabels[status] ?? status}, khong the chinh sua. Vui long mo lai chinh sua truoc khi thay doi du lieu.`,
      HTTP_STATUS.CONFLICT,
    );
  }
};

const assertParentTrainingPlanOpen = (trainingPlan: {
  trangThai?: string | null;
}) => {
  if (trainingPlan.trangThai === "da_dong") {
    throw new AppError(
      "Ke hoach nam hoc da dong, khong the thay doi ke hoach hoc ky",
      HTTP_STATUS.CONFLICT,
    );
  }
};

const buildApprovalBlockers = (
  summary: Awaited<
    ReturnType<typeof keHoachRepository.findSemesterPlanApprovalSummary>
  >,
) => {
  const blockers: string[] = [];

  if (summary.openedSubjectCount === 0) {
    blockers.push("chua co lop - hoc phan nao duoc mo");
  }

  if (summary.openedSubjectWithoutGroupCount > 0) {
    blockers.push(
      `${summary.openedSubjectWithoutGroupCount} lop - hoc phan chua tao nhom`,
    );
  }

  if (summary.groupWithoutAssignmentCount > 0) {
    blockers.push(
      `${summary.groupWithoutAssignmentCount} nhom chua phan cong giang vien`,
    );
  }

  return blockers;
};

export const keHoachService = {
  /**
   * Alias method để khớp controller/route dùng tên tiếng Việt.
   */
  async listKeHoachDaoTao(query: ListQuery) {
    return this.listTrainingPlans(query);
  },

  async detailKeHoachDaoTao(id: number) {
    return this.detailTrainingPlan(id);
  },

  async createKeHoachDaoTao(input: CreateKeHoachDaoTaoInput, userId?: number) {
    return this.createTrainingPlan(input, userId);
  },

  async updateKeHoachDaoTao(id: number, input: UpdateKeHoachDaoTaoInput) {
    return this.updateTrainingPlan(id, input);
  },

  async deleteKeHoachDaoTao(id: number) {
    return this.deleteTrainingPlan(id);
  },

  async duyetKeHoachDaoTao(id: number) {
    return this.changeTrainingPlanWorkflowStatus(id, "approve");
  },

  async batDauKeHoachDaoTao(id: number) {
    return this.changeTrainingPlanWorkflowStatus(id, "start");
  },

  async moLaiKeHoachDaoTao(id: number) {
    return this.changeTrainingPlanWorkflowStatus(id, "reopen");
  },

  async dongKeHoachDaoTao(id: number) {
    return this.changeTrainingPlanWorkflowStatus(id, "close");
  },

  async listKeHoachHocKy(query: ListQuery) {
    return this.listSemesterPlans(query);
  },

  async detailKeHoachHocKy(id: number) {
    return this.detailSemesterPlan(id);
  },

  async createKeHoachHocKy(input: CreateKeHoachHocKyInput) {
    return this.createSemesterPlan(input);
  },

  async updateKeHoachHocKy(id: number, input: UpdateKeHoachHocKyInput) {
    return this.updateSemesterPlan(id, input);
  },

  async duyetKeHoachHocKy(id: number) {
    return this.approveSemesterPlan(id);
  },

  async moLaiKeHoachHocKy(id: number) {
    return this.reopenSemesterPlan(id);
  },

  async dongKeHoachHocKy(id: number) {
    return this.closeSemesterPlan(id);
  },

  async listLopHocPhanDaMo(keHoachHocKyId: number) {
    return this.listOpenedSubjects(keHoachHocKyId);
  },

  async listNhomHocPhan(query: GroupListQuery) {
    return this.listGroups(query);
  },

  async listNhomTheoLopHocPhan(keHoachLopHocPhanId: number) {
    return this.listGroupsByClassSubjectPlan(keHoachLopHocPhanId);
  },

  async createNhomHocPhan(
    keHoachLopHocPhanId: number,
    input: CreateNhomHocPhanInput,
  ) {
    return this.createGroup(keHoachLopHocPhanId, input);
  },

  async updateNhomHocPhan(id: number, input: UpdateNhomHocPhanInput) {
    return this.updateGroup(id, input);
  },

  async deleteNhomHocPhan(id: number) {
    return this.deleteGroup(id);
  },

  async taoNhomNhanh(keHoachLopHocPhanId: number, input: TaoNhomNhanhInput) {
    return this.createGroupsQuick(keHoachLopHocPhanId, input);
  },

  async listPhanCongGiangDay(query: AssignmentListQuery) {
    return this.listAssignments(query);
  },

  async updatePhanCongGiangDay(id: number, input: UpdatePhanCongInput) {
    return this.updateAssignment(id, input);
  },

  async deletePhanCongGiangDay(id: number) {
    return this.deleteAssignment(id);
  },

  async listGiangVienTheoHocPhan(hocPhanId: number) {
    const assignments =
      await keHoachRepository.listTeachersCanTeachCourse(hocPhanId);

    return mapKeHoachData(
      assignments
        .map((assignment) => assignment.giangVien)
        .filter((giangVien) => Boolean(giangVien)),
    );
  },

  /**
   * Kế hoạch đào tạo năm.
   */
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
      throw new AppError(
        "Khong tim thay ke hoach dao tao",
        HTTP_STATUS.NOT_FOUND,
      );
    }

    return mapKeHoachData(plan);
  },

  async createTrainingPlan(input: CreateKeHoachDaoTaoInput, userId?: number) {
    if (input.trangThai && input.trangThai !== "du_thao") {
      throw new AppError(
        "Ke hoach nam hoc moi phai bat dau o trang thai du thao",
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    try {
      const [schoolYear, semesters] = await Promise.all([
        keHoachRepository.findSchoolYearForWeekGeneration(input.namHocId),
        keHoachRepository.listActiveSemesters(),
      ]);
      const defaultSemesterPlans = semesters
        .map((semester) => ({
          semester,
          order: getSemesterOrderInYear(semester),
        }))
        .filter(
          (item): item is { semester: (typeof semesters)[number]; order: number } =>
            typeof item.order === "number" && item.order >= 1 && item.order <= 2,
        )
        .sort((left, right) => left.order - right.order)
        .slice(0, 2)
        .map(({ semester }) => ({
          hocKyId: semester.hocKyId,
          tenKeHoachHocKy: `Ke hoach ${semester.tenHocKy} nam hoc ${
            schoolYear?.maNamHoc ?? ""
          }`.trim(),
          trangThai: "du_thao" as const,
        }));

      const result = await keHoachRepository.createTrainingPlan({
        ...input,
        trangThai: "du_thao",
        nguoiTaoId: userId,
        keHoachHocKy: defaultSemesterPlans,
      });

      return mapKeHoachData(result);
    } catch (error) {
      mapPrismaError(error);
    }
  },

  async updateTrainingPlan(id: number, input: UpdateKeHoachDaoTaoInput) {
    const existingPlan = await keHoachRepository.findTrainingPlan(id);

    if (!existingPlan) {
      throw new AppError(
        "Khong tim thay ke hoach dao tao",
        HTTP_STATUS.NOT_FOUND,
      );
    }

    assertTrainingPlanEditable(existingPlan);

    if (
      input.trangThai !== undefined &&
      input.trangThai !== (existingPlan.trangThai ?? "du_thao")
    ) {
      throw new AppError(
        "Vui long dung chuc nang duyet, bat dau, mo lai hoac dong ke hoach nam hoc de doi trang thai",
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    try {
      const result = await keHoachRepository.updateTrainingPlan(id, input);

      return mapKeHoachData(result);
    } catch (error) {
      mapPrismaError(error);
    }
  },

  async deleteTrainingPlan(id: number) {
    const existingPlan = await keHoachRepository.findTrainingPlan(id);

    if (!existingPlan) {
      throw new AppError(
        "Khong tim thay ke hoach dao tao",
        HTTP_STATUS.NOT_FOUND,
      );
    }

    assertTrainingPlanEditable(existingPlan);

    const [semesterCount, weekCount] =
      await keHoachRepository.countTrainingPlanChildren(id);

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

  async changeTrainingPlanWorkflowStatus(
    id: number,
    action: TrainingPlanStatusAction,
  ) {
    const existingPlan = await keHoachRepository.findTrainingPlan(id);

    if (!existingPlan) {
      throw new AppError(
        "Khong tim thay ke hoach dao tao",
        HTTP_STATUS.NOT_FOUND,
      );
    }

    const currentStatus = existingPlan.trangThai ?? "du_thao";
    const [semesterCount, nonDraftSemesterCount, notClosedSemesterCount] =
      await keHoachRepository.countSemesterPlansForTrainingPlan(id);

    if (action === "approve") {
      if (currentStatus !== "du_thao") {
        throw new AppError(
          "Chi co the duyet ke hoach nam hoc dang o trang thai du thao",
          HTTP_STATUS.CONFLICT,
        );
      }

      const result = await keHoachRepository.changeTrainingPlanStatus(
        id,
        "da_duyet",
      );
      return mapKeHoachData(result);
    }

    if (action === "start") {
      if (currentStatus === "du_thao") {
        throw new AppError(
          "Can duyet ke hoach nam hoc truoc khi bat dau thuc hien",
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      if (currentStatus === "dang_thuc_hien") {
        throw new AppError(
          "Ke hoach nam hoc dang thuc hien",
          HTTP_STATUS.CONFLICT,
        );
      }

      if (currentStatus === "da_dong") {
        throw new AppError(
          "Ke hoach nam hoc da dong, khong the bat dau lai",
          HTTP_STATUS.CONFLICT,
        );
      }

      const result = await keHoachRepository.changeTrainingPlanStatus(
        id,
        "dang_thuc_hien",
      );
      return mapKeHoachData(result);
    }

    if (action === "reopen") {
      if (currentStatus === "du_thao") {
        throw new AppError(
          "Ke hoach nam hoc dang o trang thai du thao",
          HTTP_STATUS.CONFLICT,
        );
      }

      if (currentStatus === "da_dong") {
        throw new AppError(
          "Ke hoach nam hoc da dong, khong the mo lai du thao",
          HTTP_STATUS.CONFLICT,
        );
      }

      if (nonDraftSemesterCount > 0) {
        throw new AppError(
          "Ke hoach nam hoc da co ke hoach hoc ky duoc duyet/dong, khong the mo lai du thao",
          HTTP_STATUS.CONFLICT,
        );
      }

      const result = await keHoachRepository.changeTrainingPlanStatus(
        id,
        "du_thao",
      );
      return mapKeHoachData(result);
    }

    if (currentStatus === "da_dong") {
      throw new AppError("Ke hoach nam hoc da dong", HTTP_STATUS.CONFLICT);
    }

    if (currentStatus === "du_thao") {
      throw new AppError(
        "Can duyet ke hoach nam hoc truoc khi dong",
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    if (semesterCount > 0 && notClosedSemesterCount > 0) {
      throw new AppError(
        "Chi co the dong ke hoach nam hoc khi tat ca ke hoach hoc ky truc thuoc da dong",
        HTTP_STATUS.CONFLICT,
      );
    }

    const result = await keHoachRepository.changeTrainingPlanStatus(
      id,
      "da_dong",
    );
    return mapKeHoachData(result);
  },

  /**
   * Kế hoạch học kỳ.
   */
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
      throw new AppError(
        "Khong tim thay ke hoach hoc ky",
        HTTP_STATUS.NOT_FOUND,
      );
    }

    return mapKeHoachData(semesterPlan);
  },

  async createSemesterPlan(input: CreateKeHoachHocKyInput) {
    const trainingPlan = await keHoachRepository.findTrainingPlan(
      input.keHoachId,
    );
    const semester = await keHoachRepository.findSemester(input.hocKyId);

    if (!trainingPlan) {
      throw new AppError(
        "Khong tim thay ke hoach dao tao",
        HTTP_STATUS.NOT_FOUND,
      );
    }

    if (!semester) {
      throw new AppError("Khong tim thay hoc ky", HTTP_STATUS.NOT_FOUND);
    }

    assertParentTrainingPlanOpen(trainingPlan);

    if (input.trangThai && input.trangThai !== "du_thao") {
      throw new AppError(
        "Ke hoach hoc ky moi phai bat dau o trang thai du thao",
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    try {
      const result = await keHoachRepository.createSemesterPlan({
        ...input,
        trangThai: "du_thao",
      });
      return mapKeHoachData(result);
    } catch (error) {
      mapPrismaError(error);
    }
  },

  async updateSemesterPlan(id: number, input: UpdateKeHoachHocKyInput) {
    const existingSemesterPlan = await keHoachRepository.findKeHoachHocKy(id);

    if (!existingSemesterPlan) {
      throw new AppError(
        "Khong tim thay ke hoach hoc ky",
        HTTP_STATUS.NOT_FOUND,
      );
    }

    const trainingPlan =
      input.keHoachId !== undefined
        ? await keHoachRepository.findTrainingPlan(input.keHoachId)
        : existingSemesterPlan.keHoachDaoTao;
    const semester =
      input.hocKyId !== undefined
        ? await keHoachRepository.findSemester(input.hocKyId)
        : existingSemesterPlan.hocKy;

    if (!trainingPlan) {
      throw new AppError(
        "Khong tim thay ke hoach dao tao",
        HTTP_STATUS.NOT_FOUND,
      );
    }

    if (!semester) {
      throw new AppError("Khong tim thay hoc ky", HTTP_STATUS.NOT_FOUND);
    }

    assertParentTrainingPlanOpen(trainingPlan);
    assertSemesterPlanEditable(existingSemesterPlan);

    if (
      input.trangThai !== undefined &&
      input.trangThai !== (existingSemesterPlan.trangThai ?? "du_thao")
    ) {
      throw new AppError(
        "Vui long dung chuc nang duyet, mo lai hoac dong ke hoach de doi trang thai",
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    try {
      const result = await keHoachRepository.updateSemesterPlan(id, input);
      return mapKeHoachData(result);
    } catch (error) {
      mapPrismaError(error);
    }
  },

  async approveSemesterPlan(id: number) {
    const existingSemesterPlan = await keHoachRepository.findKeHoachHocKy(id);

    if (!existingSemesterPlan) {
      throw new AppError(
        "Khong tim thay ke hoach hoc ky",
        HTTP_STATUS.NOT_FOUND,
      );
    }

    assertParentTrainingPlanOpen(existingSemesterPlan.keHoachDaoTao);

    const currentStatus = existingSemesterPlan.trangThai ?? "du_thao";

    if (currentStatus === "dang_thuc_hien") {
      throw new AppError(
        "Ke hoach hoc ky da duyet va dang duoc khoa chinh sua",
        HTTP_STATUS.CONFLICT,
      );
    }

    if (currentStatus === "da_dong") {
      throw new AppError(
        "Ke hoach hoc ky da dong, khong the duyet lai",
        HTTP_STATUS.CONFLICT,
      );
    }

    const summary = await keHoachRepository.findSemesterPlanApprovalSummary(id);
    const blockers = buildApprovalBlockers(summary);

    if (blockers.length > 0) {
      throw new AppError(
        `Chua the duyet ke hoach hoc ky: ${blockers.join("; ")}`,
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    const result = await keHoachRepository.approveSemesterPlan(id);
    return mapKeHoachData(result);
  },

  async reopenSemesterPlan(id: number) {
    const existingSemesterPlan = await keHoachRepository.findKeHoachHocKy(id);

    if (!existingSemesterPlan) {
      throw new AppError(
        "Khong tim thay ke hoach hoc ky",
        HTTP_STATUS.NOT_FOUND,
      );
    }

    assertParentTrainingPlanOpen(existingSemesterPlan.keHoachDaoTao);

    const currentStatus = existingSemesterPlan.trangThai ?? "du_thao";

    if (currentStatus === "du_thao") {
      throw new AppError(
        "Ke hoach hoc ky dang o trang thai du thao",
        HTTP_STATUS.CONFLICT,
      );
    }

    if (currentStatus === "da_dong") {
      throw new AppError(
        "Ke hoach hoc ky da dong, khong the mo lai chinh sua",
        HTTP_STATUS.CONFLICT,
      );
    }

    const result = await keHoachRepository.changeSemesterPlanStatus(
      id,
      "du_thao",
    );
    return mapKeHoachData(result);
  },

  async closeSemesterPlan(id: number) {
    const existingSemesterPlan = await keHoachRepository.findKeHoachHocKy(id);

    if (!existingSemesterPlan) {
      throw new AppError(
        "Khong tim thay ke hoach hoc ky",
        HTTP_STATUS.NOT_FOUND,
      );
    }

    const currentStatus = existingSemesterPlan.trangThai ?? "du_thao";

    if (currentStatus === "du_thao") {
      throw new AppError(
        "Can duyet va khoa ke hoach hoc ky truoc khi dong",
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    if (currentStatus === "da_dong") {
      throw new AppError("Ke hoach hoc ky da dong", HTTP_STATUS.CONFLICT);
    }

    const result = await keHoachRepository.changeSemesterPlanStatus(
      id,
      "da_dong",
    );
    return mapKeHoachData(result);
  },

  /**
   * Lớp - học phần đã mở.
   */
  async listOpenedSubjects(keHoachHocKyId: number) {
    const keHoachHocKy =
      await keHoachRepository.findKeHoachHocKy(keHoachHocKyId);

    if (!keHoachHocKy) {
      throw new AppError(
        "Khong tim thay ke hoach hoc ky",
        HTTP_STATUS.NOT_FOUND,
      );
    }

    const result = await keHoachRepository.listOpenedSubjects(keHoachHocKyId);
    return mapKeHoachData(result);
  },

  /**
   * Nhóm học phần.
   */
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
    const plan =
      await keHoachRepository.findClassSubjectPlan(keHoachLopHocPhanId);

    if (!plan) {
      throw new AppError(
        "Khong tim thay ke hoach lop hoc phan",
        HTTP_STATUS.NOT_FOUND,
      );
    }

    const result =
      await keHoachRepository.listGroupsByClassSubjectPlan(keHoachLopHocPhanId);

    return mapKeHoachData(result);
  },

  async createGroup(
    keHoachLopHocPhanId: number,
    input: CreateNhomHocPhanInput,
  ) {
    const plan =
      await keHoachRepository.findClassSubjectPlan(keHoachLopHocPhanId);

    if (!plan) {
      throw new AppError(
        "Khong tim thay ke hoach lop hoc phan",
        HTTP_STATUS.NOT_FOUND,
      );
    }

    assertSemesterPlanEditable(plan.keHoachHocKy);

    if (
      input.loaiNhom === "thuc_hanh" &&
      Number(plan.hocPhan.soTietThucHanh ?? 0) <= 0
    ) {
      throw new AppError(
        "Hoc phan nay khong co tiet thuc hanh",
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    if (
      input.loaiNhom === "ly_thuyet" &&
      Number(plan.hocPhan.soTietLyThuyet ?? 0) <= 0
    ) {
      throw new AppError(
        "Hoc phan nay khong co tiet ly thuyet",
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    const maNhom =
      input.maNhom?.trim() ||
      input.tenNhom.trim().replace(/\s+/g, "").toUpperCase();

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

  async createGroupsQuick(
    keHoachLopHocPhanId: number,
    input: TaoNhomNhanhInput,
  ) {
    const plan =
      await keHoachRepository.findClassSubjectPlan(keHoachLopHocPhanId);

    if (!plan) {
      throw new AppError(
        "Khong tim thay ke hoach lop hoc phan",
        HTTP_STATUS.NOT_FOUND,
      );
    }

    assertSemesterPlanEditable(plan.keHoachHocKy);

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

    assertSemesterPlanEditable(group.keHoachLopHocPhan.keHoachHocKy);

    const [, scheduleCount] = await keHoachRepository.findGroupBlockers(id);

    if (scheduleCount > 0 && input.soTiet !== undefined) {
      throw new AppError(
        "Nhom da co lich day theo tuan, khong the sua so tiet",
        HTTP_STATUS.CONFLICT,
      );
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

    assertSemesterPlanEditable(group.keHoachLopHocPhan.keHoachHocKy);

    const [assignmentCount, scheduleCount] =
      await keHoachRepository.findGroupBlockers(id);

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

  /**
   * Gợi ý / mở học phần.
   */
  async goiYHocPhan(input: GoiYHocPhanInput) {
    const keHoachHocKy = await keHoachRepository.findKeHoachHocKy(
      input.keHoachHocKyId,
    );

    if (!keHoachHocKy) {
      throw new AppError(
        "Khong tim thay ke hoach hoc ky",
        HTTP_STATUS.NOT_FOUND,
      );
    }

    const classSemesterMap = await resolveClassSemesterMap({
      lopIds: input.lopIds,
      keHoachHocKy,
      overrideHocKyDuKien: input.hocKyDuKien,
    });

    const classSemesters = Array.from(classSemesterMap.entries())
      .map(([lopId, hocKyDuKien]) => ({ lopId, hocKyDuKien }))
      .filter(
        (item): item is { lopId: number; hocKyDuKien: number } =>
          typeof item.hocKyDuKien === "number",
      );

    const suggested = await keHoachRepository.findSuggestedSubjects({
      classSemesters,
    });

    const opened = await keHoachRepository.listOpenedSubjects(
      input.keHoachHocKyId,
    );
    const openedSet = new Set(
      opened.map((item) => `${item.lopId}-${item.hocPhanId}`),
    );

    const matrix = new Map<
      number,
      {
        hocPhan: unknown;
        rows: Array<{
          lop: unknown;
          chuongTrinhHocPhanId: number;
          tienDo: string | null;
          hocKyDuKien: number;
          trangThai: string | null;
        }>;
      }
    >();

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
    const keHoachHocKy = await keHoachRepository.findKeHoachHocKy(
      input.keHoachHocKyId,
    );

    if (!keHoachHocKy) {
      throw new AppError(
        "Khong tim thay ke hoach hoc ky",
        HTTP_STATUS.NOT_FOUND,
      );
    }

    assertSemesterPlanEditable(keHoachHocKy);

    const classSemesterMap = await resolveClassSemesterMap({
      lopIds: Array.from(new Set(input.items.map((item) => item.lopId))),
      keHoachHocKy,
    });

    const progressItems = await keHoachRepository.findProgressForOpenSubjects(
      input.items,
    );

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
        "Chi duoc mo hoc phan thuoc CTDT cua lop va chua duoc gan vao ke hoach dao tao",
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    const invalidSemesterItem = input.items.find((item) => {
      const progress = progressMap.get(`${item.lopId}-${item.hocPhanId}`);
      return progress?.hocKyDuKien !== classSemesterMap.get(item.lopId);
    });

    if (invalidSemesterItem) {
      throw new AppError(
        "Chi duoc mo hoc phan dung hoc ky du kien trong CTDT cua lop",
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
          siSo: item.siSo || progress.lop.siSo || 0,
          coThucHanh:
            item.coThucHanh ||
            Number(progress.chuongTrinhHocPhan.hocPhan.soTietThucHanh) > 0,
        };
      }),
    };

    const result =
      await keHoachRepository.createClassSubjectPlans(normalizedInput);
    return mapKeHoachData(result);
  },

  async taoNhomHocPhan(id: number, input: TaoNhomInput) {
    const plan = await keHoachRepository.findClassSubjectPlan(id);

    if (!plan) {
      throw new AppError(
        "Khong tim thay ke hoach lop hoc phan",
        HTTP_STATUS.NOT_FOUND,
      );
    }

    assertSemesterPlanEditable(plan.keHoachHocKy);

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

  /**
   * Phân công giảng dạy.
   */
  async detailAssignmentWeeklySchedule(phanCongId: number) {
    const detail =
      await keHoachRepository.findAssignmentWeeklyScheduleDetail(phanCongId);

    if (!detail) {
      throw new AppError(
        "Khong tim thay phan cong giang day",
        HTTP_STATUS.NOT_FOUND,
      );
    }

    const tuanDaoTao = getSemesterTrainingWeeks(detail);
    const validWeekIds = new Set(tuanDaoTao.map((week) => week.tuanId));

    return mapKeHoachData({
      phanCong: detail,
      tuanDaoTao,
      lichDaPhanBo: detail.lichDayTheoTuan.filter((schedule) =>
        validWeekIds.has(schedule.tuanId),
      ),
    });
  },
  async listAssignments(query: AssignmentListQuery) {
    const { page, limit, skip } = getPagination(query);

    const [items, totalItems] = await keHoachRepository.listAssignments({
      skip,
      limit,
      keyword: query.keyword,
      keHoachHocKyId: query.keHoachHocKyId,
      lopId: query.lopId,
      hocPhanId: query.hocPhanId,
      giangVienId: query.giangVienId,
      nhomHocPhanId: query.nhomHocPhanId,
      vaiTro: query.vaiTro,
      trangThai: query.trangThai,
    });

    return mapKeHoachData({
      items,
      pagination: buildPaginationMeta(page, limit, totalItems),
    });
  },

  async phanCongGiangVien(input: PhanCongInput) {
    const group = await keHoachRepository.findGroup(input.nhomHocPhanId);

    if (!group) {
      throw new AppError("Khong tim thay nhom hoc phan", HTTP_STATUS.NOT_FOUND);
    }

    assertSemesterPlanEditable(group.keHoachLopHocPhan.keHoachHocKy);

    const ability = await keHoachRepository.findTeacherCanTeach(
      input.giangVienId,
      group.keHoachLopHocPhan.hocPhanId,
    );

    const warnings: string[] = [];

    if (!ability) {
      warnings.push("Giang vien chua duoc khai bao co the day hoc phan nay");
    }

    if (
      group.loaiNhom === "ly_thuyet" &&
      ability &&
      !ability.coTheDayLyThuyet
    ) {
      warnings.push(
        "Giang vien khong duoc khai bao day ly thuyet hoc phan nay",
      );
    }

    if (
      group.loaiNhom === "thuc_hanh" &&
      ability &&
      !ability.coTheDayThucHanh
    ) {
      warnings.push(
        "Giang vien khong duoc khai bao day thuc hanh hoc phan nay",
      );
    }

    const soTietPhanCong =
      input.soTietPhanCong !== undefined
        ? input.soTietPhanCong
        : Number(group.soTiet ?? 0);

    const heSoLop =
      input.heSoLop !== undefined
        ? input.heSoLop
        : getCourseSizeCoefficient(group.keHoachLopHocPhan.hocPhan);
    const soTietQuyDoi = soTietPhanCong * heSoLop;

    try {
      const result = await keHoachRepository.createAssignment({
        nhomHocPhanId: input.nhomHocPhanId,
        giangVienId: input.giangVienId,
        vaiTro: input.vaiTro,
        soTietPhanCong,
        heSoLop,
        soTietQuyDoi,
        trangThai: input.trangThai,
        ghiChu: input.ghiChu,
      });

      const nextWorkload = getLecturerConvertedWorkload(result.giangVien);
      const quota = toNumber(result.giangVien.dinhMucGio);

      if (quota > 0 && nextWorkload > quota) {
        warnings.push(
          `Tong gio TC cua giang vien (${nextWorkload}) vuot dinh muc (${quota})`,
        );
      }

      return mapKeHoachData({
        assignment: result,
        warnings,
      });
    } catch (error) {
      mapPrismaError(error);
    }
  },

  async updateAssignment(id: number, input: UpdatePhanCongInput) {
    const assignment = await keHoachRepository.findAssignment(id);

    if (!assignment) {
      throw new AppError(
        "Khong tim thay phan cong giang day",
        HTTP_STATUS.NOT_FOUND,
      );
    }

    assertSemesterPlanEditable(
      assignment.nhomHocPhan.keHoachLopHocPhan.keHoachHocKy,
    );

    const nextLecturerId = input.giangVienId ?? assignment.giangVienId;
    const hocPhanId = assignment.nhomHocPhan.keHoachLopHocPhan.hocPhanId;

    const ability = await keHoachRepository.findTeacherCanTeach(
      nextLecturerId,
      hocPhanId,
    );

    const warnings: string[] = [];

    if (!ability) {
      warnings.push("Giang vien chua duoc khai bao co the day hoc phan nay");
    }

    if (
      assignment.nhomHocPhan.loaiNhom === "ly_thuyet" &&
      ability &&
      !ability.coTheDayLyThuyet
    ) {
      warnings.push(
        "Giang vien khong duoc khai bao day ly thuyet hoc phan nay",
      );
    }

    if (
      assignment.nhomHocPhan.loaiNhom === "thuc_hanh" &&
      ability &&
      !ability.coTheDayThucHanh
    ) {
      warnings.push(
        "Giang vien khong duoc khai bao day thuc hanh hoc phan nay",
      );
    }

    const soTietPhanCong =
      input.soTietPhanCong !== undefined
        ? input.soTietPhanCong
        : Number(assignment.soTietPhanCong ?? 0);

    const heSoLop =
      input.heSoLop !== undefined
        ? input.heSoLop
        : Number(assignment.heSoLop ?? 1);

    try {
      const result = await keHoachRepository.updateAssignment(id, {
        giangVienId: input.giangVienId,
        vaiTro: input.vaiTro,
        soTietPhanCong: input.soTietPhanCong,
        heSoLop: input.heSoLop,
        soTietQuyDoi:
          input.soTietPhanCong !== undefined || input.heSoLop !== undefined
            ? soTietPhanCong * heSoLop
            : undefined,
        trangThai: input.trangThai,
        ghiChu: input.ghiChu,
      });

      const nextWorkload = getLecturerConvertedWorkload(result.giangVien);
      const quota = toNumber(result.giangVien.dinhMucGio);

      if (quota > 0 && nextWorkload > quota) {
        warnings.push(
          `Tong gio TC cua giang vien (${nextWorkload}) vuot dinh muc (${quota})`,
        );
      }

      return mapKeHoachData({
        assignment: result,
        warnings,
      });
    } catch (error) {
      mapPrismaError(error);
    }
  },

  async deleteAssignment(id: number) {
    const assignment = await keHoachRepository.findAssignment(id);

    if (!assignment) {
      throw new AppError(
        "Khong tim thay phan cong giang day",
        HTTP_STATUS.NOT_FOUND,
      );
    }

    assertSemesterPlanEditable(
      assignment.nhomHocPhan.keHoachLopHocPhan.keHoachHocKy,
    );

    if ((assignment._count?.lichDayTheoTuan ?? 0) > 0) {
      throw new AppError(
        "Phan cong da co lich day theo tuan, khong the xoa truc tiep",
        HTTP_STATUS.CONFLICT,
      );
    }

    try {
      const result = await keHoachRepository.deleteAssignment(id);
      return mapKeHoachData(result);
    } catch (error) {
      mapPrismaError(error);
    }
  },

  /**
   * Lịch tuần.
   */
  async capNhatLichTheoTuan(input: CapNhatLichTuanInput) {
    const assignment =
      await keHoachRepository.findAssignmentWeeklyScheduleDetail(
        input.phanCongId,
      );

    if (!assignment) {
      throw new AppError(
        "Khong tim thay phan cong giang day",
        HTTP_STATUS.NOT_FOUND,
      );
    }

    assertSemesterPlanEditable(
      assignment.nhomHocPhan.keHoachLopHocPhan.keHoachHocKy,
    );

    const validWeekIds = new Set(
      getSemesterTrainingWeeks(assignment).map((week) => week.tuanId),
    );

    const invalidWeek = input.lich.find(
      (item) => !validWeekIds.has(item.tuanId),
    );

    if (invalidWeek) {
      throw new AppError(
        "Tuan phan bo khong thuoc hoc ky cua ke hoach hoc ky hoac nam hoc cua ke hoach nam",
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    const lichCanLuu = input.lich.filter((item) => item.soTiet > 0);
    const tongTiet = lichCanLuu.reduce((total, item) => total + item.soTiet, 0);
    const soTietPhanCong = Number(assignment.soTietPhanCong);

    if (Math.abs(tongTiet - soTietPhanCong) > 0.001) {
      throw new AppError(
        `Tong so tiet theo tuan (${tongTiet}) phai bang so tiet phan cong (${soTietPhanCong})`,
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    const result = await keHoachRepository.upsertWeeklySchedules({
      ...input,
      lich: lichCanLuu,
    });
    return mapKeHoachData(result);
  },

  /**
   * Báo cáo.
   */
  async baoCaoHocKy(query: BaoCaoHocKyQuery) {
    const data = await keHoachRepository.findSemesterReportData(
      query.keHoachHocKyId,
    );

    if (!data) {
      throw new AppError(
        "Khong tim thay ke hoach hoc ky",
        HTTP_STATUS.NOT_FOUND,
      );
    }

    return mapKeHoachData(buildSemesterReport(data));
  },

  async xuatBaoCaoHocKy(query: BaoCaoHocKyQuery): Promise<ExcelExportResult> {
    const data = await keHoachRepository.findSemesterReportData(
      query.keHoachHocKyId,
    );

    if (!data) {
      throw new AppError(
        "Khong tim thay ke hoach hoc ky",
        HTTP_STATUS.NOT_FOUND,
      );
    }

    const report = buildSemesterReport(data);

    return {
      fileName: buildReportFileName(report, "bao-cao-hoc-ky"),
      buffer: await buildSemesterReportWorkbook(report),
    };
  },

  async xuatBaoCaoTheoLop(
    query: BaoCaoTheoLopQuery,
  ): Promise<ExcelExportResult> {
    const data = await keHoachRepository.findSemesterReportData(
      query.keHoachHocKyId,
    );

    if (!data) {
      throw new AppError(
        "Khong tim thay ke hoach hoc ky",
        HTTP_STATUS.NOT_FOUND,
      );
    }

    const report = buildSemesterReport(data);
    const rows = report.rows.filter((row) => row.lopId === query.lopId);
    const classCode = rows[0]?.maLop ?? String(query.lopId);

    return {
      fileName: buildReportFileName(report, `bao-cao-lop-${classCode}`),
      buffer: await buildSemesterReportWorkbook(report, rows),
    };
  },

  async xuatBaoCaoTheoGiangVien(
    query: BaoCaoTheoGiangVienQuery,
  ): Promise<ExcelExportResult> {
    const data = await keHoachRepository.findSemesterReportData(
      query.keHoachHocKyId,
    );

    if (!data) {
      throw new AppError(
        "Khong tim thay ke hoach hoc ky",
        HTTP_STATUS.NOT_FOUND,
      );
    }

    const report = buildSemesterReport(data);
    const rows = report.rows.filter(
      (row) => row.giangVienId === query.giangVienId,
    );
    const teacherCode = rows[0]?.maGiangVien || String(query.giangVienId);

    return {
      fileName: buildReportFileName(
        report,
        `bao-cao-giang-vien-${teacherCode}`,
      ),
      buffer: await buildSemesterReportWorkbook(report, rows),
    };
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
