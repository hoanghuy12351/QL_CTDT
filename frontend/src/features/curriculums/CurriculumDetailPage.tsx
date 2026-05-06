import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BookOpenCheck, Layers3, ListChecks, Route } from "lucide-react";
import { adminCrudApi } from "../../api/adminCrud.api";
import { curriculumsApi } from "../../api/admin/curriculums.api";
import FormModal from "../../components/admin/crud/FormModal";
import ErrorState from "../../components/common/ErrorState";
import SelectInput, { type SelectOption } from "../../components/ui/SelectInput";
import Toast, { type ToastType } from "../../components/ui/Toast";
import { getApiErrorMessage } from "../../types/api.types";
import type { AdminCrudRecord } from "../admin/crud/adminCrud.types";
import AssignCurriculumForm from "./AssignCurriculumForm";
import ClassProgressTable from "./ClassProgressTable";
import CurriculumAssignmentTable from "./CurriculumAssignmentTable";
import CurriculumCourseForm from "./CurriculumCourseForm";
import CurriculumCourseTable from "./CurriculumCourseTable";
import type {
  AssignCurriculumFormValues,
  ClassCourseStatus,
  CurriculumCourse,
  CurriculumCourseFormValues,
} from "./curriculum.types";

type ToastState = {
  type: ToastType;
  message: string;
};

type DetailTab = "courses" | "classes" | "progress";

const toOptionLabel = (row: AdminCrudRecord, codeKey: string, nameKey: string) => {
  const code = String(row[codeKey] ?? "").trim();
  const name = String(row[nameKey] ?? "").trim();
  return code ? `${code} - ${name}` : name;
};

const buildOptions = (
  rows: AdminCrudRecord[],
  idKey: string,
  codeKey: string,
  nameKey: string,
): SelectOption[] =>
  rows.map((row) => ({
    value: String(row[idKey] ?? ""),
    label: toOptionLabel(row, codeKey, nameKey),
  }));

export default function CurriculumDetailPage() {
  const params = useParams();
  const curriculumId = Number(params.id);
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<DetailTab>("courses");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [editingCourse, setEditingCourse] = useState<CurriculumCourse | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = (type: ToastType, message: string) => setToast({ type, message });

  const curriculumQuery = useQuery({
    queryKey: ["curriculum-detail", curriculumId],
    queryFn: () => curriculumsApi.detail(curriculumId),
    enabled: Number.isFinite(curriculumId) && curriculumId > 0,
  });

  const coursesQuery = useQuery({
    queryKey: ["curriculum-courses", curriculumId],
    queryFn: () => curriculumsApi.listCourses(curriculumId),
    enabled: Number.isFinite(curriculumId) && curriculumId > 0,
  });

  const assignmentsQuery = useQuery({
    queryKey: ["curriculum-classes", curriculumId],
    queryFn: () => curriculumsApi.listAssignments(curriculumId),
    enabled: Number.isFinite(curriculumId) && curriculumId > 0,
  });

  const coursesOptionsQuery = useQuery({
    queryKey: ["admin-crud-options", "hocphan"],
    queryFn: () => adminCrudApi.list("hocphan", { page: 1, limit: 500 }),
  });

  const classesOptionsQuery = useQuery({
    queryKey: ["admin-crud-options", "lop"],
    queryFn: () => adminCrudApi.list("lop", { page: 1, limit: 500 }),
  });

  const courseOptions = useMemo(
    () =>
      buildOptions(
        coursesOptionsQuery.data?.items ?? [],
        "hocPhanId",
        "maHocPhan",
        "tenHocPhan",
      ),
    [coursesOptionsQuery.data?.items],
  );

  const classOptions = useMemo(
    () => buildOptions(classesOptionsQuery.data?.items ?? [], "lopId", "maLop", "tenLop"),
    [classesOptionsQuery.data?.items],
  );

  const assignedClassOptions = useMemo<SelectOption[]>(
    () =>
      (assignmentsQuery.data ?? []).map((assignment) => ({
        value: String(assignment.classId),
        label: assignment.classCode
          ? `${assignment.classCode} - ${assignment.className}`
          : assignment.className,
      })),
    [assignmentsQuery.data],
  );

  useEffect(() => {
    const assignments = assignmentsQuery.data ?? [];
    if (assignments.length === 0) {
      setSelectedClassId("");
      return;
    }

    if (!selectedClassId || !assignments.some((item) => String(item.classId) === selectedClassId)) {
      setSelectedClassId(String(assignments[0].classId));
    }
  }, [assignmentsQuery.data, selectedClassId]);

  const progressQuery = useQuery({
    queryKey: ["curriculum-class-progress", curriculumId, selectedClassId],
    queryFn: () => curriculumsApi.listProgress(curriculumId, Number(selectedClassId)),
    enabled: Number.isFinite(curriculumId) && curriculumId > 0 && Boolean(selectedClassId),
  });

  const addCourseMutation = useMutation({
    mutationFn: (values: CurriculumCourseFormValues) =>
      curriculumsApi.addCourse(curriculumId, values),
    onSuccess: async () => {
      showToast("success", "Thêm học phần vào CTĐT thành công");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["curriculum-courses", curriculumId] }),
        queryClient.invalidateQueries({ queryKey: ["curriculums"] }),
        queryClient.invalidateQueries({ queryKey: ["curriculum-detail", curriculumId] }),
      ]);
    },
    onError: (error) =>
      showToast("error", getApiErrorMessage(error, "Không thể thêm học phần")),
  });

  const updateCourseMutation = useMutation({
    mutationFn: (values: CurriculumCourseFormValues) =>
      editingCourse
        ? curriculumsApi.updateCourse(editingCourse.id, values)
        : Promise.reject(new Error("Chưa chọn học phần")),
    onSuccess: async () => {
      showToast("success", "Cập nhật học phần trong CTĐT thành công");
      setEditingCourse(null);
      await queryClient.invalidateQueries({ queryKey: ["curriculum-courses", curriculumId] });
    },
    onError: (error) =>
      showToast("error", getApiErrorMessage(error, "Không thể cập nhật học phần")),
  });

  const deleteCourseMutation = useMutation({
    mutationFn: (course: CurriculumCourse) => curriculumsApi.removeCourse(course.id),
    onSuccess: async () => {
      showToast("success", "Xóa học phần khỏi CTĐT thành công");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["curriculum-courses", curriculumId] }),
        queryClient.invalidateQueries({ queryKey: ["curriculums"] }),
        queryClient.invalidateQueries({ queryKey: ["curriculum-detail", curriculumId] }),
      ]);
    },
    onError: (error) =>
      showToast("error", getApiErrorMessage(error, "Không thể xóa học phần")),
  });

  const assignClassMutation = useMutation({
    mutationFn: (values: AssignCurriculumFormValues) =>
      curriculumsApi.assignClass(curriculumId, values),
    onSuccess: async (result) => {
      showToast(
        "success",
        `Đã gán lớp và sinh ${result.createdProgress}/${result.totalCourses} tiến độ học phần`,
      );
      setSelectedClassId(String(result.assignment.classId));
      setActiveTab("progress");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["curriculum-classes", curriculumId] }),
        queryClient.invalidateQueries({ queryKey: ["curriculum-class-progress", curriculumId] }),
        queryClient.invalidateQueries({ queryKey: ["curriculums"] }),
        queryClient.invalidateQueries({ queryKey: ["curriculum-detail", curriculumId] }),
      ]);
    },
    onError: (error) =>
      showToast("error", getApiErrorMessage(error, "Không thể gán CTĐT cho lớp")),
  });

  const updateProgressMutation = useMutation({
    mutationFn: ({ progressId, status }: { progressId: number; status: ClassCourseStatus }) =>
      curriculumsApi.updateProgressStatus(progressId, status),
    onSuccess: async () => {
      showToast("success", "Cập nhật tiến độ học phần thành công");
      await queryClient.invalidateQueries({
        queryKey: ["curriculum-class-progress", curriculumId, selectedClassId],
      });
    },
    onError: (error) =>
      showToast("error", getApiErrorMessage(error, "Không thể cập nhật tiến độ")),
  });

  if (!Number.isFinite(curriculumId) || curriculumId <= 0) {
    return (
      <ErrorState
        title="Đường dẫn không hợp lệ"
        description="ID chương trình đào tạo không đúng định dạng."
      />
    );
  }

  if (curriculumQuery.isError) {
    return (
      <ErrorState
        title="Không tải được chi tiết CTĐT"
        description={getApiErrorMessage(curriculumQuery.error, "Vui lòng thử lại sau.")}
        onAction={() => curriculumQuery.refetch()}
      />
    );
  }

  const curriculum = curriculumQuery.data;
  const detailTabs: Array<{ key: DetailTab; label: string; icon: typeof BookOpenCheck }> = [
    { key: "courses", label: "Học phần CTĐT", icon: BookOpenCheck },
    { key: "classes", label: "Lớp áp dụng", icon: Layers3 },
    { key: "progress", label: "Tiến độ lớp", icon: ListChecks },
  ];

  return (
    <section className="space-y-4">
      {toast ? <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} /> : null}

      <div className="text-sm">
        <Link className="font-medium text-slate-500 hover:text-brand-700" to="/admin/curriculums">
          Chương trình đào tạo
        </Link>
        <span className="mx-2 text-slate-300">/</span>
        <span className="font-semibold text-slate-950">{curriculum?.name ?? "Đang tải..."}</span>
      </div>

      <header className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 ring-1 ring-brand-100">
            <Route size={22} aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-slate-950">
              {curriculum?.name ?? "Đang tải CTĐT"}
            </h1>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
              Quản lý học phần, lớp áp dụng và tiến độ học phần của CTĐT.
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-md bg-slate-100 px-2.5 py-1 text-slate-700">
                {curriculum?.code ?? "-"}
              </span>
              <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-emerald-700">
                {coursesQuery.data?.length ?? curriculum?.courseCount ?? 0} học phần
              </span>
              <span className="rounded-md bg-sky-50 px-2.5 py-1 text-sky-700">
                {assignmentsQuery.data?.length ?? curriculum?.classCount ?? 0} lớp áp dụng
              </span>
            </div>
          </div>
        </div>
      </header>

      <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <h2 className="truncate text-lg font-bold text-slate-950">
                {curriculum?.majorName ?? "-"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {curriculum?.cohortName ?? "-"} · {curriculum?.totalCredits ?? 0} tín chỉ
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {detailTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;

                return (
                  <button
                    key={tab.key}
                    type="button"
                    className={[
                      "inline-flex min-h-10 items-center gap-2 rounded-md px-3 text-sm font-semibold transition",
                      isActive
                        ? "bg-brand-700 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-brand-50 hover:text-brand-800",
                    ].join(" ")}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    <Icon size={16} aria-hidden="true" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-5 p-4">
          {activeTab === "courses" ? (
            <>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-sm font-bold text-slate-950">Thêm học phần vào CTĐT</h3>
                <div className="mt-4">
                  <CurriculumCourseForm
                    courseOptions={courseOptions}
                    isSubmitting={addCourseMutation.isPending}
                    onSubmit={(values) => addCourseMutation.mutate(values)}
                  />
                </div>
              </div>
              <CurriculumCourseTable
                rows={coursesQuery.data ?? []}
                isLoading={coursesQuery.isLoading}
                deletingId={deleteCourseMutation.isPending ? deleteCourseMutation.variables?.id : null}
                onEdit={(course) => setEditingCourse(course)}
                onDelete={(course) => deleteCourseMutation.mutate(course)}
              />
            </>
          ) : null}

          {activeTab === "classes" ? (
            <>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-sm font-bold text-slate-950">Gán CTĐT cho lớp</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Khi gán lớp, hệ thống tự sinh tiến độ học phần từ danh sách học phần của CTĐT.
                </p>
                <div className="mt-4">
                  <AssignCurriculumForm
                    classOptions={classOptions}
                    isSubmitting={assignClassMutation.isPending}
                    onSubmit={(values) => assignClassMutation.mutate(values)}
                  />
                </div>
              </div>
              <CurriculumAssignmentTable
                rows={assignmentsQuery.data ?? []}
                isLoading={assignmentsQuery.isLoading}
                onSelectClass={(classId) => {
                  setSelectedClassId(String(classId));
                  setActiveTab("progress");
                }}
              />
            </>
          ) : null}

          {activeTab === "progress" ? (
            <>
              <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
                <SelectInput
                  label="Lớp cần xem tiến độ"
                  name="selectedClassId"
                  options={assignedClassOptions}
                  placeholder="Chọn lớp đã áp dụng CTĐT"
                  value={selectedClassId}
                  onChange={(event) => setSelectedClassId(event.target.value)}
                />
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  Tiến độ được sinh từ học phần trong CTĐT. Có thể cập nhật nhanh trạng thái
                  để kế hoạch đào tạo dùng làm dữ liệu gợi ý.
                </div>
              </div>
              <ClassProgressTable
                rows={progressQuery.data ?? []}
                isLoading={progressQuery.isLoading}
                updatingId={
                  updateProgressMutation.isPending
                    ? updateProgressMutation.variables?.progressId
                    : null
                }
                onUpdateStatus={(progressId, status) =>
                  updateProgressMutation.mutate({ progressId, status })
                }
              />
            </>
          ) : null}
        </div>
      </section>

      <FormModal
        isOpen={Boolean(editingCourse)}
        title="Cập nhật học phần trong CTĐT"
        onClose={() => {
          if (!updateCourseMutation.isPending) {
            setEditingCourse(null);
          }
        }}
      >
        <CurriculumCourseForm
          initialData={editingCourse}
          courseOptions={courseOptions}
          isSubmitting={updateCourseMutation.isPending}
          onCancel={() => setEditingCourse(null)}
          onSubmit={(values) => updateCourseMutation.mutate(values)}
        />
      </FormModal>
    </section>
  );
}
