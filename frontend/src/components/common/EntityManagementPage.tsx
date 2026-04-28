import type { ComponentType, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, X, type LucideIcon } from "lucide-react";
import AdminCrudPagination from "../admin/crud/AdminCrudPagination";
import AdminCrudToolbar from "../admin/crud/AdminCrudToolbar";
import ConfirmDeleteDialog from "../admin/crud/ConfirmDeleteDialog";
import FormModal from "../admin/crud/FormModal";
import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";
import Button from "../ui/Button";
import IconButton from "../ui/IconButton";
import Toast, { type ToastType } from "../ui/Toast";
import Tooltip from "../ui/Tooltip";
import { useDebounce } from "../../hooks/useDebounce";
import { useDisclosure } from "../../hooks/useDisclosure";
import { usePagination } from "../../hooks/usePagination";
import { getApiErrorMessage, type PaginatedResponse } from "../../types/api.types";

type EntityWithId = {
  id: number;
};

type QueryParams = {
  page: number;
  limit: number;
  keyword?: string;
};

export type EntityFormProps<TEntity, TValues, TExtraProps = object> = {
  initialData?: TEntity | null;
  isSubmitting?: boolean;
  onCancel: () => void;
  onSubmit: (values: TValues) => void;
} & TExtraProps;

export type EntityTableProps<TEntity> = {
  rows: TEntity[];
  page: number;
  limit: number;
  selectedIds: number[];
  isLoading?: boolean;
  deletingId?: number | null;
  onEdit: (entity: TEntity) => void;
  onDelete: (entity: TEntity) => void;
  onToggleRow: (id: number) => void;
  onToggleAll: () => void;
};

type ToastState = {
  type: ToastType;
  message: string;
};

type EntityManagementPageProps<
  TEntity extends EntityWithId,
  TValues,
  TFormExtraProps = object,
> = {
  title: string;
  description: string;
  icon: LucideIcon;
  searchPlaceholder: string;
  queryKeyBase: string;
  emptyDescription: string;
  createActionLabel: string;
  queryFn: (params: QueryParams) => Promise<PaginatedResponse<TEntity>>;
  createFn: (values: TValues) => Promise<unknown>;
  updateFn: (id: number, values: TValues) => Promise<unknown>;
  deleteFn: (entity: TEntity) => Promise<unknown>;
  formComponent: ComponentType<EntityFormProps<TEntity, TValues, TFormExtraProps>>;
  formProps?: TFormExtraProps;
  tableComponent: ComponentType<EntityTableProps<TEntity>>;
  getItemName: (entity: TEntity) => string;
  selectionNotice?: string;
  extraSummary?: ReactNode;
};

export default function EntityManagementPage<
  TEntity extends EntityWithId,
  TValues,
  TFormExtraProps = object,
>({
  createActionLabel,
  createFn,
  deleteFn,
  description,
  emptyDescription,
  extraSummary,
  formComponent: FormComponent,
  formProps,
  getItemName,
  icon: Icon,
  queryFn,
  queryKeyBase,
  searchPlaceholder,
  selectionNotice = "Xóa hàng loạt sẽ bổ sung khi backend có API hỗ trợ",
  tableComponent: TableComponent,
  title,
  updateFn,
}: EntityManagementPageProps<TEntity, TValues, TFormExtraProps>) {
  const queryClient = useQueryClient();

  const formDisclosure = useDisclosure();
  const deleteDisclosure = useDisclosure();

  const { limit, page, resetPage, setLimit, setPage } = usePagination({
    initialLimit: 10,
  });

  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 400);
  const [editingEntity, setEditingEntity] = useState<TEntity | null>(null);
  const [deletingEntity, setDeletingEntity] = useState<TEntity | null>(null);
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
    () => [queryKeyBase, page, limit, debouncedKeyword.trim()],
    [debouncedKeyword, limit, page, queryKeyBase],
  );

  const listQuery = useQuery({
    queryKey,
    queryFn: () =>
      queryFn({
        page,
        limit,
        keyword: debouncedKeyword.trim() || undefined,
      }),
  });

  const rows = listQuery.data?.items ?? [];
  const pagination = listQuery.data?.pagination ?? {
    page,
    limit,
    totalItems: 0,
    totalPages: 1,
  };

  const saveMutation = useMutation({
    mutationFn: (values: TValues) => {
      if (editingEntity) {
        return updateFn(editingEntity.id, values);
      }

      return createFn(values);
    },
    onSuccess: async () => {
      setToast({
        type: "success",
        message: editingEntity
          ? `Cập nhật ${title.toLowerCase()} thành công`
          : `Thêm ${title.toLowerCase()} thành công`,
      });

      setEditingEntity(null);
      formDisclosure.close();

      await queryClient.invalidateQueries({
        queryKey: [queryKeyBase],
      });
    },
    onError: (error) => {
      setToast({
        type: "error",
        message: getApiErrorMessage(
          error,
          `Không thể lưu ${title.toLowerCase()}`,
        ),
      });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (entity: TEntity) => deleteFn(entity),
    onSuccess: async () => {
      setToast({
        type: "success",
        message: `Xóa ${title.toLowerCase()} thành công`,
      });

      if (deletingEntity) {
        setSelectedIds((current) =>
          current.filter((id) => id !== deletingEntity.id),
        );
      }

      setDeletingEntity(null);
      deleteDisclosure.close();

      await queryClient.invalidateQueries({
        queryKey: [queryKeyBase],
      });
    },
    onError: (error) => {
      setToast({
        type: "error",
        message: getApiErrorMessage(
          error,
          `Không thể xóa ${title.toLowerCase()}`,
        ),
      });
    },
  });

  const openCreateForm = () => {
    setEditingEntity(null);
    formDisclosure.open();
  };

  const openEditForm = (entity: TEntity) => {
    setEditingEntity(entity);
    formDisclosure.open();
  };

  const openDeleteDialog = (entity: TEntity) => {
    setDeletingEntity(entity);
    deleteDisclosure.open();
  };

  const closeForm = () => {
    if (saveMutation.isPending) return;
    setEditingEntity(null);
    formDisclosure.close();
  };

  const closeDeleteDialog = () => {
    if (removeMutation.isPending) return;
    setDeletingEntity(null);
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
    const currentPageIds = rows.map((entity) => entity.id);
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
        <span className="font-semibold text-slate-950">{title}</span>
      </div>

      <header className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 ring-1 ring-brand-100">
              <Icon size={22} aria-hidden="true" />
            </div>

            <div className="min-w-0">
              <h1 className="text-xl font-bold text-slate-950">{title}</h1>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
                {description}
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
                {extraSummary}
              </div>
            </div>
          </div>

          <Button
            type="button"
            className="w-full lg:w-auto"
            leftIcon={<Plus size={16} aria-hidden="true" />}
            onClick={openCreateForm}
          >
            {createActionLabel}
          </Button>
        </div>
      </header>

      <AdminCrudToolbar
        keyword={keyword}
        searchPlaceholder={searchPlaceholder}
        isSearching={listQuery.isFetching}
        onKeywordChange={setKeyword}
        onSearch={() => listQuery.refetch()}
        onReset={() => {
          setKeyword("");
          resetPage();
          setSelectedIds([]);
        }}
        leftSlot={
          selectedIds.length > 0 ? (
            <div className="flex h-10 items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 text-sm font-medium text-amber-900">
              <span>{selectedIds.length} dòng đã chọn</span>

              <Tooltip label={selectionNotice}>
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
              Lọc và thao tác trên danh sách {title.toLowerCase()}
            </span>
          )
        }
      />

      {listQuery.isError ? (
        <ErrorState
          title={`Không tải được danh sách ${title.toLowerCase()}`}
          description={getApiErrorMessage(
            listQuery.error,
            "Vui lòng kiểm tra backend hoặc thử lại sau.",
          )}
          onAction={() => listQuery.refetch()}
        />
      ) : rows.length === 0 && !listQuery.isLoading ? (
        <EmptyState
          icon={<Icon size={22} aria-hidden="true" />}
          title={`Chưa có dữ liệu ${title.toLowerCase()}`}
          description={emptyDescription}
          actionLabel={createActionLabel}
          onAction={openCreateForm}
        />
      ) : (
        <TableComponent
          rows={rows}
          page={page}
          limit={limit}
          selectedIds={selectedIds}
          isLoading={listQuery.isLoading}
          deletingId={
            removeMutation.isPending ? (deletingEntity?.id ?? null) : null
          }
          onEdit={openEditForm}
          onDelete={openDeleteDialog}
          onToggleRow={toggleRow}
          onToggleAll={toggleAllCurrentPage}
        />
      )}

      <AdminCrudPagination
        pagination={pagination}
        isLoading={listQuery.isFetching}
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
        title={editingEntity ? `Cập nhật ${title.toLowerCase()}` : createActionLabel}
        onClose={closeForm}
      >
        <FormComponent
          initialData={editingEntity}
          isSubmitting={saveMutation.isPending}
          onCancel={closeForm}
          onSubmit={(values) => saveMutation.mutate(values)}
          {...(formProps as TFormExtraProps)}
        />
      </FormModal>

      <ConfirmDeleteDialog
        isOpen={deleteDisclosure.isOpen}
        itemName={deletingEntity ? getItemName(deletingEntity) : undefined}
        isDeleting={removeMutation.isPending}
        description={
          deletingEntity
            ? `Bạn có chắc chắn muốn xóa ${title.toLowerCase()} "${getItemName(
                deletingEntity,
              )}" không?`
            : undefined
        }
        onCancel={closeDeleteDialog}
        onConfirm={() => {
          if (deletingEntity) {
            removeMutation.mutate(deletingEntity);
          }
        }}
      />
    </section>
  );
}
