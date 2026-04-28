import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { GraduationCap } from "lucide-react";
import { adminCrudApi } from "../../api/adminCrud.api";
import AdminCrudPage from "../../pages/admin/AdminCrudPage";
import { buildSelectOptions } from "../admin/crud/adminCrudPage.utils";
import type { AdminCrudConfig } from "../admin/crud/adminCrud.types";

export default function MajorPage() {
  const facultiesQuery = useQuery({
    queryKey: ["admin-crud-options", "khoa"],
    queryFn: () => adminCrudApi.list("khoa", { page: 1, limit: 100 }),
  });

  const facultyOptions = useMemo(
    () =>
      buildSelectOptions(facultiesQuery.data?.items ?? [], "khoaId", (row) =>
        `${String(row.maKhoa ?? "")} - ${String(row.tenKhoa ?? "")}`,
      ),
    [facultiesQuery.data?.items],
  );

  const config = useMemo<AdminCrudConfig>(
    () => ({
      resource: "nganh",
      path: "nganh",
      title: "Ngành",
      description: "Quản lý ngành đào tạo theo khoa và chuẩn hóa mã ngành.",
      primaryAction: "Thêm ngành",
      icon: GraduationCap,
      idField: "nganhId",
      searchPlaceholder: "Tìm mã ngành, tên ngành...",
      fields: [
        {
          name: "khoaId",
          label: "Khoa",
          type: "select",
          required: true,
          options: facultyOptions,
        },
        {
          name: "maNganh",
          label: "Mã ngành",
          type: "text",
          required: true,
          placeholder: "VD: 7480201",
        },
        {
          name: "tenNganh",
          label: "Tên ngành",
          type: "text",
          required: true,
          placeholder: "VD: Công nghệ thông tin",
        },
      ],
      columns: [
        { key: "maNganh", label: "Mã ngành" },
        { key: "tenNganh", label: "Tên ngành" },
        { key: "khoa.tenKhoa", label: "Khoa" },
        { key: "ngayTao", label: "Ngày tạo" },
      ],
    }),
    [facultyOptions],
  );

  return <AdminCrudPage config={config} />;
}
