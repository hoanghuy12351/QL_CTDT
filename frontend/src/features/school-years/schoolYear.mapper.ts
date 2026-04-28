import type {
  CreateSchoolYearPayload,
  SchoolYear,
  SchoolYearDto,
  SchoolYearFormValues,
  UpdateSchoolYearPayload,
} from "./schoolYear.types";

export function mapSchoolYear(dto: SchoolYearDto): SchoolYear {
  return {
    id: dto.namHocId,
    code: dto.maNamHoc,
    startDate: dto.ngayBatDau ?? null,
    endDate: dto.ngayKetThuc ?? null,
    status: dto.trangThai ?? null,
    createdAt: dto.ngayTao ?? null,
  };
}

export function mapSchoolYearFormValuesToCreatePayload(
  values: SchoolYearFormValues,
): CreateSchoolYearPayload {
  return {
    maNamHoc: values.code.trim(),
    ngayBatDau: values.startDate || undefined,
    ngayKetThuc: values.endDate || undefined,
    trangThai: (values.status || undefined) as CreateSchoolYearPayload["trangThai"],
  };
}

export function mapSchoolYearFormValuesToUpdatePayload(
  values: SchoolYearFormValues,
): UpdateSchoolYearPayload {
  return mapSchoolYearFormValuesToCreatePayload(values);
}
