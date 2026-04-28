import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarRange, ClipboardList, Lightbulb, Plus, Save } from "lucide-react";
import { adminCrudApi } from "../../api/adminCrud.api";
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
import type { AdminCrudRecord } from "../admin/crud/adminCrud.types";
import OpenedSubjectTable from "./OpenedSubjectTable";
import SemesterPlanForm from "./SemesterPlanForm";
import SuggestionMatrix from "./SuggestionMatrix";
import TrainingPlanForm from "./TrainingPlanForm";
import TrainingPlanTable from "./TrainingPlanTable";
import type {
  SuggestionMatrix as SuggestionMatrixType,
  TrainingPlan,
  TrainingPlanFormValues,
} from "./trainingPlan.types";

type ToastState = {
  type: ToastType;
  message: string;
};

const buildOptions = (
  rows: AdminCrudRecord[],
  idKey: string,
  codeKey: string,
  nameKey?: string,
): SelectOption[] =>
  rows.map((row) => {
    const code = String(row[codeKey] ?? "").trim();
    const name = nameKey ? String(row[nameKey] ?? "").trim() : "";

    return {
      value: String(row[idKey] ?? ""),
      label: name ? `${code} - ${name}` : code,
    };
  });

export default function TrainingPlanPage() {
  const queryClient = useQueryClient();
  const formDisclosure = useDisclosure();
  const deleteDisclosure = useDisclosure();
  const { limit, page, resetPage, setLimit, setPage } = usePagination({ initialLimit: 10 });

  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 400);
  const [selectedPlan, setSelectedPlan] = useState<TrainingPlan | null>(null);
  const [editingPlan, setEditingPlan] = useState<TrainingPlan | null>(null);
  const [deletingPlan, setDeletingPlan] = useState<TrainingPlan | null>(null);
  const [selectedSemesterPlanId, setSelectedSemesterPlanId] = useState("");
  const [selectedClassIds, setSelectedClassIds] = useState<number[]>([]);
  const [suggestionMatrix, setSuggestionMatrix] = useState<SuggestionMatrixType | null>(null);
  const [selectedMatrixKeys, setSelectedMatrixKeys] = useState<string[]>([]);
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    resetPage();
  }, [debouncedKeyword, resetPage]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = (type: ToastType, message: string) => setToast({ type, message });

  const plansQuery = useQuery({
    queryKey: ["training-plans", page, limit, debouncedKeyword.trim()],
    queryFn: () =>
      trainingPlansApi.list({
        page,
        limit,
        keyword: debouncedKeyword.trim() || undefined,
      }),
  });

  const rows = useMemo(() => plansQuery.data?.items ?? [], [plansQuery.data?.items]);
  const pagination = plansQuery.data?.pagination ?? {
    page,
    limit,
    totalItems: 0,
    totalPages: 1,
  };

  useEffect(() => {
    if (rows.length === 0) {
      setSelectedPlan(null);
      return;
    }
    setSelectedPlan((current) => {
      if (!current) return rows[0];
      return rows.find((row) => row.id === current.id) ?? rows[0];
    });
  }, [rows]);

  const selectedPlanId = selectedPlan?.id ?? 0;

  const semesterPlansQuery = useQuery({
    queryKey: ["semester-plans", selectedPlanId],
    queryFn: () =>
      trainingPlansApi.listSemesterPlans({
        page: 1,
        limit: 100,
        keHoachId: selectedPlanId,
      }),
    enabled: selectedPlanId > 0,
  });

  const semesterPlans = useMemo(
    () => semesterPlansQuery.data?.items ?? [],
    [semesterPlansQuery.data?.items],
  );
  const semesterPlanOptions = useMemo<SelectOption[]>(
    () =>
      semesterPlans.map((semesterPlan) => ({
        value: String(semesterPlan.id),
        label: `${semesterPlan.name} · ${semesterPlan.openedCount} học phần`,
      })),
    [semesterPlans],
  );

  useEffect(() => {
    if (semesterPlans.length === 0) {
      setSelectedSemesterPlanId("");
      return;
    }
    if (
      !selectedSemesterPlanId ||
      !semesterPlans.some((semesterPlan) => String(semesterPlan.id) === selectedSemesterPlanId)
    ) {
      setSelectedSemesterPlanId(String(semesterPlans[0].id));
    }
  }, [selectedSemesterPlanId, semesterPlans]);

  const selectedSemesterPlan = semesterPlans.find(
    (semesterPlan) => String(semesterPlan.id) === selectedSemesterPlanId,
  );

  const schoolYearsQuery = useQuery({
    queryKey: ["admin-crud-options", "nam-hoc"],
    queryFn: () => adminCrudApi.list("nam-hoc", { page: 1, limit: 500 }),
  });
  const facultiesQuery = useQuery({
    queryKey: ["admin-crud-options", "khoa"],
    queryFn: () => adminCrudApi.list("khoa", { page: 1, limit: 500 }),
  });
  const semestersQuery = useQuery({
    queryKey: ["admin-crud-options", "hoc-ky"],
    queryFn: () => adminCrudApi.list("hoc-ky", { page: 1, limit: 500 }),
  });
  const classesQuery = useQuery({
    queryKey: ["admin-crud-options", "lop"],
    queryFn: () => adminCrudApi.list("lop", { page: 1, limit: 500 }),
  });

  const schoolYearOptions = useMemo(
    () => buildOptions(schoolYearsQuery.data?.items ?? [], "namHocId", "maNamHoc"),
    [schoolYearsQuery.data?.items],
  );
  const facultyOptions = useMemo(
    () => buildOptions(facultiesQuery.data?.items ?? [], "khoaId", "maKhoa", "tenKhoa"),
    [facultiesQuery.data?.items],
  );
  const semesterOptions = useMemo(
    () => buildOptions(semestersQuery.data?.items ?? [], "hocKyId", "maHocKy", "tenHocKy"),
    [semestersQuery.data?.items],
  );
  const classOptions = useMemo(
    () => buildOptions(classesQuery.data?.items ?? [], "lopId", "maLop", "tenLop"),
    [classesQuery.data?.items],
  );

  const openedSubjectsQuery = useQuery({
    queryKey: ["opened-subjects", selectedSemesterPlanId],
    queryFn: () => trainingPlansApi.listOpenedSubjects(Number(selectedSemesterPlanId)),
    enabled: Boolean(selectedSemesterPlanId),
  });

  const savePlanMutation = useMutation({
    mutationFn: (values: TrainingPlanFormValues) =>
      editingPlan ? trainingPlansApi.update(editingPlan.id, values) : trainingPlansApi.create(values),
    onSuccess: async (plan) => {
      showToast("success", editingPlan ? "Cập nhật kế hoạch thành công" : "Tạo kế hoạch thành công");
      setSelectedPlan(plan);
      setEditingPlan(null);
      formDisclosure.close();
      await queryClient.invalidateQueries({ queryKey: ["training-plans"] });
    },
    onError: (error) =>
      showToast("error", getApiErrorMessage(error, "Không thể lưu kế hoạch đào tạo")),
  });

  const deletePlanMutation = useMutation({
    mutationFn: (plan: TrainingPlan) => trainingPlansApi.remove(plan.id),
    onSuccess: async () => {
      showToast("success", "Xóa kế hoạch đào tạo thành công");
      setDeletingPlan(null);
      deleteDisclosure.close();
      await queryClient.invalidateQueries({ queryKey: ["training-plans"] });
    },
    onError: (error) =>
      showToast("error", getApiErrorMessage(error, "Không thể xóa kế hoạch đào tạo")),
  });

  const createSemesterPlanMutation = useMutation({
    mutationFn: trainingPlansApi.createSemesterPlan,
    onSuccess: async (semesterPlan) => {
      showToast("success", "Tạo kế hoạch học kỳ thành công");
      setSelectedSemesterPlanId(String(semesterPlan.id));
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["semester-plans", selectedPlanId] }),
        queryClient.invalidateQueries({ queryKey: ["training-plans"] }),
      ]);
    },
    onError: (error) =>
      showToast("error", getApiErrorMessage(error, "Không thể tạo kế hoạch học kỳ")),
  });

  const suggestMutation = useMutation({
    mutationFn: () =>
      trainingPlansApi.suggestCourses({
        keHoachHocKyId: Number(selectedSemesterPlanId),
        lopIds: selectedClassIds,
      }),
    onSuccess: (matrix) => {
      setSuggestionMatrix(matrix);
      setSelectedMatrixKeys(matrix.cells.map((cell) => `${cell.classId}-${cell.courseId}`));
      showToast("success", "Đã lấy gợi ý học phần");
    },
    onError: (error) =>
      showToast("error", getApiErrorMessage(error, "Không thể lấy gợi ý học phần")),
  });

  const openCoursesMutation = useMutation({
    mutationFn: () => {
      const cellMap = new Map(
        (suggestionMatrix?.cells ?? []).map((cell) => [`${cell.classId}-${cell.courseId}`, cell]),
      );

      return trainingPlansApi.openCourses({
        keHoachHocKyId: Number(selectedSemesterPlanId),
        items: selectedMatrixKeys
          .map((key) => cellMap.get(key))
          .filter((cell): cell is NonNullable<typeof cell> => Boolean(cell))
          .map((cell) => ({
            lopId: cell.classId,
            hocPhanId: cell.courseId,
            chuongTrinhHocPhanId: cell.curriculumCourseId,
            tienDo: cell.progress,
          })),
      });
    },
    onSuccess: async (items) => {
      showToast("success", `Đã lưu ${items.length} lớp - học phần vào kế hoạch`);
      setSuggestionMatrix(null);
      setSelectedMatrixKeys([]);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["opened-subjects", selectedSemesterPlanId] }),
        queryClient.invalidateQueries({ queryKey: ["semester-plans", selectedPlanId] }),
      ]);
    },
    onError: (error) =>
      showToast("error", getApiErrorMessage(error, "Không thể lưu học phần mở")),
  });

  const toggleClass = (id: number) => {
    setSelectedClassIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const openCreateForm = () => {
    setEditingPlan(null);
    formDisclosure.open();
  };

  const openEditForm = (plan: TrainingPlan) => {
    setEditingPlan(plan);
    formDisclosure.open();
  };

  const openDeleteDialog = (plan: TrainingPlan) => {
    setDeletingPlan(plan);
    deleteDisclosure.open();
  };

  return (
    <section className="space-y-4">
      {toast ? <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} /> : null}

      <div className="text-sm">
        <span className="font-medium text-slate-500">Quản trị</span>
        <span className="mx-2 text-slate-300">/</span>
        <span className="font-semibold text-slate-950">Kế hoạch đào tạo</span>
      </div>

      <header className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 ring-1 ring-brand-100">
              <ClipboardList size={22} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-slate-950">Kế hoạch đào tạo học kỳ</h1>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
                Lập kế hoạch mở học phần theo năm học, học kỳ và lớp dựa trên CTĐT cùng tiến độ học phần của từng lớp.
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-slate-700">
                  {pagination.totalItems} kế hoạch
                </span>
                <span className="rounded-md bg-sky-50 px-2.5 py-1 text-sky-700">
                  {semesterPlans.length} học kỳ của kế hoạch đang chọn
                </span>
                <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-emerald-700">
                  {openedSubjectsQuery.data?.length ?? 0} lớp - học phần đã lưu
                </span>
              </div>
            </div>
          </div>
          <Button className="w-full lg:w-auto" leftIcon={<Plus size={16} aria-hidden="true" />} onClick={openCreateForm}>
            Thêm kế hoạch
          </Button>
        </div>
      </header>

      <AdminCrudToolbar
        keyword={keyword}
        searchPlaceholder="Tìm mã kế hoạch, tên kế hoạch, năm học, khoa..."
        isSearching={plansQuery.isFetching}
        onKeywordChange={setKeyword}
        onSearch={() => plansQuery.refetch()}
        onReset={() => {
          setKeyword("");
          resetPage();
        }}
        leftSlot={<span className="text-sm font-medium text-slate-500">Chọn kế hoạch để tạo học kỳ và lập ma trận mở học phần.</span>}
      />

      {plansQuery.isError ? (
        <ErrorState
          title="Không tải được danh sách kế hoạch"
          description={getApiErrorMessage(plansQuery.error, "Vui lòng thử lại sau.")}
          onAction={() => plansQuery.refetch()}
        />
      ) : rows.length === 0 && !plansQuery.isLoading ? (
        <EmptyState
          icon={<ClipboardList size={22} aria-hidden="true" />}
          title="Chưa có kế hoạch đào tạo"
          description="Tạo kế hoạch theo năm học trước, sau đó tạo kế hoạch học kỳ và chọn lớp để lấy gợi ý học phần."
          actionLabel="Thêm kế hoạch"
          onAction={openCreateForm}
        />
      ) : (
        <TrainingPlanTable
          rows={rows}
          selectedId={selectedPlan?.id}
          isLoading={plansQuery.isLoading}
          deletingId={deletePlanMutation.isPending ? deletingPlan?.id : null}
          onSelect={(plan) => {
            setSelectedPlan(plan);
            setSuggestionMatrix(null);
            setSelectedMatrixKeys([]);
          }}
          onEdit={openEditForm}
          onDelete={openDeleteDialog}
        />
      )}

      <AdminCrudPagination
        pagination={pagination}
        isLoading={plansQuery.isFetching}
        onPageChange={setPage}
        onLimitChange={setLimit}
      />

      {selectedPlan ? (
        <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-950">{selectedPlan.name}</h2>
              <p className="mt-1 text-sm text-slate-500">
                {selectedPlan.schoolYearName} · {selectedPlan.facultyName}
              </p>
            </div>
            <SelectInput
              className="lg:w-[360px]"
              label="Kế hoạch học kỳ"
              options={semesterPlanOptions}
              placeholder="Chưa có kế hoạch học kỳ"
              value={selectedSemesterPlanId}
              onChange={(event) => {
                setSelectedSemesterPlanId(event.target.value);
                setSuggestionMatrix(null);
              }}
            />
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-950">
              <CalendarRange size={16} aria-hidden="true" />
              Bước 1: Tạo kế hoạch học kỳ
            </h3>
            <div className="mt-4">
              <SemesterPlanForm
                trainingPlan={selectedPlan}
                semesterOptions={semesterOptions}
                isSubmitting={createSemesterPlanMutation.isPending}
                onSubmit={(values) => createSemesterPlanMutation.mutate(values)}
              />
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-950">
              <Lightbulb size={16} aria-hidden="true" />
              Bước 2: Chọn lớp và lấy gợi ý học phần
            </h3>
            <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
              <div className="max-h-72 overflow-auto rounded-lg border border-slate-200">
                <div className="grid divide-y divide-slate-100">
                  {classOptions.map((option) => {
                    const id = Number(option.value);
                    return (
                      <label key={option.value} className="flex cursor-pointer items-center gap-3 px-3 py-2 text-sm hover:bg-slate-50">
                        <input
                          type="checkbox"
                          className="size-4 rounded border-slate-300 text-brand-600 focus:ring-brand-200"
                          checked={selectedClassIds.includes(id)}
                          onChange={() => toggleClass(id)}
                        />
                        <span className="font-medium text-slate-700">{option.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-3">
                <Button
                  className="w-full"
                  variant="secondary"
                  disabled={!selectedSemesterPlan || selectedClassIds.length === 0}
                  isLoading={suggestMutation.isPending}
                  onClick={() => suggestMutation.mutate()}
                >
                  Lấy gợi ý học phần
                </Button>
                <p className="text-sm leading-6 text-slate-500">
                  Chỉ các học phần thuộc CTĐT của lớp và còn trạng thái chưa học mới được đưa vào ma trận.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-950">Bước 3: Ma trận lớp x học phần</h3>
                <p className="mt-1 text-sm text-slate-500">Tick các ô cần mở trong kế hoạch học kỳ đang chọn.</p>
              </div>
              <Button
                disabled={!suggestionMatrix || selectedMatrixKeys.length === 0}
                isLoading={openCoursesMutation.isPending}
                leftIcon={<Save size={16} aria-hidden="true" />}
                onClick={() => openCoursesMutation.mutate()}
              >
                Lưu học phần mở
              </Button>
            </div>
            <SuggestionMatrix
              matrix={suggestionMatrix ?? { classes: [], courses: [], cells: [] }}
              selectedKeys={selectedMatrixKeys}
              onToggle={(key) =>
                setSelectedMatrixKeys((current) =>
                  current.includes(key) ? current.filter((item) => item !== key) : [...current, key],
                )
              }
            />
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-950">Bước 4: Kết quả đã lưu</h3>
            <OpenedSubjectTable rows={openedSubjectsQuery.data ?? []} />
          </div>
        </section>
      ) : null}

      <FormModal
        isOpen={formDisclosure.isOpen}
        title={editingPlan ? "Cập nhật kế hoạch đào tạo" : "Thêm kế hoạch đào tạo"}
        onClose={() => {
          if (!savePlanMutation.isPending) {
            setEditingPlan(null);
            formDisclosure.close();
          }
        }}
      >
        <TrainingPlanForm
          initialData={editingPlan}
          schoolYearOptions={schoolYearOptions}
          facultyOptions={facultyOptions}
          isSubmitting={savePlanMutation.isPending}
          onCancel={() => {
            setEditingPlan(null);
            formDisclosure.close();
          }}
          onSubmit={(values) => savePlanMutation.mutate(values)}
        />
      </FormModal>

      <ConfirmDeleteDialog
        isOpen={deleteDisclosure.isOpen}
        itemName={deletingPlan?.name}
        isDeleting={deletePlanMutation.isPending}
        description={
          deletingPlan
            ? `Bạn có chắc chắn muốn xóa kế hoạch "${deletingPlan.name}" không? Nếu đã có kế hoạch học kỳ, backend sẽ chặn xóa.`
            : undefined
        }
        onCancel={() => {
          if (!deletePlanMutation.isPending) {
            setDeletingPlan(null);
            deleteDisclosure.close();
          }
        }}
        onConfirm={() => {
          if (deletingPlan) deletePlanMutation.mutate(deletingPlan);
        }}
      />
    </section>
  );
}
