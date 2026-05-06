export type SemesterColumnKey =
  | "index"
  | "code"
  | "name"
  | "startDate"
  | "endDate"
  | "status";

export type SemesterColumn = {
  key: SemesterColumnKey;
  label: string;
  className?: string;
};

export const semesterColumns: SemesterColumn[] = [
  { key: "index", label: "STT", className: "w-20" },
  { key: "code", label: "Mã học kỳ", className: "w-32" },
  { key: "name", label: "Tên học kỳ", className: "w-44" },
  { key: "startDate", label: "Ngày bắt đầu", className: "w-36" },
  { key: "endDate", label: "Ngày kết thúc", className: "w-36" },
  { key: "status", label: "Trạng thái", className: "w-40" },
];
