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

const getFilenameFromDisposition = (
  disposition: string | undefined,
  fallback: string,
) => {
  if (!disposition) return fallback;

  const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1].replace(/"/g, ""));
  }

  const asciiMatch = disposition.match(/filename="?([^";]+)"?/i);
  return asciiMatch?.[1] ? asciiMatch[1] : fallback;
};

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

  exportExcel: async (id: number) => {
    const response = await axiosClient.get<Blob>(
      `/admin/chuong-trinh-dao-tao/${id}/export-excel`,
      { responseType: "blob" },
    );

    return {
      blob: response.data,
      fileName: getFilenameFromDisposition(
        response.headers["content-disposition"],
        "chuong-trinh-dao-tao.xlsx",
      ),
    };
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
        assignments: CurriculumAssignmentDto[];
        totalClasses: number;
        totalCourses: number;
        createdProgress: number;
        skippedProgress: number;
      }>
    >(`/admin/chuong-trinh-dao-tao/${curriculumId}/lop`, payload);
    const result = unwrap(data);

    return {
      ...result,
      assignment: mapCurriculumAssignment(result.assignment),
      assignments: result.assignments.map(mapCurriculumAssignment),
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
