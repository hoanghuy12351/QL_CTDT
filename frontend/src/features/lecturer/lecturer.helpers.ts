import type { LecturerAssignmentDto, WeeklyScheduleDto } from "./lecturer.types";

export const assignmentRoleLabels: Record<string, string> = {
  chinh: "Phụ trách chính",
  tro_giang: "Trợ giảng",
  thuc_hanh: "Thực hành",
  huong_dan_do_an: "Hướng dẫn đồ án",
  huong_dan_thuc_tap: "Hướng dẫn thực tập",
};

export const assignmentStatusLabels: Record<string, string> = {
  du_thao: "Dự thảo",
  da_phan_cong: "Đã phân công",
  da_xac_nhan: "Đã xác nhận",
  da_huy: "Đã hủy",
};

export const groupTypeLabels: Record<string, string> = {
  ly_thuyet: "Lý thuyết",
  thuc_hanh: "Thực hành",
  do_an: "Đồ án",
  thuc_tap: "Thực tập",
  tot_nghiep: "Tốt nghiệp",
};

export const toNumber = (value: unknown, fallback = 0) => {
  const parsed = Number(value ?? fallback);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const formatNumber = (value: unknown) => {
  return new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 1 }).format(
    toNumber(value),
  );
};

export const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("vi-VN").format(date);
};

export const formatWeekRange = (schedule: WeeklyScheduleDto) => {
  const week = schedule.tuanDaoTao;
  const weekName = week?.tenTuan || (week?.soTuan ? `Tuần ${week.soTuan}` : "Tuần học");
  return `${weekName} · ${formatDate(week?.ngayBatDau)} - ${formatDate(
    week?.ngayKetThuc,
  )}`;
};

export const getCourseName = (assignment?: LecturerAssignmentDto | null) => {
  const course = assignment?.nhomHocPhan?.keHoachLopHocPhan?.hocPhan;
  if (!course) return "-";
  return `${course.maHocPhan ?? ""} - ${course.tenHocPhan ?? ""}`.trim();
};

export const getClassName = (assignment?: LecturerAssignmentDto | null) => {
  const classroom = assignment?.nhomHocPhan?.keHoachLopHocPhan?.lop;
  if (!classroom) return "-";
  return `${classroom.maLop ?? ""} - ${classroom.tenLop ?? ""}`.trim();
};

export const getSemesterPlanName = (assignment?: LecturerAssignmentDto | null) => {
  const semesterPlan = assignment?.nhomHocPhan?.keHoachLopHocPhan?.keHoachHocKy;
  const semester = semesterPlan?.hocKy?.tenHocKy;
  const schoolYear = semesterPlan?.keHoachDaoTao?.namHoc?.maNamHoc;
  return [semesterPlan?.tenKeHoach, semester, schoolYear]
    .filter(Boolean)
    .join(" · ") || "-";
};

export const getGroupName = (assignment?: LecturerAssignmentDto | null) => {
  const group = assignment?.nhomHocPhan;
  if (!group) return "-";
  const groupType = group.loaiNhom ? groupTypeLabels[group.loaiNhom] ?? group.loaiNhom : "";
  return [group.maNhom, group.tenNhom, groupType].filter(Boolean).join(" · ");
};

export const getRoomName = (schedule: WeeklyScheduleDto) => {
  const room = schedule.phongHoc;
  if (!room) return "-";
  return [room.maPhong, room.tenPhong].filter(Boolean).join(" - ") || "-";
};
