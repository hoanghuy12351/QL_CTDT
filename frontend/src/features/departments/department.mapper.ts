import type {
  CreateDepartmentPayload,
  Department,
  DepartmentDto,
  DepartmentFormValues,
  UpdateDepartmentPayload,
} from "./department.types";

export function mapDepartment(dto: DepartmentDto): Department {
  return {
    id: dto.boMonId,
    facultyId: dto.khoaId,
    code: dto.maBoMon,
    name: dto.tenBoMon,
    facultyName: dto.khoa?.tenKhoa ?? "-",
    createdAt: dto.ngayTao ?? null,
  };
}

export function mapDepartmentFormValuesToCreatePayload(
  values: DepartmentFormValues,
): CreateDepartmentPayload {
  return {
    khoaId: Number(values.facultyId),
    maBoMon: values.code.trim(),
    tenBoMon: values.name.trim(),
  };
}

export function mapDepartmentFormValuesToUpdatePayload(
  values: DepartmentFormValues,
): UpdateDepartmentPayload {
  return {
    khoaId: Number(values.facultyId),
    maBoMon: values.code.trim(),
    tenBoMon: values.name.trim(),
  };
}
