import { axiosClient } from "../axiosClient";
import type { ApiResponse, PaginatedResponse } from "../../types/api.types";
import {
  mapLecturer,
  mapTeachingAssignment,
  mapTeachingAssignmentForm,
} from "../../features/teaching-assignments/teachingAssignment.mapper";
import type {
  AssignmentRole,
  AssignmentStatus,
  AssignmentWeeklyScheduleDetailDto,
  LecturerDto,
  TeachingAssignmentCreateResponseDto,
  TeachingAssignmentDto,
  TeachingAssignmentFormValues,
  TeachingAssignmentListResult,
  WeeklyScheduleDto,
  WeeklyScheduleSaveValues,
} from "../../features/teaching-assignments/teachingAssignment.types";
const unwrap = <T>(response: ApiResponse<T>) => response.data;

const buildQueryString = (params: Record<string, unknown>) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    searchParams.append(key, String(value));
  });

  return searchParams.toString();
};

export const teachingAssignmentsApi = {
  getWeeklyScheduleDetail: async (assignmentId: number) => {
    const { data } = await axiosClient.get<
      ApiResponse<AssignmentWeeklyScheduleDetailDto>
    >(`/admin/ke-hoach/phan-cong-giang-day/${assignmentId}/lich-tuan`);

    return unwrap(data);
  },

  saveWeeklySchedule: async (values: WeeklyScheduleSaveValues) => {
    const { data } = await axiosClient.post<ApiResponse<WeeklyScheduleDto[]>>(
      "/admin/ke-hoach/lich-tuan",
      values,
    );

    return unwrap(data);
  },
  listLecturers: async (
    params: { page?: number; limit?: number; keyword?: string } = {},
  ) => {
    const queryString = buildQueryString({
      page: params.page ?? 1,
      limit: Math.min(params.limit ?? 500, 500),
      keyword: params.keyword?.trim() || undefined,
    });

    const url = queryString
      ? `/admin/giang-vien?${queryString}`
      : "/admin/giang-vien";

    const { data } =
      await axiosClient.get<ApiResponse<PaginatedResponse<LecturerDto>>>(url);

    return unwrap(data).items.map(mapLecturer);
  },

  listLecturersByCourse: async (courseId: number) => {
    const { data } = await axiosClient.get<ApiResponse<LecturerDto[]>>(
      `/admin/ke-hoach/hoc-phan/${courseId}/giang-vien`,
    );

    return unwrap(data).map(mapLecturer);
  },

  listAssignments: async (params: {
    page?: number;
    limit?: number;
    keyword?: string;
    keHoachHocKyId?: number;
    lopId?: number;
    hocPhanId?: number;
    giangVienId?: number;
    nhomHocPhanId?: number;
    vaiTro?: AssignmentRole | "";
    trangThai?: AssignmentStatus | "";
  }): Promise<TeachingAssignmentListResult> => {
    const queryString = buildQueryString({
      page: params.page ?? 1,
      limit: Math.min(params.limit ?? 500, 500),
      keyword: params.keyword?.trim() || undefined,
      keHoachHocKyId: params.keHoachHocKyId,
      lopId: params.lopId,
      hocPhanId: params.hocPhanId,
      giangVienId: params.giangVienId,
      nhomHocPhanId: params.nhomHocPhanId,
      vaiTro: params.vaiTro || undefined,
      trangThai: params.trangThai || undefined,
    });

    const url = queryString
      ? `/admin/ke-hoach/phan-cong-giang-day?${queryString}`
      : "/admin/ke-hoach/phan-cong-giang-day";

    const { data } =
      await axiosClient.get<
        ApiResponse<PaginatedResponse<TeachingAssignmentDto>>
      >(url);

    const result = unwrap(data);

    return {
      pagination: result.pagination,
      items: result.items.map(mapTeachingAssignment),
    };
  },

  createAssignment: async (
    groupId: number,
    values: TeachingAssignmentFormValues,
  ) => {
    const { data } = await axiosClient.post<
      ApiResponse<TeachingAssignmentCreateResponseDto>
    >("/admin/ke-hoach/phan-cong", {
      nhomHocPhanId: groupId,
      ...mapTeachingAssignmentForm(values),
    });

    const result = unwrap(data);

    return {
      assignment: mapTeachingAssignment(result.assignment),
      warnings: result.warnings ?? [],
    };
  },

  updateAssignment: async (
    assignmentId: number,
    values: TeachingAssignmentFormValues,
  ) => {
    const { data } = await axiosClient.put<ApiResponse<TeachingAssignmentDto>>(
      `/admin/ke-hoach/phan-cong-giang-day/${assignmentId}`,
      mapTeachingAssignmentForm(values),
    );

    return mapTeachingAssignment(unwrap(data));
  },

  removeAssignment: async (assignmentId: number) => {
    const { data } = await axiosClient.delete<
      ApiResponse<TeachingAssignmentDto>
    >(`/admin/ke-hoach/phan-cong-giang-day/${assignmentId}`);

    return mapTeachingAssignment(unwrap(data));
  },
};
