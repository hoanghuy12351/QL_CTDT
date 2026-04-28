import { axiosClient } from "../axiosClient";
import type { ApiResponse, PaginatedResponse } from "../../types/api.types";
import {
  mapClassroom,
  mapClassroomFormValuesToCreatePayload,
  mapClassroomFormValuesToUpdatePayload,
} from "../../features/classrooms/classroom.mapper";
import type {
  Classroom,
  ClassroomDto,
  ClassroomFormValues,
  ClassroomListParams,
} from "../../features/classrooms/classroom.types";

const unwrap = <T>(response: ApiResponse<T>) => response.data;

const mapPaginatedClassrooms = (
  response: PaginatedResponse<ClassroomDto>,
): PaginatedResponse<Classroom> => ({
  ...response,
  items: response.items.map(mapClassroom),
});

export const classroomsApi = {
  list: async (params: ClassroomListParams) => {
    const { data } = await axiosClient.get<ApiResponse<PaginatedResponse<ClassroomDto>>>(
      "/admin/phonghoc",
      { params },
    );

    return mapPaginatedClassrooms(unwrap(data));
  },

  create: async (values: ClassroomFormValues) => {
    const payload = mapClassroomFormValuesToCreatePayload(values);
    const { data } = await axiosClient.post<ApiResponse<ClassroomDto>>(
      "/admin/phonghoc",
      payload,
    );
    return mapClassroom(unwrap(data));
  },

  update: async (id: number, values: ClassroomFormValues) => {
    const payload = mapClassroomFormValuesToUpdatePayload(values);
    const { data } = await axiosClient.put<ApiResponse<ClassroomDto>>(
      `/admin/phonghoc/${id}`,
      payload,
    );
    return mapClassroom(unwrap(data));
  },

  remove: async (id: number) => {
    const { data } = await axiosClient.delete<ApiResponse<ClassroomDto>>(
      `/admin/phonghoc/${id}`,
    );
    return mapClassroom(unwrap(data));
  },
};
