import type { PaginationMeta } from "../../types/api.types";
import type {
  TeachingGroup,
  TeachingGroupDto,
  TeachingGroupType,
} from "../teaching-groups/teachingGroup.types";

export type AssignmentRole =
  | "chinh"
  | "tro_giang"
  | "thuc_hanh"
  | "huong_dan_do_an"
  | "huong_dan_thuc_tap";

export type AssignmentStatus =
  | "du_thao"
  | "da_phan_cong"
  | "da_xac_nhan"
  | "da_huy";

export type LecturerDto = {
  giangVienId: number;
  maGiangVien?: string | null;
  hoTen: string;
  dinhMucGio?: number | string | null;
  trangThai?: string | null;
  boMon?: {
    tenBoMon?: string | null;
  } | null;
};

export type TeachingAssignmentDto = {
  phanCongId: number;
  nhomHocPhanId: number;
  giangVienId: number;
  vaiTro?: AssignmentRole | null;
  soTietPhanCong?: number | string | null;
  heSoLop?: number | string | null;
  soTietQuyDoi?: number | string | null;
  trangThai?: AssignmentStatus | null;
  ghiChu?: string | null;
  giangVien?: LecturerDto | null;
  nhomHocPhan?: TeachingGroupDto | null;
  _count?: {
    lichDayTheoTuan?: number;
  };
};

export type TeachingAssignmentCreateResponseDto = {
  assignment: TeachingAssignmentDto;
  warnings: string[];
};

export type LecturerOption = {
  id: number;
  code: string;
  name: string;
  departmentName: string;
  quota: number;
  status: string;
};

export type TeachingAssignment = {
  id: number;
  groupId: number;
  lecturerId: number;
  lecturerCode: string;
  lecturerName: string;
  departmentName: string;
  role: AssignmentRole;
  roleLabel: string;
  assignedPeriods: number;
  classCoefficient: number;
  convertedPeriods: number;
  status: AssignmentStatus;
  statusLabel: string;
  note: string;
  weeklyScheduleCount: number;
  group?: TeachingGroup;
};

export type TeachingAssignmentFormValues = {
  lecturerId: string;
  role: AssignmentRole;
  assignedPeriods: string;
  classCoefficient: string;
  status: AssignmentStatus;
  note: string;
};

export type TeachingAssignmentRow = {
  rowId: string;
  group: TeachingGroup;
  assignment?: TeachingAssignment;
  isAssigned: boolean;
};

export type TeachingAssignmentListResult = {
  items: TeachingAssignment[];
  pagination: PaginationMeta;
};

export type WorkloadStatus =
  | "chua_phan_cong"
  | "chua_dinh_muc"
  | "thieu_gio"
  | "du_gio"
  | "thua_gio";

export type LecturerWorkload = {
  lecturerId: number;
  lecturerCode: string;
  lecturerName: string;
  departmentName: string;
  theoryGroupCount: number;
  practiceGroupCount: number;
  projectGroupCount: number;
  internshipGroupCount: number;
  totalGroupCount: number;
  totalPeriods: number;
  totalStandardHours: number;
  yearlyQuota: number;
  semesterQuota: number;
  excessHours: number;
  shortageHours: number;
  quota: number;
  status: WorkloadStatus;
  statusLabel: string;
};

export type TeachingAssignmentStats = {
  totalGroups: number;
  assignedGroups: number;
  unassignedGroups: number;
  totalAssignments: number;
  totalPeriods: number;
  totalStandardHours: number;
  lecturerCount: number;
};
export type TrainingWeekDto = {
  tuanId: number;
  keHoachId: number;
  soTuan: number;
  tenTuan?: string | null;
  ngayBatDau?: string | null;
  ngayKetThuc?: string | null;
  loaiTuan?: string | null;
  ghiChu?: string | null;
};

export type ClassroomOption = {
  id: number;
  code: string;
  name: string;
  campusName: string;
  capacity: number;
  type: string;
};

export type WeeklyScheduleDto = {
  lichTuanId: number;
  phanCongId: number;
  tuanId: number;
  phongHocId?: number | null;
  soTiet?: number | string | null;
  noiDungGiangDay?: string | null;
  ghiChu?: string | null;
  tuanDaoTao?: TrainingWeekDto | null;
  phongHoc?: {
    phongHocId: number;
    maPhong?: string | null;
    tenPhong?: string | null;
  } | null;
};

export type AssignmentWeeklyScheduleDetailDto = {
  phanCong: TeachingAssignmentDto;
  tuanDaoTao: TrainingWeekDto[];
  lichDaPhanBo: WeeklyScheduleDto[];
};

export type WeeklyScheduleFormRow = {
  tuanId: number;
  weekNumber: number;
  weekName: string;
  dateRange: string;
  phongHocId: string;
  soTiet: string;
  noiDungGiangDay: string;
  ghiChu: string;
};

export type WeeklyScheduleSaveValues = {
  phanCongId: number;
  lich: Array<{
    tuanId: number;
    phongHocId?: number;
    soTiet: number;
    noiDungGiangDay?: string;
    ghiChu?: string;
  }>;
};
export type AssignmentStatusFilter = "all" | "assigned" | "unassigned";
export type AssignmentGroupTypeFilter = TeachingGroupType | "";
export type AssignmentViewMode = "list" | "workload";
