import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layers3 } from "lucide-react";
import { adminCrudApi } from "../../api/adminCrud.api";
import AdminCrudPage from "../../pages/admin/AdminCrudPage";
import { buildSelectOptions } from "../admin/crud/adminCrudPage.utils";
import type {
  AdminCrudConfig,
  AdminSelectOption,
} from "../admin/crud/adminCrud.types";

const classStatusOptions = [
  { label: "Dang hoc", value: "dang_hoc" },
  { label: "Da tot nghiep", value: "da_tot_nghiep" },
  { label: "Tam ngung", value: "tam_ngung" },
];

export default function ClassPage() {
  const academicYearsQuery = useQuery({
    queryKey: ["admin-crud-options", "khoa-hoc"],
    queryFn: () => adminCrudApi.list("khoa-hoc", { page: 1, limit: 100 }),
  });

  const majorsQuery = useQuery({
    queryKey: ["admin-crud-options", "nganh"],
    queryFn: () => adminCrudApi.list("nganh", { page: 1, limit: 100 }),
  });

  const specializationsQuery = useQuery({
    queryKey: ["admin-crud-options", "chuyen-nganh"],
    queryFn: () => adminCrudApi.list("chuyen-nganh", { page: 1, limit: 100 }),
  });

  const campusesQuery = useQuery({
    queryKey: ["admin-crud-options", "co-so"],
    queryFn: () => adminCrudApi.list("co-so", { page: 1, limit: 100 }),
  });

  const academicYearOptions = useMemo(
    () =>
      buildSelectOptions(
        academicYearsQuery.data?.items ?? [],
        "khoaHocId",
        (row) =>
          `${String(row.maKhoaHoc ?? "")} - ${String(row.tenKhoaHoc ?? "")}`,
      ),
    [academicYearsQuery.data?.items],
  );

  const majorOptions = useMemo(
    () =>
      buildSelectOptions(majorsQuery.data?.items ?? [], "nganhId", (row) =>
        `${String(row.maNganh ?? "")} - ${String(row.tenNganh ?? "")}`,
      ),
    [majorsQuery.data?.items],
  );

  const specializationOptions = useMemo<AdminSelectOption[]>(
    () =>
      (specializationsQuery.data?.items ?? []).map((row) => ({
        value: String(row.chuyenNganhId ?? ""),
        label: row.maChuyenNganh
          ? `${String(row.maChuyenNganh)} - ${String(row.tenChuyenNganh ?? "")}`
          : `${String(row.tenChuyenNganh ?? "")}`,
        parentValue: String(row.nganhId ?? ""),
      })),
    [specializationsQuery.data?.items],
  );

  const campusOptions = useMemo(
    () =>
      buildSelectOptions(campusesQuery.data?.items ?? [], "coSoId", (row) =>
        `${String(row.maCoSo ?? "")} - ${String(row.tenCoSo ?? "")}`,
      ),
    [campusesQuery.data?.items],
  );

  const config = useMemo<AdminCrudConfig>(
    () => ({
      resource: "lop",
      path: "lop",
      title: "Lop",
      description:
        "Quan ly lop theo khoa hoc, nganh, chuyen nganh, co so va trang thai dao tao.",
      primaryAction: "Them lop",
      icon: Layers3,
      idField: "lopId",
      searchPlaceholder: "Tim ma lop, ten lop, he dao tao...",
      fields: [
        {
          name: "maLop",
          label: "Ma lop",
          type: "text",
          required: true,
          placeholder: "VD: CNTT-K18A",
        },
        {
          name: "tenLop",
          label: "Ten lop",
          type: "text",
          required: true,
          placeholder: "VD: Cong nghe thong tin K18A",
        },
        {
          name: "khoaHocId",
          label: "Khoa hoc",
          type: "select",
          required: true,
          options: academicYearOptions,
        },
        {
          name: "nganhId",
          label: "Nganh",
          type: "select",
          required: true,
          options: majorOptions,
        },
        {
          name: "chuyenNganhId",
          label: "Chuyen nganh",
          type: "select",
          options: specializationOptions,
          dependsOn: "nganhId",
          dependencyPlaceholder: "Chon nganh truoc",
        },
        {
          name: "coSoId",
          label: "Co so",
          type: "select",
          options: campusOptions,
        },
        {
          name: "heDaoTao",
          label: "He dao tao",
          type: "text",
          placeholder: "VD: Chinh quy",
        },
        {
          name: "siSo",
          label: "Si so",
          type: "number",
          min: 0,
        },
        {
          name: "thoiGianNhapHoc",
          label: "Thoi gian nhap hoc",
          type: "month",
        },
        {
          name: "thoiGianTotNghiep",
          label: "Thoi gian tot nghiep",
          type: "month",
        },
        {
          name: "trangThai",
          label: "Trang thai",
          type: "select",
          options: classStatusOptions,
        },
        {
          name: "ghiChu",
          label: "Ghi chu",
          type: "textarea",
          placeholder: "Thong tin bo sung ve lop",
        },
      ],
      columns: [
        { key: "maLop", label: "Ma lop" },
        { key: "tenLop", label: "Ten lop" },
        { key: "khoaHoc.tenKhoaHoc", label: "Khoa hoc" },
        { key: "nganh.tenNganh", label: "Nganh" },
        { key: "chuyenNganh.tenChuyenNganh", label: "Chuyen nganh", fallback: "-" },
        { key: "siSo", label: "Si so", fallback: "0" },
        { key: "trangThai", label: "Trang thai", fallback: "-" },
      ],
    }),
    [academicYearOptions, campusOptions, majorOptions, specializationOptions],
  );

  return <AdminCrudPage config={config} />;
}
