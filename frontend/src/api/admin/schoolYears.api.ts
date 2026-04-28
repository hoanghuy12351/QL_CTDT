import { axiosClient } from "../axiosClient";
import type { ApiResponse, PaginatedResponse } from "../../types/api.types";
import {
  mapSchoolYear,
  mapSchoolYearFormValuesToCreatePayload,
  mapSchoolYearFormValuesToUpdatePayload,
} from "../../features/school-years/schoolYear.mapper";
import type {
  SchoolYear,
  SchoolYearDto,
  SchoolYearFormValues,
  SchoolYearListParams,
} from "../../features/school-years/schoolYear.types";

const unwrap = <T>(response: ApiResponse<T>) => response.data;

const mapPaginatedSchoolYears = (
  response: PaginatedResponse<SchoolYearDto>,
): PaginatedResponse<SchoolYear> => ({
  ...response,
  items: response.items.map(mapSchoolYear),
});

export const schoolYearsApi = {
  list: async (params: SchoolYearListParams) => {
    const { data } = await axiosClient.get<ApiResponse<PaginatedResponse<SchoolYearDto>>>(
      "/admin/namhoc",
      { params },
    );
    return mapPaginatedSchoolYears(unwrap(data));
  },
  create: async (values: SchoolYearFormValues) => {
    const payload = mapSchoolYearFormValuesToCreatePayload(values);
    const { data } = await axiosClient.post<ApiResponse<SchoolYearDto>>(
      "/admin/namhoc",
      payload,
    );
    return mapSchoolYear(unwrap(data));
  },
  update: async (id: number, values: SchoolYearFormValues) => {
    const payload = mapSchoolYearFormValuesToUpdatePayload(values);
    const { data } = await axiosClient.put<ApiResponse<SchoolYearDto>>(
      `/admin/namhoc/${id}`,
      payload,
    );
    return mapSchoolYear(unwrap(data));
  },
  remove: async (id: number) => {
    const { data } = await axiosClient.delete<ApiResponse<SchoolYearDto>>(
      `/admin/namhoc/${id}`,
    );
    return mapSchoolYear(unwrap(data));
  },
};
