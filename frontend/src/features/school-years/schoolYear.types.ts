export type SchoolYearDto = {
  namHocId: number;
  maNamHoc: string;
  ngayBatDau?: string | null;
  ngayKetThuc?: string | null;
  trangThai?: string | null;
  ngayTao?: string | null;
};

export type SchoolYear = {
  id: number;
  code: string;
  startDate: string | null;
  endDate: string | null;
  status: string | null;
  createdAt: string | null;
};

export type SchoolYearFormValues = {
  code: string;
  startDate: string;
  endDate: string;
  status: string;
};

export type CreateSchoolYearPayload = {
  maNamHoc: string;
  ngayBatDau?: string;
  ngayKetThuc?: string;
  trangThai?: "du_thao" | "dang_ap_dung" | "da_dong";
};

export type UpdateSchoolYearPayload = Partial<CreateSchoolYearPayload>;

export type SchoolYearListParams = {
  page: number;
  limit: number;
  keyword?: string;
};
