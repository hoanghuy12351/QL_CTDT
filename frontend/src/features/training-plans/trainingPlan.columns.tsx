import type { PlanProgress, SemesterPlanStatus, TrainingPlanStatus } from "./trainingPlan.types";

export const trainingPlanStatusLabels: Record<TrainingPlanStatus, string> = {
  du_thao: "Dự thảo",
  da_duyet: "Đã duyệt",
  dang_thuc_hien: "Đang thực hiện",
  da_dong: "Đã đóng",
};

export const semesterPlanStatusLabels: Record<SemesterPlanStatus, string> = {
  du_thao: "Dự thảo",
  dang_thuc_hien: "Đang thực hiện",
  da_dong: "Đã đóng",
};

export const statusClassNames: Record<TrainingPlanStatus | SemesterPlanStatus, string> = {
  du_thao: "bg-amber-50 text-amber-700 ring-amber-100",
  da_duyet: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  dang_thuc_hien: "bg-sky-50 text-sky-700 ring-sky-100",
  da_dong: "bg-slate-100 text-slate-700 ring-slate-200",
};

export const progressLabels: Record<PlanProgress, string> = {
  tien_do_1: "Tiến độ 1",
  tien_do_2: "Tiến độ 2",
  ca_ky: "Cả kỳ",
};

export const trainingPlanColumns = [
  "Mã kế hoạch",
  "Tên kế hoạch",
  "Năm học",
  "Khoa",
  "Học kỳ",
  "Trạng thái",
  "Thao tác",
];

export const openedSubjectColumns = [
  "Lớp",
  "Học phần",
  "TC",
  "Tiến độ",
  "Trạng thái",
  "Nhóm HP",
];
