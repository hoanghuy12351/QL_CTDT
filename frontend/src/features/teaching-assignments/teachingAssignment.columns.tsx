import type {
  AssignmentStatus,
  WorkloadStatus,
} from "./teachingAssignment.types";

export const teachingAssignmentColumns = [
  "Nhóm học phần",
  "Lớp",
  "Học phần",
  "Giảng viên",
  "Vai trò",
  "Số tiết",
  "Trạng thái",
  "Thao tác",
];

export const workloadColumns = [
  "Giảng viên",
  "Bộ môn",
  "LT",
  "TH",
  "Đồ án",
  "Thực tập",
  "Tổng nhóm",
  "Tổng tiết",
  "Định mức",
  "Trạng thái",
];

export const assignmentStatusClassNames: Record<AssignmentStatus, string> = {
  du_thao: "bg-slate-100 text-slate-700 ring-slate-200",
  da_phan_cong: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  da_xac_nhan: "bg-sky-50 text-sky-700 ring-sky-100",
  da_huy: "bg-red-50 text-red-700 ring-red-100",
};

export const workloadStatusClassNames: Record<WorkloadStatus, string> = {
  chua_phan_cong: "bg-slate-100 text-slate-700 ring-slate-200",
  binh_thuong: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  cao: "bg-amber-50 text-amber-700 ring-amber-100",
  qua_tai: "bg-red-50 text-red-700 ring-red-100",
};
