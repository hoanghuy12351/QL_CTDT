import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GitBranchPlus, Plus, RotateCcw } from "lucide-react";
import { teachingGroupsApi } from "../../api/admin/teachingGroups.api";
import { trainingPlansApi } from "../../api/admin/trainingPlans.api";
import AdminCrudPagination from "../../components/admin/crud/AdminCrudPagination";
import AdminCrudToolbar from "../../components/admin/crud/AdminCrudToolbar";
import ConfirmDeleteDialog from "../../components/admin/crud/ConfirmDeleteDialog";
import FormModal from "../../components/admin/crud/FormModal";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import Button from "../../components/ui/Button";
import SelectInput, { type SelectOption } from "../../components/ui/SelectInput";
import Toast, { type ToastType } from "../../components/ui/Toast";
import { useDebounce } from "../../hooks/useDebounce";
import { useDisclosure } from "../../hooks/useDisclosure";
import { usePagination } from "../../hooks/usePagination";
import { getApiErrorMessage } from "../../types/api.types";
import OpenedClassCourseTable from "./OpenedClassCourseTable";
import QuickGroupForm from "./QuickGroupForm";
import TeachingGroupForm from "./TeachingGroupForm";
import TeachingGroupTable from "./TeachingGroupTable";
import type {
  OpenedClassCourse,
  QuickGroupFormValues,
  TeachingGroup,
  TeachingGroupFormValues,
  TeachingGroupType,
} from "./teachingGroup.types";

type ToastState = {
  type: ToastType;
  message: string;
};

const typeOptions: SelectOption[] = [
  { label: "Tất cả loại nhóm", value: "" },
  { label: "Lý thuyết", value: "ly_thuyet" },
  { label: "Thực hành", value: "thuc_hanh" },
];

export default function TeachingGroupPage() {
  const queryClient = useQueryClient();
  const groupFormDisclosure = useDisclosure();
  const quickFormDisclosure = useDisclosure();
  const deleteDisclosure = useDisclosure();
  const { limit, page, resetPage, setLimit, setPage } = usePagination({ initialLimit: 10 });

  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 400);
  const [selectedSemesterPlanId, setSelectedSemesterPlanId] = useState("");
  const [selectedClassCourse, setSelectedClassCourse] = useState<OpenedClassCourse | null>(null);
  const [editingGroup, setEditingGroup] = useState<TeachingGroup | null>(null);
  const [deletingGroup, setDeletingGroup] = useState<TeachingGroup | null>(null);
  const [classFilter, setClassFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState<TeachingGroupType | "">("");
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    resetPage();
  }, [debouncedKeyword, classFilter, courseFilter, typeFilter, selectedSemesterPlanId, resetPage]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = (type: ToastType, message: string) => setToast({ type, message });

  const semesterPlansQuery = useQuery({
    queryKey: ["teaching-groups-semester-plans"],
    queryFn: () => trainingPlansApi.listSemesterPlans({ page: 1, limit: 500 }),
  });

  const semesterPlanOptions = useMemo<SelectOption[]>(
    () =>
      (semesterPlansQuery.data?.items ?? []).map((semesterPlan) => ({
        value: String(semesterPlan.id),
        label: semesterPlan.name,
      })),
    [semesterPlansQuery.data?.items],
  );

  useEffect(() => {
    if (!selectedSemesterPlanId && semesterPlanOptions.length > 0) {
      setSelectedSemesterPlanId(String(semesterPlanOptions[0].value));
    }
  }, [selectedSemesterPlanId, semesterPlanOptions]);

  const openedClassCoursesQuery = useQuery({
    queryKey: ["teaching-groups-opened-class-courses", selectedSemesterPlanId],
    queryFn: () => teachingGroupsApi.listOpenedClassCourses(Number(selectedSemesterPlanId)),
    enabled: Boolean(selectedSemesterPlanId),
  });

  const openedClassCourses = useMemo(
    () => openedClassCoursesQuery.data ?? [],
    [openedClassCoursesQuery.data],
  );

  useEffect(() => {
    if (openedClassCourses.length === 0) {
      setSelectedClassCourse(null);
      return;
    }

    setSelectedClassCourse((current) => {
      if (!current) return openedClassCourses[0];
      return openedClassCourses.find((item) => item.id === current.id) ?? openedClassCourses[0];
    });
  }, [openedClassCourses]);

  const classOptions = useMemo<SelectOption[]>(() => {
    const map = new Map<number, SelectOption>();
    openedClassCourses.forEach((item) => {
      map.set(item.classId, {
        value: String(item.classId),
        label: item.classCode ? `${item.classCode} - ${item.className}` : item.className,
      });
    });
    return [{ label: "Tất cả lớp", value: "" }, ...Array.from(map.values())];
  }, [openedClassCourses]);

  const courseOptions = useMemo<SelectOption[]>(() => {
    const map = new Map<number, SelectOption>();
    openedClassCourses.forEach((item) => {
      map.set(item.courseId, {
        value: String(item.courseId),
        label: item.courseCode ? `${item.courseCode} - ${item.courseName}` : item.courseName,
      });
    });
    return [{ label: "Tất cả học phần", value: "" }, ...Array.from(map.values())];
  }, [openedClassCourses]);

  const groupsQuery = useQuery({
    queryKey: [
      "teaching-groups",
      selectedSemesterPlanId,
      page,
      limit,
      debouncedKeyword.trim(),
      classFilter,
      courseFilter,
      typeFilter,
    ],
    queryFn: () =>
      teachingGroupsApi.listGroups({
        page,
        limit,
        keyword: debouncedKeyword.trim() || undefined,
        keHoachHocKyId: selectedSemesterPlanId ? Number(selectedSemesterPlanId) : undefined,
        lopId: classFilter ? Number(classFilter) : undefined,
        hocPhanId: courseFilter ? Number(courseFilter) : undefined,
        loaiNhom: typeFilter,
      }),
    enabled: Boolean(selectedSemesterPlanId),
  });

  const groupRows = groupsQuery.data?.items ?? [];
  const pagination = groupsQuery.data?.pagination ?? {
    page,
    limit,
    totalItems: 0,
    totalPages: 1,
  };

  const invalidateGroupData = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["teaching-groups"] }),
      queryClient.invalidateQueries({ queryKey: ["teaching-groups-opened-class-courses"] }),
    ]);
  };

  const createGroupMutation = useMutation({
    mutationFn: (values: TeachingGroupFormValues) =>
      selectedClassCourse
        ? teachingGroupsApi.createGroup(selectedClassCourse.id, values)
        : Promise.reject(new Error("Chưa chọn lớp - học phần")),
    onSuccess: async () => {
      showToast("success", "Tạo nhóm học phần thành công");
      groupFormDisclosure.close();
      setSelectedClassCourse(null);
      await invalidateGroupData();
    },
    onError: (error) =>
      showToast("error", getApiErrorMessage(error, "Không thể tạo nhóm học phần")),
  });

  const quickCreateMutation = useMutation({
    mutationFn: (values: QuickGroupFormValues) =>
      selectedClassCourse
        ? teachingGroupsApi.createQuickGroups(selectedClassCourse.id, values)
        : Promise.reject(new Error("Chưa chọn lớp - học phần")),
    onSuccess: async (result) => {
      showToast("success", `Đã tạo ${result.groups.length} nhóm học phần`);
      quickFormDisclosure.close();
      setSelectedClassCourse(null);
      await invalidateGroupData();
    },
    onError: (error) =>
      showToast("error", getApiErrorMessage(error, "Không thể tạo nhóm nhanh")),
  });

  const updateGroupMutation = useMutation({
    mutationFn: (values: TeachingGroupFormValues) =>
      editingGroup
        ? teachingGroupsApi.updateGroup(editingGroup.id, values)
        : Promise.reject(new Error("Chưa chọn nhóm")),
    onSuccess: async () => {
      showToast("success", "Cập nhật nhóm học phần thành công");
      setEditingGroup(null);
      groupFormDisclosure.close();
      await invalidateGroupData();
    },
    onError: (error) =>
      showToast("error", getApiErrorMessage(error, "Không thể cập nhật nhóm học phần")),
  });

  const deleteGroupMutation = useMutation({
    mutationFn: (group: TeachingGroup) => teachingGroupsApi.removeGroup(group.id),
    onSuccess: async () => {
      showToast("success", "Xóa nhóm học phần thành công");
      setDeletingGroup(null);
      deleteDisclosure.close();
      await invalidateGroupData();
    },
    onError: (error) =>
      showToast("error", getApiErrorMessage(error, "Không thể xóa nhóm học phần")),
  });

  const openCreateGroup = (classCourse: OpenedClassCourse) => {
    setEditingGroup(null);
    setSelectedClassCourse(classCourse);
    groupFormDisclosure.open();
  };

  const openQuickCreate = (classCourse: OpenedClassCourse) => {
    setSelectedClassCourse(classCourse);
    quickFormDisclosure.open();
  };

  const openEditGroup = (group: TeachingGroup) => {
    const classCourse = openedClassCourses.find((item) => item.id === group.classCoursePlanId) ?? null;
    setSelectedClassCourse(classCourse);
    setEditingGroup(group);
    groupFormDisclosure.open();
  };

  return (
    <section className="space-y-4">
      {toast ? <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} /> : null}

      <div className="text-sm">
        <span className="font-medium text-slate-500">Quản trị</span>
        <span className="mx-2 text-slate-300">/</span>
        <span className="font-semibold text-slate-950">Tạo nhóm học phần</span>
      </div>

      <header className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 ring-1 ring-brand-100">
              <GitBranchPlus size={22} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-slate-950">Tạo nhóm học phần</h1>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
                Chia các lớp - học phần đã mở trong kế hoạch học kỳ thành nhóm lý thuyết và thực hành để phục vụ phân công giảng viên.
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-slate-700">
                  {openedClassCourses.length} lớp - học phần
                </span>
                <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-emerald-700">
                  {pagination.totalItems} nhóm học phần
                </span>
              </div>
            </div>
          </div>
          <Button
            className="w-full lg:w-auto"
            leftIcon={<Plus size={16} aria-hidden="true" />}
            disabled={!selectedClassCourse}
            onClick={() => {
              if (selectedClassCourse) openCreateGroup(selectedClassCourse);
            }}
          >
            Thêm nhóm
          </Button>
        </div>
      </header>

      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-4">
          <SelectInput
            label="Kế hoạch học kỳ"
            options={semesterPlanOptions}
            value={selectedSemesterPlanId}
            onChange={(event) => {
              setSelectedSemesterPlanId(event.target.value);
              setSelectedClassCourse(null);
            }}
          />
          <SelectInput label="Lớp" options={classOptions} value={classFilter} onChange={(event) => setClassFilter(event.target.value)} />
          <SelectInput label="Học phần" options={courseOptions} value={courseFilter} onChange={(event) => setCourseFilter(event.target.value)} />
          <SelectInput label="Loại nhóm" options={typeOptions} value={typeFilter} onChange={(event) => setTypeFilter(event.target.value as TeachingGroupType | "")} />
        </div>
      </div>

      <AdminCrudToolbar
        keyword={keyword}
        searchPlaceholder="Tìm nhóm, lớp, học phần..."
        isSearching={groupsQuery.isFetching}
        onKeywordChange={setKeyword}
        onSearch={() => groupsQuery.refetch()}
        onReset={() => {
          setKeyword("");
          setClassFilter("");
          setCourseFilter("");
          setTypeFilter("");
          resetPage();
        }}
        leftSlot={<span className="text-sm font-medium text-slate-500">Chọn một dòng lớp - học phần để tạo nhóm nhanh hoặc tạo thủ công.</span>}
        rightSlot={
          <Button
            variant="secondary"
            className="min-h-10"
            leftIcon={<RotateCcw size={15} aria-hidden="true" />}
            onClick={() => invalidateGroupData()}
          >
            Tải lại
          </Button>
        }
      />

      {!selectedSemesterPlanId ? (
        <EmptyState
          icon={<GitBranchPlus size={22} aria-hidden="true" />}
          title="Chưa có kế hoạch học kỳ"
          description="Tạo kế hoạch học kỳ và mở học phần cho lớp trước khi tạo nhóm học phần."
        />
      ) : openedClassCoursesQuery.isError ? (
        <ErrorState
          title="Không tải được danh sách lớp - học phần"
          description={getApiErrorMessage(openedClassCoursesQuery.error, "Vui lòng thử lại sau.")}
          onAction={() => openedClassCoursesQuery.refetch()}
        />
      ) : (
        <OpenedClassCourseTable
          rows={openedClassCourses}
          selectedId={selectedClassCourse?.id}
          onSelect={setSelectedClassCourse}
          onCreateGroup={openCreateGroup}
          onQuickCreate={openQuickCreate}
        />
      )}

      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-950">Danh sách nhóm học phần</h2>
        <TeachingGroupTable
          rows={groupRows}
          isLoading={groupsQuery.isLoading}
          deletingId={deleteGroupMutation.isPending ? deletingGroup?.id : null}
          onEdit={openEditGroup}
          onDelete={(group) => {
            setDeletingGroup(group);
            deleteDisclosure.open();
          }}
        />
        <AdminCrudPagination
          pagination={pagination}
          isLoading={groupsQuery.isFetching}
          onPageChange={setPage}
          onLimitChange={setLimit}
        />
      </div>

      <FormModal
        isOpen={groupFormDisclosure.isOpen}
        title={editingGroup ? "Cập nhật nhóm học phần" : "Thêm nhóm học phần"}
        onClose={() => {
          if (!createGroupMutation.isPending && !updateGroupMutation.isPending) {
            setEditingGroup(null);
            groupFormDisclosure.close();
          }
        }}
      >
        <TeachingGroupForm
          classCourse={selectedClassCourse}
          initialData={editingGroup}
          isSubmitting={createGroupMutation.isPending || updateGroupMutation.isPending}
          onCancel={() => {
            setEditingGroup(null);
            groupFormDisclosure.close();
          }}
          onSubmit={(values) =>
            editingGroup ? updateGroupMutation.mutate(values) : createGroupMutation.mutate(values)
          }
        />
      </FormModal>

      {selectedClassCourse ? (
        <FormModal
          isOpen={quickFormDisclosure.isOpen}
          title="Tạo nhóm nhanh"
          onClose={() => {
            if (!quickCreateMutation.isPending) quickFormDisclosure.close();
          }}
        >
          <QuickGroupForm
            classCourse={selectedClassCourse}
            isSubmitting={quickCreateMutation.isPending}
            onCancel={quickFormDisclosure.close}
            onSubmit={(values) => quickCreateMutation.mutate(values)}
          />
        </FormModal>
      ) : null}

      <ConfirmDeleteDialog
        isOpen={deleteDisclosure.isOpen}
        itemName={deletingGroup?.name}
        isDeleting={deleteGroupMutation.isPending}
        description={
          deletingGroup
            ? `Bạn có chắc chắn muốn xóa nhóm "${deletingGroup.name}" không? Backend sẽ chặn nếu nhóm đã có phân công hoặc lịch tuần.`
            : undefined
        }
        onCancel={() => {
          if (!deleteGroupMutation.isPending) {
            setDeletingGroup(null);
            deleteDisclosure.close();
          }
        }}
        onConfirm={() => {
          if (deletingGroup) deleteGroupMutation.mutate(deletingGroup);
        }}
      />
    </section>
  );
}
