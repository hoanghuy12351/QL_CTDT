import { axiosClient } from "../axiosClient";
import type { ApiResponse } from "../../types/api.types";
import type { DashboardOverview } from "../../features/admin-dashboard.types";

const unwrap = <T>(response: ApiResponse<T>) => response.data;

export const dashboardApi = {
  overview: async () => {
    const { data } = await axiosClient.get<ApiResponse<DashboardOverview>>(
      "/admin/dashboard/overview",
    );

    return unwrap(data);
  },
};
