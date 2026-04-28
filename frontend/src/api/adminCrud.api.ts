import { axiosClient } from "./axiosClient";
import type {
  AdminCrudListResult,
  AdminCrudRecord,
} from "../features/admin/crud/adminCrud.types";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

const unwrap = <T>(response: ApiResponse<T>) => response.data;

export const adminCrudApi = {
  list: async (resource: string, params: { page: number; limit: number; keyword?: string }) => {
    const { data } = await axiosClient.get<ApiResponse<AdminCrudListResult>>(
      `/admin/${resource}`,
      { params },
    );

    return unwrap(data);
  },

  create: async (resource: string, payload: AdminCrudRecord) => {
    const { data } = await axiosClient.post<ApiResponse<AdminCrudRecord>>(
      `/admin/${resource}`,
      payload,
    );

    return unwrap(data);
  },

  update: async (resource: string, id: string | number, payload: AdminCrudRecord) => {
    const { data } = await axiosClient.put<ApiResponse<AdminCrudRecord>>(
      `/admin/${resource}/${id}`,
      payload,
    );

    return unwrap(data);
  },

  remove: async (resource: string, id: string | number) => {
    const { data } = await axiosClient.delete<ApiResponse<AdminCrudRecord>>(
      `/admin/${resource}/${id}`,
    );

    return unwrap(data);
  },
};
