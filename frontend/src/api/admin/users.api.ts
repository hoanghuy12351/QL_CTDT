import { axiosClient } from "../axiosClient";
import type { ApiResponse } from "../../types/api.types";
import type { UserFormValues, UserListResult } from "../../features/users/user.types";

type ListUsersParams = {
  page?: number;
  limit?: number;
  keyword?: string;
  vaiTro?: string;
  trangThai?: string;
};

const unwrap = <T>(response: ApiResponse<T>) => response.data;

const buildPayload = (values: UserFormValues, isEdit = false) => ({
  email: values.email.trim(),
  hoTen: values.hoTen.trim(),
  vaiTro: values.vaiTro,
  trangThai: values.trangThai,
  giangVienId:
    values.vaiTro === "giang_vien" && values.giangVienId
      ? Number(values.giangVienId)
      : undefined,
  ...(!isEdit || values.password.trim()
    ? { password: values.password.trim() }
    : {}),
});

export const usersApi = {
  list: async (params: ListUsersParams = {}) => {
    const { data } = await axiosClient.get<ApiResponse<UserListResult>>(
      "/admin/users",
      { params },
    );
    return unwrap(data);
  },

  create: async (values: UserFormValues) => {
    const { data } = await axiosClient.post<ApiResponse<unknown>>(
      "/admin/users",
      buildPayload(values),
    );
    return unwrap(data);
  },

  update: async (id: number, values: UserFormValues) => {
    const { data } = await axiosClient.put<ApiResponse<unknown>>(
      `/admin/users/${id}`,
      buildPayload(values, true),
    );
    return unwrap(data);
  },
};
