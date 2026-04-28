export type CohortDto = {
  khoaHocId: number;
  maKhoaHoc: string;
  tenKhoaHoc: string;
  namBatDau: number;
  namKetThuc: number;
};

export type Cohort = {
  id: number;
  code: string;
  name: string;
  startYear: number;
  endYear: number;
};

export type CohortFormValues = {
  code: string;
  name: string;
  startYear: string;
  endYear: string;
};

export type CreateCohortPayload = {
  maKhoaHoc: string;
  tenKhoaHoc: string;
  namBatDau: number;
  namKetThuc: number;
};

export type UpdateCohortPayload = Partial<CreateCohortPayload>;

export type CohortListParams = {
  page: number;
  limit: number;
  keyword?: string;
};
