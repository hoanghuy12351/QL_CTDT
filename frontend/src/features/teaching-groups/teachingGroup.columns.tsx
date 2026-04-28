import type { TeachingGroupType } from "./teachingGroup.types";

export const groupTypeClassNames: Record<TeachingGroupType, string> = {
  ly_thuyet: "bg-sky-50 text-sky-700 ring-sky-100",
  thuc_hanh: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  do_an: "bg-violet-50 text-violet-700 ring-violet-100",
  thuc_tap: "bg-amber-50 text-amber-700 ring-amber-100",
  tot_nghiep: "bg-slate-100 text-slate-700 ring-slate-200",
};

export const openedClassCourseColumns = [
  "Lớp",
  "Học phần",
  "TC",
  "LT",
  "TH",
  "Sĩ số",
  "Nhóm",
  "Thao tác",
];

export const teachingGroupColumns = [
  "Nhóm",
  "Loại",
  "Lớp",
  "Học phần",
  "Sĩ số",
  "Số tiết",
  "Phân công",
  "Thao tác",
];
