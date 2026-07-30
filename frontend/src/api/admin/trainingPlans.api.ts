import { axiosClient } from "../axiosClient";
import type { ApiResponse, PaginatedResponse } from "../../types/api.types";
import {
  mapOpenedSubject,
  mapSemesterPlan,
  mapSemesterPlanForm,
  mapSuggestion,
  mapTrainingPlanDetail,
  mapTrainingPlan,
  mapTrainingPlanForm,
} from "../../features/training-plans/trainingPlan.mapper";
import type {
  OpenedSubjectDto,
  SemesterPlanDto,
  SemesterPlanFormValues,
  SuggestionDto,
  TrainingPlanDto,
  TrainingPlanDetail,
  TrainingPlanFormValues,
  TrainingPlanListResult,
  SemesterPlanListResult,
} from "../../features/training-plans/trainingPlan.types";

const unwrap = <T>(response: ApiResponse<T>) => response.data;

export const trainingPlansApi = {
  list: async (params: { page: number; limit: number; keyword?: string }) => {
    const { data } = await axiosClient.get<
      ApiResponse<PaginatedResponse<TrainingPlanDto>>
    >("/admin/ke-hoach/dao-tao", { params });
    const result = unwrap(data);

    return {
      pagination: result.pagination,
      items: result.items.map(mapTrainingPlan),
    } satisfies TrainingPlanListResult;
  },

  create: async (values: TrainingPlanFormValues) => {
    const { data } = await axiosClient.post<ApiResponse<TrainingPlanDto>>(
      "/admin/ke-hoach/dao-tao",
      mapTrainingPlanForm(values),
    );
    return mapTrainingPlan(unwrap(data));
  },

  detail: async (id: number): Promise<TrainingPlanDetail> => {
    const { data } = await axiosClient.get<ApiResponse<TrainingPlanDto>>(
      `/admin/ke-hoach/dao-tao/${id}`,
    );
    return mapTrainingPlanDetail(unwrap(data));
  },

  update: async (id: number, values: TrainingPlanFormValues) => {
    const { data } = await axiosClient.put<ApiResponse<TrainingPlanDto>>(
      `/admin/ke-hoach/dao-tao/${id}`,
      mapTrainingPlanForm(values),
    );
    return mapTrainingPlan(unwrap(data));
  },

  remove: async (id: number) => {
    const { data } = await axiosClient.delete<ApiResponse<TrainingPlanDto>>(
      `/admin/ke-hoach/dao-tao/${id}`,
    );
    return mapTrainingPlan(unwrap(data));
  },

  approve: async (id: number) => {
    const { data } = await axiosClient.post<ApiResponse<TrainingPlanDto>>(
      `/admin/ke-hoach/dao-tao/${id}/duyet`,
    );
    return mapTrainingPlan(unwrap(data));
  },

  start: async (id: number) => {
    const { data } = await axiosClient.post<ApiResponse<TrainingPlanDto>>(
      `/admin/ke-hoach/dao-tao/${id}/bat-dau`,
    );
    return mapTrainingPlan(unwrap(data));
  },

  reopen: async (id: number) => {
    const { data } = await axiosClient.post<ApiResponse<TrainingPlanDto>>(
      `/admin/ke-hoach/dao-tao/${id}/mo-lai`,
    );
    return mapTrainingPlan(unwrap(data));
  },

  close: async (id: number) => {
    const { data } = await axiosClient.post<ApiResponse<TrainingPlanDto>>(
      `/admin/ke-hoach/dao-tao/${id}/dong`,
    );
    return mapTrainingPlan(unwrap(data));
  },

  listSemesterPlans: async (params: {
    page: number;
    limit: number;
    keyword?: string;
    keHoachId?: number;
  }): Promise<SemesterPlanListResult> => {
    const { data } = await axiosClient.get<
      ApiResponse<PaginatedResponse<SemesterPlanDto>>
    >("/admin/ke-hoach/hoc-ky", { params });
    const result = unwrap(data);

    return {
      pagination: result.pagination,
      items: result.items.map(mapSemesterPlan),
    };
  },

  createSemesterPlan: async (values: SemesterPlanFormValues) => {
    const { data } = await axiosClient.post<ApiResponse<SemesterPlanDto>>(
      "/admin/ke-hoach/hoc-ky",
      mapSemesterPlanForm(values),
    );
    return mapSemesterPlan(unwrap(data));
  },

  detailSemesterPlan: async (id: number) => {
    const { data } = await axiosClient.get<ApiResponse<SemesterPlanDto>>(
      `/admin/ke-hoach/hoc-ky/${id}`,
    );
    return mapSemesterPlan(unwrap(data));
  },

  updateSemesterPlan: async (id: number, values: SemesterPlanFormValues) => {
    const { data } = await axiosClient.put<ApiResponse<SemesterPlanDto>>(
      `/admin/ke-hoach/hoc-ky/${id}`,
      mapSemesterPlanForm(values),
    );
    return mapSemesterPlan(unwrap(data));
  },

  approveSemesterPlan: async (id: number) => {
    const { data } = await axiosClient.post<ApiResponse<SemesterPlanDto>>(
      `/admin/ke-hoach/hoc-ky/${id}/duyet`,
    );
    return mapSemesterPlan(unwrap(data));
  },

  reopenSemesterPlan: async (id: number) => {
    const { data } = await axiosClient.post<ApiResponse<SemesterPlanDto>>(
      `/admin/ke-hoach/hoc-ky/${id}/mo-lai`,
    );
    return mapSemesterPlan(unwrap(data));
  },

  closeSemesterPlan: async (id: number) => {
    const { data } = await axiosClient.post<ApiResponse<SemesterPlanDto>>(
      `/admin/ke-hoach/hoc-ky/${id}/dong`,
    );
    return mapSemesterPlan(unwrap(data));
  },

  suggestCourses: async (payload: {
    keHoachHocKyId: number;
    lopIds: number[];
    hocKyDuKien?: number;
  }) => {
    const { data } = await axiosClient.post<ApiResponse<SuggestionDto>>(
      "/admin/ke-hoach/goi-y-hoc-phan",
      payload,
    );
    return mapSuggestion(unwrap(data));
  },

  openCourses: async (payload: {
    keHoachHocKyId: number;
    items: Array<{
      lopId: number;
      hocPhanId: number;
      chuongTrinhHocPhanId: number;
    }>;
  }) => {
    const { data } = await axiosClient.post<ApiResponse<OpenedSubjectDto[]>>(
      "/admin/ke-hoach/mo-hoc-phan",
      payload,
    );
    return unwrap(data).map(mapOpenedSubject);
  },

  listOpenedSubjects: async (semesterPlanId: number) => {
    const { data } = await axiosClient.get<ApiResponse<OpenedSubjectDto[]>>(
      `/admin/ke-hoach/hoc-ky/${semesterPlanId}/lop-hoc-phan`,
    );
    return unwrap(data).map(mapOpenedSubject);
  },
};
