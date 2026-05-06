import type {
  CreateSemesterPayload,
  Semester,
  SemesterDto,
  SemesterFormValues,
  UpdateSemesterPayload,
} from "./semester.types";

const TEMPLATE_YEAR = 2000;

const parseDayMonth = (value: string) => {
  const match = value.trim().match(/^(\d{1,2})\/(\d{1,2})$/);
  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const date = new Date(Date.UTC(TEMPLATE_YEAR, month - 1, day));

  if (
    date.getUTCFullYear() !== TEMPLATE_YEAR ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return {
    day: String(day).padStart(2, "0"),
    month: String(month).padStart(2, "0"),
  };
};

const dayMonthToApiDate = (value: string) => {
  const parsed = parseDayMonth(value);
  if (!parsed) return undefined;
  return `${TEMPLATE_YEAR}-${parsed.month}-${parsed.day}`;
};

export function mapSemester(dto: SemesterDto): Semester {
  return {
    id: dto.hocKyId,
    code: dto.maHocKy,
    name: dto.tenHocKy,
    startDate: dto.ngayBatDau ?? null,
    endDate: dto.ngayKetThuc ?? null,
    status: dto.trangThai ?? null,
  };
}

export function mapSemesterFormValuesToCreatePayload(
  values: SemesterFormValues,
): CreateSemesterPayload {
  return {
    maHocKy: values.code.trim(),
    tenHocKy: values.name.trim(),
    ngayBatDau: dayMonthToApiDate(values.startDate),
    ngayKetThuc: dayMonthToApiDate(values.endDate),
    trangThai: (values.status || undefined) as CreateSemesterPayload["trangThai"],
  };
}

export function mapSemesterFormValuesToUpdatePayload(
  values: SemesterFormValues,
): UpdateSemesterPayload {
  return mapSemesterFormValuesToCreatePayload(values);
}
