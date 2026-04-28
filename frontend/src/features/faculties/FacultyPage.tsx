import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, School, Trash2, X } from "lucide-react";
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
import FacultyForm from "./FacultyForm";
import FacultyTable from "./FacultyTable";
import type { Faculty, FacultyFormValues } from "./faculty.types";

type ToastState = {
  type: ToastType;
  message: string;
};

export default function FacultyPage() {
  const queryClient = useQueryClient();

  const formDisclosure = useDisclosure();
  const deleteDisclosure = useDisclosure();

  const { limit, page, resetPage, setLimit, setPage } = usePagination({
    initialLimit: 10,
  });

  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 400);

  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [deletingFaculty, setDeletingFaculty] = useState<Faculty | null>(null);
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
    () => ["faculties", page, limit, debouncedKeyword.trim()],
    [debouncedKeyword, limit, page],
  );

  const facultiesQuery = useQuery({
    queryKey,
    queryFn: () =>
      facultiesApi.list({
        page,
        limit,
        keyword: debouncedKeyword.trim() || undefined,
      }),
  });

  const rows = facultiesQuery.data?.items ?? [];

  const pagination = facultiesQuery.data?.pagination ?? {
    page,
    limit,
    totalItems: 0,
    totalPages: 1,
  };

  const saveMutation = useMutation({
    mutationFn: (values: FacultyFormValues) => {
      if (editingFaculty) {
        return facultiesApi.update(editingFaculty.id, values);
      }

      return facultiesApi.create(values);
    },
    onSuccess: async () => {
      setToast({
        type: "success",
        message: editingFaculty
          ? "Cập nhật khoa thành công"
          : "Thêm khoa thành công",
      });

      setEditingFaculty(null);
      formDisclosure.close();

      await queryClient.invalidateQueries({
        queryKey: ["faculties"],
      });
    },
    onError: (error) => {
      setToast({
        type: "error",
        message: getApiErrorMessage(error, "Không thể lưu khoa"),
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (faculty: Faculty) => facultiesApi.remove(faculty.id),
    onSuccess: async () => {
      setToast({
        type: "success",
        message: "Xóa khoa thành công",
      });

      if (deletingFaculty) {
        setSelectedIds((current) =>
          current.filter((id) => id !== deletingFaculty.id),
        );
      }

      setDeletingFaculty(null);
      deleteDisclosure.close();

      await queryClient.invalidateQueries({
        queryKey: ["faculties"],
      });
    },
    onError: (error) => {
      setToast({
        type: "error",
        message: getApiErrorMessage(
          error,
          "Không thể xóa khoa. Vui lòng kiểm tra ràng buộc dữ liệu.",
        ),
      });
    },
  });

  const openCreateForm = () => {
    setEditingFaculty(null);
    formDisclosure.open();
  };

  const openEditForm = (faculty: Faculty) => {
    setEditingFaculty(faculty);
    formDisclosure.open();
  };

  const openDeleteDialog = (faculty: Faculty) => {
    setDeletingFaculty(faculty);
    deleteDisclosure.open();
  };

  const closeForm = () => {
    if (saveMutation.isPending) return;

    setEditingFaculty(null);
    formDisclosure.close();
  };

  const closeDeleteDialog = () => {
    if (deleteMutation.isPending) return;

    setDeletingFaculty(null);
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
    const currentPageIds = rows.map((faculty) => faculty.id);

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
        <span className="font-semibold text-slate-950">Khoa</span>
      </div>

      <header className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 ring-1 ring-brand-100">
              <School size={22} aria-hidden="true" />
            </div>

            <div className="min-w-0">
              <h1 className="text-xl font-bold text-slate-950">Khoa</h1>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
                Quản lý mã khoa, tên khoa và dữ liệu nền dùng cho bộ môn,
                ngành đào tạo.
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
            type="button"
            className="w-full lg:w-auto"
            leftIcon={<Plus size={16} aria-hidden="true" />}
            onClick={openCreateForm}
          >
            Thêm khoa
          </Button>
        </div>
      </header>

      <AdminCrudToolbar
        keyword={keyword}
        searchPlaceholder="Tìm mã khoa, tên khoa..."
        isSearching={facultiesQuery.isFetching}
        onKeywordChange={setKeyword}
        onSearch={() => facultiesQuery.refetch()}
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
              Lọc và thao tác trên danh sách khoa
            </span>
          )
        }
      />

      {facultiesQuery.isError ? (
        <ErrorState
          title="Không tải được danh sách khoa"
          description={getApiErrorMessage(
            facultiesQuery.error,
            "Vui lòng kiểm tra backend hoặc thử lại sau.",
          )}
          onAction={() => facultiesQuery.refetch()}
        />
      ) : rows.length === 0 && !facultiesQuery.isLoading ? (
        <EmptyState
          icon={<School size={22} aria-hidden="true" />}
          title="Chưa có dữ liệu khoa"
          description="Thêm khoa đầu tiên để liên kết bộ môn và ngành đào tạo."
          actionLabel="Thêm khoa"
          onAction={openCreateForm}
        />
      ) : (
        <FacultyTable
          rows={rows}
          page={page}
          limit={limit}
          selectedIds={selectedIds}
          isLoading={facultiesQuery.isLoading}
          deletingId={
            deleteMutation.isPending ? (deletingFaculty?.id ?? null) : null
          }
          onEdit={openEditForm}
          onDelete={openDeleteDialog}
          onToggleRow={toggleRow}
          onToggleAll={toggleAllCurrentPage}
        />
      )}

      <AdminCrudPagination
        pagination={pagination}
        isLoading={facultiesQuery.isFetching}
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
        title={editingFaculty ? "Cập nhật khoa" : "Thêm khoa"}
        onClose={closeForm}
      >
        <FacultyForm
          initialData={editingFaculty}
          isSubmitting={saveMutation.isPending}
          onCancel={closeForm}
          onSubmit={(values) => saveMutation.mutate(values)}
        />
      </FormModal>

      <ConfirmDeleteDialog
        isOpen={deleteDisclosure.isOpen}
        itemName={deletingFaculty?.name}
        isDeleting={deleteMutation.isPending}
        description={
          deletingFaculty
            ? `Bạn có chắc chắn muốn xóa khoa "${deletingFaculty.name}" không?`
            : undefined
        }
        onCancel={closeDeleteDialog}
        onConfirm={() => {
          if (deletingFaculty) {
            deleteMutation.mutate(deletingFaculty);
          }
        }}
      />
    </section>
  );
}
