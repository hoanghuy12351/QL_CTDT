import { axiosClient } from "../axiosClient";
import type { ApiResponse, PaginatedResponse } from "../../types/api.types";
import {
  mapCampus,
  mapCampusFormValuesToCreatePayload,
  mapCampusFormValuesToUpdatePayload,
} from "../../features/campuses/campus.mapper";
import type {
  Campus,
  CampusDto,
  CampusFormValues,
  CampusListParams,
} from "../../features/campuses/campus.types";

const unwrap = <T>(response: ApiResponse<T>) => response.data;

const mapPaginatedCampuses = (
  response: PaginatedResponse<CampusDto>,
): PaginatedResponse<Campus> => ({
  ...response,
  items: response.items.map(mapCampus),
});

export const campusesApi = {
  list: async (params: CampusListParams) => {
    const { data } = await axiosClient.get<ApiResponse<PaginatedResponse<CampusDto>>>(
      "/admin/coso",
      { params },
    );
    return mapPaginatedCampuses(unwrap(data));
  },
  create: async (values: CampusFormValues) => {
    const payload = mapCampusFormValuesToCreatePayload(values);
    const { data } = await axiosClient.post<ApiResponse<CampusDto>>(
      "/admin/coso",
      payload,
    );
    return mapCampus(unwrap(data));
  },
  update: async (id: number, values: CampusFormValues) => {
    const payload = mapCampusFormValuesToUpdatePayload(values);
    const { data } = await axiosClient.put<ApiResponse<CampusDto>>(
      `/admin/coso/${id}`,
      payload,
    );
    return mapCampus(unwrap(data));
  },
  remove: async (id: number) => {
    const { data } = await axiosClient.delete<ApiResponse<CampusDto>>(
      `/admin/coso/${id}`,
    );
    return mapCampus(unwrap(data));
  },
};
