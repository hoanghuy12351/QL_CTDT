import { axiosClient } from "./axiosClient";
import type { ApiResponse } from "../types/api.types";
import type {
  LecturerAssignmentListDto,
  LecturerDashboardDto,
  LecturerWeeklyScheduleListDto,
} from "../features/lecturer/lecturer.types";

type LecturerAssignmentQuery = {
  page?: number;
  limit?: number;
  keyword?: string;
  keHoachHocKyId?: number;
  trangThai?: string;
};

const unwrap = <T>(response: ApiResponse<T>) => response.data;

export const lecturerApi = {
  dashboard: async () => {
    const { data } = await axiosClient.get<ApiResponse<LecturerDashboardDto>>(
      "/lecturer/dashboard",
    );
    return unwrap(data);
  },

  assignments: async (params: LecturerAssignmentQuery = {}) => {
    const { data } = await axiosClient.get<
      ApiResponse<LecturerAssignmentListDto>
    >("/lecturer/assignments", { params });
    return unwrap(data);
  },

  weeklySchedule: async () => {
    const { data } = await axiosClient.get<
      ApiResponse<LecturerWeeklyScheduleListDto>
    >("/lecturer/weekly-schedule");
    return unwrap(data);
  },
};
