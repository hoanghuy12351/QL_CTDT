import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2, Plus, Trash2, X } from "lucide-react";
import { departmentsApi } from "../../api/admin/departments.api";
import { facultiesApi } from "../../api/admin/faculties.api";
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
import DepartmentForm from "./DepartmentForm";
import DepartmentTable from "./DepartmentTable";
import type { Department, DepartmentFormValues } from "./department.types";

type ToastState = {
  type: ToastType;
  message: string;
};

export default function DepartmentPage() {
  const queryClient = useQueryClient();

  const formDisclosure = useDisclosure();
  const deleteDisclosure = useDisclosure();

  const { limit, page, resetPage, setLimit, setPage } = usePagination({
    initialLimit: 10,
  });

  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 400);

  const [editingDepartment, setEditingDepartment] = useState<Department | null>(
    null,
  );
  const [deletingDepartment, setDeletingDepartment] =
    useState<Department | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    resetPage();
    setSelectedIds([]);
  }, [debouncedKeyword, resetPage]);

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => {
      setToast(null);
    }, 3500);

    return () => window.clearTimeout(timer);
  }, [toast]);

  const queryKey = useMemo(
    () => ["departments", page, limit, debouncedKeyword.trim()],
    [debouncedKeyword, limit, page],
  );

  const departmentsQuery = useQuery({
    queryKey,
    queryFn: () =>
      departmentsApi.list({
        page,
        limit,
        keyword: debouncedKeyword.trim() || undefined,
      }),
  });

  const facultiesQuery = useQuery({
    queryKey: ["faculties", "options"],
    queryFn: () =>
      facultiesApi.list({
        page: 1,
        limit: 100,
      }),
  });

  const rows = departmentsQuery.data?.items ?? [];
  const faculties = facultiesQuery.data?.items ?? [];

  const pagination = departmentsQuery.data?.pagination ?? {
    page,
    limit,
    totalItems: 0,
    totalPages: 1,
  };

  const saveMutation = useMutation({
    mutationFn: (values: DepartmentFormValues) => {
      if (editingDepartment) {
        return departmentsApi.update(editingDepartment.id, values);
      }

      return departmentsApi.create(values);
    },
    onSuccess: async () => {
      setToast({
        type: "success",
        message: editingDepartment
          ? "Cập nhật bộ môn thành công"
          : "Thêm bộ môn thành công",
      });

      setEditingDepartment(null);
      formDisclosure.close();

      await queryClient.invalidateQueries({
        queryKey: ["departments"],
      });
    },
    onError: (error) => {
      setToast({
        type: "error",
        message: getApiErrorMessage(error, "Không thể lưu bộ môn"),
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (department: Department) =>
      departmentsApi.remove(department.id),
    onSuccess: async () => {
      setToast({
        type: "success",
        message: "Xóa bộ môn thành công",
      });

      if (deletingDepartment) {
        setSelectedIds((current) =>
          current.filter((id) => id !== deletingDepartment.id),
        );
      }

      setDeletingDepartment(null);
      deleteDisclosure.close();

      await queryClient.invalidateQueries({
        queryKey: ["departments"],
      });
    },
    onError: (error) => {
      setToast({
        type: "error",
        message: getApiErrorMessage(
          error,
          "Không thể xóa bộ môn. Vui lòng kiểm tra ràng buộc dữ liệu.",
        ),
      });
    },
  });

  const openCreateForm = () => {
    setEditingDepartment(null);
    formDisclosure.open();
  };

  const openEditForm = (department: Department) => {
    setEditingDepartment(department);
    formDisclosure.open();
  };

  const openDeleteDialog = (department: Department) => {
    setDeletingDepartment(department);
    deleteDisclosure.open();
  };

  const closeForm = () => {
    if (saveMutation.isPending) return;

    setEditingDepartment(null);
    formDisclosure.close();
  };

  const closeDeleteDialog = () => {
    if (deleteMutation.isPending) return;

    setDeletingDepartment(null);
    deleteDisclosure.close();
  };

  const toggleRow = (id: number) => {
    setSelectedIds((current) => {
      if (current.includes(id)) {
        return current.filter((selectedId) => selectedId !== id);
      }

      return [...current, id];
    });
  };

  const toggleAllCurrentPage = () => {
    const currentPageIds = rows.map((department) => department.id);

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
        <span className="font-medium text-slate-500">Danh mục</span>
        <span className="mx-2 text-slate-300">/</span>
        <span className="font-semibold text-slate-950">Bộ môn</span>
      </div>

      <header className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
              <Building2 size={22} aria-hidden="true" />
            </div>

            <div className="min-w-0">
              <h1 className="text-xl font-bold text-slate-950">Bộ môn</h1>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
                Quản lý bộ môn trực thuộc khoa, phục vụ phân công giảng viên và
                tổ chức chuyên môn.
              </p>

              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-slate-700">
                  {pagination.totalItems} bản ghi
                </span>
                <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-emerald-700">
                  {rows.length} đang hiển thị
                </span>
                <span className="rounded-md bg-brand-50 px-2.5 py-1 text-brand-700">
                  {faculties.length} khoa tham chiếu
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
            type="button"
            className="w-full lg:w-auto"
            leftIcon={<Plus size={16} aria-hidden="true" />}
            onClick={openCreateForm}
          >
            Thêm bộ môn
          </Button>
        </div>
      </header>

      <AdminCrudToolbar
        keyword={keyword}
        searchPlaceholder="Tìm mã bộ môn, tên bộ môn..."
        isSearching={departmentsQuery.isFetching}
        onKeywordChange={setKeyword}
        onSearch={() => departmentsQuery.refetch()}
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
              Lọc và thao tác trên danh sách bộ môn
            </span>
          )
        }
      />

      {departmentsQuery.isError ? (
        <ErrorState
          title="Không tải được danh sách bộ môn"
          description={getApiErrorMessage(
            departmentsQuery.error,
            "Vui lòng kiểm tra backend hoặc thử lại sau.",
          )}
          onAction={() => departmentsQuery.refetch()}
        />
      ) : rows.length === 0 && !departmentsQuery.isLoading ? (
        <EmptyState
          icon={<Building2 size={22} aria-hidden="true" />}
          title="Chưa có dữ liệu bộ môn"
          description="Thêm bộ môn đầu tiên và gắn với khoa quản lý tương ứng."
          actionLabel="Thêm bộ môn"
          onAction={openCreateForm}
        />
      ) : (
        <DepartmentTable
          rows={rows}
          page={page}
          limit={limit}
          selectedIds={selectedIds}
          isLoading={departmentsQuery.isLoading}
          deletingId={
            deleteMutation.isPending ? (deletingDepartment?.id ?? null) : null
          }
          onEdit={openEditForm}
          onDelete={openDeleteDialog}
          onToggleRow={toggleRow}
          onToggleAll={toggleAllCurrentPage}
        />
      )}

      <AdminCrudPagination
        pagination={pagination}
        isLoading={departmentsQuery.isFetching}
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
        title={editingDepartment ? "Cập nhật bộ môn" : "Thêm bộ môn"}
        onClose={closeForm}
      >
        <DepartmentForm
          initialData={editingDepartment}
          faculties={faculties}
          isLoadingFaculties={facultiesQuery.isLoading}
          isSubmitting={saveMutation.isPending}
          onCancel={closeForm}
          onSubmit={(values) => saveMutation.mutate(values)}
        />
      </FormModal>

      <ConfirmDeleteDialog
        isOpen={deleteDisclosure.isOpen}
        itemName={deletingDepartment?.name}
        isDeleting={deleteMutation.isPending}
        description={
          deletingDepartment
            ? `Bạn có chắc chắn muốn xóa bộ môn "${deletingDepartment.name}" không?`
            : undefined
        }
        onCancel={closeDeleteDialog}
        onConfirm={() => {
          if (deletingDepartment) {
            deleteMutation.mutate(deletingDepartment);
          }
        }}
      />
    </section>
  );
}
