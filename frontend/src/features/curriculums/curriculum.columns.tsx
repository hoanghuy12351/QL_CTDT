import type {
  ClassCourseStatus,
  CurriculumCourseProgress,
  CurriculumStatus,
} from "./curriculum.types";

export const curriculumStatusLabels: Record<CurriculumStatus, string> = {
  du_thao: "Dự thảo",
  dang_ap_dung: "Đang áp dụng",
  luu_tru: "Lưu trữ",
};

export const curriculumStatusClassNames: Record<CurriculumStatus, string> = {
  du_thao: "bg-amber-50 text-amber-700 ring-amber-100",
  dang_ap_dung: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  luu_tru: "bg-slate-100 text-slate-700 ring-slate-200",
};

export const progressLabels: Record<CurriculumCourseProgress, string> = {
  tien_do_1: "Tiến độ 1",
  tien_do_2: "Tiến độ 2",
  ca_ky: "Cả kỳ",
};

export const classCourseStatusLabels: Record<ClassCourseStatus, string> = {
  chua_hoc: "Chưa học",
  da_len_ke_hoach: "Đã lên kế hoạch",
  dang_hoc: "Đang học",
  da_hoc: "Đã học",
  tam_hoan: "Tạm hoãn",
  da_huy: "Đã hủy",
};

export const classCourseStatusClassNames: Record<ClassCourseStatus, string> = {
  chua_hoc: "bg-slate-100 text-slate-700 ring-slate-200",
  da_len_ke_hoach: "bg-sky-50 text-sky-700 ring-sky-100",
  dang_hoc: "bg-amber-50 text-amber-700 ring-amber-100",
  da_hoc: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  tam_hoan: "bg-orange-50 text-orange-700 ring-orange-100",
  da_huy: "bg-red-50 text-red-700 ring-red-100",
};

export const curriculumColumns = [
  { key: "index", label: "#" },
  { key: "code", label: "Mã CTĐT" },
  { key: "name", label: "Tên chương trình" },
  { key: "major", label: "Ngành" },
  { key: "cohort", label: "Khóa học" },
  { key: "credits", label: "Tín chỉ" },
  { key: "status", label: "Trạng thái" },
];

export const curriculumCourseColumns = [
  { key: "semester", label: "Học kỳ" },
  { key: "course", label: "Học phần" },
  { key: "credits", label: "TC" },
  { key: "progress", label: "Tiến độ" },
  { key: "required", label: "Loại" },
  { key: "actions", label: "Thao tác" },
];

export const assignmentColumns = [
  { key: "class", label: "Lớp" },
  { key: "appliedAt", label: "Ngày áp dụng" },
  { key: "status", label: "Trạng thái" },
  { key: "note", label: "Ghi chú" },
];

export const classProgressColumns = [
  { key: "semester", label: "Học kỳ" },
  { key: "course", label: "Học phần" },
  { key: "credits", label: "TC" },
  { key: "progress", label: "Tiến độ" },
  { key: "status", label: "Trạng thái" },
  { key: "actions", label: "Cập nhật" },
];
