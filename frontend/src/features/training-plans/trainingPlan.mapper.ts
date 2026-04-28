import type {
  OpenedSubject,
  OpenedSubjectDto,
  SemesterPlan,
  SemesterPlanDto,
  SemesterPlanFormValues,
  SuggestionMatrix,
  SuggestionDto,
  TrainingPlan,
  TrainingPlanDto,
  TrainingPlanFormValues,
} from "./trainingPlan.types";

const text = (value?: string | null) => value?.trim() ?? "";

export function mapTrainingPlan(dto: TrainingPlanDto): TrainingPlan {
  return {
    id: dto.keHoachId,
    code: dto.maKeHoach,
    name: dto.tenKeHoach,
    schoolYearId: dto.namHocId,
    facultyId: dto.khoaId,
    schoolYearName: dto.namHoc?.maNamHoc ?? "-",
    facultyName: dto.khoa?.tenKhoa ?? "-",
    status: dto.trangThai ?? "du_thao",
    note: text(dto.ghiChu),
    semesterCount: dto._count?.keHoachHocKy ?? dto.keHoachHocKy?.length ?? 0,
  };
}

export function mapSemesterPlan(dto: SemesterPlanDto): SemesterPlan {
  return {
    id: dto.keHoachHocKyId,
    trainingPlanId: dto.keHoachId,
    semesterId: dto.hocKyId,
    name: dto.tenKeHoachHocKy ?? dto.hocKy?.tenHocKy ?? "-",
    semesterName: dto.hocKy?.tenHocKy ?? "-",
    status: dto.trangThai ?? "du_thao",
    note: text(dto.ghiChu),
    openedCount: dto._count?.keHoachLopHocPhan ?? 0,
  };
}

export function mapSuggestion(dto: SuggestionDto): SuggestionMatrix {
  const classMap = new Map<number, SuggestionMatrix["classes"][number]>();
  const courses = dto.items.map((item) => ({
    id: Number(item.hocPhan.hocPhanId),
    code: item.hocPhan.maHocPhan ?? "",
    name: item.hocPhan.tenHocPhan ?? "-",
    credits: Number(item.hocPhan.soTinChi ?? 0),
  }));
  const cells: SuggestionMatrix["cells"] = [];

  dto.items.forEach((item) => {
    item.rows.forEach((row) => {
      const classId = Number(row.lop.lopId);
      classMap.set(classId, {
        id: classId,
        code: row.lop.maLop ?? "",
        name: row.lop.tenLop ?? "-",
      });
      cells.push({
        classId,
        courseId: Number(item.hocPhan.hocPhanId),
        curriculumCourseId: row.chuongTrinhHocPhanId,
        semester: row.hocKyDuKien,
        progress: row.tienDo ?? "ca_ky",
      });
    });
  });

  return {
    classes: Array.from(classMap.values()),
    courses,
    cells,
  };
}

export function mapOpenedSubject(dto: OpenedSubjectDto): OpenedSubject {
  return {
    id: dto.keHoachLopHocPhanId,
    classId: dto.lopId,
    classCode: dto.lop?.maLop ?? "",
    className: dto.lop?.tenLop ?? "-",
    courseId: dto.hocPhanId,
    courseCode: dto.hocPhan?.maHocPhan ?? "",
    courseName: dto.hocPhan?.tenHocPhan ?? "-",
    credits: Number(dto.hocPhan?.soTinChi ?? 0),
    progress: dto.tienDo ?? "ca_ky",
    status: dto.trangThai ?? "du_thao",
    groupCount: dto.nhomHocPhan?.length ?? 0,
  };
}

export function mapTrainingPlanForm(values: TrainingPlanFormValues) {
  return {
    maKeHoach: values.code.trim(),
    tenKeHoach: values.name.trim(),
    namHocId: Number(values.schoolYearId),
    khoaId: Number(values.facultyId),
    trangThai: values.status,
    ghiChu: values.note.trim() || null,
  };
}

export function mapSemesterPlanForm(values: SemesterPlanFormValues) {
  return {
    keHoachId: Number(values.trainingPlanId),
    hocKyId: Number(values.semesterId),
    tenKeHoachHocKy: values.name.trim(),
    trangThai: values.status,
    ghiChu: values.note.trim() || null,
  };
}
