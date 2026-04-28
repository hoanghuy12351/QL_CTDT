import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BookOpenCheck, Layers3, ListChecks, Plus, Route } from "lucide-react";
import { adminCrudApi } from "../../api/adminCrud.api";
import { curriculumsApi } from "../../api/admin/curriculums.api";
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
import type { AdminCrudRecord } from "../admin/crud/adminCrud.types";
import AssignCurriculumForm from "./AssignCurriculumForm";
import ClassProgressTable from "./ClassProgressTable";
import CurriculumAssignmentTable from "./CurriculumAssignmentTable";
import CurriculumCourseForm from "./CurriculumCourseForm";
import CurriculumCourseTable from "./CurriculumCourseTable";
import CurriculumForm from "./CurriculumForm";
import CurriculumTable from "./CurriculumTable";
import type {
  AssignCurriculumFormValues,
  ClassCourseStatus,
  Curriculum,
  CurriculumCourse,
  CurriculumCourseFormValues,
  CurriculumFormValues,
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

const showToastFor = (
  setToast: (toast: ToastState) => void,
  type: ToastType,
  message: string,
) => setToast({ type, message });

export default function CurriculumPage() {
  const queryClient = useQueryClient();
  const formDisclosure = useDisclosure();
  const deleteDisclosure = useDisclosure();
  const courseEditDisclosure = useDisclosure();

  const { limit, page, resetPage, setLimit, setPage } = usePagination({
    initialLimit: 10,
  });

  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 400);
  const [selectedCurriculum, setSelectedCurriculum] = useState<Curriculum | null>(null);
  const [deletingCurriculum, setDeletingCurriculum] = useState<Curriculum | null>(null);
  const [editingCurriculum, setEditingCurriculum] = useState<Curriculum | null>(null);
  const [editingCourse, setEditingCourse] = useState<CurriculumCourse | null>(null);
  const [activeTab, setActiveTab] = useState<DetailTab>("courses");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    resetPage();
  }, [debouncedKeyword, resetPage]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const listQuery = useQuery({
    queryKey: ["curriculums", page, limit, debouncedKeyword.trim()],
    queryFn: () =>
      curriculumsApi.list({
        page,
        limit,
        keyword: debouncedKeyword.trim() || undefined,
      }),
  });

  const rows = useMemo(() => listQuery.data?.items ?? [], [listQuery.data?.items]);
  const pagination = listQuery.data?.pagination ?? {
    page,
    limit,
    totalItems: 0,
    totalPages: 1,
  };

  useEffect(() => {
    if (rows.length === 0) {
      setSelectedCurriculum(null);
      return;
    }

    setSelectedCurriculum((current) => {
      if (!current) return rows[0];
      return rows.find((row) => row.id === current.id) ?? rows[0];
    });
  }, [rows]);

  const selectedCurriculumId = selectedCurriculum?.id ?? 0;

  const majorsQuery = useQuery({
    queryKey: ["admin-crud-options", "nganh"],
    queryFn: () => adminCrudApi.list("nganh", { page: 1, limit: 500 }),
  });
  const specializationsQuery = useQuery({
    queryKey: ["admin-crud-options", "chuyen-nganh"],
    queryFn: () => adminCrudApi.list("chuyen-nganh", { page: 1, limit: 500 }),
  });
  const cohortsQuery = useQuery({
    queryKey: ["admin-crud-options", "khoa-hoc"],
    queryFn: () => adminCrudApi.list("khoa-hoc", { page: 1, limit: 500 }),
  });
  const coursesOptionsQuery = useQuery({
    queryKey: ["admin-crud-options", "hocphan"],
    queryFn: () => adminCrudApi.list("hocphan", { page: 1, limit: 500 }),
  });
  const classesOptionsQuery = useQuery({
    queryKey: ["admin-crud-options", "lop"],
    queryFn: () => adminCrudApi.list("lop", { page: 1, limit: 500 }),
  });

  const majorOptions = useMemo(
    () => buildOptions(majorsQuery.data?.items ?? [], "nganhId", "maNganh", "tenNganh"),
    [majorsQuery.data?.items],
  );
  const specializationOptions = useMemo(
    () =>
      buildOptions(
        specializationsQuery.data?.items ?? [],
        "chuyenNganhId",
        "maChuyenNganh",
        "tenChuyenNganh",
      ),
    [specializationsQuery.data?.items],
  );
  const cohortOptions = useMemo(
    () =>
      buildOptions(cohortsQuery.data?.items ?? [], "khoaHocId", "maKhoaHoc", "tenKhoaHoc"),
    [cohortsQuery.data?.items],
  );
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

  const coursesQuery = useQuery({
    queryKey: ["curriculum-courses", selectedCurriculumId],
    queryFn: () => curriculumsApi.listCourses(selectedCurriculumId),
    enabled: selectedCurriculumId > 0,
  });

  const assignmentsQuery = useQuery({
    queryKey: ["curriculum-classes", selectedCurriculumId],
    queryFn: () => curriculumsApi.listAssignments(selectedCurriculumId),
    enabled: selectedCurriculumId > 0,
  });

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
    queryKey: ["curriculum-class-progress", selectedCurriculumId, selectedClassId],
    queryFn: () => curriculumsApi.listProgress(selectedCurriculumId, Number(selectedClassId)),
    enabled: selectedCurriculumId > 0 && Boolean(selectedClassId),
  });

  const saveCurriculumMutation = useMutation({
    mutationFn: (values: CurriculumFormValues) => {
      if (editingCurriculum) {
        return curriculumsApi.update(editingCurriculum.id, values);
      }
      return curriculumsApi.create(values);
    },
    onSuccess: async (curriculum) => {
      showToastFor(
        setToast,
        "success",
        editingCurriculum ? "Cập nhật CTĐT thành công" : "Tạo CTĐT thành công",
      );
      setSelectedCurriculum(curriculum);
      setEditingCurriculum(null);
      formDisclosure.close();
      await queryClient.invalidateQueries({ queryKey: ["curriculums"] });
    },
    onError: (error) =>
      showToastFor(setToast, "error", getApiErrorMessage(error, "Không thể lưu CTĐT")),
  });

  const deleteCurriculumMutation = useMutation({
    mutationFn: (curriculum: Curriculum) => curriculumsApi.remove(curriculum.id),
    onSuccess: async () => {
      showToastFor(setToast, "success", "Xóa CTĐT thành công");
      setDeletingCurriculum(null);
      deleteDisclosure.close();
      await queryClient.invalidateQueries({ queryKey: ["curriculums"] });
    },
    onError: (error) =>
      showToastFor(setToast, "error", getApiErrorMessage(error, "Không thể xóa CTĐT")),
  });

  const addCourseMutation = useMutation({
    mutationFn: (values: CurriculumCourseFormValues) =>
      curriculumsApi.addCourse(selectedCurriculumId, values),
    onSuccess: async () => {
      showToastFor(setToast, "success", "Thêm học phần vào CTĐT thành công");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["curriculum-courses", selectedCurriculumId] }),
        queryClient.invalidateQueries({ queryKey: ["curriculums"] }),
      ]);
    },
    onError: (error) =>
      showToastFor(setToast, "error", getApiErrorMessage(error, "Không thể thêm học phần")),
  });

  const updateCourseMutation = useMutation({
    mutationFn: (values: CurriculumCourseFormValues) =>
      editingCourse
        ? curriculumsApi.updateCourse(editingCourse.id, values)
        : Promise.reject(new Error("Chưa chọn học phần")),
    onSuccess: async () => {
      showToastFor(setToast, "success", "Cập nhật học phần trong CTĐT thành công");
      setEditingCourse(null);
      courseEditDisclosure.close();
      await queryClient.invalidateQueries({ queryKey: ["curriculum-courses", selectedCurriculumId] });
    },
    onError: (error) =>
      showToastFor(setToast, "error", getApiErrorMessage(error, "Không thể cập nhật học phần")),
  });

  const deleteCourseMutation = useMutation({
    mutationFn: (course: CurriculumCourse) => curriculumsApi.removeCourse(course.id),
    onSuccess: async () => {
      showToastFor(setToast, "success", "Xóa học phần khỏi CTĐT thành công");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["curriculum-courses", selectedCurriculumId] }),
        queryClient.invalidateQueries({ queryKey: ["curriculums"] }),
      ]);
    },
    onError: (error) =>
      showToastFor(setToast, "error", getApiErrorMessage(error, "Không thể xóa học phần")),
  });

  const assignClassMutation = useMutation({
    mutationFn: (values: AssignCurriculumFormValues) =>
      curriculumsApi.assignClass(selectedCurriculumId, values),
    onSuccess: async (result) => {
      showToastFor(
        setToast,
        "success",
        `Đã gán lớp và sinh ${result.createdProgress}/${result.totalCourses} tiến độ học phần`,
      );
      setSelectedClassId(String(result.assignment.classId));
      setActiveTab("progress");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["curriculum-classes", selectedCurriculumId] }),
        queryClient.invalidateQueries({ queryKey: ["curriculum-class-progress", selectedCurriculumId] }),
        queryClient.invalidateQueries({ queryKey: ["curriculums"] }),
      ]);
    },
    onError: (error) =>
      showToastFor(setToast, "error", getApiErrorMessage(error, "Không thể gán CTĐT cho lớp")),
  });

  const updateProgressMutation = useMutation({
    mutationFn: ({ progressId, status }: { progressId: number; status: ClassCourseStatus }) =>
      curriculumsApi.updateProgressStatus(progressId, status),
    onSuccess: async () => {
      showToastFor(setToast, "success", "Cập nhật tiến độ học phần thành công");
      await queryClient.invalidateQueries({
        queryKey: ["curriculum-class-progress", selectedCurriculumId, selectedClassId],
      });
    },
    onError: (error) =>
      showToastFor(setToast, "error", getApiErrorMessage(error, "Không thể cập nhật tiến độ")),
  });

  const openCreateForm = () => {
    setEditingCurriculum(null);
    formDisclosure.open();
  };

  const openEditForm = (curriculum: Curriculum) => {
    setEditingCurriculum(curriculum);
    formDisclosure.open();
  };

  const openDeleteDialog = (curriculum: Curriculum) => {
    setDeletingCurriculum(curriculum);
    deleteDisclosure.open();
  };

  const openCourseEdit = (course: CurriculumCourse) => {
    setEditingCourse(course);
    courseEditDisclosure.open();
  };

  const detailTabs: Array<{ key: DetailTab; label: string; icon: typeof BookOpenCheck }> = [
    { key: "courses", label: "Học phần CTĐT", icon: BookOpenCheck },
    { key: "classes", label: "Lớp áp dụng", icon: Layers3 },
    { key: "progress", label: "Tiến độ lớp", icon: ListChecks },
  ];

  return (
    <section className="space-y-4">
      {toast ? (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      ) : null}

      <div className="text-sm">
        <span className="font-medium text-slate-500">Quản trị</span>
        <span className="mx-2 text-slate-300">/</span>
        <span className="font-semibold text-slate-950">Chương trình đào tạo</span>
      </div>

      <header className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 ring-1 ring-brand-100">
              <Route size={22} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-slate-950">Chương trình đào tạo</h1>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
                Quản lý khung học phần theo ngành, chuyên ngành, khóa học; gán CTĐT cho lớp và sinh tiến độ học phần để phục vụ kế hoạch đào tạo.
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-slate-700">
                  {pagination.totalItems} CTĐT
                </span>
                <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-emerald-700">
                  {selectedCurriculum?.courseCount ?? 0} học phần đang chọn
                </span>
                <span className="rounded-md bg-sky-50 px-2.5 py-1 text-sky-700">
                  {selectedCurriculum?.classCount ?? 0} lớp áp dụng
                </span>
              </div>
            </div>
          </div>
          <Button
            type="button"
            className="w-full lg:w-auto"
            leftIcon={<Plus size={16} aria-hidden="true" />}
            onClick={openCreateForm}
          >
            Thêm CTĐT
          </Button>
        </div>
      </header>

      <AdminCrudToolbar
        keyword={keyword}
        searchPlaceholder="Tìm mã CTĐT, tên chương trình, ngành, khóa học..."
        isSearching={listQuery.isFetching}
        onKeywordChange={setKeyword}
        onSearch={() => listQuery.refetch()}
        onReset={() => {
          setKeyword("");
          resetPage();
        }}
        leftSlot={
          <span className="text-sm font-medium text-slate-500">
            Chọn một CTĐT trong bảng để quản lý học phần và lớp áp dụng.
          </span>
        }
      />

      {listQuery.isError ? (
        <ErrorState
          title="Không tải được danh sách CTĐT"
          description={getApiErrorMessage(listQuery.error, "Vui lòng kiểm tra backend hoặc thử lại sau.")}
          onAction={() => listQuery.refetch()}
        />
      ) : rows.length === 0 && !listQuery.isLoading ? (
        <EmptyState
          icon={<Route size={22} aria-hidden="true" />}
          title="Chưa có chương trình đào tạo"
          description="Tạo CTĐT đầu tiên, sau đó thêm học phần và gán cho lớp để hệ thống sinh tiến độ."
          actionLabel="Thêm CTĐT"
          onAction={openCreateForm}
        />
      ) : (
        <CurriculumTable
          rows={rows}
          page={page}
          limit={limit}
          selectedId={selectedCurriculum?.id}
          isLoading={listQuery.isLoading}
          deletingId={deleteCurriculumMutation.isPending ? deletingCurriculum?.id : null}
          onSelect={(curriculum) => setSelectedCurriculum(curriculum)}
          onEdit={openEditForm}
          onDelete={openDeleteDialog}
        />
      )}

      <AdminCrudPagination
        pagination={pagination}
        isLoading={listQuery.isFetching}
        onPageChange={setPage}
        onLimitChange={setLimit}
      />

      {selectedCurriculum ? (
        <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <h2 className="truncate text-lg font-bold text-slate-950">
                  {selectedCurriculum.name}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {selectedCurriculum.code} · {selectedCurriculum.majorName} · {selectedCurriculum.totalCredits} tín chỉ
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
                  deletingId={deleteCourseMutation.isPending ? undefined : null}
                  onEdit={openCourseEdit}
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
                    Tiến độ được sinh từ học phần trong CTĐT. Có thể cập nhật nhanh trạng thái “đang học” hoặc “đã học” để kế hoạch đào tạo sau này dùng làm dữ liệu gợi ý.
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
      ) : null}

      <FormModal
        isOpen={formDisclosure.isOpen}
        title={editingCurriculum ? "Cập nhật CTĐT" : "Thêm CTĐT"}
        onClose={() => {
          if (!saveCurriculumMutation.isPending) {
            setEditingCurriculum(null);
            formDisclosure.close();
          }
        }}
      >
        <CurriculumForm
          initialData={editingCurriculum}
          isSubmitting={saveCurriculumMutation.isPending}
          majorOptions={majorOptions}
          specializationOptions={specializationOptions}
          cohortOptions={cohortOptions}
          onCancel={() => {
            setEditingCurriculum(null);
            formDisclosure.close();
          }}
          onSubmit={(values) => saveCurriculumMutation.mutate(values)}
        />
      </FormModal>

      <FormModal
        isOpen={courseEditDisclosure.isOpen}
        title="Cập nhật học phần trong CTĐT"
        onClose={() => {
          if (!updateCourseMutation.isPending) {
            setEditingCourse(null);
            courseEditDisclosure.close();
          }
        }}
      >
        <CurriculumCourseForm
          initialData={editingCourse}
          courseOptions={courseOptions}
          isSubmitting={updateCourseMutation.isPending}
          onCancel={() => {
            setEditingCourse(null);
            courseEditDisclosure.close();
          }}
          onSubmit={(values) => updateCourseMutation.mutate(values)}
        />
      </FormModal>

      <ConfirmDeleteDialog
        isOpen={deleteDisclosure.isOpen}
        itemName={deletingCurriculum?.name}
        isDeleting={deleteCurriculumMutation.isPending}
        description={
          deletingCurriculum
            ? `Bạn có chắc chắn muốn xóa CTĐT "${deletingCurriculum.name}" không?`
            : undefined
        }
        onCancel={() => {
          if (!deleteCurriculumMutation.isPending) {
            setDeletingCurriculum(null);
            deleteDisclosure.close();
          }
        }}
        onConfirm={() => {
          if (deletingCurriculum) {
            deleteCurriculumMutation.mutate(deletingCurriculum);
          }
        }}
      />
    </section>
  );
}
