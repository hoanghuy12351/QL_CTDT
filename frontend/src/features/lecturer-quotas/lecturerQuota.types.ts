export type LecturerQuotaType =
  | "giang_vien_thuong"
  | "truong_bo_mon"
  | "pho_truong_bo_mon"
  | "tro_giang";

export type LecturerQuota = {
  dinhMucId: number;
  giangVienId: number;
  namHocId: number;
  loaiDinhMuc: LecturerQuotaType;
  tyLeDinhMuc: number;
  gioTieuChuan: number;
  gioMienGiam: number;
  gioPhaiDay: number;
  ghiChu?: string | null;
  giangVien?: {
    maGiangVien?: string | null;
    hoTen?: string | null;
    chucVu?: string | null;
    boMon?: {
      maBoMon?: string | null;
      tenBoMon?: string | null;
    } | null;
  } | null;
  namHoc?: {
    maNamHoc?: string | null;
  } | null;
};

export type LecturerQuotaFormValues = {
  giangVienId: number;
  namHocId: number;
  loaiDinhMuc: LecturerQuotaType;
  gioTieuChuan: number;
  ghiChu?: string | null;
};

export type LecturerQuotaGenerateValues = {
  namHocId: number;
  gioTieuChuanMacDinh: number;
  boMonId?: number;
};

export const lecturerQuotaTypeLabels: Record<LecturerQuotaType, string> = {
  giang_vien_thuong: "Giảng viên thường",
  truong_bo_mon: "Trưởng bộ môn",
  pho_truong_bo_mon: "Phó trưởng bộ môn",
  tro_giang: "Trợ giảng",
};

export const lecturerQuotaTypeRates: Record<LecturerQuotaType, number> = {
  giang_vien_thuong: 100,
  truong_bo_mon: 80,
  pho_truong_bo_mon: 85,
  tro_giang: 70,
};
