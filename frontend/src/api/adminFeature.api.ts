import { axiosClient } from "./axiosClient";
import type {
  AdminFeature,
  AdminFeatureFormValues,
} from "../features/admin/feature-name/adminFeature.types";

const endpoint = "/admin/features";

export const adminFeatureApi = {
  list: async () => {
    const { data } = await axiosClient.get<AdminFeature[]>(endpoint);
    return data;
  },

  detail: async (id: string) => {
    const { data } = await axiosClient.get<AdminFeature>(`${endpoint}/${id}`);
    return data;
  },

  create: async (payload: AdminFeatureFormValues) => {
    const { data } = await axiosClient.post<AdminFeature>(endpoint, payload);
    return data;
  },

  update: async (id: string, payload: AdminFeatureFormValues) => {
    const { data } = await axiosClient.put<AdminFeature>(
      `${endpoint}/${id}`,
      payload,
    );
    return data;
  },

  remove: async (id: string) => {
    await axiosClient.delete(`${endpoint}/${id}`);
  },
};

