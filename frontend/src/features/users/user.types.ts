import type { PaginationMeta } from "../../types/api.types";

export type UserRole = "quan_tri" | "giang_vien";
export type UserStatus = "hoat_dong" | "tam_khoa" | "bi_khoa";

export type UserAccountDto = {
  nguoiDungId: number;
  email: string;
  hoTen: string;
  vaiTro: UserRole;
  trangThai: UserStatus;
  ngayTao?: string | null;
  ngayCapNhat?: string | null;
  giangVien?: Array<{
    giangVienId: number;
    maGiangVien?: string | null;
    hoTen: string;
    boMon?: {
      tenBoMon?: string | null;
    } | null;
  }>;
};

export type UserListResult = {
  items: UserAccountDto[];
  pagination: PaginationMeta;
};

export type UserFormValues = {
  email: string;
  password: string;
  hoTen: string;
  vaiTro: UserRole;
  trangThai: UserStatus;
  giangVienId: string;
};
