export type FacultyColumnKey = "index" | "code" | "name" | "createdAt";

export type FacultyColumn = {
  key: FacultyColumnKey;
  label: string;
  className?: string;
};

export const facultyColumns: FacultyColumn[] = [
  {
    key: "index",
    label: "STT",
    className: "w-20",
  },
  {
    key: "code",
    label: "Mã khoa",
    className: "w-40",
  },
  {
    key: "name",
    label: "Tên khoa",
  },
  {
    key: "createdAt",
    label: "Ngày tạo",
    className: "w-48",
  },
];
