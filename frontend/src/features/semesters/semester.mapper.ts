import type {
  CreateSemesterPayload,
  Semester,
  SemesterDto,
  SemesterFormValues,
  UpdateSemesterPayload,
} from "./semester.types";

export function mapSemester(dto: SemesterDto): Semester {
  return {
    id: dto.hocKyId,
    schoolYearId: dto.namHocId,
    code: dto.maHocKy,
    name: dto.tenHocKy,
    schoolYearCode: dto.namHoc?.maNamHoc ?? "-",
    startDate: dto.ngayBatDau ?? null,
    endDate: dto.ngayKetThuc ?? null,
    status: dto.trangThai ?? null,
  };
}

export function mapSemesterFormValuesToCreatePayload(
  values: SemesterFormValues,
): CreateSemesterPayload {
  return {
    namHocId: Number(values.schoolYearId),
    maHocKy: values.code.trim(),
    tenHocKy: values.name.trim(),
    ngayBatDau: values.startDate || undefined,
    ngayKetThuc: values.endDate || undefined,
    trangThai: (values.status || undefined) as CreateSemesterPayload["trangThai"],
  };
}

export function mapSemesterFormValuesToUpdatePayload(
  values: SemesterFormValues,
): UpdateSemesterPayload {
  return mapSemesterFormValuesToCreatePayload(values);
}
