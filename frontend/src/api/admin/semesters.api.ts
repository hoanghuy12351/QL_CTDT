import { axiosClient } from "../axiosClient";
import type { ApiResponse, PaginatedResponse } from "../../types/api.types";
import {
  mapSemester,
  mapSemesterFormValuesToCreatePayload,
  mapSemesterFormValuesToUpdatePayload,
} from "../../features/semesters/semester.mapper";
import type {
  Semester,
  SemesterDto,
  SemesterFormValues,
  SemesterListParams,
} from "../../features/semesters/semester.types";

const unwrap = <T>(response: ApiResponse<T>) => response.data;

const mapPaginatedSemesters = (
  response: PaginatedResponse<SemesterDto>,
): PaginatedResponse<Semester> => ({
  ...response,
  items: response.items.map(mapSemester),
});

export const semestersApi = {
  list: async (params: SemesterListParams) => {
    const { data } = await axiosClient.get<ApiResponse<PaginatedResponse<SemesterDto>>>(
      "/admin/hocky",
      { params },
    );

    return mapPaginatedSemesters(unwrap(data));
  },

  create: async (values: SemesterFormValues) => {
    const payload = mapSemesterFormValuesToCreatePayload(values);
    const { data } = await axiosClient.post<ApiResponse<SemesterDto>>(
      "/admin/hocky",
      payload,
    );
    return mapSemester(unwrap(data));
  },

  update: async (id: number, values: SemesterFormValues) => {
    const payload = mapSemesterFormValuesToUpdatePayload(values);
    const { data } = await axiosClient.put<ApiResponse<SemesterDto>>(
      `/admin/hocky/${id}`,
      payload,
    );
    return mapSemester(unwrap(data));
  },

  remove: async (id: number) => {
    const { data } = await axiosClient.delete<ApiResponse<SemesterDto>>(
      `/admin/hocky/${id}`,
    );
    return mapSemester(unwrap(data));
  },
};
