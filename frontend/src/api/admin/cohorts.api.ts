import { axiosClient } from "../axiosClient";
import type { ApiResponse, PaginatedResponse } from "../../types/api.types";
import {
  mapCohort,
  mapCohortFormValuesToCreatePayload,
  mapCohortFormValuesToUpdatePayload,
} from "../../features/cohorts/cohort.mapper";
import type {
  Cohort,
  CohortDto,
  CohortFormValues,
  CohortListParams,
} from "../../features/cohorts/cohort.types";

const unwrap = <T>(response: ApiResponse<T>) => response.data;

const mapPaginatedCohorts = (
  response: PaginatedResponse<CohortDto>,
): PaginatedResponse<Cohort> => ({
  ...response,
  items: response.items.map(mapCohort),
});

export const cohortsApi = {
  list: async (params: CohortListParams) => {
    const { data } = await axiosClient.get<ApiResponse<PaginatedResponse<CohortDto>>>(
      "/admin/khoahoc",
      {
        params: {
          page: params.page,
          limit: params.limit,
          keyword: params.keyword,
        },
      },
    );

    return mapPaginatedCohorts(unwrap(data));
  },

  create: async (values: CohortFormValues) => {
    const payload = mapCohortFormValuesToCreatePayload(values);
    const { data } = await axiosClient.post<ApiResponse<CohortDto>>(
      "/admin/khoahoc",
      payload,
    );
    return mapCohort(unwrap(data));
  },

  update: async (id: number, values: CohortFormValues) => {
    const payload = mapCohortFormValuesToUpdatePayload(values);
    const { data } = await axiosClient.put<ApiResponse<CohortDto>>(
      `/admin/khoahoc/${id}`,
      payload,
    );
    return mapCohort(unwrap(data));
  },

  remove: async (id: number) => {
    const { data } = await axiosClient.delete<ApiResponse<CohortDto>>(
      `/admin/khoahoc/${id}`,
    );
    return mapCohort(unwrap(data));
  },
};
