import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, RefreshCw, Save, Trash2, X } from "lucide-react";
import { adminCrudApi } from "../../api/adminCrud.api";
import { lecturerQuotasApi } from "../../api/admin/lecturerQuotas.api";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Card, { CardBody, CardHeader } from "../../components/ui/Card";
import SelectInput from "../../components/ui/SelectInput";
import TextInput from "../../components/ui/TextInput";
import { useDebounce } from "../../hooks/useDebounce";
import { usePagination } from "../../hooks/usePagination";
import { getApiErrorMessage } from "../../types/api.types";
import type {
  LecturerQuota,
  LecturerQuotaFormValues,
  LecturerQuotaType,
} from "./lecturerQuota.types";
import {
  lecturerQuotaTypeLabels,
  lecturerQuotaTypeRates,
} from "./lecturerQuota.types";

const emptyForm: LecturerQuotaFormValues = {
  giangVienId: 0,
  namHocId: 0,
  loaiDinhMuc: "giang_vien_thuong",
  gioTieuChuan: 270,
  ghiChu: "",
};

const formatNumber = (value: number | string | null | undefined) => {
  const parsed = Number(value ?? 0);
  if (!Number.isFinite(parsed)) return "0";
  return parsed.toLocaleString("vi-VN", { maximumFractionDigits: 1 });
};

export default function LecturerQuotaPage() {
  const queryClient = useQueryClient();
  const { page, limit, setPage, setLimit, resetPage } = usePagination({
    initialLimit: 10,
  });
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 350);
  const [namHocId, setNamHocId] = useState("");
  const [boMonId, setBoMonId] = useState("");
  const [form, setForm] = useState<LecturerQuotaFormValues>(emptyForm);
  const [editing, setEditing] = useState<LecturerQuota | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const schoolYearsQuery = useQuery({
    queryKey: ["quota-school-years"],
    queryFn: () => adminCrudApi.list("namhoc", { page: 1, limit: 200 }),
  });

  const departmentsQuery = useQuery({
    queryKey: ["quota-departments"],
    queryFn: () => adminCrudApi.list("bo-mon", { page: 1, limit: 200 }),
  });

  const lecturersQuery = useQuery({
    queryKey: ["quota-lecturers"],
    queryFn: () => adminCrudApi.list("giang-vien", { page: 1, limit: 500 }),
  });

  useEffect(() => {
    const first = schoolYearsQuery.data?.items?.[0];
    if (!namHocId && first?.namHocId) {
      setNamHocId(String(first.namHocId));
      setForm((current) => ({ ...current, namHocId: Number(first.namHocId) }));
    }
  }, [schoolYearsQuery.data?.items, namHocId]);

  useEffect(() => {
    resetPage();
  }, [debouncedKeyword, namHocId, boMonId, resetPage]);

  const quotaQuery = useQuery({
    queryKey: ["lecturer-quotas", page, limit, debouncedKeyword, namHocId, boMonId],
    queryFn: () =>
      lecturerQuotasApi.list({
        page,
        limit,
        keyword: debouncedKeyword.trim() || undefined,
        namHocId: namHocId || undefined,
        boMonId: boMonId || undefined,
      }),
    enabled: Boolean(namHocId),
  });

  const schoolYearOptions = useMemo(
    () =>
      (schoolYearsQuery.data?.items ?? []).map((item) => ({
        label: String(item.maNamHoc ?? item.tenNamHoc ?? item.namHocId),
        value: String(item.namHocId),
      })),
    [schoolYearsQuery.data?.items],
  );

  const departmentOptions = useMemo(
    () => [
      { label: "Tất cả bộ môn", value: "" },
      ...(departmentsQuery.data?.items ?? []).map((item) => ({
        label: `${String(item.maBoMon ?? "")} - ${String(item.tenBoMon ?? "")}`,
        value: String(item.boMonId),
      })),
    ],
    [departmentsQuery.data?.items],
  );

  const lecturerOptions = useMemo(
    () =>
      (lecturersQuery.data?.items ?? []).map((item) => ({
        label: `${String(item.maGiangVien ?? "")} - ${String(item.hoTen ?? "")}`,
        value: String(item.giangVienId),
      })),
    [lecturersQuery.data?.items],
  );

  const computed = useMemo(() => {
    const rate = lecturerQuotaTypeRates[form.loaiDinhMuc] ?? 100;
    const required = Number(
      ((Number(form.gioTieuChuan || 0) * rate) / 100).toFixed(1),
    );
    const reduced = Number(
      (Number(form.gioTieuChuan || 0) - required).toFixed(1),
    );
    return { rate, required, reduced };
  }, [form.gioTieuChuan, form.loaiDinhMuc]);

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: ["lecturer-quotas"] });
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!form.giangVienId || !form.namHocId) {
        throw new Error("Vui lòng chọn năm học và giảng viên");
      }
      return editing
        ? lecturerQuotasApi.update(editing.dinhMucId, form)
        : lecturerQuotasApi.create(form);
    },
    onSuccess: async () => {
      setMessage(editing ? "Đã cập nhật định mức" : "Đã tạo định mức");
      setEditing(null);
      setForm({ ...emptyForm, namHocId: Number(namHocId || 0) });
      await invalidate();
    },
    onError: (error) =>
      setMessage(getApiErrorMessage(error, "Không thể lưu định mức")),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => lecturerQuotasApi.remove(id),
    onSuccess: async () => {
      setMessage("Đã xóa định mức");
      await invalidate();
    },
    onError: (error) =>
      setMessage(getApiErrorMessage(error, "Không thể xóa định mức")),
  });

  const generateMutation = useMutation({
    mutationFn: () =>
      lecturerQuotasApi.generate({
        namHocId: Number(namHocId),
        gioTieuChuanMacDinh: 270,
        boMonId: boMonId ? Number(boMonId) : undefined,
      }),
    onSuccess: async (result) => {
      setMessage(
        `Đã sinh ${result.created} định mức, bỏ qua ${result.skipped} giảng viên đã có định mức`,
      );
      await invalidate();
    },
    onError: (error) =>
      setMessage(getApiErrorMessage(error, "Không thể sinh định mức")),
  });

  const startEdit = (item: LecturerQuota) => {
    setEditing(item);
    setForm({
      giangVienId: item.giangVienId,
      namHocId: item.namHocId,
      loaiDinhMuc: item.loaiDinhMuc,
      gioTieuChuan: Number(item.gioTieuChuan ?? 270),
      ghiChu: item.ghiChu ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm({ ...emptyForm, namHocId: Number(namHocId || 0) });
  };

  const items = quotaQuery.data?.items ?? [];
  const pagination = quotaQuery.data?.pagination;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-brand-700">Giảng viên</p>
        <h1 className="text-2xl font-bold text-slate-950">
          Định mức giảng viên
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Quản lý giờ tiêu chuẩn, tỷ lệ định mức và giờ phải dạy theo từng năm
          học.
        </p>
      </div>

      {message ? (
        <div className="rounded-lg border border-brand-100 bg-brand-50 px-4 py-3 text-sm font-medium text-brand-800">
          {message}
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <h2 className="text-lg font-bold text-slate-900">
            Bộ lọc và sinh định mức
          </h2>
        </CardHeader>
        <CardBody className="grid gap-4 lg:grid-cols-[1fr_1fr_1.2fr_auto]">
          <SelectInput
            label="Năm học"
            value={namHocId}
            options={schoolYearOptions}
            onChange={(event) => {
              setNamHocId(event.target.value);
              setForm((current) => ({
                ...current,
                namHocId: Number(event.target.value || 0),
              }));
            }}
          />
          <SelectInput
            label="Bộ môn"
            value={boMonId}
            options={departmentOptions}
            onChange={(event) => setBoMonId(event.target.value)}
          />
          <TextInput
            label="Tìm giảng viên"
            placeholder="Mã, họ tên, email..."
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
          <div className="flex items-end">
            <Button
              className="w-full"
              disabled={!namHocId}
              isLoading={generateMutation.isPending}
              leftIcon={<RefreshCw size={16} />}
              onClick={() => generateMutation.mutate()}
            >
              Sinh mặc định
            </Button>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-bold text-slate-900">
            {editing ? "Cập nhật định mức" : "Thêm định mức"}
          </h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-4">
            <SelectInput
              label="Giảng viên"
              required
              value={form.giangVienId ? String(form.giangVienId) : ""}
              options={lecturerOptions}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  giangVienId: Number(event.target.value || 0),
                }))
              }
            />
            <SelectInput
              label="Loại định mức"
              required
              value={form.loaiDinhMuc}
              options={(
                Object.keys(lecturerQuotaTypeLabels) as LecturerQuotaType[]
              ).map((key) => ({
                label: lecturerQuotaTypeLabels[key],
                value: key,
              }))}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  loaiDinhMuc: event.target.value as LecturerQuotaType,
                }))
              }
            />
            <TextInput
              label="Giờ tiêu chuẩn"
              type="number"
              min={0}
              value={form.gioTieuChuan}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  gioTieuChuan: Number(event.target.value || 0),
                }))
              }
            />
            <TextInput
              label="Ghi chú"
              value={form.ghiChu ?? ""}
              onChange={(event) =>
                setForm((current) => ({ ...current, ghiChu: event.target.value }))
              }
            />
          </div>

          <div className="grid gap-3 rounded-xl bg-slate-50 p-4 text-sm lg:grid-cols-3">
            <div>
              <p className="text-slate-500">Tỷ lệ định mức</p>
              <p className="mt-1 text-lg font-bold text-slate-900">
                {computed.rate}%
              </p>
            </div>
            <div>
              <p className="text-slate-500">Giờ miễn giảm</p>
              <p className="mt-1 text-lg font-bold text-slate-900">
                {formatNumber(computed.reduced)}
              </p>
            </div>
            <div>
              <p className="text-slate-500">Giờ phải dạy</p>
              <p className="mt-1 text-lg font-bold text-slate-900">
                {formatNumber(computed.required)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              isLoading={saveMutation.isPending}
              leftIcon={editing ? <Save size={16} /> : <Plus size={16} />}
              onClick={() => saveMutation.mutate()}
            >
              {editing ? "Lưu cập nhật" : "Thêm định mức"}
            </Button>
            {editing ? (
              <Button
                variant="secondary"
                leftIcon={<X size={16} />}
                onClick={cancelEdit}
              >
                Hủy sửa
              </Button>
            ) : null}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            Danh sách định mức
          </h2>
          <p className="text-sm text-slate-500">
            {pagination
              ? `Hiển thị ${items.length} / ${pagination.totalItems} bản ghi`
              : "Đang tải..."}
          </p>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-bold uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Giảng viên</th>
                <th className="px-4 py-3">Năm học</th>
                <th className="px-4 py-3">Loại định mức</th>
                <th className="px-4 py-3 text-right">Giờ TC</th>
                <th className="px-4 py-3 text-right">Tỷ lệ</th>
                <th className="px-4 py-3 text-right">Miễn giảm</th>
                <th className="px-4 py-3 text-right">Phải dạy</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {quotaQuery.isLoading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-slate-500"
                  >
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-slate-500"
                  >
                    Chưa có định mức giảng viên cho bộ lọc hiện tại.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.dinhMucId} className="hover:bg-slate-50/70">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">
                        {item.giangVien?.hoTen ?? "-"}
                      </div>
                      <div className="text-xs text-slate-500">
                        {item.giangVien?.maGiangVien ?? "-"} ·{" "}
                        {item.giangVien?.boMon?.tenBoMon ?? "-"}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-700">
                      {item.namHoc?.maNamHoc ?? "-"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone="blue">
                        {lecturerQuotaTypeLabels[item.loaiDinhMuc] ??
                          item.loaiDinhMuc}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {formatNumber(item.gioTieuChuan)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {formatNumber(item.tyLeDinhMuc)}%
                    </td>
                    <td className="px-4 py-3 text-right">
                      {formatNumber(item.gioMienGiam)}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-brand-700">
                      {formatNumber(item.gioPhaiDay)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="secondary"
                          onClick={() => startEdit(item)}
                        >
                          Sửa
                        </Button>
                        <Button
                          variant="danger"
                          leftIcon={<Trash2 size={16} />}
                          onClick={() => {
                            if (window.confirm("Xóa định mức này?")) {
                              deleteMutation.mutate(item.dinhMucId);
                            }
                          }}
                        >
                          Xóa
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 text-sm">
          <div className="flex items-center gap-2">
            <span>Số dòng</span>
            <select
              className="rounded-md border border-slate-200 px-2 py-1"
              value={limit}
              onChange={(event) => setLimit(Number(event.target.value))}
            >
              {[10, 20, 50].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              Trước
            </Button>
            <span className="font-semibold">
              {page} / {pagination?.totalPages ?? 1}
            </span>
            <Button
              variant="secondary"
              disabled={page >= (pagination?.totalPages ?? 1)}
              onClick={() => setPage(page + 1)}
            >
              Sau
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
