import type {
  AssignmentStatus,
  WorkloadStatus,
} from "./teachingAssignment.types";

export const teachingAssignmentColumns = [
  "Nhom hoc phan",
  "Lop",
  "Hoc phan",
  "Giang vien",
  "Vai tro",
  "So tiet",
  "Gio TC",
  "Trang thai",
  "Thao tac",
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
  "Giờ quy đổi HK",
  "Phải dạy HK",
  "Thừa HK",
  "Thiếu HK",
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
  chua_dinh_muc: "bg-violet-50 text-violet-700 ring-violet-100",
  thieu_gio: "bg-amber-50 text-amber-700 ring-amber-100",
  du_gio: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  thua_gio: "bg-red-50 text-red-700 ring-red-100",
};
