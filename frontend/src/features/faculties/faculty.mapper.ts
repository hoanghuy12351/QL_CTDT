import type {
  CreateFacultyPayload,
  Faculty,
  FacultyDto,
  FacultyFormValues,
  UpdateFacultyPayload,
} from "./faculty.types";

export function mapFaculty(dto: FacultyDto): Faculty {
  return {
    id: dto.khoaId,
    code: dto.maKhoa,
    name: dto.tenKhoa,
    createdAt: dto.ngayTao ?? null,
  };
}

export function mapFacultyFormValuesToCreatePayload(
  values: FacultyFormValues,
): CreateFacultyPayload {
  return {
    maKhoa: values.code.trim(),
    tenKhoa: values.name.trim(),
  };
}

export function mapFacultyFormValuesToUpdatePayload(
  values: FacultyFormValues,
): UpdateFacultyPayload {
  return {
    maKhoa: values.code.trim(),
    tenKhoa: values.name.trim(),
  };
}
