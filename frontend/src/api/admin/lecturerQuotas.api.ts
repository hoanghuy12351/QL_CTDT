import { axiosClient } from "../axiosClient";
import type { ApiResponse, PaginatedResponse } from "../../types/api.types";
import type {
  LecturerQuota,
  LecturerQuotaFormValues,
  LecturerQuotaGenerateValues,
} from "../../features/lecturer-quotas/lecturerQuota.types";

const unwrap = <T>(response: ApiResponse<T>) => response.data;

export const lecturerQuotasApi = {
  list: async (params: {
    page?: number;
    limit?: number;
    keyword?: string;
    namHocId?: number | string;
    boMonId?: number | string;
  }) => {
    const { data } = await axiosClient.get<ApiResponse<PaginatedResponse<LecturerQuota>>>(
      "/admin/dinh-muc-giang-vien",
      { params },
    );

    return unwrap(data);
  },

  create: async (payload: LecturerQuotaFormValues) => {
    const { data } = await axiosClient.post<ApiResponse<LecturerQuota>>(
      "/admin/dinh-muc-giang-vien",
      payload,
    );

    return unwrap(data);
  },

  update: async (id: number, payload: LecturerQuotaFormValues) => {
    const { data } = await axiosClient.put<ApiResponse<LecturerQuota>>(
      `/admin/dinh-muc-giang-vien/${id}`,
      payload,
    );

    return unwrap(data);
  },

  remove: async (id: number) => {
    const { data } = await axiosClient.delete<ApiResponse<LecturerQuota>>(
      `/admin/dinh-muc-giang-vien/${id}`,
    );

    return unwrap(data);
  },

  generate: async (payload: LecturerQuotaGenerateValues) => {
    const { data } = await axiosClient.post<
      ApiResponse<{ created: number; skipped: number; totalLecturers: number }>
    >("/admin/dinh-muc-giang-vien/generate", payload);

    return unwrap(data);
  },
};
