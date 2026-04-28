export type CohortColumnKey = "index" | "code" | "name" | "startYear" | "endYear";

export type CohortColumn = {
  key: CohortColumnKey;
  label: string;
  className?: string;
};

export const cohortColumns: CohortColumn[] = [
  { key: "index", label: "STT", className: "w-20" },
  { key: "code", label: "Mã khóa học", className: "w-40" },
  { key: "name", label: "Tên khóa học" },
  { key: "startYear", label: "Năm bắt đầu", className: "w-36" },
  { key: "endYear", label: "Năm kết thúc", className: "w-36" },
];
