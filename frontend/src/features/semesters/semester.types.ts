export type SemesterDto = {
  hocKyId: number;
  maHocKy: string;
  tenHocKy: string;
  ngayBatDau?: string | null;
  ngayKetThuc?: string | null;
  trangThai?: string | null;
};

export type Semester = {
  id: number;
  code: string;
  name: string;
  startDate: string | null;
  endDate: string | null;
  status: string | null;
};

export type SemesterFormValues = {
  code: string;
  name: string;
  startDate: string;
  endDate: string;
  status: string;
};

export type CreateSemesterPayload = {
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
