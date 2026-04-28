import type {
  Classroom,
  ClassroomDto,
  ClassroomFormValues,
  CreateClassroomPayload,
  UpdateClassroomPayload,
} from "./classroom.types";

export function mapClassroom(dto: ClassroomDto): Classroom {
  return {
    id: dto.phongHocId,
    campusId: dto.coSoId,
    code: dto.maPhong,
    name: dto.tenPhong ?? null,
    campusName: dto.coSo?.tenCoSo ?? "-",
    capacity: dto.sucChua ?? null,
    roomType: dto.loaiPhong ?? null,
  };
}

export function mapClassroomFormValuesToCreatePayload(
  values: ClassroomFormValues,
): CreateClassroomPayload {
  return {
    coSoId: Number(values.campusId),
    maPhong: values.code.trim(),
    tenPhong: values.name.trim() || undefined,
    sucChua: values.capacity ? Number(values.capacity) : undefined,
    loaiPhong: (values.roomType || undefined) as CreateClassroomPayload["loaiPhong"],
  };
}

export function mapClassroomFormValuesToUpdatePayload(
  values: ClassroomFormValues,
): UpdateClassroomPayload {
  return mapClassroomFormValuesToCreatePayload(values);
}
