import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ClipboardList, ListChecks, RotateCcw, Table2 } from "lucide-react";

import { adminCrudApi } from "../../api/adminCrud.api";
import { teachingAssignmentsApi } from "../../api/admin/teachingAssignments.api";
import { teachingGroupsApi } from "../../api/admin/teachingGroups.api";
import { trainingPlansApi } from "../../api/admin/trainingPlans.api";

import AdminCrudPagination from "../../components/admin/crud/AdminCrudPagination";
import AdminCrudToolbar from "../../components/admin/crud/AdminCrudToolbar";
import ConfirmDeleteDialog from "../../components/admin/crud/ConfirmDeleteDialog";
import FormModal from "../../components/admin/crud/FormModal";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import Button from "../../components/ui/Button";
import SelectInput, {
  type SelectOption,
} from "../../components/ui/SelectInput";
import Toast, { type ToastType } from "../../components/ui/Toast";

import { useDebounce } from "../../hooks/useDebounce";
import { useDisclosure } from "../../hooks/useDisclosure";
import { usePagination } from "../../hooks/usePagination";
import { getApiErrorMessage } from "../../types/api.types";

import TeachingAssignmentForm from "./TeachingAssignmentForm";
import TeachingAssignmentStats from "./TeachingAssignmentStats";
import TeachingAssignmentTable from "./TeachingAssignmentTable";
import TeachingWeeklyScheduleForm from "./TeachingWeeklyScheduleForm";
import TeachingWorkloadMatrix from "./TeachingWorkloadMatrix";

import {
  buildAssignmentStats,
  buildLecturerWorkloads,
} from "./teachingAssignment.mapper";

import type {
  AssignmentGroupTypeFilter,
  AssignmentStatusFilter,
  AssignmentViewMode,
  ClassroomOption,
  LecturerOption,
  TeachingAssignment,
  TeachingAssignmentFormValues,
  TeachingAssignmentRow,
  WeeklyScheduleSaveValues,
} from "./teachingAssignment.types";

type ToastState = {
  type: ToastType;
  message: string;
};

const groupTypeOptions: SelectOption[] = [
  { label: "Tất cả loại nhóm", value: "" },
  { label: "Lý thuyết", value: "ly_thuyet" },
  { label: "Thực hành", value: "thuc_hanh" },
  { label: "Đồ án", value: "do_an" },
  { label: "Thực tập", value: "thuc_tap" },
  { label: "Tốt nghiệp", value: "tot_nghiep" },
];

const assignmentStatusOptions: SelectOption[] = [
  { label: "Tất cả trạng thái", value: "all" },
  { label: "Đã phân công", value: "assigned" },
  { label: "Chưa phân công", value: "unassigned" },
];

const viewModeOptions: SelectOption[] = [
  { label: "Danh sách phân công", value: "list" },
  { label: "Ma trận tải giảng viên", value: "workload" },
];

export default function TeachingAssignmentPage() {
  const queryClient = useQueryClient();

  const formDisclosure = useDisclosure();
  const deleteDisclosure = useDisclosure();
  const scheduleDisclosure = useDisclosure();

  const { page, limit, setPage, setLimit, resetPage } = usePagination({
    initialLimit: 10,
  });

  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 400);

  const [selectedSemesterPlanId, setSelectedSemesterPlanId] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [lecturerFilter, setLecturerFilter] = useState("");
  const [groupTypeFilter, setGroupTypeFilter] =
    useState<AssignmentGroupTypeFilter>("");
  const [statusFilter, setStatusFilter] =
    useState<AssignmentStatusFilter>("all");
  const [viewMode, setViewMode] = useState<AssignmentViewMode>("list");

  const [selectedRow, setSelectedRow] = useState<TeachingAssignmentRow | null>(
    null,
  );
  const [editingAssignment, setEditingAssignment] =
    useState<TeachingAssignment | null>(null);
  const [deletingAssignment, setDeletingAssignment] =
    useState<TeachingAssignment | null>(null);
  const [schedulingAssignment, setSchedulingAssignment] =
    useState<TeachingAssignment | null>(null);

  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    resetPage();
  }, [
    debouncedKeyword,
    selectedSemesterPlanId,
    classFilter,
    courseFilter,
    lecturerFilter,
    groupTypeFilter,
    statusFilter,
    viewMode,
    resetPage,
  ]);

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => setToast(null), 3500);

    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = (type: ToastType, message: string) => {
    setToast({ type, message });
  };

  const semesterPlansQuery = useQuery({
    queryKey: ["teaching-assignments-semester-plans"],
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

  const lecturersQuery = useQuery({
    queryKey: ["teaching-assignments-lecturers"],
    queryFn: () =>
      teachingAssignmentsApi.listLecturers({ page: 1, limit: 500 }),
  });

  const classroomsQuery = useQuery({
    queryKey: ["teaching-assignments-classrooms"],
    queryFn: () => adminCrudApi.list("phonghoc", { page: 1, limit: 500 }),
  });

  const classroomOptions = useMemo<ClassroomOption[]>(() => {
    return (classroomsQuery.data?.items ?? []).map((room) => {
      const campus = room.coSo as { tenCoSo?: string } | undefined;

      return {
        id: Number(room.phongHocId),
        code: String(room.maPhong ?? ""),
        name: String(room.tenPhong ?? ""),
        campusName: String(campus?.tenCoSo ?? ""),
        capacity: Number(room.sucChua ?? 0),
        type: String(room.loaiPhong ?? ""),
      };
    });
  }, [classroomsQuery.data?.items]);

  const lecturerOptions = useMemo<SelectOption[]>(() => {
    const lecturers = lecturersQuery.data ?? [];

    return [
      { label: "Tất cả giảng viên", value: "" },
      ...lecturers.map((lecturer) => ({
        value: String(lecturer.id),
        label: lecturer.code
          ? `${lecturer.code} - ${lecturer.name}`
          : lecturer.name,
      })),
    ];
  }, [lecturersQuery.data]);

  const groupsQuery = useQuery({
    queryKey: [
      "teaching-assignments-groups",
      selectedSemesterPlanId,
      debouncedKeyword.trim(),
      classFilter,
      courseFilter,
      groupTypeFilter,
    ],
    queryFn: () =>
      teachingGroupsApi.listGroups({
        page: 1,
        limit: 500,
        keyword: debouncedKeyword.trim() || undefined,
        keHoachHocKyId: selectedSemesterPlanId
          ? Number(selectedSemesterPlanId)
          : undefined,
        lopId: classFilter ? Number(classFilter) : undefined,
        hocPhanId: courseFilter ? Number(courseFilter) : undefined,
        loaiNhom: groupTypeFilter,
      }),
    enabled: Boolean(selectedSemesterPlanId),
  });

  const assignmentsQuery = useQuery({
    queryKey: [
      "teaching-assignments",
      selectedSemesterPlanId,
      lecturerFilter,
      debouncedKeyword.trim(),
    ],
    queryFn: () =>
      teachingAssignmentsApi.listAssignments({
        page: 1,
        limit: 500,
        keyword: debouncedKeyword.trim() || undefined,
        keHoachHocKyId: selectedSemesterPlanId
          ? Number(selectedSemesterPlanId)
          : undefined,
        giangVienId: lecturerFilter ? Number(lecturerFilter) : undefined,
      }),
    enabled: Boolean(selectedSemesterPlanId),
  });

  const weeklyScheduleQuery = useQuery({
    queryKey: ["teaching-assignment-weekly-schedule", schedulingAssignment?.id],
    queryFn: () =>
      teachingAssignmentsApi.getWeeklyScheduleDetail(
        Number(schedulingAssignment?.id),
      ),
    enabled: scheduleDisclosure.isOpen && Boolean(schedulingAssignment?.id),
  });

  const groups = groupsQuery.data?.items ?? [];
  const assignments = assignmentsQuery.data?.items ?? [];
  const lecturers = lecturersQuery.data ?? [];

  const classOptions = useMemo<SelectOption[]>(() => {
    const map = new Map<number, SelectOption>();

    groups.forEach((group) => {
      if (!group.classId) return;

      map.set(group.classId, {
        value: String(group.classId),
        label: group.classCode
          ? `${group.classCode} - ${group.className}`
          : group.className,
      });
    });

    return [{ label: "Tất cả lớp", value: "" }, ...Array.from(map.values())];
  }, [groups]);

  const courseOptions = useMemo<SelectOption[]>(() => {
    const map = new Map<number, SelectOption>();

    groups.forEach((group) => {
      if (!group.courseId) return;

      map.set(group.courseId, {
        value: String(group.courseId),
        label: group.courseCode
          ? `${group.courseCode} - ${group.courseName}`
          : group.courseName,
      });
    });

    return [
      { label: "Tất cả học phần", value: "" },
      ...Array.from(map.values()),
    ];
  }, [groups]);

  const allRows = useMemo<TeachingAssignmentRow[]>(() => {
    const assignmentsByGroup = new Map<number, TeachingAssignment[]>();

    assignments.forEach((assignment) => {
      const current = assignmentsByGroup.get(assignment.groupId) ?? [];
      current.push(assignment);
      assignmentsByGroup.set(assignment.groupId, current);
    });

    const rows: TeachingAssignmentRow[] = [];

    groups.forEach((group) => {
      const groupAssignments = assignmentsByGroup.get(group.id) ?? [];

      if (groupAssignments.length === 0) {
        rows.push({
          rowId: `group-${group.id}-empty`,
          group,
          isAssigned: false,
        });

        return;
      }

      groupAssignments.forEach((assignment) => {
        rows.push({
          rowId: `group-${group.id}-assignment-${assignment.id}`,
          group,
          assignment,
          isAssigned: true,
        });
      });
    });

    return rows;
  }, [assignments, groups]);

  const filteredRows = useMemo(() => {
    return allRows.filter((row) => {
      if (statusFilter === "assigned" && !row.isAssigned) return false;
      if (statusFilter === "unassigned" && row.isAssigned) return false;

      if (lecturerFilter) {
        if (!row.assignment) return false;
        if (row.assignment.lecturerId !== Number(lecturerFilter)) return false;
      }

      return true;
    });
  }, [allRows, lecturerFilter, statusFilter]);

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredRows.slice(start, start + limit);
  }, [filteredRows, limit, page]);

  const pagination = useMemo(
    () => ({
      page,
      limit,
      totalItems: filteredRows.length,
      totalPages: Math.max(Math.ceil(filteredRows.length / limit), 1),
    }),
    [filteredRows.length, limit, page],
  );

  const stats = useMemo(() => buildAssignmentStats(allRows), [allRows]);

  const workloadRows = useMemo(
    () => buildLecturerWorkloads(lecturers, assignments),
    [assignments, lecturers],
  );

  const invalidateAssignmentData = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["teaching-assignments"] }),
      queryClient.invalidateQueries({
        queryKey: ["teaching-assignments-groups"],
      }),
      queryClient.invalidateQueries({ queryKey: ["teaching-groups"] }),
    ]);
  };

  const createAssignmentMutation = useMutation({
    mutationFn: (values: TeachingAssignmentFormValues) => {
      if (!selectedRow) {
        return Promise.reject(new Error("Chưa chọn nhóm học phần"));
      }

      return teachingAssignmentsApi.createAssignment(
        selectedRow.group.id,
        values,
      );
    },
    onSuccess: async (result) => {
      if (result.warnings.length > 0) {
        showToast(
          "warning",
          `Đã lưu phân công, nhưng cần kiểm tra: ${result.warnings.join(" ")}`,
        );
      } else {
        showToast("success", "Phân công giảng viên thành công");
      }

      setSelectedRow(null);
      formDisclosure.close();
      await invalidateAssignmentData();
    },
    onError: (error) => {
      showToast(
        "error",
        getApiErrorMessage(error, "Không thể phân công giảng viên"),
      );
    },
  });

  const updateAssignmentMutation = useMutation({
    mutationFn: (values: TeachingAssignmentFormValues) => {
      if (!editingAssignment) {
        return Promise.reject(new Error("Chưa chọn phân công"));
      }

      return teachingAssignmentsApi.updateAssignment(
        editingAssignment.id,
        values,
      );
    },
    onSuccess: async () => {
      showToast("success", "Cập nhật phân công thành công");
      setEditingAssignment(null);
      setSelectedRow(null);
      formDisclosure.close();
      await invalidateAssignmentData();
    },
    onError: (error) => {
      showToast(
        "error",
        getApiErrorMessage(error, "Không thể cập nhật phân công"),
      );
    },
  });

  const deleteAssignmentMutation = useMutation({
    mutationFn: (assignment: TeachingAssignment) =>
      teachingAssignmentsApi.removeAssignment(assignment.id),
    onSuccess: async () => {
      showToast("success", "Xóa phân công thành công");
      setDeletingAssignment(null);
      deleteDisclosure.close();
      await invalidateAssignmentData();
    },
    onError: (error) => {
      showToast("error", getApiErrorMessage(error, "Không thể xóa phân công"));
    },
  });

  const saveWeeklyScheduleMutation = useMutation({
    mutationFn: (values: WeeklyScheduleSaveValues) =>
      teachingAssignmentsApi.saveWeeklySchedule(values),
    onSuccess: async () => {
      showToast("success", "Lưu phân bổ tuần thành công");
      scheduleDisclosure.close();
      setSchedulingAssignment(null);

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["teaching-assignment-weekly-schedule"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["teaching-assignments"],
        }),
      ]);
    },
    onError: (error) => {
      showToast(
        "error",
        getApiErrorMessage(error, "Không thể lưu phân bổ tuần"),
      );
    },
  });

  const openCreateAssignment = (row: TeachingAssignmentRow) => {
    setSelectedRow(row);
    setEditingAssignment(null);
    formDisclosure.open();
  };

  const openEditAssignment = (row: TeachingAssignmentRow) => {
    if (!row.assignment) return;

    setSelectedRow(row);
    setEditingAssignment(row.assignment);
    formDisclosure.open();
  };

  const openWeeklySchedule = (assignment: TeachingAssignment) => {
    setSchedulingAssignment(assignment);
    scheduleDisclosure.open();
  };

  const resetFilters = () => {
    setKeyword("");
    setClassFilter("");
    setCourseFilter("");
    setLecturerFilter("");
    setGroupTypeFilter("");
    setStatusFilter("all");
    resetPage();
  };

  const isLoading =
    groupsQuery.isLoading ||
    assignmentsQuery.isLoading ||
    lecturersQuery.isLoading;

  const isFetching =
    groupsQuery.isFetching ||
    assignmentsQuery.isFetching ||
    lecturersQuery.isFetching;

  const hasError =
    groupsQuery.isError || assignmentsQuery.isError || lecturersQuery.isError;

  const errorMessage =
    getApiErrorMessage(groupsQuery.error, "") ||
    getApiErrorMessage(assignmentsQuery.error, "") ||
    getApiErrorMessage(lecturersQuery.error, "") ||
    "Không tải được dữ liệu phân công giảng dạy.";

  return (
    <section className="space-y-4">
      {toast ? (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      ) : null}

      <div className="text-sm">
        <span className="font-medium text-slate-500">Quản trị</span>
        <span className="mx-2 text-slate-300">/</span>
        <span className="font-semibold text-slate-950">
          Phân công giảng dạy
        </span>
      </div>

      <header className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 ring-1 ring-brand-100">
              <ClipboardList size={22} aria-hidden="true" />
            </div>

            <div className="min-w-0">
              <h1 className="text-xl font-bold text-slate-950">
                Phân công giảng dạy
              </h1>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
                Gán giảng viên cho từng nhóm học phần, theo dõi số tiết phân
                công và phân bổ số tiết theo từng tuần đào tạo.
              </p>

              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-slate-700">
                  {stats.totalGroups} nhóm học phần
                </span>
                <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-emerald-700">
                  {stats.assignedGroups} nhóm đã phân công
                </span>
                <span className="rounded-md bg-amber-50 px-2.5 py-1 text-amber-700">
                  {stats.unassignedGroups} nhóm chưa phân công
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              variant={viewMode === "list" ? "primary" : "secondary"}
              leftIcon={<ListChecks size={16} aria-hidden="true" />}
              onClick={() => setViewMode("list")}
            >
              Danh sách
            </Button>

            <Button
              variant={viewMode === "workload" ? "primary" : "secondary"}
              leftIcon={<Table2 size={16} aria-hidden="true" />}
              onClick={() => setViewMode("workload")}
            >
              Ma trận tải
            </Button>
          </div>
        </div>
      </header>

      <TeachingAssignmentStats stats={stats} />

      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <SelectInput
            label="Kế hoạch học kỳ"
            options={semesterPlanOptions}
            value={selectedSemesterPlanId}
            onChange={(event) => {
              setSelectedSemesterPlanId(event.target.value);
              resetPage();
            }}
          />

          <SelectInput
            label="Lớp"
            options={classOptions}
            value={classFilter}
            onChange={(event) => setClassFilter(event.target.value)}
          />

          <SelectInput
            label="Học phần"
            options={courseOptions}
            value={courseFilter}
            onChange={(event) => setCourseFilter(event.target.value)}
          />

          <SelectInput
            label="Giảng viên"
            options={lecturerOptions}
            value={lecturerFilter}
            onChange={(event) => setLecturerFilter(event.target.value)}
          />

          <SelectInput
            label="Loại nhóm"
            options={groupTypeOptions}
            value={groupTypeFilter}
            onChange={(event) =>
              setGroupTypeFilter(
                event.target.value as AssignmentGroupTypeFilter,
              )
            }
          />

          <SelectInput
            label="Trạng thái"
            options={assignmentStatusOptions}
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as AssignmentStatusFilter)
            }
          />

          <SelectInput
            label="Chế độ xem"
            options={viewModeOptions}
            value={viewMode}
            onChange={(event) =>
              setViewMode(event.target.value as AssignmentViewMode)
            }
          />
        </div>
      </div>

      <AdminCrudToolbar
        keyword={keyword}
        searchPlaceholder="Tìm nhóm, lớp, học phần, giảng viên..."
        isSearching={isFetching}
        onKeywordChange={setKeyword}
        onSearch={() => {
          void Promise.all([groupsQuery.refetch(), assignmentsQuery.refetch()]);
        }}
        onReset={resetFilters}
        leftSlot={
          <span className="text-sm font-medium text-slate-500">
            Phân công giảng viên và phân bổ số tiết theo tuần.
          </span>
        }
        rightSlot={
          <Button
            variant="secondary"
            className="min-h-10"
            leftIcon={<RotateCcw size={15} aria-hidden="true" />}
            onClick={() => {
              void invalidateAssignmentData();
            }}
          >
            Tải lại
          </Button>
        }
      />

      {!selectedSemesterPlanId ? (
        <EmptyState
          icon={<ClipboardList size={22} aria-hidden="true" />}
          title="Chưa có kế hoạch học kỳ"
          description="Bạn cần có kế hoạch học kỳ và nhóm học phần trước khi phân công giảng dạy."
        />
      ) : hasError ? (
        <ErrorState
          title="Không tải được dữ liệu phân công"
          description={errorMessage}
          onAction={() => {
            void Promise.all([
              groupsQuery.refetch(),
              assignmentsQuery.refetch(),
              lecturersQuery.refetch(),
            ]);
          }}
        />
      ) : viewMode === "workload" ? (
        <TeachingWorkloadMatrix rows={workloadRows} isLoading={isLoading} />
      ) : (
        <div className="space-y-3">
          <TeachingAssignmentTable
            rows={paginatedRows}
            isLoading={isLoading}
            deletingId={
              deleteAssignmentMutation.isPending ? deletingAssignment?.id : null
            }
            onAssign={openCreateAssignment}
            onEdit={openEditAssignment}
            onSchedule={openWeeklySchedule}
            onDelete={(assignment) => {
              setDeletingAssignment(assignment);
              deleteDisclosure.open();
            }}
          />

          <AdminCrudPagination
            pagination={pagination}
            isLoading={isFetching}
            onPageChange={setPage}
            onLimitChange={setLimit}
          />
        </div>
      )}

      {selectedRow ? (
        <FormModal
          isOpen={formDisclosure.isOpen}
          title={
            editingAssignment ? "Cập nhật phân công" : "Phân công giảng viên"
          }
          onClose={() => {
            if (
              !createAssignmentMutation.isPending &&
              !updateAssignmentMutation.isPending
            ) {
              setSelectedRow(null);
              setEditingAssignment(null);
              formDisclosure.close();
            }
          }}
        >
          <TeachingAssignmentForm
            row={selectedRow}
            lecturers={lecturers as LecturerOption[]}
            initialData={editingAssignment}
            isSubmitting={
              createAssignmentMutation.isPending ||
              updateAssignmentMutation.isPending
            }
            onCancel={() => {
              setSelectedRow(null);
              setEditingAssignment(null);
              formDisclosure.close();
            }}
            onSubmit={(values: TeachingAssignmentFormValues) => {
              if (editingAssignment) {
                updateAssignmentMutation.mutate(values);
                return;
              }

              createAssignmentMutation.mutate(values);
            }}
          />
        </FormModal>
      ) : null}

      {schedulingAssignment ? (
        <FormModal
          isOpen={scheduleDisclosure.isOpen}
          title="Phân bổ tiết theo tuần"
          onClose={() => {
            if (!saveWeeklyScheduleMutation.isPending) {
              setSchedulingAssignment(null);
              scheduleDisclosure.close();
            }
          }}
        >
          <TeachingWeeklyScheduleForm
            assignment={schedulingAssignment}
            detail={weeklyScheduleQuery.data}
            classrooms={classroomOptions}
            isLoading={
              weeklyScheduleQuery.isLoading || classroomsQuery.isLoading
            }
            isSubmitting={saveWeeklyScheduleMutation.isPending}
            onCancel={() => {
              setSchedulingAssignment(null);
              scheduleDisclosure.close();
            }}
            onSubmit={(values: WeeklyScheduleSaveValues) =>
              saveWeeklyScheduleMutation.mutate(values)
            }
          />
        </FormModal>
      ) : null}

      <ConfirmDeleteDialog
        isOpen={deleteDisclosure.isOpen}
        itemName={deletingAssignment?.lecturerName}
        isDeleting={deleteAssignmentMutation.isPending}
        description={
          deletingAssignment
            ? `Bạn có chắc chắn muốn xóa phân công của giảng viên "${deletingAssignment.lecturerName}" khỏi nhóm học phần này không?`
            : undefined
        }
        onCancel={() => {
          if (!deleteAssignmentMutation.isPending) {
            setDeletingAssignment(null);
            deleteDisclosure.close();
          }
        }}
        onConfirm={() => {
          if (deletingAssignment) {
            deleteAssignmentMutation.mutate(deletingAssignment);
          }
        }}
      />
    </section>
  );
}
