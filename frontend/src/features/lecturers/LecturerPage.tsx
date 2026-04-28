import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Users } from "lucide-react";
import { adminCrudApi } from "../../api/adminCrud.api";
import AdminCrudPage from "../../pages/admin/AdminCrudPage";
import { buildSelectOptions } from "../admin/crud/adminCrudPage.utils";
import type { AdminCrudConfig } from "../admin/crud/adminCrud.types";

const statusOptions = [
  { label: "Đang giảng dạy", value: "dang_giang_day" },
  { label: "Tạm nghỉ", value: "tam_nghi" },
];

export default function LecturerPage() {
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
      resource: "giangvien",
      path: "giangvien",
      title: "Giảng viên",
      description:
        "Quản lý hồ sơ giảng viên, bộ môn trực thuộc, học vị và định mức giờ.",
      primaryAction: "Thêm giảng viên",
      icon: Users,
      idField: "giangVienId",
      searchPlaceholder: "Tìm mã, họ tên, email, bộ môn...",
      fields: [
        {
          name: "boMonId",
          label: "Bộ môn",
          type: "select",
          options: departmentOptions,
        },
        {
          name: "maGiangVien",
          label: "Mã giảng viên",
          type: "text",
          placeholder: "VD: GV001",
        },
        {
          name: "hoTen",
          label: "Họ tên",
          type: "text",
          required: true,
          placeholder: "VD: Nguyễn Văn A",
        },
        {
          name: "email",
          label: "Email",
          type: "email",
          placeholder: "VD: giangvien@utehy.edu.vn",
        },
        {
          name: "soDienThoai",
          label: "Số điện thoại",
          type: "text",
          placeholder: "VD: 0912345678",
        },
        {
          name: "hocVi",
          label: "Học vị",
          type: "text",
          placeholder: "VD: Thạc sĩ",
        },
        {
          name: "chucDanh",
          label: "Chức danh",
          type: "text",
          placeholder: "VD: Giảng viên chính",
        },
        {
          name: "dinhMucGio",
          label: "Định mức giờ",
          type: "number",
          min: 0,
        },
        {
          name: "trangThai",
          label: "Trạng thái",
          type: "select",
          options: statusOptions,
        },
      ],
      columns: [
        { key: "maGiangVien", label: "Mã GV", fallback: "-" },
        { key: "hoTen", label: "Họ tên" },
        { key: "boMon.tenBoMon", label: "Bộ môn", fallback: "-" },
        { key: "hocVi", label: "Học vị", fallback: "-" },
        { key: "dinhMucGio", label: "Định mức", fallback: "0" },
        { key: "trangThai", label: "Trạng thái", fallback: "-" },
      ],
    }),
    [departmentOptions],
  );

  return <AdminCrudPage config={config} />;
}
