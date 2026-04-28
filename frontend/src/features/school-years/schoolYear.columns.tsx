export type SchoolYearColumnKey =
  | "index"
  | "code"
  | "startDate"
  | "endDate"
  | "status"
  | "createdAt";

export type SchoolYearColumn = {
  key: SchoolYearColumnKey;
  label: string;
  className?: string;
};

export const schoolYearColumns: SchoolYearColumn[] = [
  { key: "index", label: "STT", className: "w-20" },
  { key: "code", label: "Mã năm học", className: "w-40" },
  { key: "startDate", label: "Ngày bắt đầu", className: "w-40" },
  { key: "endDate", label: "Ngày kết thúc", className: "w-40" },
  { key: "status", label: "Trạng thái", className: "w-40" },
  { key: "createdAt", label: "Ngày tạo", className: "w-40" },
];
