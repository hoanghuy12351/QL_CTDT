export type SemesterDto = {
  hocKyId: number;
  namHocId: number;
  maHocKy: string;
  tenHocKy: string;
  ngayBatDau?: string | null;
  ngayKetThuc?: string | null;
  trangThai?: string | null;
  namHoc?: {
    namHocId: number;
    maNamHoc: string;
  } | null;
};

export type Semester = {
  id: number;
  schoolYearId: number;
  code: string;
  name: string;
  schoolYearCode: string;
  startDate: string | null;
  endDate: string | null;
  status: string | null;
};

export type SemesterFormValues = {
  schoolYearId: string;
  code: string;
  name: string;
  startDate: string;
  endDate: string;
  status: string;
};

export type CreateSemesterPayload = {
  namHocId: number;
  maHocKy: string;
  tenHocKy: string;
  ngayBatDau?: string;
  ngayKetThuc?: string;
  trangThai?: "du_thao" | "dang_ap_dung" | "da_dong";
};

export type UpdateSemesterPayload = Partial<CreateSemesterPayload>;

export type SemesterListParams = {
  page: number;
  limit: number;
  keyword?: string;
};
