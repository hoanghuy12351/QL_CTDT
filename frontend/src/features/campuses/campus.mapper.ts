import type {
  Campus,
  CampusDto,
  CampusFormValues,
  CreateCampusPayload,
  UpdateCampusPayload,
} from "./campus.types";

export function mapCampus(dto: CampusDto): Campus {
  return {
    id: dto.coSoId,
    code: dto.maCoSo,
    name: dto.tenCoSo,
    address: dto.diaChi ?? null,
  };
}

export function mapCampusFormValuesToCreatePayload(
  values: CampusFormValues,
): CreateCampusPayload {
  return {
    maCoSo: values.code.trim(),
    tenCoSo: values.name.trim(),
    diaChi: values.address.trim() || undefined,
  };
}

export function mapCampusFormValuesToUpdatePayload(
  values: CampusFormValues,
): UpdateCampusPayload {
  return mapCampusFormValuesToCreatePayload(values);
}
