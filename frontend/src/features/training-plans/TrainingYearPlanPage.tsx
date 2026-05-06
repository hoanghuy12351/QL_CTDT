import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  ClipboardList,
  PlayCircle,
  Plus,
  RotateCcw,
  Trash2,
  Unlock,
  X,
  XCircle,
} from "lucide-react";
import { adminCrudApi } from "../../api/adminCrud.api";
import { trainingPlansApi } from "../../api/admin/trainingPlans.api";
import AdminCrudPagination from "../../components/admin/crud/AdminCrudPagination";
import AdminCrudToolbar from "../../components/admin/crud/AdminCrudToolbar";
import ConfirmDeleteDialog from "../../components/admin/crud/ConfirmDeleteDialog";
import FormModal from "../../components/admin/crud/FormModal";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import Button from "../../components/ui/Button";
import IconButton from "../../components/ui/IconButton";
import Toast, { type ToastType } from "../../components/ui/Toast";
import Tooltip from "../../components/ui/Tooltip";
import { useDebounce } from "../../hooks/useDebounce";
import { useDisclosure } from "../../hooks/useDisclosure";
import { usePagination } from "../../hooks/usePagination";
import { getApiErrorMessage } from "../../types/api.types";
import type { AdminCrudRecord } from "../admin/crud/adminCrud.types";
import TrainingPlanForm from "./TrainingPlanForm";
import TrainingPlanTable from "./TrainingPlanTable";
import {
  statusClassNames,
  trainingPlanStatusLabels,
} from "./trainingPlan.columns";
import type {
  TrainingPlan,
  TrainingPlanFormValues,
  TrainingPlanStatus,
} from "./trainingPlan.types";

type ToastState = {
  type: ToastType;
  message: string;
};

type TrainingPlanAction = "approve" | "start" | "reopen" | "close";

const statusDescriptions: Record<TrainingPlanStatus, string> = {
  du_thao:
    "Có thể chỉnh sửa thông tin kế hoạch năm học và lập các kế hoạch học kỳ trực thuộc.",
  da_duyet:
    "Thông tin kế hoạch năm học đã được duyệt, không chỉnh sửa trực tiếp. Có thể bắt đầu thực hiện hoặc mở lại khi chưa có học kỳ chính thức.",
  dang_thuc_hien:
    "Kế hoạch năm học đang được dùng để triển khai các kế hoạch học kỳ.",
  da_dong: "Kế hoạch năm học đã kết thúc và được lưu như dữ liệu lịch sử.",
};

const actionSuccessMessages: Record<TrainingPlanAction, string> = {
  approve: "Đã duyệt kế hoạch năm học",
  start: "Đã chuyển kế hoạch năm học sang đang thực hiện",
  reopen: "Đã mở lại kế hoạch năm học về dự thảo",
  close: "Đã đóng kế hoạch năm học",
};

const buildOptions = (
  rows: AdminCrudRecord[],
  idKey: string,
  codeKey: string,
  nameKey?: string,
) =>
  rows.map((row) => {
    const code = String(row[codeKey] ?? "").trim();
    const name = nameKey ? String(row[nameKey] ?? "").trim() : "";

    return {
      value: String(row[idKey] ?? ""),
      label: name ? `${code} - ${name}` : code,
    };
  });

export default function TrainingYearPlanPage() {
  const queryClient = useQueryClient();
  const formDisclosure = useDisclosure();
  const deleteDisclosure = useDisclosure();
  const workflowDisclosure = useDisclosure();
  const { limit, page, resetPage, setLimit, setPage } = usePagination({
    initialLimit: 10,
  });

  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 400);
  const [editingPlan, setEditingPlan] = useState<TrainingPlan | null>(null);
  const [deletingPlan, setDeletingPlan] = useState<TrainingPlan | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<TrainingPlan | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    resetPage();
    setSelectedIds([]);
  }, [debouncedKeyword, resetPage]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = (type: ToastType, message: string) =>
    setToast({ type, message });

  const plansQuery = useQuery({
    queryKey: ["training-plans", page, limit, debouncedKeyword.trim()],
    queryFn: () =>
      trainingPlansApi.list({
        page,
        limit,
        keyword: debouncedKeyword.trim() || undefined,
      }),
  });

  const schoolYearsQuery = useQuery({
    queryKey: ["admin-crud-options", "nam-hoc"],
    queryFn: () => adminCrudApi.list("nam-hoc", { page: 1, limit: 500 }),
  });
  const facultiesQuery = useQuery({
    queryKey: ["admin-crud-options", "khoa"],
    queryFn: () => adminCrudApi.list("khoa", { page: 1, limit: 500 }),
  });

  const rows = useMemo(
    () => plansQuery.data?.items ?? [],
    [plansQuery.data?.items],
  );
  const pagination = plansQuery.data?.pagination ?? {
    page,
    limit,
    totalItems: 0,
    totalPages: 1,
  };

  const schoolYearOptions = useMemo(
    () =>
      buildOptions(schoolYearsQuery.data?.items ?? [], "namHocId", "maNamHoc"),
    [schoolYearsQuery.data?.items],
  );
  const facultyOptions = useMemo(
    () =>
      buildOptions(
        facultiesQuery.data?.items ?? [],
        "khoaId",
        "maKhoa",
        "tenKhoa",
      ),
    [facultiesQuery.data?.items],
  );

  useEffect(() => {
    if (!selectedPlan) return;
    const latest = rows.find((plan) => plan.id === selectedPlan.id);
    if (latest && latest !== selectedPlan) setSelectedPlan(latest);
  }, [rows, selectedPlan]);

  const savePlanMutation = useMutation({
    mutationFn: (values: TrainingPlanFormValues) =>
      editingPlan
        ? trainingPlansApi.update(editingPlan.id, values)
        : trainingPlansApi.create(values),
    onSuccess: async () => {
      showToast(
        "success",
        editingPlan
          ? "Cập nhật kế hoạch năm học thành công"
          : "Tạo kế hoạch năm học thành công",
      );
      setEditingPlan(null);
      formDisclosure.close();
      await queryClient.invalidateQueries({ queryKey: ["training-plans"] });
    },
    onError: (error) =>
      showToast(
        "error",
        getApiErrorMessage(error, "Không thể lưu kế hoạch năm học"),
      ),
  });

  const workflowMutation = useMutation({
    mutationFn: (payload: { id: number; action: TrainingPlanAction }) => {
      if (payload.action === "approve")
        return trainingPlansApi.approve(payload.id);
      if (payload.action === "start") return trainingPlansApi.start(payload.id);
      if (payload.action === "reopen")
        return trainingPlansApi.reopen(payload.id);
      return trainingPlansApi.close(payload.id);
    },
    onSuccess: async (plan, payload) => {
      setSelectedPlan(plan);
      showToast("success", actionSuccessMessages[payload.action]);
      await queryClient.invalidateQueries({ queryKey: ["training-plans"] });
    },
    onError: (error) =>
      showToast(
        "error",
        getApiErrorMessage(
          error,
          "Không thể cập nhật trạng thái kế hoạch năm học",
        ),
      ),
  });

  const deletePlanMutation = useMutation({
    mutationFn: (plan: TrainingPlan) => trainingPlansApi.remove(plan.id),
    onSuccess: async () => {
      showToast("success", "Xóa kế hoạch năm học thành công");
      if (deletingPlan) {
        setSelectedIds((current) =>
          current.filter((id) => id !== deletingPlan.id),
        );
      }
      setDeletingPlan(null);
      deleteDisclosure.close();
      await queryClient.invalidateQueries({ queryKey: ["training-plans"] });
    },
    onError: (error) =>
      showToast(
        "error",
        getApiErrorMessage(error, "Không thể xóa kế hoạch năm học"),
      ),
  });

  const openCreateForm = () => {
    setEditingPlan(null);
    formDisclosure.open();
  };

  const toggleRow = (id: number) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id],
    );
  };

  const toggleAllCurrentPage = () => {
    const currentPageIds = rows.map((plan) => plan.id);
    const isAllCurrentPageSelected =
      currentPageIds.length > 0 &&
      currentPageIds.every((id) => selectedIds.includes(id));

    if (isAllCurrentPageSelected) {
      setSelectedIds((current) =>
        current.filter((id) => !currentPageIds.includes(id)),
      );
      return;
    }

    setSelectedIds((current) =>
      Array.from(new Set([...current, ...currentPageIds])),
    );
  };

  const openWorkflowModal = (plan: TrainingPlan) => {
    setSelectedPlan(plan);
    workflowDisclosure.open();
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

      <div className="text-sm">
        <span className="font-medium text-slate-500">Quản trị</span>
        <span className="mx-2 text-slate-300">/</span>
        <span className="font-medium text-slate-500">Kế hoạch đào tạo</span>
        <span className="mx-2 text-slate-300">/</span>
        <span className="font-semibold text-slate-950">Kế hoạch năm học</span>
      </div>

      <header className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 ring-1 ring-brand-100">
              <ClipboardList size={22} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-slate-950">
                Kế hoạch năm học
              </h1>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
                Quản lý kế hoạch đào tạo theo từng năm học.
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-slate-700">
                  {pagination.totalItems} bản ghi
                </span>
                <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-emerald-700">
                  {rows.length} đang hiển thị
                </span>
                {selectedIds.length > 0 ? (
                  <span className="rounded-md bg-amber-50 px-2.5 py-1 text-amber-700">
                    {selectedIds.length} đã chọn
                  </span>
                ) : null}
              </div>
            </div>
          </div>
          <Button
            className="w-full lg:w-auto"
            leftIcon={<Plus size={16} aria-hidden="true" />}
            onClick={openCreateForm}
          >
            Thêm kế hoạch năm
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
          setSelectedIds([]);
        }}
        leftSlot={
          selectedIds.length > 0 ? (
            <div className="flex h-10 items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 text-sm font-medium text-amber-900">
              <span>{selectedIds.length} dòng đã chọn</span>
              <Tooltip label="Xóa hàng loạt sẽ bổ sung khi backend có API hỗ trợ">
                <button
                  type="button"
                  disabled
                  className="inline-flex size-7 items-center justify-center rounded-md text-red-500 opacity-60"
                  aria-label="Xóa hàng loạt"
                >
                  <Trash2 size={15} aria-hidden="true" />
                </button>
              </Tooltip>
              <IconButton
                label="Bỏ chọn tất cả"
                variant="subtle"
                className="size-7"
                onClick={() => setSelectedIds([])}
              >
                <X size={15} aria-hidden="true" />
              </IconButton>
            </div>
          ) : (
            <span className="text-sm font-medium text-slate-500">
              Bấm vào trạng thái trong bảng để duyệt, khóa hoặc mở lại kế hoạch
            </span>
          )
        }
      />

      {plansQuery.isError ? (
        <ErrorState
          title="Không tải được danh sách kế hoạch năm học"
          description={getApiErrorMessage(
            plansQuery.error,
            "Vui lòng thử lại sau.",
          )}
          onAction={() => plansQuery.refetch()}
        />
      ) : rows.length === 0 && !plansQuery.isLoading ? (
        <EmptyState
          icon={<ClipboardList size={22} aria-hidden="true" />}
          title="Chưa có kế hoạch năm học"
          description="Tạo kế hoạch năm học trước, sau đó lập các kế hoạch học kỳ trực thuộc."
          actionLabel="Thêm kế hoạch năm"
          onAction={openCreateForm}
        />
      ) : (
        <TrainingPlanTable
          rows={rows}
          page={page}
          limit={limit}
          selectedIds={selectedIds}
          isLoading={plansQuery.isLoading}
          deletingId={deletePlanMutation.isPending ? deletingPlan?.id : null}
          selectedId={selectedPlan?.id ?? null}
          onSelect={(plan) => setSelectedPlan(plan)}
          onEdit={(plan) => {
            if (plan.status !== "du_thao") {
              showToast(
                "error",
                "Chỉ có thể sửa kế hoạch năm học ở trạng thái dự thảo",
              );
              return;
            }
            setEditingPlan(plan);
            formDisclosure.open();
          }}
          onDelete={(plan) => {
            if (plan.status !== "du_thao") {
              showToast(
                "error",
                "Chỉ có thể xóa kế hoạch năm học ở trạng thái dự thảo",
              );
              return;
            }
            setDeletingPlan(plan);
            deleteDisclosure.open();
          }}
          onStatusClick={openWorkflowModal}
          onToggleRow={toggleRow}
          onToggleAll={toggleAllCurrentPage}
        />
      )}

      <AdminCrudPagination
        pagination={pagination}
        isLoading={plansQuery.isFetching}
        onPageChange={(nextPage) => {
          setPage(nextPage);
          setSelectedIds([]);
        }}
        onLimitChange={(nextLimit) => {
          setLimit(nextLimit);
          setSelectedIds([]);
        }}
      />

      <FormModal
        isOpen={formDisclosure.isOpen}
        title={
          editingPlan ? "Cập nhật kế hoạch năm học" : "Thêm kế hoạch năm học"
        }
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

      <FormModal
        isOpen={workflowDisclosure.isOpen}
        title="Duyệt và khóa kế hoạch năm học"
        description="Kế hoạch năm học là khung cha: dùng để sinh tuần, chứa các kế hoạch học kỳ và kiểm soát trạng thái tổng thể."
        onClose={() => {
          if (!workflowMutation.isPending) workflowDisclosure.close();
        }}
      >
        {selectedPlan ? (
          <div className="space-y-5">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-slate-500">
                  Trạng thái hiện tại
                </span>
                <span
                  className={[
                    "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
                    statusClassNames[selectedPlan.status],
                  ].join(" ")}
                >
                  {trainingPlanStatusLabels[selectedPlan.status]}
                </span>
              </div>
              <h3 className="mt-3 text-lg font-bold text-slate-950">
                {selectedPlan.name}
              </h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                {statusDescriptions[selectedPlan.status]}
              </p>
              <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-3">
                <div className="rounded-lg bg-white px-3 py-2 ring-1 ring-slate-100">
                  <span className="font-semibold text-slate-900">Năm học:</span>{" "}
                  {selectedPlan.schoolYearName}
                </div>
                <div className="rounded-lg bg-white px-3 py-2 ring-1 ring-slate-100">
                  <span className="font-semibold text-slate-900">Khoa:</span>{" "}
                  {selectedPlan.facultyName}
                </div>
                <div className="rounded-lg bg-white px-3 py-2 ring-1 ring-slate-100">
                  <span className="font-semibold text-slate-900">Học kỳ:</span>{" "}
                  {selectedPlan.semesterCount}
                </div>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-4">
              <div className="rounded-lg border border-amber-100 bg-amber-50 p-3 text-sm text-amber-800">
                <div className="flex items-center gap-2 font-bold">
                  <ClipboardList size={15} /> Dự thảo
                </div>
                <p className="mt-1 leading-5">
                  Được sửa thông tin cơ bản và lập học kỳ.
                </p>
              </div>
              <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-800">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 size={15} /> Đã duyệt
                </div>
                <p className="mt-1 leading-5">
                  Khóa thông tin năm học để tránh lệch dữ liệu.
                </p>
              </div>
              <div className="rounded-lg border border-sky-100 bg-sky-50 p-3 text-sm text-sky-800">
                <div className="flex items-center gap-2 font-bold">
                  <PlayCircle size={15} /> Đang thực hiện
                </div>
                <p className="mt-1 leading-5">
                  Dùng để triển khai các kế hoạch học kỳ.
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                <div className="flex items-center gap-2 font-bold">
                  <XCircle size={15} /> Đã đóng
                </div>
                <p className="mt-1 leading-5">
                  Chỉ đóng khi các học kỳ trực thuộc đã đóng.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
              {selectedPlan.status === "du_thao" ? (
                <Button
                  isLoading={workflowMutation.isPending}
                  leftIcon={<CheckCircle2 size={16} aria-hidden="true" />}
                  onClick={() =>
                    workflowMutation.mutate({
                      id: selectedPlan.id,
                      action: "approve",
                    })
                  }
                >
                  Duyệt kế hoạch năm
                </Button>
              ) : null}
              {selectedPlan.status === "da_duyet" ? (
                <>
                  <Button
                    variant="secondary"
                    isLoading={workflowMutation.isPending}
                    leftIcon={<Unlock size={16} aria-hidden="true" />}
                    onClick={() =>
                      workflowMutation.mutate({
                        id: selectedPlan.id,
                        action: "reopen",
                      })
                    }
                  >
                    Mở lại dự thảo
                  </Button>
                  <Button
                    isLoading={workflowMutation.isPending}
                    leftIcon={<PlayCircle size={16} aria-hidden="true" />}
                    onClick={() =>
                      workflowMutation.mutate({
                        id: selectedPlan.id,
                        action: "start",
                      })
                    }
                  >
                    Bắt đầu thực hiện
                  </Button>
                </>
              ) : null}
              {selectedPlan.status === "dang_thuc_hien" ? (
                <>
                  <Button
                    variant="secondary"
                    isLoading={workflowMutation.isPending}
                    leftIcon={<RotateCcw size={16} aria-hidden="true" />}
                    onClick={() =>
                      workflowMutation.mutate({
                        id: selectedPlan.id,
                        action: "reopen",
                      })
                    }
                  >
                    Mở lại dự thảo
                  </Button>
                  <Button
                    variant="danger"
                    isLoading={workflowMutation.isPending}
                    leftIcon={<XCircle size={16} aria-hidden="true" />}
                    onClick={() =>
                      workflowMutation.mutate({
                        id: selectedPlan.id,
                        action: "close",
                      })
                    }
                  >
                    Đóng kế hoạch năm
                  </Button>
                </>
              ) : null}
              {selectedPlan.status === "da_dong" ? (
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-600">
                  Kế hoạch năm học đã đóng, không còn thao tác chỉnh sửa.
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-amber-100 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
            Vui lòng chọn một kế hoạch năm học trong bảng trước khi thao tác.
          </div>
        )}
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
