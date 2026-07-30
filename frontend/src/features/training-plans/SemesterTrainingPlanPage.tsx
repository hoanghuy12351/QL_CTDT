import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useSearchParams } from "react-router-dom";
import {
  BookOpenCheck,
  CalendarRange,
  CheckCircle2,
  Lightbulb,
  Lock,
  Plus,
  Save,
  Unlock,
  XCircle,
} from "lucide-react";
import { adminCrudApi } from "../../api/adminCrud.api";
import { trainingPlansApi } from "../../api/admin/trainingPlans.api";
import AdminCrudPagination from "../../components/admin/crud/AdminCrudPagination";
import AdminCrudToolbar from "../../components/admin/crud/AdminCrudToolbar";
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
import type { AdminCrudRecord } from "../admin/crud/adminCrud.types";
import OpenedSubjectTable from "./OpenedSubjectTable";
import SemesterPlanForm from "./SemesterPlanForm";
import SemesterPlanTable from "./SemesterPlanTable";
import SuggestionMatrix from "./SuggestionMatrix";
import {
  semesterPlanStatusLabels,
  statusClassNames,
} from "./trainingPlan.columns";
import type {
  SemesterPlan,
  SemesterPlanStatus,
  SuggestionMatrix as SuggestionMatrixType,
} from "./trainingPlan.types";

type ToastState = {
  type: ToastType;
  message: string;
};

type SemesterPlanAction = "approve" | "reopen" | "close";

const statusDescriptions: Record<SemesterPlanStatus, string> = {
  du_thao:
    "Kế hoạch đang được xây dựng, có thể mở học phần, tạo nhóm LT/TH và phân công giảng viên.",
  da_duyet: "Kế hoạch đã được duyệt, sẵn sàng triển khai.",
  dang_thuc_hien: "Kế hoạch đang được triển khai trong học kỳ.",
  da_dong: "Kế hoạch đã kết thúc học kỳ và được lưu như dữ liệu lịch sử.",
};

const actionSuccessMessages: Record<SemesterPlanAction, string> = {
  approve: "Đã duyệt và khóa kế hoạch học kỳ",
  reopen: "Đã mở lại kế hoạch học kỳ để chỉnh sửa",
  close: "Đã đóng kế hoạch học kỳ",
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

export default function SemesterTrainingPlanPage() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const routeSemesterPlanId = params.id ? Number(params.id) : 0;
  const initialPlanId = searchParams.get("yearPlanId") ?? "";

  const queryClient = useQueryClient();
  const semesterFormDisclosure = useDisclosure();
  const planningDisclosure = useDisclosure();
  const workflowDisclosure = useDisclosure();
  const { limit, page, resetPage, setLimit, setPage } = usePagination({
    initialLimit: 10,
  });
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 400);
  const [selectedPlanId, setSelectedPlanId] = useState(initialPlanId);
  const [selectedSemesterPlanId, setSelectedSemesterPlanId] = useState(
    routeSemesterPlanId > 0 ? String(routeSemesterPlanId) : "",
  );
  const [selectedClassIds, setSelectedClassIds] = useState<number[]>([]);
  const [suggestionMatrix, setSuggestionMatrix] =
    useState<SuggestionMatrixType | null>(null);
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

  const showToast = (type: ToastType, message: string) =>
    setToast({ type, message });

  const plansQuery = useQuery({
    queryKey: ["training-plans-options"],
    queryFn: () => trainingPlansApi.list({ page: 1, limit: 500 }),
  });

  const semesterPlansQuery = useQuery({
    queryKey: [
      "semester-plans",
      page,
      limit,
      debouncedKeyword.trim(),
      selectedPlanId,
    ],
    queryFn: () =>
      trainingPlansApi.listSemesterPlans({
        page,
        limit,
        keyword: debouncedKeyword.trim() || undefined,
        keHoachId: selectedPlanId ? Number(selectedPlanId) : undefined,
      }),
  });

  const selectedSemesterPlanDetailQuery = useQuery({
    queryKey: ["semester-plan-detail", selectedSemesterPlanId],
    queryFn: () =>
      trainingPlansApi.detailSemesterPlan(Number(selectedSemesterPlanId)),
    enabled: Boolean(selectedSemesterPlanId),
  });

  const semestersQuery = useQuery({
    queryKey: ["admin-crud-options", "hoc-ky"],
    queryFn: () => adminCrudApi.list("hoc-ky", { page: 1, limit: 500 }),
  });

  const classesQuery = useQuery({
    queryKey: ["admin-crud-options", "lop"],
    queryFn: () => adminCrudApi.list("lop", { page: 1, limit: 500 }),
  });

  const yearPlanOptions = useMemo<SelectOption[]>(
    () =>
      (plansQuery.data?.items ?? []).map((plan) => ({
        value: String(plan.id),
        label: `${plan.code} - ${plan.name}`,
      })),
    [plansQuery.data?.items],
  );

  const semesterOptions = useMemo(
    () =>
      buildOptions(
        semestersQuery.data?.items ?? [],
        "hocKyId",
        "maHocKy",
        "tenHocKy",
      ),
    [semestersQuery.data?.items],
  );

  const classOptions = useMemo(
    () =>
      buildOptions(classesQuery.data?.items ?? [], "lopId", "maLop", "tenLop"),
    [classesQuery.data?.items],
  );

  const semesterRows = semesterPlansQuery.data?.items ?? [];
  const pagination = semesterPlansQuery.data?.pagination ?? {
    page,
    limit,
    totalItems: 0,
    totalPages: 1,
  };
  const selectedYearPlan = (plansQuery.data?.items ?? []).find(
    (plan) => String(plan.id) === selectedPlanId,
  );
  const selectedSemesterPlanFromRows = semesterRows.find(
    (plan) => String(plan.id) === selectedSemesterPlanId,
  );
  const selectedSemesterPlan =
    selectedSemesterPlanFromRows ?? selectedSemesterPlanDetailQuery.data;
  const isSelectedPlanLocked = selectedSemesterPlan
    ? selectedSemesterPlan.status !== "du_thao"
    : false;

  useEffect(() => {
    if (!selectedSemesterPlanDetailQuery.data) return;

    const trainingPlanId = String(selectedSemesterPlanDetailQuery.data.trainingPlanId);
    if (selectedPlanId !== trainingPlanId) {
      setSelectedPlanId(trainingPlanId);
    }
  }, [selectedPlanId, selectedSemesterPlanDetailQuery.data]);

  useEffect(() => {
    if (
      routeSemesterPlanId > 0 &&
      selectedSemesterPlanId !== String(routeSemesterPlanId)
    ) {
      setSelectedSemesterPlanId(String(routeSemesterPlanId));
      setSuggestionMatrix(null);
      setSelectedMatrixKeys([]);
    }
  }, [routeSemesterPlanId, selectedSemesterPlanId]);

  const openedSubjectsQuery = useQuery({
    queryKey: ["opened-subjects", selectedSemesterPlanId],
    queryFn: () =>
      trainingPlansApi.listOpenedSubjects(Number(selectedSemesterPlanId)),
    enabled: Boolean(selectedSemesterPlanId),
  });

  const invalidateSemesterData = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["semester-plans"] }),
      queryClient.invalidateQueries({ queryKey: ["training-plans"] }),
      queryClient.invalidateQueries({
        queryKey: ["opened-subjects", selectedSemesterPlanId],
      }),
      queryClient.invalidateQueries({
        queryKey: ["semester-plan-detail", selectedSemesterPlanId],
      }),
      queryClient.invalidateQueries({ queryKey: ["reports"] }),
    ]);
  };

  const createSemesterPlanMutation = useMutation({
    mutationFn: trainingPlansApi.createSemesterPlan,
    onSuccess: async (semesterPlan) => {
      showToast("success", "Tạo kế hoạch học kỳ thành công");
      semesterFormDisclosure.close();
      setSelectedSemesterPlanId(String(semesterPlan.id));
      await invalidateSemesterData();
    },
    onError: (error) =>
      showToast(
        "error",
        getApiErrorMessage(error, "Không thể tạo kế hoạch học kỳ"),
      ),
  });

  const statusMutation = useMutation({
    mutationFn: (payload: { id: number; action: SemesterPlanAction }) => {
      if (payload.action === "approve") {
        return trainingPlansApi.approveSemesterPlan(payload.id);
      }

      if (payload.action === "reopen") {
        return trainingPlansApi.reopenSemesterPlan(payload.id);
      }

      return trainingPlansApi.closeSemesterPlan(payload.id);
    },
    onSuccess: async (semesterPlan, payload) => {
      setSelectedSemesterPlanId(String(semesterPlan.id));
      setSuggestionMatrix(null);
      setSelectedMatrixKeys([]);
      showToast("success", actionSuccessMessages[payload.action]);
      workflowDisclosure.close();
      await invalidateSemesterData();
    },
    onError: (error) =>
      showToast(
        "error",
        getApiErrorMessage(
          error,
          "Không thể cập nhật trạng thái kế hoạch học kỳ",
        ),
      ),
  });

  const suggestMutation = useMutation({
    mutationFn: () =>
      trainingPlansApi.suggestCourses({
        keHoachHocKyId: Number(selectedSemesterPlanId),
        lopIds: selectedClassIds,
      }),
    onSuccess: (matrix) => {
      setSuggestionMatrix(matrix);
      setSelectedMatrixKeys(
        matrix.cells.map((cell) => `${cell.classId}-${cell.courseId}`),
      );
      showToast("success", "Đã lấy gợi ý học phần");
    },
    onError: (error) =>
      showToast(
        "error",
        getApiErrorMessage(error, "Không thể lấy gợi ý học phần"),
      ),
  });

  const openCoursesMutation = useMutation({
    mutationFn: () => {
      const cellMap = new Map(
        (suggestionMatrix?.cells ?? []).map((cell) => [
          `${cell.classId}-${cell.courseId}`,
          cell,
        ]),
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
          })),
      });
    },
    onSuccess: async (items) => {
      showToast(
        "success",
        `Đã lưu ${items.length} lớp - học phần vào kế hoạch`,
      );
      setSuggestionMatrix(null);
      setSelectedMatrixKeys([]);
      planningDisclosure.close();
      await invalidateSemesterData();
    },
    onError: (error) =>
      showToast(
        "error",
        getApiErrorMessage(error, "Không thể lưu học phần mở"),
      ),
  });

  const toggleClass = (id: number) => {
    if (isSelectedPlanLocked) return;
    setSelectedClassIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const handleSelectSemesterPlan = (plan: SemesterPlan) => {
    setSelectedSemesterPlanId(String(plan.id));
    setSuggestionMatrix(null);
    setSelectedMatrixKeys([]);
  };

  const openWorkflowModal = (plan: SemesterPlan) => {
    handleSelectSemesterPlan(plan);
    workflowDisclosure.open();
  };

  const handleStatusAction = (action: SemesterPlanAction) => {
    if (!selectedSemesterPlan) return;
    statusMutation.mutate({ id: selectedSemesterPlan.id, action });
  };

  return (
    <section className="space-y-4">
      {toast ? (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      ) : null}

      <header className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 ring-1 ring-brand-100">
            <CalendarRange size={22} aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-slate-950">
              Kế hoạch học kỳ
            </h1>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
              Lập kế hoạch học kỳ theo đúng luồng: dự thảo, duyệt để khóa chỉnh
              sửa, sau đó đóng khi kết thúc học kỳ.
            </p>
          </div>
        </div>
      </header>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[minmax(280px,420px)_minmax(0,1fr)]">
          <SelectInput
            label="Kế hoạch năm học"
            options={yearPlanOptions}
            placeholder="Chọn kế hoạch năm học"
            value={selectedPlanId}
            onChange={(event) => {
              setSelectedPlanId(event.target.value);
              setSelectedSemesterPlanId("");
              setSuggestionMatrix(null);
              setSelectedMatrixKeys([]);
              resetPage();
            }}
          />
          <AdminCrudToolbar
            keyword={keyword}
            searchPlaceholder="Tìm kế hoạch học kỳ..."
            isSearching={semesterPlansQuery.isFetching}
            onKeywordChange={setKeyword}
            onSearch={() => semesterPlansQuery.refetch()}
            onReset={() => {
              setKeyword("");
              resetPage();
            }}
            rightSlot={
              <Button
                className="w-full sm:w-auto"
                disabled={!selectedPlanId}
                leftIcon={<Plus size={16} aria-hidden="true" />}
                onClick={semesterFormDisclosure.open}
              >
                Tạo kế hoạch học kỳ
              </Button>
            }
          />
        </div>
      </section>

      {semesterPlansQuery.isError ? (
        <ErrorState
          title="Không tải được danh sách kế hoạch học kỳ"
          description={getApiErrorMessage(
            semesterPlansQuery.error,
            "Vui lòng thử lại sau.",
          )}
          onAction={() => semesterPlansQuery.refetch()}
        />
      ) : semesterRows.length === 0 && !semesterPlansQuery.isLoading ? (
        <EmptyState
          icon={<CalendarRange size={22} aria-hidden="true" />}
          title="Chưa có kế hoạch học kỳ"
          description="Chọn kế hoạch năm học và tạo kế hoạch học kỳ để bắt đầu mở học phần cho lớp."
        />
      ) : (
        <SemesterPlanTable
          rows={semesterRows}
          selectedId={Number(selectedSemesterPlanId) || null}
          isLoading={semesterPlansQuery.isLoading}
          onSelect={handleSelectSemesterPlan}
          onStatusClick={openWorkflowModal}
        />
      )}

      <AdminCrudPagination
        pagination={pagination}
        isLoading={semesterPlansQuery.isFetching}
        onPageChange={setPage}
        onLimitChange={setLimit}
      />

      {selectedSemesterPlanId ? (
        <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-slate-950">
              Học phần trong kế hoạch học kỳ
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Kế hoạch học kỳ đang chọn: {selectedSemesterPlan?.name ?? "Đang tải..."}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {selectedSemesterPlan ? (
                <span
                  className={[
                    "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
                    statusClassNames[selectedSemesterPlan.status],
                  ].join(" ")}
                >
                  {semesterPlanStatusLabels[selectedSemesterPlan.status]}
                </span>
              ) : null}
              <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                {selectedSemesterPlan?.semesterName ?? "Học kỳ"}
              </span>
              <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                {openedSubjectsQuery.data?.length ?? selectedSemesterPlan?.openedCount ?? 0} học phần đã mở
              </span>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                variant="secondary"
                disabled={!selectedSemesterPlan}
                onClick={() => selectedSemesterPlan && openWorkflowModal(selectedSemesterPlan)}
              >
                Trạng thái
              </Button>
              <Button
                disabled={!selectedSemesterPlan || isSelectedPlanLocked}
                leftIcon={<Lightbulb size={16} aria-hidden="true" />}
                onClick={planningDisclosure.open}
              >
                Lập kế hoạch mở học phần
              </Button>
            </div>
          </div>

          <OpenedSubjectTable rows={openedSubjectsQuery.data ?? []} />
        </section>
      ) : (
        <section className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center shadow-sm">
          <BookOpenCheck className="mx-auto text-slate-400" size={28} aria-hidden="true" />
          <h2 className="mt-3 text-base font-bold text-slate-950">
            Chọn một kế hoạch học kỳ
          </h2>
          <p className="mx-auto mt-1 max-w-2xl text-sm leading-6 text-slate-500">
            Bấm vào một dòng trong bảng để xem nhanh các học phần đã mở, hoặc bấm vào tên kế hoạch học kỳ để mở trang chi tiết.
          </p>
        </section>
      )}

      <FormModal
        isOpen={semesterFormDisclosure.isOpen}
        title="Tạo kế hoạch học kỳ"
        description={
          selectedYearPlan
            ? `Tạo kế hoạch học kỳ trực thuộc kế hoạch năm học ${selectedYearPlan.name}.`
            : "Chọn kế hoạch năm học trước khi tạo kế hoạch học kỳ."
        }
        onClose={() => {
          if (!createSemesterPlanMutation.isPending)
            semesterFormDisclosure.close();
        }}
      >
        {selectedYearPlan ? (
          <SemesterPlanForm
            trainingPlan={selectedYearPlan}
            semesterOptions={semesterOptions}
            isSubmitting={createSemesterPlanMutation.isPending}
            onSubmit={(values) => createSemesterPlanMutation.mutate(values)}
          />
        ) : (
          <div className="rounded-lg border border-amber-100 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
            Vui lòng chọn kế hoạch năm học trước, sau đó mở lại form tạo kế
            hoạch học kỳ.
          </div>
        )}
      </FormModal>

      <FormModal
        isOpen={planningDisclosure.isOpen}
        title="Lập kế hoạch mở học phần"
        description={
          selectedSemesterPlan
            ? `Mở học phần cho ${selectedSemesterPlan.name}.`
            : "Chọn một kế hoạch học kỳ trước khi lấy gợi ý học phần."
        }
        onClose={() => {
          if (!suggestMutation.isPending && !openCoursesMutation.isPending) {
            planningDisclosure.close();
          }
        }}
      >
        {selectedSemesterPlan ? (
          <div className="space-y-5">
            {isSelectedPlanLocked ? (
              <div className="rounded-lg border border-sky-100 bg-sky-50 px-3 py-2 text-sm leading-6 text-sky-800">
                Kế hoạch học kỳ đã được khóa nên phần mở học phần không còn cho chỉnh sửa.
              </div>
            ) : null}

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
              <div>
                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-950">
                  <Lightbulb size={16} aria-hidden="true" />
                  Chọn lớp và lấy gợi ý học phần
                </h3>
                <div className="mt-3 max-h-72 overflow-auto rounded-lg border border-slate-200">
                  <div className="grid divide-y divide-slate-100">
                    {classOptions.map((option) => {
                      const id = Number(option.value);
                      return (
                        <label
                          key={option.value}
                          className={[
                            "flex items-center gap-3 px-3 py-2 text-sm hover:bg-slate-50",
                            isSelectedPlanLocked
                              ? "cursor-not-allowed opacity-60"
                              : "cursor-pointer",
                          ].join(" ")}
                        >
                          <input
                            type="checkbox"
                            disabled={isSelectedPlanLocked}
                            className="size-4 rounded border-slate-300 text-brand-600 focus:ring-brand-200"
                            checked={selectedClassIds.includes(id)}
                            onChange={() => toggleClass(id)}
                          />
                          <span className="font-medium text-slate-700">
                            {option.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">Kế hoạch học kỳ</p>
                  <p className="mt-1 text-sm font-bold text-slate-950">{selectedSemesterPlan.name}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">Học kỳ</p>
                  <p className="mt-1 text-sm font-bold text-slate-950">{selectedSemesterPlan.semesterName}</p>
                </div>
                <Button
                  className="w-full"
                  variant="secondary"
                  disabled={selectedClassIds.length === 0 || isSelectedPlanLocked}
                  isLoading={suggestMutation.isPending}
                  onClick={() => suggestMutation.mutate()}
                >
                  Lấy gợi ý học phần
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-950">
                    Ma trận lớp x học phần
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Chọn các ô cần mở trong kế hoạch học kỳ đang thao tác.
                  </p>
                </div>
                <Button
                  disabled={
                    !suggestionMatrix ||
                    selectedMatrixKeys.length === 0 ||
                    isSelectedPlanLocked
                  }
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
                onToggle={(key) => {
                  if (isSelectedPlanLocked) return;
                  setSelectedMatrixKeys((current) =>
                    current.includes(key)
                      ? current.filter((item) => item !== key)
                      : [...current, key],
                  );
                }}
              />
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-amber-100 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
            Vui lòng chọn một kế hoạch học kỳ trong bảng trước khi thao tác.
          </div>
        )}
      </FormModal>

      <FormModal
        isOpen={workflowDisclosure.isOpen}
        title="Duyệt và khóa kế hoạch học kỳ"
        description="Quản lý trạng thái kế hoạch học kỳ bằng modal để không làm dài màn hình danh sách."
        onClose={() => {
          if (!statusMutation.isPending) workflowDisclosure.close();
        }}
      >
        {selectedSemesterPlan ? (
          <div className="space-y-5">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-slate-500">
                  Trạng thái hiện tại
                </span>
                <span
                  className={[
                    "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
                    statusClassNames[selectedSemesterPlan.status],
                  ].join(" ")}
                >
                  {semesterPlanStatusLabels[selectedSemesterPlan.status]}
                </span>
              </div>
              <h3 className="mt-3 text-lg font-bold text-slate-950">
                {selectedSemesterPlan.name}
              </h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                {statusDescriptions[selectedSemesterPlan.status]}
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-lg border border-amber-100 bg-amber-50 p-3 text-sm text-amber-800">
                <div className="flex items-center gap-2 font-bold">
                  <CalendarRange size={15} /> Dự thảo
                </div>
                <p className="mt-1 leading-5">
                  Nhập và chỉnh sửa dữ liệu kế hoạch.
                </p>
              </div>
              <div className="rounded-lg border border-sky-100 bg-sky-50 p-3 text-sm text-sky-800">
                <div className="flex items-center gap-2 font-bold">
                  <Lock size={15} /> Đã duyệt
                </div>
                <p className="mt-1 leading-5">
                  Khóa chỉnh sửa để báo cáo là dữ liệu chính thức.
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                <div className="flex items-center gap-2 font-bold">
                  <XCircle size={15} /> Đã đóng
                </div>
                <p className="mt-1 leading-5">
                  Kết thúc học kỳ và lưu lịch sử.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
              {selectedSemesterPlan.status === "du_thao" ? (
                <Button
                  isLoading={statusMutation.isPending}
                  leftIcon={<CheckCircle2 size={16} aria-hidden="true" />}
                  onClick={() => handleStatusAction("approve")}
                >
                  Duyệt & khóa kế hoạch
                </Button>
              ) : null}
              {selectedSemesterPlan.status === "dang_thuc_hien" ? (
                <>
                  <Button
                    variant="secondary"
                    isLoading={statusMutation.isPending}
                    leftIcon={<Unlock size={16} aria-hidden="true" />}
                    onClick={() => handleStatusAction("reopen")}
                  >
                    Mở lại chỉnh sửa
                  </Button>
                  <Button
                    variant="danger"
                    isLoading={statusMutation.isPending}
                    leftIcon={<XCircle size={16} aria-hidden="true" />}
                    onClick={() => handleStatusAction("close")}
                  >
                    Đóng kế hoạch
                  </Button>
                </>
              ) : null}
              {selectedSemesterPlan.status === "da_dong" ? (
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-600">
                  Kế hoạch đã đóng, không còn thao tác chỉnh sửa.
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-amber-100 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
            Vui lòng chọn một kế hoạch học kỳ trong bảng trước khi thao tác.
          </div>
        )}
      </FormModal>
    </section>
  );
}
