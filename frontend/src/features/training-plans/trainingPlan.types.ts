import type { PaginationMeta } from "../../types/api.types";

export type TrainingPlanStatus = "du_thao" | "da_duyet" | "dang_thuc_hien" | "da_dong";
export type SemesterPlanStatus = "du_thao" | "dang_thuc_hien" | "da_dong";
export type PlanProgress = "tien_do_1" | "tien_do_2" | "ca_ky";

export type RelationDto = {
  namHocId?: number;
  maNamHoc?: string;
  khoaId?: number;
  maKhoa?: string;
  tenKhoa?: string;
  hocKyId?: number;
  maHocKy?: string;
  tenHocKy?: string;
  lopId?: number;
  maLop?: string;
  tenLop?: string;
  siSo?: number | null;
  hocPhanId?: number;
  maHocPhan?: string;
  tenHocPhan?: string;
  soTinChi?: number;
  soTietThucHanh?: number;
};

export type TrainingPlanDto = {
  keHoachId: number;
  maKeHoach: string;
  tenKeHoach: string;
  namHocId: number;
  khoaId: number;
  trangThai?: TrainingPlanStatus | null;
  ghiChu?: string | null;
  namHoc?: RelationDto | null;
  khoa?: RelationDto | null;
  keHoachHocKy?: SemesterPlanDto[];
  _count?: {
    keHoachHocKy?: number;
    tuanDaoTao?: number;
  };
};

export type SemesterPlanDto = {
  keHoachHocKyId: number;
  keHoachId: number;
  hocKyId: number;
  tenKeHoachHocKy?: string | null;
  trangThai?: SemesterPlanStatus | null;
  ghiChu?: string | null;
  hocKy?: RelationDto | null;
  keHoachDaoTao?: TrainingPlanDto | null;
  _count?: {
    keHoachLopHocPhan?: number;
  };
};

export type SuggestionDto = {
  keHoachHocKyId: number;
  lopIds: number[];
  items: Array<{
    hocPhan: RelationDto;
    rows: Array<{
      lop: RelationDto;
      chuongTrinhHocPhanId: number;
      tienDo?: PlanProgress | null;
      hocKyDuKien: number;
      trangThai?: string | null;
    }>;
  }>;
};

export type OpenedSubjectDto = {
  keHoachLopHocPhanId: number;
  keHoachHocKyId: number;
  lopId: number;
  hocPhanId: number;
  chuongTrinhHocPhanId?: number | null;
  tienDo?: PlanProgress | null;
  siSo?: number | null;
  coThucHanh?: boolean | null;
  trangThai?: string | null;
  lop?: RelationDto | null;
  hocPhan?: RelationDto | null;
  nhomHocPhan?: unknown[];
};

export type TrainingPlan = {
  id: number;
  code: string;
  name: string;
  schoolYearId: number;
  facultyId: number;
  schoolYearName: string;
  facultyName: string;
  status: TrainingPlanStatus;
  note: string;
  semesterCount: number;
};

export type SemesterPlan = {
  id: number;
  trainingPlanId: number;
  semesterId: number;
  name: string;
  semesterName: string;
  status: SemesterPlanStatus;
  note: string;
  openedCount: number;
};

export type SuggestionClass = {
  id: number;
  code: string;
  name: string;
};

export type SuggestionCourse = {
  id: number;
  code: string;
  name: string;
  credits: number;
};

export type SuggestionCell = {
  classId: number;
  courseId: number;
  curriculumCourseId: number;
  semester: number;
  progress: PlanProgress;
};

export type SuggestionMatrix = {
  classes: SuggestionClass[];
  courses: SuggestionCourse[];
  cells: SuggestionCell[];
};

export type OpenedSubject = {
  id: number;
  classId: number;
  classCode: string;
  className: string;
  courseId: number;
  courseCode: string;
  courseName: string;
  credits: number;
  progress: PlanProgress;
  status: string;
  groupCount: number;
};

export type TrainingPlanFormValues = {
  code: string;
  name: string;
  schoolYearId: string;
  facultyId: string;
  status: TrainingPlanStatus;
  note: string;
};

export type SemesterPlanFormValues = {
  trainingPlanId: string;
  semesterId: string;
  name: string;
  status: SemesterPlanStatus;
  note: string;
};

export type TrainingPlanListResult = {
  items: TrainingPlan[];
  pagination: PaginationMeta;
};
