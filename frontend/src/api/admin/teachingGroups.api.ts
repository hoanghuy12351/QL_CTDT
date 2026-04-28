import { axiosClient } from "../axiosClient";
import type { ApiResponse, PaginatedResponse } from "../../types/api.types";
import {
  mapOpenedClassCourse,
  mapQuickGroupForm,
  mapTeachingGroup,
  mapTeachingGroupForm,
  mapTeachingGroupUpdateForm,
} from "../../features/teaching-groups/teachingGroup.mapper";
import type {
  OpenedClassCourseDto,
  QuickGroupFormValues,
  TeachingGroupDto,
  TeachingGroupFormValues,
  TeachingGroupListResult,
  TeachingGroupType,
} from "../../features/teaching-groups/teachingGroup.types";

const unwrap = <T>(response: ApiResponse<T>) => response.data;

export const teachingGroupsApi = {
  listOpenedClassCourses: async (semesterPlanId: number) => {
    const { data } = await axiosClient.get<ApiResponse<OpenedClassCourseDto[]>>(
      `/admin/ke-hoach/hoc-ky/${semesterPlanId}/lop-hoc-phan`,
    );
    return unwrap(data).map(mapOpenedClassCourse);
  },

  listGroups: async (params: {
    page: number;
    limit: number;
    keyword?: string;
    keHoachHocKyId?: number;
    lopId?: number;
    hocPhanId?: number;
    loaiNhom?: TeachingGroupType | "";
  }) => {
    const { data } = await axiosClient.get<ApiResponse<PaginatedResponse<TeachingGroupDto>>>(
      "/admin/ke-hoach/nhom-hoc-phan",
      { params },
    );
    const result = unwrap(data);

    return {
      pagination: result.pagination,
      items: result.items.map(mapTeachingGroup),
    } satisfies TeachingGroupListResult;
  },

  createGroup: async (classCoursePlanId: number, values: TeachingGroupFormValues) => {
    const { data } = await axiosClient.post<ApiResponse<TeachingGroupDto>>(
      `/admin/ke-hoach/lop-hoc-phan/${classCoursePlanId}/nhom`,
      mapTeachingGroupForm(values),
    );
    return mapTeachingGroup(unwrap(data));
  },

  createQuickGroups: async (classCoursePlanId: number, values: QuickGroupFormValues) => {
    const { data } = await axiosClient.post<
      ApiResponse<{ nhomDaTao: TeachingGroupDto[]; goiYSoNhomThucHanh: number }>
    >(
      `/admin/ke-hoach/lop-hoc-phan/${classCoursePlanId}/tao-nhom-nhanh`,
      mapQuickGroupForm(values),
    );
    const result = unwrap(data);

    return {
      suggestedPracticeGroupCount: result.goiYSoNhomThucHanh,
      groups: (result.nhomDaTao ?? []).map(mapTeachingGroup),
    };
  },

  updateGroup: async (id: number, values: TeachingGroupFormValues) => {
    const { data } = await axiosClient.put<ApiResponse<TeachingGroupDto>>(
      `/admin/ke-hoach/nhom-hoc-phan/${id}`,
      mapTeachingGroupUpdateForm(values),
    );
    return mapTeachingGroup(unwrap(data));
  },

  removeGroup: async (id: number) => {
    const { data } = await axiosClient.delete<ApiResponse<TeachingGroupDto>>(
      `/admin/ke-hoach/nhom-hoc-phan/${id}`,
    );
    return mapTeachingGroup(unwrap(data));
  },
};
