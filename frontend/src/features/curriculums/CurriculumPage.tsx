import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Route } from "lucide-react";
import { adminCrudApi } from "../../api/adminCrud.api";
import { curriculumsApi } from "../../api/admin/curriculums.api";
import AdminCrudPagination from "../../components/admin/crud/AdminCrudPagination";
import AdminCrudToolbar from "../../components/admin/crud/AdminCrudToolbar";
import ConfirmDeleteDialog from "../../components/admin/crud/ConfirmDeleteDialog";
import FormModal from "../../components/admin/crud/FormModal";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import Button from "../../components/ui/Button";
import Toast, { type ToastType } from "../../components/ui/Toast";
import { useDebounce } from "../../hooks/useDebounce";
import { useDisclosure } from "../../hooks/useDisclosure";
import { usePagination } from "../../hooks/usePagination";
import { getApiErrorMessage } from "../../types/api.types";
import type { AdminCrudRecord } from "../admin/crud/adminCrud.types";
import CurriculumForm from "./CurriculumForm";
import CurriculumTable from "./CurriculumTable";
import type { Curriculum, CurriculumFormValues } from "./curriculum.types";

type ToastState = {
  type: ToastType;
  message: string;
};

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
) =>
  rows.map((row) => ({
    value: String(row[idKey] ?? ""),
    label: toOptionLabel(row, codeKey, nameKey),
  }));

export default function CurriculumPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const formDisclosure = useDisclosure();
  const deleteDisclosure = useDisclosure();

  const { limit, page, resetPage, setLimit, setPage } = usePagination({
    initialLimit: 10,
  });

  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 400);
  const [deletingCurriculum, setDeletingCurriculum] = useState<Curriculum | null>(null);
  const [editingCurriculum, setEditingCurriculum] = useState<Curriculum | null>(null);
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

  const listQuery = useQuery({
    queryKey: ["curriculums", page, limit, debouncedKeyword.trim()],
    queryFn: () =>
      curriculumsApi.list({
        page,
        limit,
        keyword: debouncedKeyword.trim() || undefined,
      }),
  });

  const majorsQuery = useQuery({
    queryKey: ["admin-crud-options", "nganh"],
    queryFn: () => adminCrudApi.list("nganh", { page: 1, limit: 500 }),
  });
  const departmentsQuery = useQuery({
    queryKey: ["admin-crud-options", "bo-mon"],
    queryFn: () => adminCrudApi.list("bo-mon", { page: 1, limit: 500 }),
  });
  const specializationsQuery = useQuery({
    queryKey: ["admin-crud-options", "chuyen-nganh"],
    queryFn: () => adminCrudApi.list("chuyen-nganh", { page: 1, limit: 500 }),
  });
  const cohortsQuery = useQuery({
    queryKey: ["admin-crud-options", "khoa-hoc"],
    queryFn: () => adminCrudApi.list("khoa-hoc", { page: 1, limit: 500 }),
  });

  const rows = useMemo(() => listQuery.data?.items ?? [], [listQuery.data?.items]);
  const pagination = listQuery.data?.pagination ?? {
    page,
    limit,
    totalItems: 0,
    totalPages: 1,
  };

  const majorOptions = useMemo(
    () => buildOptions(majorsQuery.data?.items ?? [], "nganhId", "maNganh", "tenNganh"),
    [majorsQuery.data?.items],
  );
  const departmentOptions = useMemo(
    () =>
      buildOptions(
        departmentsQuery.data?.items ?? [],
        "boMonId",
        "maBoMon",
        "tenBoMon",
      ),
    [departmentsQuery.data?.items],
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

  const saveCurriculumMutation = useMutation({
    mutationFn: (values: CurriculumFormValues) => {
      if (editingCurriculum) {
        return curriculumsApi.update(editingCurriculum.id, values);
      }
      return curriculumsApi.create(values);
    },
    onSuccess: async (curriculum) => {
      showToast(
        "success",
        editingCurriculum ? "Cập nhật CTĐT thành công" : "Tạo CTĐT thành công",
      );
      setEditingCurriculum(null);
      formDisclosure.close();
      await queryClient.invalidateQueries({ queryKey: ["curriculums"] });
      if (!editingCurriculum) {
        navigate(`/admin/curriculums/${curriculum.id}`);
      }
    },
    onError: (error) =>
      showToast("error", getApiErrorMessage(error, "Không thể lưu CTĐT")),
  });

  const deleteCurriculumMutation = useMutation({
    mutationFn: (curriculum: Curriculum) => curriculumsApi.remove(curriculum.id),
    onSuccess: async () => {
      showToast("success", "Xóa CTĐT thành công");
      setDeletingCurriculum(null);
      deleteDisclosure.close();
      await queryClient.invalidateQueries({ queryKey: ["curriculums"] });
    },
    onError: (error) =>
      showToast("error", getApiErrorMessage(error, "Không thể xóa CTĐT")),
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
                Quản lý khung học phần theo ngành, chuyên ngành và khóa học.
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-slate-700">
                  {pagination.totalItems} CTĐT
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
            Nhấn vào tên CTĐT trong bảng để xem chi tiết học phần và lớp áp dụng.
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
          description="Tạo CTĐT đầu tiên, sau đó mở trang chi tiết để thêm học phần và gán lớp."
          actionLabel="Thêm CTĐT"
          onAction={openCreateForm}
        />
      ) : (
        <CurriculumTable
          rows={rows}
          page={page}
          limit={limit}
          isLoading={listQuery.isLoading}
          deletingId={deleteCurriculumMutation.isPending ? deletingCurriculum?.id : null}
          onSelect={(curriculum) => navigate(`/admin/curriculums/${curriculum.id}`)}
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
          departmentOptions={departmentOptions}
          specializationOptions={specializationOptions}
          cohortOptions={cohortOptions}
          onCancel={() => {
            setEditingCurriculum(null);
            formDisclosure.close();
          }}
          onSubmit={(values) => saveCurriculumMutation.mutate(values)}
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
