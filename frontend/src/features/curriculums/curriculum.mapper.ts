import type {
  AssignCurriculumFormValues,
  AssignCurriculumPayload,
  ClassProgress,
  ClassProgressDto,
  Curriculum,
  CurriculumAssignment,
  CurriculumAssignmentDto,
  CurriculumCourse,
  CurriculumCourseDto,
  CurriculumCourseFormValues,
  CurriculumCoursePayload,
  CurriculumDto,
  CurriculumFormValues,
  CurriculumPayload,
} from "./curriculum.types";

const asText = (value?: string | null) => value?.trim() ?? "";

const asOptionalNumber = (value: string) => {
  const trimmed = value.trim();
  return trimmed ? Number(trimmed) : null;
};

export function mapCurriculum(dto: CurriculumDto): Curriculum {
  return {
    id: dto.chuongTrinhId,
    code: dto.maChuongTrinh,
    name: dto.tenChuongTrinh,
    majorId: dto.nganhId,
    specializationId: dto.chuyenNganhId ?? null,
    cohortId: dto.khoaHocId ?? null,
    totalCredits: Number(dto.tongTinChi ?? 0),
    educationLevel: asText(dto.trinhDoDaoTao),
    trainingType: asText(dto.hinhThucDaoTao),
    status: dto.trangThai ?? "du_thao",
    description: asText(dto.moTa),
    majorName: dto.nganh?.tenNganh ?? "-",
    specializationName: dto.chuyenNganh?.tenChuyenNganh ?? "-",
    cohortName: dto.khoaHoc?.tenKhoaHoc ?? "-",
    courseCount: dto._count?.chuongTrinhHocPhan ?? 0,
    classCount: dto._count?.lopChuongTrinh ?? 0,
    updatedAt: dto.ngayCapNhat,
  };
}

export function mapCurriculumCourse(dto: CurriculumCourseDto): CurriculumCourse {
  return {
    id: dto.chuongTrinhHocPhanId,
    curriculumId: dto.chuongTrinhId,
    courseId: dto.hocPhanId,
    semester: dto.hocKyDuKien,
    progress: dto.tienDo ?? "ca_ky",
    required: dto.batBuoc ?? true,
    order: dto.thuTu ?? 0,
    note: asText(dto.ghiChu),
    courseCode: dto.hocPhan?.maHocPhan ?? "",
    courseName: dto.hocPhan?.tenHocPhan ?? "-",
    credits: Number(dto.hocPhan?.soTinChi ?? 0),
    courseType: dto.hocPhan?.loaiHocPhan ?? "-",
  };
}

export function mapCurriculumAssignment(
  dto: CurriculumAssignmentDto,
): CurriculumAssignment {
  return {
    id: dto.lopChuongTrinhId,
    classId: dto.lopId,
    curriculumId: dto.chuongTrinhId,
    classCode: dto.lop?.maLop ?? "",
    className: dto.lop?.tenLop ?? "-",
    appliedAt: dto.ngayApDung,
    status: dto.trangThai ?? "dang_ap_dung",
    note: asText(dto.ghiChu),
  };
}

export function mapClassProgress(dto: ClassProgressDto): ClassProgress {
  const course = dto.chuongTrinhHocPhan?.hocPhan;

  return {
    id: dto.tienDoId,
    classId: dto.lopId,
    courseEntryId: dto.chuongTrinhHocPhanId,
    courseCode: course?.maHocPhan ?? "",
    courseName: course?.tenHocPhan ?? "-",
    credits: Number(course?.soTinChi ?? 0),
    semester: dto.hocKyDuKien,
    progress: dto.tienDoDuKien ?? "ca_ky",
    status: dto.trangThai ?? "chua_hoc",
    note: asText(dto.ghiChu),
  };
}

export function mapCurriculumFormValuesToPayload(
  values: CurriculumFormValues,
): CurriculumPayload {
  return {
    maChuongTrinh: values.code.trim(),
    tenChuongTrinh: values.name.trim(),
    nganhId: Number(values.majorId),
    chuyenNganhId: asOptionalNumber(values.specializationId),
    khoaHocId: asOptionalNumber(values.cohortId),
    tongTinChi: asOptionalNumber(values.totalCredits),
    trinhDoDaoTao: values.educationLevel.trim() || null,
    hinhThucDaoTao: values.trainingType.trim() || null,
    trangThai: values.status,
    moTa: values.description.trim() || null,
  };
}

export function mapCourseFormValuesToPayload(
  values: CurriculumCourseFormValues,
): CurriculumCoursePayload {
  return {
    hocPhanId: Number(values.courseId),
    hocKyDuKien: Number(values.semester),
    tienDo: values.progress,
    batBuoc: values.required === "true",
    thuTu: values.order.trim() ? Number(values.order) : 0,
    ghiChu: values.note.trim() || null,
  };
}

export function mapAssignFormValuesToPayload(
  values: AssignCurriculumFormValues,
): AssignCurriculumPayload {
  return {
    lopId: Number(values.classId),
    ngayApDung: values.appliedAt || null,
    ghiChu: values.note.trim() || null,
  };
}
