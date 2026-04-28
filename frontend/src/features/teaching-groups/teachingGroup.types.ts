import type { PaginationMeta } from "../../types/api.types";

export type TeachingGroupType = "ly_thuyet" | "thuc_hanh" | "do_an" | "thuc_tap" | "tot_nghiep";

export type OpenedClassCourseDto = {
  keHoachLopHocPhanId: number;
  keHoachHocKyId: number;
  lopId: number;
  hocPhanId: number;
  siSo?: number | null;
  lop?: {
    maLop?: string;
    tenLop?: string;
    siSo?: number | null;
  } | null;
  hocPhan?: {
    maHocPhan?: string;
    tenHocPhan?: string;
    soTinChi?: number;
    soTietLyThuyet?: number;
    soTietThucHanh?: number;
    tongSoTiet?: number;
  } | null;
  nhomHocPhan?: unknown[];
};

export type TeachingGroupDto = {
  nhomHocPhanId: number;
  keHoachLopHocPhanId: number;
  maNhom: string;
  tenNhom?: string | null;
  loaiNhom: TeachingGroupType;
  siSo?: number | null;
  soTiet?: number | null;
  ghiChu?: string | null;
  keHoachLopHocPhan?: OpenedClassCourseDto | null;
  _count?: {
    phanCongGiangDay?: number;
  };
};

export type OpenedClassCourse = {
  id: number;
  semesterPlanId: number;
  classId: number;
  classCode: string;
  className: string;
  courseId: number;
  courseCode: string;
  courseName: string;
  credits: number;
  theoryPeriods: number;
  practicePeriods: number;
  totalPeriods: number;
  classSize: number;
  groupCount: number;
};

export type TeachingGroup = {
  id: number;
  classCoursePlanId: number;
  code: string;
  name: string;
  type: TeachingGroupType;
  typeLabel: string;
  classCode: string;
  className: string;
  courseCode: string;
  courseName: string;
  classSize: number;
  periods: number;
  note: string;
  assignmentCount: number;
};

export type TeachingGroupFormValues = {
  code: string;
  name: string;
  type: TeachingGroupType;
  classSize: string;
  periods: string;
  note: string;
};

export type QuickGroupFormValues = {
  createTheoryGroup: string;
  practiceGroupCount: string;
  maxPracticeGroupSize: string;
};

export type TeachingGroupListResult = {
  items: TeachingGroup[];
  pagination: PaginationMeta;
};
