import type { PaginationMeta } from "../../types/api.types";

export type LecturerProfileDto = {
  giangVienId: number;
  maGiangVien?: string | null;
  hoTen: string;
  email?: string | null;
  soDienThoai?: string | null;
  hocVi?: string | null;
  chucDanh?: string | null;
  dinhMucGio?: number | string | null;
  trangThai?: string | null;
  boMon?: {
    tenBoMon?: string | null;
  } | null;
};

export type LecturerAssignmentDto = {
  phanCongId: number;
  nhomHocPhanId: number;
  giangVienId: number;
  vaiTro?: string | null;
  soTietPhanCong?: number | string | null;
  heSoLop?: number | string | null;
  soTietQuyDoi?: number | string | null;
  trangThai?: string | null;
  ghiChu?: string | null;
  nhomHocPhan?: {
    maNhom?: string | null;
    tenNhom?: string | null;
    loaiNhom?: string | null;
    keHoachLopHocPhan?: {
      lop?: {
        maLop?: string | null;
        tenLop?: string | null;
      } | null;
      hocPhan?: {
        maHocPhan?: string | null;
        tenHocPhan?: string | null;
        soTinChi?: number | string | null;
        tongSoTiet?: number | string | null;
      } | null;
      keHoachHocKy?: {
        tenKeHoach?: string | null;
        hocKy?: {
          tenHocKy?: string | null;
        } | null;
        keHoachDaoTao?: {
          tenKeHoach?: string | null;
          namHoc?: {
            maNamHoc?: string | null;
          } | null;
        } | null;
      } | null;
    } | null;
  } | null;
  lichDayTheoTuan?: WeeklyScheduleDto[];
  _count?: {
    lichDayTheoTuan?: number;
  };
};

export type WeeklyScheduleDto = {
  lichTuanId: number;
  phanCongId: number;
  tuanId: number;
  phongHocId?: number | null;
  soTiet?: number | string | null;
  noiDungGiangDay?: string | null;
  ghiChu?: string | null;
  tuanDaoTao?: {
    soTuan?: number | null;
    tenTuan?: string | null;
    ngayBatDau?: string | null;
    ngayKetThuc?: string | null;
  } | null;
  phongHoc?: {
    maPhong?: string | null;
    tenPhong?: string | null;
  } | null;
  phanCongGiangDay?: LecturerAssignmentDto | null;
};

export type LecturerDashboardDto = {
  lecturer: LecturerProfileDto;
  stats: {
    activeAssignments: number;
    confirmedAssignments: number;
    totalAssignedPeriods: number;
    totalConvertedPeriods: number;
  };
  upcomingSchedules: WeeklyScheduleDto[];
};

export type LecturerAssignmentListDto = {
  lecturer: LecturerProfileDto;
  items: LecturerAssignmentDto[];
  pagination: PaginationMeta;
};

export type LecturerWeeklyScheduleListDto = {
  lecturer: LecturerProfileDto;
  items: WeeklyScheduleDto[];
};
