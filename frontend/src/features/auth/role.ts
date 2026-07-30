export type AppRole = "quan_tri" | "giao_vu" | "giang_vien" | "sinh_vien" | string;

export const ADMIN_ROLES = ["quan_tri", "giao_vu"] as const;
export const LECTURER_ROLES = ["giang_vien"] as const;

export const roleLabels: Record<string, string> = {
  quan_tri: "Quản trị viên",
  giao_vu: "Quản trị viên",
  giang_vien: "Giảng viên",
  sinh_vien: "Sinh viên",
};

export const isAdminRole = (role?: AppRole | null) => {
  return Boolean(role && ADMIN_ROLES.includes(role as (typeof ADMIN_ROLES)[number]));
};

export const isLecturerRole = (role?: AppRole | null) => {
  return Boolean(
    role && LECTURER_ROLES.includes(role as (typeof LECTURER_ROLES)[number]),
  );
};

export const getRoleLabel = (role?: AppRole | null) => {
  if (!role) return "Người dùng";
  return roleLabels[role] ?? role;
};

export const getHomePathByRole = (role?: AppRole | null) => {
  if (isLecturerRole(role)) return "/lecturer/dashboard";
  return "/admin/dashboard";
};
