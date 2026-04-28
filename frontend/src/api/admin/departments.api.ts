import { axiosClient } from "../axiosClient";
import type { ApiResponse, PaginatedResponse } from "../../types/api.types";
import {
  mapDepartment,
  mapDepartmentFormValuesToCreatePayload,
  mapDepartmentFormValuesToUpdatePayload,
} from "../../features/departments/department.mapper";
import type {
  Department,
  DepartmentDto,
  DepartmentFormValues,
  DepartmentListParams,
} from "../../features/departments/department.types";

const unwrap = <T>(response: ApiResponse<T>) => response.data;

const mapPaginatedDepartments = (
  response: PaginatedResponse<DepartmentDto>,
): PaginatedResponse<Department> => {
  return {
    ...response,
    items: response.items.map(mapDepartment),
  };
};

export const departmentsApi = {
  list: async (params: DepartmentListParams) => {
    const { data } = await axiosClient.get<
      ApiResponse<PaginatedResponse<DepartmentDto>>
    >("/admin/bomon", {
      params: {
        page: params.page,
        limit: params.limit,
        keyword: params.keyword,
      },
    });

    return mapPaginatedDepartments(unwrap(data));
  },

  create: async (values: DepartmentFormValues) => {
    const payload = mapDepartmentFormValuesToCreatePayload(values);

    const { data } = await axiosClient.post<ApiResponse<DepartmentDto>>(
      "/admin/bomon",
      payload,
    );

    return mapDepartment(unwrap(data));
  },

  update: async (id: number, values: DepartmentFormValues) => {
    const payload = mapDepartmentFormValuesToUpdatePayload(values);

    const { data } = await axiosClient.put<ApiResponse<DepartmentDto>>(
      `/admin/bomon/${id}`,
      payload,
    );

    return mapDepartment(unwrap(data));
  },

  remove: async (id: number) => {
    const { data } = await axiosClient.delete<ApiResponse<DepartmentDto>>(
      `/admin/bomon/${id}`,
    );

    return mapDepartment(unwrap(data));
  },
};
