import type { PaginationMeta } from "../../types/api.types";

export type CurriculumStatus = "du_thao" | "dang_ap_dung" | "luu_tru";
export type CurriculumCourseProgress = "tien_do_1" | "tien_do_2" | "ca_ky";
export type ClassCourseStatus =
  | "chua_hoc"
  | "da_len_ke_hoach"
  | "dang_hoc"
  | "da_hoc"
  | "tam_hoan"
  | "da_huy";

export type CurriculumRelationDto = {
  nganhId?: number;
  maNganh?: string;
  tenNganh?: string;
  boMonId?: number;
  maBoMon?: string;
  tenBoMon?: string;
  chuyenNganhId?: number;
  maChuyenNganh?: string;
  tenChuyenNganh?: string;
  khoaHocId?: number;
  maKhoaHoc?: string;
  tenKhoaHoc?: string;
  lopId?: number;
  maLop?: string;
  tenLop?: string;
  hocPhanId?: number;
  maHocPhan?: string;
  tenHocPhan?: string;
  soTinChi?: number;
  soTietLyThuyet?: number;
  soTietThucHanh?: number;
  tongSoTiet?: number;
  loaiHocPhan?: string;
};

export type CurriculumDto = {
  chuongTrinhId: number;
  maChuongTrinh: string;
  tenChuongTrinh: string;
  nganhId: number;
  boMonId?: number | null;
  chuyenNganhId?: number | null;
  khoaHocId?: number | null;
  tongTinChi?: number | null;
  trinhDoDaoTao?: string | null;
  hinhThucDaoTao?: string | null;
  trangThai?: CurriculumStatus | null;
  moTa?: string | null;
  ngayTao?: string | null;
  ngayCapNhat?: string | null;
  nganh?: CurriculumRelationDto | null;
  boMon?: CurriculumRelationDto | null;
  chuyenNganh?: CurriculumRelationDto | null;
  khoaHoc?: CurriculumRelationDto | null;
  _count?: {
    chuongTrinhHocPhan?: number;
    lopChuongTrinh?: number;
  };
};

export type CurriculumCourseDto = {
  chuongTrinhHocPhanId: number;
  chuongTrinhId: number;
  hocPhanId: number;
  hocKyDuKien: number;
  batBuoc?: boolean | null;
  thuTu?: number | null;
  ghiChu?: string | null;
  hocPhan?: CurriculumRelationDto | null;
};

export type CurriculumAssignmentDto = {
  lopChuongTrinhId: number;
  lopId: number;
  chuongTrinhId: number;
  ngayApDung?: string | null;
  trangThai?: "dang_ap_dung" | "ngung_ap_dung" | null;
  ghiChu?: string | null;
  lop?: CurriculumRelationDto | null;
};

export type ClassProgressDto = {
  tienDoId: number;
  lopId: number;
  chuongTrinhHocPhanId: number;
  hocKyDuKien: number;
  tienDoDuKien?: CurriculumCourseProgress | null;
  trangThai?: ClassCourseStatus | null;
  ghiChu?: string | null;
  chuongTrinhHocPhan?: CurriculumCourseDto | null;
};

export type Curriculum = {
  id: number;
  code: string;
  name: string;
  majorId: number;
  departmentId?: number | null;
  specializationId?: number | null;
  cohortId?: number | null;
  totalCredits: number;
  educationLevel: string;
  trainingType: string;
  status: CurriculumStatus;
  description: string;
  majorName: string;
  departmentName: string;
  specializationName: string;
  cohortName: string;
  courseCount: number;
  classCount: number;
  updatedAt?: string | null;
};

export type CurriculumCourse = {
  id: number;
  curriculumId: number;
  courseId: number;
  semester: number;
  required: boolean;
  order: number;
  note: string;
  courseCode: string;
  courseName: string;
  credits: number;
  theoryHours: number;
  practiceHours: number;
  totalHours: number;
  courseType: string;
};

export type CurriculumAssignment = {
  id: number;
  classId: number;
  curriculumId: number;
  classCode: string;
  className: string;
  appliedAt?: string | null;
  status: string;
  note: string;
};

export type ClassProgress = {
  id: number;
  classId: number;
  courseEntryId: number;
  courseCode: string;
  courseName: string;
  credits: number;
  semester: number;
  progress: CurriculumCourseProgress;
  status: ClassCourseStatus;
  note: string;
};

export type CurriculumListParams = {
  page: number;
  limit: number;
  keyword?: string;
};

export type CurriculumListResult = {
  items: Curriculum[];
  pagination: PaginationMeta;
};

export type CurriculumFormValues = {
  code: string;
  name: string;
  majorId: string;
  departmentId: string;
  specializationId: string;
  cohortId: string;
  totalCredits: string;
  educationLevel: string;
  trainingType: string;
  status: CurriculumStatus;
  description: string;
};

export type CurriculumCourseFormValues = {
  courseId: string;
  semester: string;
  required: string;
  order: string;
  note: string;
};

export type AssignCurriculumFormValues = {
  classIds: string[];
  appliedAt: string;
  note: string;
};

export type CurriculumPayload = {
  maChuongTrinh: string;
  tenChuongTrinh: string;
  nganhId: number;
  boMonId?: number | null;
  chuyenNganhId?: number | null;
  khoaHocId?: number | null;
  tongTinChi?: number | null;
  trinhDoDaoTao?: string | null;
  hinhThucDaoTao?: string | null;
  trangThai?: CurriculumStatus;
  moTa?: string | null;
};

export type CurriculumCoursePayload = {
  hocPhanId: number;
  hocKyDuKien: number;
  batBuoc?: boolean;
  thuTu?: number;
  ghiChu?: string | null;
};

export type AssignCurriculumPayload = {
  lopIds: number[];
  ngayApDung?: string | null;
  ghiChu?: string | null;
};
