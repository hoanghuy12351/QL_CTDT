import { axiosClient } from "../axiosClient";
import type {
  AvailableLecturerOption,
  LecturerAccount,
  LecturerAccountFormValues,
  LecturerAccountListResult,
} from "../../features/lecturer-accounts/lecturerAccount.types";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

const unwrap = <T>(response: ApiResponse<T>) => response.data;

export const lecturerAccountsApi = {
  list: async (params: { page: number; limit: number; keyword?: string }) => {
    const { data } = await axiosClient.get<ApiResponse<LecturerAccountListResult>>(
      "/admin/tai-khoan-giang-vien",
      { params },
    );

    return unwrap(data);
  },

  availableLecturers: async () => {
    const { data } = await axiosClient.get<ApiResponse<AvailableLecturerOption[]>>(
      "/admin/tai-khoan-giang-vien/giang-vien-chua-co-tai-khoan",
    );

    return unwrap(data);
  },

  create: async (payload: LecturerAccountFormValues) => {
    const { data } = await axiosClient.post<ApiResponse<LecturerAccount>>(
      "/admin/tai-khoan-giang-vien",
      payload,
    );

    return unwrap(data);
  },

  update: async (accountId: number, payload: Partial<LecturerAccountFormValues>) => {
    const { data } = await axiosClient.put<ApiResponse<LecturerAccount>>(
      `/admin/tai-khoan-giang-vien/${accountId}`,
      payload,
    );

    return unwrap(data);
  },
};
