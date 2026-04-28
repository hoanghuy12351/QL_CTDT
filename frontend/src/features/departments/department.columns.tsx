export type DepartmentColumnKey =
  | "index"
  | "code"
  | "name"
  | "facultyName"
  | "createdAt";

export type DepartmentColumn = {
  key: DepartmentColumnKey;
  label: string;
  className?: string;
};

export const departmentColumns: DepartmentColumn[] = [
  {
    key: "index",
    label: "STT",
    className: "w-20",
  },
  {
    key: "code",
    label: "Mã bộ môn",
    className: "w-44",
  },
  {
    key: "name",
    label: "Tên bộ môn",
  },
  {
    key: "facultyName",
    label: "Khoa",
    className: "w-64",
  },
  {
    key: "createdAt",
    label: "Ngày tạo",
    className: "w-44",
  },
];
