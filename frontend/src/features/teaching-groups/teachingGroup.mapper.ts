import type {
  OpenedClassCourse,
  OpenedClassCourseDto,
  QuickGroupFormValues,
  TeachingGroup,
  TeachingGroupDto,
  TeachingGroupFormValues,
  TeachingGroupType,
} from "./teachingGroup.types";

export const groupTypeLabels: Record<TeachingGroupType, string> = {
  ly_thuyet: "Lý thuyết",
  thuc_hanh: "Thực hành",
  do_an: "Đồ án",
  thuc_tap: "Thực tập",
  tot_nghiep: "Tốt nghiệp",
};

export function mapOpenedClassCourse(dto: OpenedClassCourseDto): OpenedClassCourse {
  return {
    id: dto.keHoachLopHocPhanId,
    semesterPlanId: dto.keHoachHocKyId,
    classId: dto.lopId,
    classCode: dto.lop?.maLop ?? "",
    className: dto.lop?.tenLop ?? "-",
    courseId: dto.hocPhanId,
    courseCode: dto.hocPhan?.maHocPhan ?? "",
    courseName: dto.hocPhan?.tenHocPhan ?? "-",
    credits: Number(dto.hocPhan?.soTinChi ?? 0),
    theoryPeriods: Number(dto.hocPhan?.soTietLyThuyet ?? 0),
    practicePeriods: Number(dto.hocPhan?.soTietThucHanh ?? 0),
    totalPeriods: Number(dto.hocPhan?.tongSoTiet ?? 0),
    classSize: Number(dto.siSo || dto.lop?.siSo || 0),
    groupCount: dto.nhomHocPhan?.length ?? 0,
  };
}

export function mapTeachingGroup(dto: TeachingGroupDto): TeachingGroup {
  const classCourse = dto.keHoachLopHocPhan;

  return {
    id: dto.nhomHocPhanId,
    classCoursePlanId: dto.keHoachLopHocPhanId,
    code: dto.maNhom,
    name: dto.tenNhom ?? dto.maNhom,
    type: dto.loaiNhom,
    typeLabel: groupTypeLabels[dto.loaiNhom] ?? dto.loaiNhom,
    classCode: classCourse?.lop?.maLop ?? "",
    className: classCourse?.lop?.tenLop ?? "-",
    courseCode: classCourse?.hocPhan?.maHocPhan ?? "",
    courseName: classCourse?.hocPhan?.tenHocPhan ?? "-",
    classSize: Number(dto.siSo ?? 0),
    periods: Number(dto.soTiet ?? 0),
    note: dto.ghiChu?.trim() ?? "",
    assignmentCount: dto._count?.phanCongGiangDay ?? 0,
  };
}

export function mapTeachingGroupForm(values: TeachingGroupFormValues) {
  return {
    maNhom: values.code.trim() || undefined,
    tenNhom: values.name.trim(),
    loaiNhom: values.type,
    siSo: Number(values.classSize),
    soTiet: Number(values.periods),
    ghiChu: values.note.trim() || null,
  };
}

export function mapTeachingGroupUpdateForm(values: TeachingGroupFormValues) {
  return {
    maNhom: values.code.trim() || undefined,
    tenNhom: values.name.trim(),
    siSo: Number(values.classSize),
    soTiet: Number(values.periods),
    ghiChu: values.note.trim() || null,
  };
}

export function mapQuickGroupForm(values: QuickGroupFormValues) {
  return {
    taoNhomLyThuyet: values.createTheoryGroup === "true",
    soNhomThucHanh: Number(values.practiceGroupCount || 0),
    siSoToiDaNhomThucHanh: Number(values.maxPracticeGroupSize || 30),
  };
}
