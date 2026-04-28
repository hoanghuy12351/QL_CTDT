export type CampusColumnKey = "index" | "code" | "name" | "address";

export type CampusColumn = {
  key: CampusColumnKey;
  label: string;
  className?: string;
};

export const campusColumns: CampusColumn[] = [
  { key: "index", label: "STT", className: "w-20" },
  { key: "code", label: "Mã cơ sở", className: "w-36" },
  { key: "name", label: "Tên cơ sở", className: "w-64" },
  { key: "address", label: "Địa chỉ" },
];
