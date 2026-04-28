import type {
  Cohort,
  CohortDto,
  CohortFormValues,
  CreateCohortPayload,
  UpdateCohortPayload,
} from "./cohort.types";

export function mapCohort(dto: CohortDto): Cohort {
  return {
    id: dto.khoaHocId,
    code: dto.maKhoaHoc,
    name: dto.tenKhoaHoc,
    startYear: dto.namBatDau,
    endYear: dto.namKetThuc,
  };
}

export function mapCohortFormValuesToCreatePayload(
  values: CohortFormValues,
): CreateCohortPayload {
  return {
    maKhoaHoc: values.code.trim(),
    tenKhoaHoc: values.name.trim(),
    namBatDau: Number(values.startYear),
    namKetThuc: Number(values.endYear),
  };
}

export function mapCohortFormValuesToUpdatePayload(
  values: CohortFormValues,
): UpdateCohortPayload {
  return mapCohortFormValuesToCreatePayload(values);
}
