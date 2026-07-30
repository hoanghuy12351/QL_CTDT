import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, UserCog } from "lucide-react";
import { usersApi } from "../../api/admin/users.api";
import { adminCrudApi } from "../../api/adminCrud.api";
import FormModal from "../../components/admin/crud/FormModal";
import Button from "../../components/ui/Button";
import Card, { CardBody, CardHeader } from "../../components/ui/Card";
import TextInput from "../../components/ui/TextInput";
import SelectInput, { type SelectOption } from "../../components/ui/SelectInput";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import Toast, { type ToastType } from "../../components/ui/Toast";
import { useDebounce } from "../../hooks/useDebounce";
import { getApiErrorMessage } from "../../types/api.types";
import UserForm from "./UserForm";
import type { UserAccountDto, UserFormValues } from "./user.types";

const defaultValues: UserFormValues = {
  email: "",
  password: "",
  hoTen: "",
  vaiTro: "giang_vien",
  trangThai: "hoat_dong",
  giangVienId: "",
};

const roleLabels: Record<string, string> = {
  quan_tri: "Admin",
  giang_vien: "Giảng viên",
};

const statusLabels: Record<string, string> = {
  hoat_dong: "Hoạt động",
  tam_khoa: "Tạm khóa",
  bi_khoa: "Bị khóa",
};

const roleOptions: SelectOption[] = [
  { label: "Tất cả vai trò", value: "" },
  { label: "Admin", value: "quan_tri" },
  { label: "Giảng viên", value: "giang_vien" },
];

const getLinkedLecturerId = (user: UserAccountDto) => {
  return user.giangVien?.[0]?.giangVienId ? String(user.giangVien[0].giangVienId) : "";
};

const buildInitialValues = (user: UserAccountDto): UserFormValues => ({
  email: user.email,
  password: "",
  hoTen: user.hoTen,
  vaiTro: user.vaiTro,
  trangThai: user.trangThai,
  giangVienId: getLinkedLecturerId(user),
});

export default function UserPage() {
  const queryClient = useQueryClient();
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 400);
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccountDto | null>(null);
  const [values, setValues] = useState<UserFormValues>(defaultValues);
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);

  useEffect(() => {
    setPage(1);
  }, [debouncedKeyword, role]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const usersQuery = useQuery({
    queryKey: ["users", page, debouncedKeyword, role],
    queryFn: () =>
      usersApi.list({
        page,
        limit: 10,
        keyword: debouncedKeyword || undefined,
        vaiTro: role || undefined,
      }),
  });

  const lecturersQuery = useQuery({
    queryKey: ["user-form-lecturers"],
    queryFn: () => adminCrudApi.list("giang-vien", { page: 1, limit: 500 }),
  });

  const lecturerOptions = useMemo<SelectOption[]>(() => {
    return (lecturersQuery.data?.items ?? []).map((lecturer) => ({
      value: String(lecturer.giangVienId ?? ""),
      label: `${String(lecturer.maGiangVien ?? "GV")} - ${String(
        lecturer.hoTen ?? "Giảng viên",
      )}`,
    }));
  }, [lecturersQuery.data?.items]);

  const saveMutation = useMutation({
    mutationFn: () =>
      editingUser
        ? usersApi.update(editingUser.nguoiDungId, values)
        : usersApi.create(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user-form-lecturers"] });
      setIsFormOpen(false);
      setEditingUser(null);
      setValues(defaultValues);
      setToast({ type: "success", message: "Lưu tài khoản thành công" });
    },
    onError: (error) => {
      setToast({
        type: "error",
        message: getApiErrorMessage(error, "Không lưu được tài khoản"),
      });
    },
  });

  const openCreate = () => {
    setEditingUser(null);
    setValues(defaultValues);
    setIsFormOpen(true);
  };

  const openEdit = (user: UserAccountDto) => {
    setEditingUser(user);
    setValues(buildInitialValues(user));
    setIsFormOpen(true);
  };

  if (usersQuery.isError) {
    return (
      <ErrorState
        title="Không tải được danh sách tài khoản"
        description="Chỉ tài khoản admin mới được quản lý phân quyền."
        onAction={() => usersQuery.refetch()}
      />
    );
  }

  const users = usersQuery.data?.items ?? [];
  const pagination = usersQuery.data?.pagination;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-brand-700">Phân quyền</p>
            <h1 className="mt-2 text-2xl font-bold text-slate-950">Tài khoản người dùng</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Quản lý tài khoản admin và tài khoản giảng viên. Tài khoản giảng viên cần liên kết với hồ sơ giảng viên để xem đúng phân công.
            </p>
          </div>
          <Button leftIcon={<Plus size={18} aria-hidden="true" />} onClick={openCreate}>
            Thêm tài khoản
          </Button>
        </div>
      </section>

      <Card>
        <CardHeader>
          <div className="grid gap-3 lg:grid-cols-[1fr_240px]">
            <TextInput
              label="Tìm kiếm"
              name="keyword"
              value={keyword}
              placeholder="Tìm theo họ tên, email hoặc mã giảng viên..."
              onChange={(event) => setKeyword(event.target.value)}
            />
            <SelectInput
              label="Vai trò"
              name="role"
              options={roleOptions}
              value={role}
              onChange={(event) => setRole(event.target.value)}
            />
          </div>
        </CardHeader>
        <CardBody>
          {usersQuery.isLoading ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center text-sm font-medium text-slate-500">
              Đang tải tài khoản...
            </div>
          ) : users.length === 0 ? (
            <EmptyState
              icon={<UserCog size={22} aria-hidden="true" />}
              title="Chưa có tài khoản phù hợp"
              description="Bạn có thể tạo tài khoản admin hoặc tài khoản giảng viên mới."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Người dùng</th>
                    <th className="px-4 py-3">Vai trò</th>
                    <th className="px-4 py-3">Hồ sơ giảng viên</th>
                    <th className="px-4 py-3">Trạng thái</th>
                    <th className="px-4 py-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((user) => {
                    const lecturer = user.giangVien?.[0];
                    return (
                      <tr key={user.nguoiDungId} className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <p className="font-bold text-slate-950">{user.hoTen}</p>
                          <p className="mt-1 text-xs text-slate-500">{user.email}</p>
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {roleLabels[user.vaiTro] ?? user.vaiTro}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {lecturer ? (
                            <>
                              <p className="font-semibold text-slate-800">
                                {lecturer.maGiangVien || "GV"} - {lecturer.hoTen}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                {lecturer.boMon?.tenBoMon || "Chưa gán bộ môn"}
                              </p>
                            </>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                            {statusLabels[user.trangThai] ?? user.trangThai}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button variant="secondary" onClick={() => openEdit(user)}>
                            Sửa
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {pagination ? (
            <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <p>
                Trang {pagination.page}/{Math.max(pagination.totalPages, 1)} · Tổng {pagination.totalItems} tài khoản
              </p>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  disabled={page <= 1 || usersQuery.isFetching}
                  onClick={() => setPage((current) => Math.max(current - 1, 1))}
                >
                  Trước
                </Button>
                <Button
                  variant="secondary"
                  disabled={
                    !pagination.totalPages || page >= pagination.totalPages || usersQuery.isFetching
                  }
                  onClick={() => setPage((current) => current + 1)}
                >
                  Sau
                </Button>
              </div>
            </div>
          ) : null}
        </CardBody>
      </Card>

      <FormModal
        isOpen={isFormOpen}
        title={editingUser ? "Sửa tài khoản" : "Thêm tài khoản"}
        description="Thiết lập vai trò đăng nhập và liên kết hồ sơ giảng viên nếu là tài khoản giảng viên."
        onClose={() => {
          setIsFormOpen(false);
          setEditingUser(null);
          setValues(defaultValues);
        }}
        footer={
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              disabled={saveMutation.isPending}
              onClick={() => setIsFormOpen(false)}
            >
              Hủy
            </Button>
            <Button isLoading={saveMutation.isPending} onClick={() => saveMutation.mutate()}>
              Lưu tài khoản
            </Button>
          </div>
        }
      >
        <UserForm
          values={values}
          isEdit={Boolean(editingUser)}
          lecturerOptions={lecturerOptions}
          onChange={setValues}
        />
      </FormModal>

      {toast ? <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} /> : null}
    </div>
  );
}
