export type ClassroomColumnKey =
  | "index"
  | "code"
  | "name"
  | "campusName"
  | "roomType"
  | "capacity";

export type ClassroomColumn = {
  key: ClassroomColumnKey;
  label: string;
  className?: string;
};

export const classroomColumns: ClassroomColumn[] = [
  { key: "index", label: "STT", className: "w-20" },
  { key: "code", label: "Mã phòng", className: "w-36" },
  { key: "name", label: "Tên phòng", className: "w-48" },
  { key: "campusName", label: "Cơ sở", className: "w-48" },
  { key: "roomType", label: "Loại phòng", className: "w-40" },
  { key: "capacity", label: "Sức chứa", className: "w-32" },
];
