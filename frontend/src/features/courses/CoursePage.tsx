import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { BookOpen } from "lucide-react";
import { adminCrudApi } from "../../api/adminCrud.api";
import AdminCrudPage from "../../pages/admin/AdminCrudPage";
import { buildSelectOptions } from "../admin/crud/adminCrudPage.utils";
import type { AdminCrudConfig } from "../admin/crud/adminCrud.types";

const subjectTypeOptions = [
  { label: "Đại học thông thường", value: "dai_hoc_thong_thuong" },
  { label: "Thực hành", value: "thuc_hanh" },
  { label: "Đồ án / Dự án", value: "do_an_du_an" },
  { label: "Thực tập", value: "thuc_tap" },
  {
    label: "Đồ án / Khóa luận tốt nghiệp",
    value: "do_an_khoa_luan_tot_nghiep",
  },
  { label: "Cao học", value: "cao_hoc" },
  { label: "Hướng dẫn luận văn", value: "huong_dan_luan_van" },
  { label: "Khác", value: "khac" },
];

export default function CoursePage() {
  const departmentsQuery = useQuery({
    queryKey: ["admin-crud-options", "bo-mon"],
    queryFn: () => adminCrudApi.list("bo-mon", { page: 1, limit: 100 }),
  });

  const departmentOptions = useMemo(
    () =>
      buildSelectOptions(departmentsQuery.data?.items ?? [], "boMonId", (row) =>
        `${String(row.maBoMon ?? "")} - ${String(row.tenBoMon ?? "")}`,
      ),
    [departmentsQuery.data?.items],
  );

  const config = useMemo<AdminCrudConfig>(
    () => ({
      resource: "hocphan",
      path: "hocphan",
      title: "Học phần",
      description:
        "Quản lý mã học phần, tín chỉ, số tiết LT/TH và bộ môn phụ trách.",
      primaryAction: "Thêm học phần",
      icon: BookOpen,
      idField: "hocPhanId",
      searchPlaceholder: "Tìm mã học phần, tên học phần...",
      fields: [
        {
          name: "maHocPhan",
          label: "Mã học phần",
          type: "text",
          required: true,
          placeholder: "VD: IT101",
        },
        {
          name: "tenHocPhan",
          label: "Tên học phần",
          type: "text",
          required: true,
          placeholder: "VD: Cấu trúc dữ liệu và giải thuật",
        },
        {
          name: "soTinChi",
          label: "Số tín chỉ",
          type: "number",
          required: true,
          min: 0,
        },
        {
          name: "soTietLyThuyet",
          label: "Số tiết lý thuyết",
          type: "number",
          required: true,
          min: 0,
        },
        {
          name: "soTietThucHanh",
          label: "Số tiết thực hành",
          type: "number",
          required: true,
          min: 0,
        },
        {
          name: "tongSoTiet",
          label: "Tổng số tiết",
          type: "number",
          min: 0,
        },
        {
          name: "boMonId",
          label: "Bộ môn",
          type: "select",
          options: departmentOptions,
        },
        {
          name: "loaiHocPhan",
          label: "Loại học phần",
          type: "select",
          options: subjectTypeOptions,
        },
        {
          name: "moTa",
          label: "Mô tả",
          type: "textarea",
          placeholder: "Mô tả ngắn về học phần",
        },
      ],
      columns: [
        { key: "maHocPhan", label: "Mã HP" },
        { key: "tenHocPhan", label: "Tên học phần" },
        { key: "soTinChi", label: "Tín chỉ" },
        { key: "tongSoTiet", label: "Tổng tiết" },
        { key: "boMon.tenBoMon", label: "Bộ môn", fallback: "-" },
        { key: "loaiHocPhanLabel", label: "Loại", fallback: "-" },
      ],
    }),
    [departmentOptions],
  );

  return <AdminCrudPage config={config} />;
}
