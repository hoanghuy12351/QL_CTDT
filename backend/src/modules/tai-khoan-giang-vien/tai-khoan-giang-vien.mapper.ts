type LecturerAccountRecord = {
  giangVienId: number;
  maGiangVien: string | null;
  hoTen: string;
  email: string | null;
  soDienThoai: string | null;
  hocVi: string | null;
  chucDanh: string | null;
  trangThai: string | null;
  boMon?: {
    boMonId: number;
    maBoMon: string | null;
    tenBoMon: string;
  } | null;
  nguoiDung?: {
    nguoiDungId: number;
    email: string;
    hoTen: string;
    vaiTro: string;
    trangThai: string;
    ngayTao: Date | null;
    ngayCapNhat: Date | null;
  } | null;
};

export const mapLecturerAccount = (lecturer: LecturerAccountRecord) => ({
  id: lecturer.giangVienId,
  giangVienId: lecturer.giangVienId,
  maGiangVien: lecturer.maGiangVien,
  hoTen: lecturer.hoTen,
  email: lecturer.email,
  soDienThoai: lecturer.soDienThoai,
  hocVi: lecturer.hocVi,
  chucDanh: lecturer.chucDanh,
  trangThaiGiangVien: lecturer.trangThai,
  boMon: lecturer.boMon
    ? {
        id: lecturer.boMon.boMonId,
        maBoMon: lecturer.boMon.maBoMon,
        tenBoMon: lecturer.boMon.tenBoMon,
      }
    : null,
  taiKhoan: lecturer.nguoiDung
    ? {
        id: lecturer.nguoiDung.nguoiDungId,
        email: lecturer.nguoiDung.email,
        hoTen: lecturer.nguoiDung.hoTen,
        vaiTro: lecturer.nguoiDung.vaiTro,
        trangThai: lecturer.nguoiDung.trangThai,
        ngayTao: lecturer.nguoiDung.ngayTao,
        ngayCapNhat: lecturer.nguoiDung.ngayCapNhat,
      }
    : null,
});

export const mapAvailableLecturer = (lecturer: LecturerAccountRecord) => ({
  giangVienId: lecturer.giangVienId,
  maGiangVien: lecturer.maGiangVien,
  hoTen: lecturer.hoTen,
  email: lecturer.email,
  boMon: lecturer.boMon
    ? {
        id: lecturer.boMon.boMonId,
        maBoMon: lecturer.boMon.maBoMon,
        tenBoMon: lecturer.boMon.tenBoMon,
      }
    : null,
});
