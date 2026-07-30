import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { KeyRound, Plus, UserCheck, UserCog, UserX } from "lucide-react";
import { lecturerAccountsApi } from "../../api/admin/lecturerAccounts.api";
import AdminCrudPagination from "../../components/admin/crud/AdminCrudPagination";
import AdminCrudToolbar from "../../components/admin/crud/AdminCrudToolbar";
import FormModal from "../../components/admin/crud/FormModal";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import Badge, { type BadgeTone } from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import IconButton from "../../components/ui/IconButton";
import TableSkeleton from "../../components/ui/TableSkeleton";
import Toast, { type ToastType } from "../../components/ui/Toast";
import { useDebounce } from "../../hooks/useDebounce";
import { getApiErrorMessage } from "../../types/api.types";
import LecturerAccountForm from "./LecturerAccountForm";
import type {
  AccountStatus,
  LecturerAccount,
  LecturerAccountFormValues,
} from "./lecturerAccount.types";

type ToastState = {
  type: ToastType;
  message: string;
};

const accountStatusLabel: Record<AccountStatus, string> = {
  hoat_dong: "Đang hoạt động",
  tam_khoa: "Tạm khóa",
  bi_khoa: "Bị khóa",
};

const accountStatusTone: Record<AccountStatus, BadgeTone> = {
  hoat_dong: "green",
  tam_khoa: "amber",
  bi_khoa: "red",
};

const formatAccountStatus = (row: LecturerAccount) => {
  if (!row.taiKhoan) {
    return <Badge tone="slate">Chưa có tài khoản</Badge>;
  }

  return (
    <Badge tone={accountStatusTone[row.taiKhoan.trangThai]}>
      {accountStatusLabel[row.taiKhoan.trangThai]}
    </Badge>
  );
};

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  return new Intl.DateTimeFormat("vi-VN").format(new Date(value));
};

export default function LecturerAccountPage() {
  const queryClient = useQueryClient();
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 300);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [formMode, setFormMode] = useState<"create" | "edit" | null>(null);
  const [selectedLecturer, setSelectedLecturer] = useState<LecturerAccount | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    setPage(1);
  }, [debouncedKeyword]);

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const listQuery = useQuery({
    queryKey: ["lecturer-accounts", page, limit, debouncedKeyword.trim()],
    queryFn: () =>
      lecturerAccountsApi.list({
        page,
        limit,
        keyword: debouncedKeyword.trim() || undefined,
      }),
  });

  const availableLecturersQuery = useQuery({
    queryKey: ["lecturer-accounts", "available-lecturers"],
    queryFn: lecturerAccountsApi.availableLecturers,
  });

  const rows = useMemo(() => listQuery.data?.items ?? [], [listQuery.data?.items]);
  const pagination = listQuery.data?.pagination ?? {
    page,
    limit,
    totalItems: 0,
    totalPages: 1,
  };

  const summary = useMemo(() => {
    const total = pagination.totalItems;
    const accountCountOnPage = rows.filter((row) => row.taiKhoan).length;
    const missingCountOnPage = rows.length - accountCountOnPage;

    return { total, accountCountOnPage, missingCountOnPage };
  }, [pagination.totalItems, rows]);

  const saveMutation = useMutation({
    mutationFn: (values: LecturerAccountFormValues) => {
      if (formMode === "edit" && selectedLecturer?.taiKhoan) {
        const payload: Partial<LecturerAccountFormValues> = {
          email: values.email,
          trangThai: values.trangThai,
        };

        if (values.password) {
          payload.password = values.password;
        }

        return lecturerAccountsApi.update(selectedLecturer.taiKhoan.id, payload);
      }

      return lecturerAccountsApi.create(values);
    },
    onSuccess: async () => {
      setToast({
        type: "success",
        message:
          formMode === "edit"
            ? "Cập nhật tài khoản giảng viên thành công"
            : "Tạo tài khoản giảng viên thành công",
      });
      closeForm();
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["lecturer-accounts"] }),
        queryClient.invalidateQueries({ queryKey: ["admin-crud", "giangvien"] }),
      ]);
    },
    onError: (error) => {
      setToast({
        type: "error",
        message: getApiErrorMessage(error, "Không thể lưu tài khoản giảng viên"),
      });
    },
  });

  const openCreateForm = (lecturer?: LecturerAccount) => {
    setSelectedLecturer(lecturer ?? null);
    setFormMode("create");
  };

  const openEditForm = (lecturer: LecturerAccount) => {
    setSelectedLecturer(lecturer);
    setFormMode("edit");
  };

  const closeForm = () => {
    if (saveMutation.isPending) return;
    setFormMode(null);
    setSelectedLecturer(null);
  };

  const isFormOpen = Boolean(formMode);
  const editingAccount = formMode === "edit" ? selectedLecturer : null;

  return (
    <section className="space-y-4">
      {toast ? (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      ) : null}

      <div className="text-sm">
        <span className="font-medium text-slate-500">Quản trị</span>
        <span className="mx-2 text-slate-300">/</span>
        <span className="font-medium text-slate-500">Giảng viên</span>
        <span className="mx-2 text-slate-300">/</span>
        <span className="font-semibold text-slate-950">Tài khoản giảng viên</span>
      </div>

      <header className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 ring-1 ring-brand-100">
              <UserCog size={22} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-slate-950">Tài khoản giảng viên</h1>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
                Quản trị và giáo vụ tạo tài khoản đăng nhập cho giảng viên, đồng thời khóa hoặc mở lại tài khoản khi cần.
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-slate-700">
                  {summary.total} hồ sơ giảng viên
                </span>
                <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-emerald-700">
                  {summary.accountCountOnPage} tài khoản trong trang này
                </span>
                <span className="rounded-md bg-amber-50 px-2.5 py-1 text-amber-700">
                  {summary.missingCountOnPage} chưa có tài khoản trong trang này
                </span>
              </div>
            </div>
          </div>

          <Button
            type="button"
            className="w-full lg:w-auto"
            leftIcon={<Plus size={16} aria-hidden="true" />}
            disabled={(availableLecturersQuery.data?.length ?? 0) === 0}
            onClick={() => openCreateForm()}
          >
            Tạo tài khoản
          </Button>
        </div>
      </header>

      <AdminCrudToolbar
        keyword={keyword}
        searchPlaceholder="Tìm mã GV, họ tên, email, bộ môn..."
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
          title="Không tải được danh sách tài khoản giảng viên"
          description={getApiErrorMessage(
            listQuery.error,
            "Vui lòng kiểm tra backend hoặc thử lại sau.",
          )}
          onAction={() => listQuery.refetch()}
        />
      ) : rows.length === 0 && !listQuery.isLoading ? (
        <EmptyState
          icon={<UserCog size={22} aria-hidden="true" />}
          title="Chưa có hồ sơ giảng viên"
          description="Hãy tạo hồ sơ giảng viên trước, sau đó tạo tài khoản đăng nhập cho giảng viên."
          actionLabel="Tải lại dữ liệu"
          onAction={() => listQuery.refetch()}
        />
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          {listQuery.isLoading ? <TableSkeleton columns={7} rows={6} /> : null}
          <div className={["max-h-[calc(100vh-330px)] min-h-[280px] overflow-auto", listQuery.isLoading ? "hidden" : ""].join(" ")}> 
            <table className="w-full min-w-[980px] table-fixed border-collapse text-left text-sm">
              <thead className="sticky top-0 z-10 bg-slate-50 text-xs uppercase text-slate-600">
                <tr>
                  <th className="w-32 border-b border-slate-200 px-4 py-3 font-semibold">Mã GV</th>
                  <th className="border-b border-slate-200 px-4 py-3 font-semibold">Giảng viên</th>
                  <th className="border-b border-slate-200 px-4 py-3 font-semibold">Bộ môn</th>
                  <th className="border-b border-slate-200 px-4 py-3 font-semibold">Email đăng nhập</th>
                  <th className="w-40 border-b border-slate-200 px-4 py-3 font-semibold">Trạng thái</th>
                  <th className="w-32 border-b border-slate-200 px-4 py-3 font-semibold">Ngày tạo</th>
                  <th className="sticky right-0 w-36 border-b border-slate-200 bg-slate-50 px-4 py-3 text-center font-semibold">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((row) => (
                  <tr key={row.giangVienId} className="transition hover:bg-brand-50/45">
                    <td className="px-4 py-3 font-semibold text-slate-700">
                      {row.maGiangVien || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-950">{row.hoTen}</div>
                      <div className="mt-0.5 truncate text-xs text-slate-500">
                        {[row.hocVi, row.chucDanh].filter(Boolean).join(" · ") || "Hồ sơ giảng viên"}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {row.boMon?.tenBoMon || "-"}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {row.taiKhoan?.email || row.email || "-"}
                    </td>
                    <td className="px-4 py-3">{formatAccountStatus(row)}</td>
                    <td className="px-4 py-3 text-slate-500">
                      {formatDate(row.taiKhoan?.ngayTao)}
                    </td>
                    <td className="sticky right-0 bg-white px-3 py-2 shadow-[-10px_0_18px_-18px_rgba(15,23,42,0.5)]">
                      <div className="flex justify-center gap-1">
                        {row.taiKhoan ? (
                          <IconButton label="Sửa tài khoản" onClick={() => openEditForm(row)}>
                            <KeyRound size={16} aria-hidden="true" />
                          </IconButton>
                        ) : (
                          <IconButton label="Tạo tài khoản" onClick={() => openCreateForm(row)}>
                            <UserCheck size={16} aria-hidden="true" />
                          </IconButton>
                        )}
                        {row.taiKhoan?.trangThai === "bi_khoa" ? (
                          <span className="flex size-9 items-center justify-center rounded-md text-red-500" title="Tài khoản đang bị khóa">
                            <UserX size={16} aria-hidden="true" />
                          </span>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
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
        title={formMode === "edit" ? "Sửa tài khoản giảng viên" : "Tạo tài khoản giảng viên"}
        description="Tài khoản giảng viên dùng để đăng nhập khu vực giảng viên và xem phân công của chính giảng viên đó."
        onClose={closeForm}
      >
        <LecturerAccountForm
          initialData={editingAccount}
          selectedLecturer={formMode === "create" ? selectedLecturer : null}
          availableLecturers={availableLecturersQuery.data ?? []}
          isSubmitting={saveMutation.isPending}
          onCancel={closeForm}
          onSubmit={(values) => saveMutation.mutate(values)}
        />
      </FormModal>
    </section>
  );
}
