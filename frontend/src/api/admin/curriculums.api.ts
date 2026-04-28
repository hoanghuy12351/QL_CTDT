import { axiosClient } from "../axiosClient";
import type { ApiResponse, PaginatedResponse } from "../../types/api.types";
import {
  mapAssignFormValuesToPayload,
  mapClassProgress,
  mapCourseFormValuesToPayload,
  mapCurriculum,
  mapCurriculumAssignment,
  mapCurriculumCourse,
  mapCurriculumFormValuesToPayload,
} from "../../features/curriculums/curriculum.mapper";
import type {
  AssignCurriculumFormValues,
  ClassCourseStatus,
  ClassProgressDto,
  CurriculumAssignmentDto,
  CurriculumCourseDto,
  CurriculumCourseFormValues,
  CurriculumDto,
  CurriculumFormValues,
  CurriculumListParams,
  CurriculumListResult,
} from "../../features/curriculums/curriculum.types";

const unwrap = <T>(response: ApiResponse<T>) => response.data;

const mapCurriculumList = (
  response: PaginatedResponse<CurriculumDto>,
): CurriculumListResult => ({
  pagination: response.pagination,
  items: response.items.map(mapCurriculum),
});

export const curriculumsApi = {
  list: async (params: CurriculumListParams) => {
    const { data } = await axiosClient.get<ApiResponse<PaginatedResponse<CurriculumDto>>>(
      "/admin/chuong-trinh-dao-tao",
      { params },
    );

    return mapCurriculumList(unwrap(data));
  },

  detail: async (id: number) => {
    const { data } = await axiosClient.get<ApiResponse<CurriculumDto>>(
      `/admin/chuong-trinh-dao-tao/${id}`,
    );
    return mapCurriculum(unwrap(data));
  },

  create: async (values: CurriculumFormValues) => {
    const payload = mapCurriculumFormValuesToPayload(values);
    const { data } = await axiosClient.post<ApiResponse<CurriculumDto>>(
      "/admin/chuong-trinh-dao-tao",
      payload,
    );
    return mapCurriculum(unwrap(data));
  },

  update: async (id: number, values: CurriculumFormValues) => {
    const payload = mapCurriculumFormValuesToPayload(values);
    const { data } = await axiosClient.put<ApiResponse<CurriculumDto>>(
      `/admin/chuong-trinh-dao-tao/${id}`,
      payload,
    );
    return mapCurriculum(unwrap(data));
  },

  remove: async (id: number) => {
    const { data } = await axiosClient.delete<ApiResponse<CurriculumDto>>(
      `/admin/chuong-trinh-dao-tao/${id}`,
    );
    return mapCurriculum(unwrap(data));
  },

  listCourses: async (curriculumId: number) => {
    const { data } = await axiosClient.get<ApiResponse<CurriculumCourseDto[]>>(
      `/admin/chuong-trinh-dao-tao/${curriculumId}/hoc-phan`,
    );
    return unwrap(data).map(mapCurriculumCourse);
  },

  addCourse: async (curriculumId: number, values: CurriculumCourseFormValues) => {
    const payload = mapCourseFormValuesToPayload(values);
    const { data } = await axiosClient.post<ApiResponse<CurriculumCourseDto>>(
      `/admin/chuong-trinh-dao-tao/${curriculumId}/hoc-phan`,
      payload,
    );
    return mapCurriculumCourse(unwrap(data));
  },

  updateCourse: async (entryId: number, values: CurriculumCourseFormValues) => {
    const payload = mapCourseFormValuesToPayload(values);
    const { data } = await axiosClient.put<ApiResponse<CurriculumCourseDto>>(
      `/admin/chuong-trinh-dao-tao/hoc-phan/${entryId}`,
      payload,
    );
    return mapCurriculumCourse(unwrap(data));
  },

  removeCourse: async (entryId: number) => {
    const { data } = await axiosClient.delete<ApiResponse<CurriculumCourseDto>>(
      `/admin/chuong-trinh-dao-tao/hoc-phan/${entryId}`,
    );
    return mapCurriculumCourse(unwrap(data));
  },

  listAssignments: async (curriculumId: number) => {
    const { data } = await axiosClient.get<ApiResponse<CurriculumAssignmentDto[]>>(
      `/admin/chuong-trinh-dao-tao/${curriculumId}/lop`,
    );
    return unwrap(data).map(mapCurriculumAssignment);
  },

  assignClass: async (curriculumId: number, values: AssignCurriculumFormValues) => {
    const payload = mapAssignFormValuesToPayload(values);
    const { data } = await axiosClient.post<
      ApiResponse<{
        assignment: CurriculumAssignmentDto;
        totalCourses: number;
        createdProgress: number;
        skippedProgress: number;
      }>
    >(`/admin/chuong-trinh-dao-tao/${curriculumId}/lop`, payload);
    const result = unwrap(data);

    return {
      ...result,
      assignment: mapCurriculumAssignment(result.assignment),
    };
  },

  listProgress: async (curriculumId: number, classId: number) => {
    const { data } = await axiosClient.get<ApiResponse<ClassProgressDto[]>>(
      `/admin/chuong-trinh-dao-tao/${curriculumId}/lop/${classId}/tien-do`,
    );
    return unwrap(data).map(mapClassProgress);
  },

  updateProgressStatus: async (progressId: number, status: ClassCourseStatus) => {
    const { data } = await axiosClient.put<ApiResponse<ClassProgressDto>>(
      `/admin/chuong-trinh-dao-tao/tien-do/${progressId}`,
      { trangThai: status },
    );
    return mapClassProgress(unwrap(data));
  },
};
