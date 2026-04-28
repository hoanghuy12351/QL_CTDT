export type DepartmentDto = {
  boMonId: number;
  khoaId: number;
  maBoMon: string;
  tenBoMon: string;
  ngayTao?: string | null;
  khoa?: {
    khoaId: number;
    maKhoa: string;
    tenKhoa: string;
  } | null;
};

export type Department = {
  id: number;
  facultyId: number;
  code: string;
  name: string;
  facultyName: string;
  createdAt: string | null;
};

export type DepartmentFormValues = {
  facultyId: string;
  code: string;
  name: string;
};

export type CreateDepartmentPayload = {
  khoaId: number;
  maBoMon: string;
  tenBoMon: string;
};

export type UpdateDepartmentPayload = Partial<CreateDepartmentPayload>;

export type DepartmentListParams = {
  page: number;
  limit: number;
  keyword?: string;
};
