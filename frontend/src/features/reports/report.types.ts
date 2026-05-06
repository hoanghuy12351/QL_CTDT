export type ReportWeek = {
  tuanId: number;
  soTuan: number;
  tenTuan: string;
  ngayBatDau?: string | null;
  ngayKetThuc?: string | null;
};

export type SemesterReportRow = {
  rowId: string;
  stt: number;
  phanCongId?: number | null;
  giangVienId?: number | null;
  maGiangVien: string;
  tenGiangVien: string;
  lopId: number;
  maLop: string;
  tenLop: string;
  siSo: number;
  hocPhanId: number;
  maHocPhan: string;
  tenHocPhan: string;
  soTinChi: number;
  tongSoTietHocPhan: number;
  nhomHocPhanId?: number | null;
  maNhom: string;
  tenNhom: string;
  loaiNhom: string;
  vaiTro: string;
  soTietPhanCong: number;
  heSoLop: number;
  soTietQuyDoi: number;
  trangThai: string;
  phongHoc: string;
  ghiChu: string;
  weeklyPeriods: Record<string, number>;
};

export type SemesterReportSummary = {
  totalRows: number;
  totalClasses: number;
  totalLecturers: number;
  totalSubjects: number;
  totalAssignedPeriods: number;
  totalConvertedPeriods: number;
};

export type SemesterReport = {
  meta: {
    keHoachHocKyId: number;
    tenKeHoachHocKy: string;
    maKeHoach: string;
    tenKeHoach: string;
    maNamHoc: string;
    tenHocKy: string;
    tenKhoa: string;
    generatedAt: string;
  };
  summary: SemesterReportSummary;
  weeks: ReportWeek[];
  rows: SemesterReportRow[];
};

export type ReportDownload = {
  blob: Blob;
  fileName: string;
};
