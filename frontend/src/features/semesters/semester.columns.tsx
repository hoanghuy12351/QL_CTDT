export type SemesterColumnKey =
  | "index"
  | "code"
  | "name"
  | "schoolYearCode"
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
  { key: "name", label: "Tên học kỳ", className: "w-40" },
  { key: "schoolYearCode", label: "Năm học", className: "w-40" },
  { key: "startDate", label: "Ngày bắt đầu", className: "w-40" },
  { key: "endDate", label: "Ngày kết thúc", className: "w-40" },
  { key: "status", label: "Trạng thái", className: "w-40" },
];
