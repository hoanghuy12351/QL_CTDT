export type AccountStatus = "hoat_dong" | "tam_khoa" | "bi_khoa";

export type LecturerAccount = {
  id: number;
  giangVienId: number;
  maGiangVien: string | null;
  hoTen: string;
  email: string | null;
  soDienThoai: string | null;
  hocVi: string | null;
  chucDanh: string | null;
  trangThaiGiangVien: string | null;
  boMon: {
    id: number;
    maBoMon: string | null;
    tenBoMon: string;
  } | null;
  taiKhoan: {
    id: number;
    email: string;
    hoTen: string;
    vaiTro: "giang_vien" | string;
    trangThai: AccountStatus;
    ngayTao: string | null;
    ngayCapNhat: string | null;
  } | null;
};

export type AvailableLecturerOption = {
  giangVienId: number;
  maGiangVien: string | null;
  hoTen: string;
  email: string | null;
  boMon: {
    id: number;
    maBoMon: string | null;
    tenBoMon: string;
  } | null;
};

export type LecturerAccountFormValues = {
  giangVienId: number;
  email: string;
  password?: string;
  trangThai: AccountStatus;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};

export type LecturerAccountListResult = {
  items: LecturerAccount[];
  pagination: PaginationMeta;
};
