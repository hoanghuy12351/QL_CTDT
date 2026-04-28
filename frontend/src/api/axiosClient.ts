import axios from "axios";
import { getStorageItem, removeStorageItem } from "../lib/storage";

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = getStorageItem("auth_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      removeStorageItem("auth_token");
      removeStorageItem("auth_user");

      if (!window.location.pathname.startsWith("/auth")) {
        window.location.href = "/auth/login";
      }
    }

    return Promise.reject(error);
  },
);
