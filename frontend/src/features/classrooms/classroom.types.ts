export type ClassroomDto = {
  phongHocId: number;
  coSoId: number;
  maPhong: string;
  tenPhong?: string | null;
  sucChua?: number | null;
  loaiPhong?: string | null;
  coSo?: {
    coSoId: number;
    maCoSo: string;
    tenCoSo: string;
  } | null;
};

export type Classroom = {
  id: number;
  campusId: number;
  code: string;
  name: string | null;
  campusName: string;
  capacity: number | null;
  roomType: string | null;
};

export type ClassroomFormValues = {
  campusId: string;
  code: string;
  name: string;
  capacity: string;
  roomType: string;
};

export type CreateClassroomPayload = {
  coSoId: number;
  maPhong: string;
  tenPhong?: string;
  sucChua?: number;
  loaiPhong?: "ly_thuyet" | "thuc_hanh" | "lab" | "do_an" | "online";
};

export type UpdateClassroomPayload = Partial<CreateClassroomPayload>;

export type ClassroomListParams = {
  page: number;
  limit: number;
  keyword?: string;
};
