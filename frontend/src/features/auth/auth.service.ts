import { axiosClient } from "../../api/axiosClient";
import type {
  AuthResponse,
  AuthUser,
  LoginCredentials,
  RegisterPayload,
} from "./auth.types";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

const unwrap = <T>(response: ApiResponse<T>) => response.data;

export const authService = {
  login: async (payload: LoginCredentials) => {
    const { data } = await axiosClient.post<ApiResponse<AuthResponse>>(
      "/auth/login",
      payload,
    );
    return unwrap(data);
  },

  register: async (payload: RegisterPayload) => {
    const { data } = await axiosClient.post<ApiResponse<AuthResponse>>(
      "/auth/register",
      payload,
    );
    return unwrap(data);
  },

  me: async () => {
    const { data } = await axiosClient.get<ApiResponse<AuthUser>>("/auth/me");
    return unwrap(data);
  },

  logout: async () => {
    const { data } = await axiosClient.post<ApiResponse<null>>("/auth/logout");
    return unwrap(data);
  },
};
