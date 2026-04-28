import { axiosClient } from "../axiosClient";
import type { ApiResponse, PaginatedResponse } from "../../types/api.types";
import {
  mapFaculty,
  mapFacultyFormValuesToCreatePayload,
  mapFacultyFormValuesToUpdatePayload,
} from "../../features/faculties/faculty.mapper";
import type {
  Faculty,
  FacultyDto,
  FacultyFormValues,
  FacultyListParams,
} from "../../features/faculties/faculty.types";

const unwrap = <T>(response: ApiResponse<T>) => response.data;

const mapPaginatedFaculties = (
  response: PaginatedResponse<FacultyDto>,
): PaginatedResponse<Faculty> => {
  return {
    ...response,
    items: response.items.map(mapFaculty),
  };
};

export const facultiesApi = {
  list: async (params: FacultyListParams) => {
    const { data } = await axiosClient.get<
      ApiResponse<PaginatedResponse<FacultyDto>>
    >("/admin/khoa", {
      params: {
        page: params.page,
        limit: params.limit,
        keyword: params.keyword,
      },
    });

    return mapPaginatedFaculties(unwrap(data));
  },

  create: async (values: FacultyFormValues) => {
    const payload = mapFacultyFormValuesToCreatePayload(values);

    const { data } = await axiosClient.post<ApiResponse<FacultyDto>>(
      "/admin/khoa",
      payload,
    );

    return mapFaculty(unwrap(data));
  },

  update: async (id: number, values: FacultyFormValues) => {
    const payload = mapFacultyFormValuesToUpdatePayload(values);

    const { data } = await axiosClient.put<ApiResponse<FacultyDto>>(
      `/admin/khoa/${id}`,
      payload,
    );

    return mapFaculty(unwrap(data));
  },

  remove: async (id: number) => {
    const { data } = await axiosClient.delete<ApiResponse<FacultyDto>>(
      `/admin/khoa/${id}`,
    );

    return mapFaculty(unwrap(data));
  },
};
