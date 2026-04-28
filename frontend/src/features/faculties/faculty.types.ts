export type FacultyDto = {
  khoaId: number;
  maKhoa: string;
  tenKhoa: string;
  ngayTao?: string | null;
};

export type Faculty = {
  id: number;
  code: string;
  name: string;
  createdAt: string | null;
};

export type FacultyFormValues = {
  code: string;
  name: string;
};

export type CreateFacultyPayload = {
  maKhoa: string;
  tenKhoa: string;
};

export type UpdateFacultyPayload = Partial<CreateFacultyPayload>;

export type FacultyListParams = {
  page: number;
  limit: number;
  keyword?: string;
};
