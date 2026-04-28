import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { adminCrudApi } from "../../api/adminCrud.api";
import AdminCrudForm from "../../components/admin/crud/AdminCrudForm";
import AdminCrudPagination from "../../components/admin/crud/AdminCrudPagination";
import AdminCrudTable from "../../components/admin/crud/AdminCrudTable";
import AdminCrudToolbar from "../../components/admin/crud/AdminCrudToolbar";
import ConfirmDeleteDialog from "../../components/admin/crud/ConfirmDeleteDialog";
import FormModal from "../../components/admin/crud/FormModal";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import Button from "../../components/ui/Button";
import Toast, { type ToastType } from "../../components/ui/Toast";
import { useDebounce } from "../../hooks/useDebounce";
import { getApiErrorMessage } from "../../types/api.types";
import type {
  AdminCrudConfig,
  AdminCrudRecord,
} from "../../features/admin/crud/adminCrud.types";

type AdminCrudPageProps = {
  config: AdminCrudConfig;
};

type ToastState = {
  type: ToastType;
  message: string;
};

export default function AdminCrudPage({ config }: AdminCrudPageProps) {
  const queryClient = useQueryClient();
  const Icon = config.icon;

  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 300);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AdminCrudRecord | null>(
    null,
  );
  const [deletingRecord, setDeletingRecord] = useState<AdminCrudRecord | null>(
    null,
  );
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    setPage(1);
  }, [debouncedKeyword]);

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => {
      setToast(null);
    }, 3500);

    return () => window.clearTimeout(timer);
  }, [toast]);

  const queryKey = useMemo(
    () => ["admin-crud", config.resource, page, limit, debouncedKeyword.trim()],
    [config.resource, debouncedKeyword, limit, page],
  );

  const listQuery = useQuery({
    queryKey,
    queryFn: () =>
      adminCrudApi.list(config.resource, {
        page,
        limit,
        keyword: debouncedKeyword.trim() || undefined,
      }),
  });

  const saveMutation = useMutation({
    mutationFn: (payload: AdminCrudRecord) => {
      if (editingRecord) {
        return adminCrudApi.update(
          config.resource,
          editingRecord[config.idField] as string | number,
          payload,
        );
      }

      return adminCrudApi.create(config.resource, payload);
    },
    onSuccess: async () => {
      setToast({
        type: "success",
        message: editingRecord
          ? `Cập nhật ${config.title.toLowerCase()} thành công`
          : `Thêm ${config.title.toLowerCase()} thành công`,
      });
      setIsFormOpen(false);
      setEditingRecord(null);
      await queryClient.invalidateQueries({
        queryKey: ["admin-crud", config.resource],
      });
    },
    onError: (error) => {
      setToast({
        type: "error",
        message: getApiErrorMessage(
          error,
          `Không thể lưu ${config.title.toLowerCase()}`,
        ),
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (record: AdminCrudRecord) =>
      adminCrudApi.remove(
        config.resource,
        record[config.idField] as string | number,
      ),
    onSuccess: async () => {
      setToast({
        type: "success",
        message: `Xóa ${config.title.toLowerCase()} thành công`,
      });
      setDeletingRecord(null);
      await queryClient.invalidateQueries({
        queryKey: ["admin-crud", config.resource],
      });
    },
    onError: (error) => {
      setToast({
        type: "error",
        message: getApiErrorMessage(
          error,
          `Không thể xóa ${config.title.toLowerCase()}`,
        ),
      });
    },
  });

  const rows = listQuery.data?.items ?? [];
  const pagination = listQuery.data?.pagination ?? {
    page,
    limit,
    totalItems: 0,
    totalPages: 1,
  };

  const openCreateForm = () => {
    setEditingRecord(null);
    setIsFormOpen(true);
  };

  const openEditForm = (record: AdminCrudRecord) => {
    setEditingRecord(record);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    if (saveMutation.isPending) return;
    setIsFormOpen(false);
    setEditingRecord(null);
  };

  const closeDeleteDialog = () => {
    if (deleteMutation.isPending) return;
    setDeletingRecord(null);
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
        <span className="font-semibold text-slate-950">{config.title}</span>
      </div>

      <header className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 ring-1 ring-brand-100">
              <Icon size={22} aria-hidden="true" />
            </div>

            <div className="min-w-0">
              <h1 className="text-xl font-bold text-slate-950">
                {config.title}
              </h1>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
                {config.description}
              </p>

              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-slate-700">
                  {pagination.totalItems} bản ghi
                </span>
                <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-emerald-700">
                  {rows.length} đang hiển thị
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
            {config.primaryAction}
          </Button>
        </div>
      </header>

      <AdminCrudToolbar
        keyword={keyword}
        searchPlaceholder={config.searchPlaceholder}
        isSearching={listQuery.isFetching}
        onKeywordChange={setKeyword}
        onSearch={() => listQuery.refetch()}
        onReset={() => {
          setKeyword("");
          setPage(1);
        }}
      />

      {listQuery.isError ? (
        <ErrorState
          title={`Không tải được danh sách ${config.title.toLowerCase()}`}
          description={getApiErrorMessage(
            listQuery.error,
            "Vui lòng kiểm tra backend hoặc thử lại sau.",
          )}
          onAction={() => listQuery.refetch()}
        />
      ) : rows.length === 0 && !listQuery.isLoading ? (
        <EmptyState
          icon={<Icon size={22} aria-hidden="true" />}
          title={`Chưa có dữ liệu ${config.title.toLowerCase()}`}
          description={`Thêm ${config.title.toLowerCase()} đầu tiên để bắt đầu quản lý danh mục này.`}
          actionLabel={config.primaryAction}
          onAction={openCreateForm}
        />
      ) : (
        <AdminCrudTable
          config={config}
          deletingId={
            deleteMutation.isPending
              ? ((deletingRecord?.[config.idField] as string | number | undefined) ??
                null)
              : null
          }
          isLoading={listQuery.isLoading}
          rows={rows}
          onDelete={(record) => setDeletingRecord(record)}
          onEdit={openEditForm}
        />
      )}

      <AdminCrudPagination
        pagination={pagination}
        isLoading={listQuery.isFetching}
        onPageChange={setPage}
        onLimitChange={(nextLimit) => {
          setLimit(nextLimit);
          setPage(1);
        }}
      />

      <FormModal
        isOpen={isFormOpen}
        title={editingRecord ? `Cập nhật ${config.title}` : config.primaryAction}
        onClose={closeForm}
      >
        <AdminCrudForm
          config={config}
          record={editingRecord}
          isSaving={saveMutation.isPending}
          onCancel={closeForm}
          onSubmit={(payload) => saveMutation.mutate(payload)}
        />
      </FormModal>

      <ConfirmDeleteDialog
        isOpen={Boolean(deletingRecord)}
        title={`Xác nhận xóa ${config.title.toLowerCase()}`}
        isDeleting={deleteMutation.isPending}
        onCancel={closeDeleteDialog}
        onConfirm={() => {
          if (deletingRecord) {
            deleteMutation.mutate(deletingRecord);
          }
        }}
      />
    </section>
  );
}
