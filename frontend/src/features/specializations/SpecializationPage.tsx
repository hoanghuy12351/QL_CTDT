import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layers3 } from "lucide-react";
import { adminCrudApi } from "../../api/adminCrud.api";
import AdminCrudPage from "../../pages/admin/AdminCrudPage";
import { buildSelectOptions } from "../admin/crud/adminCrudPage.utils";
import type { AdminCrudConfig } from "../admin/crud/adminCrud.types";

export default function SpecializationPage() {
  const majorsQuery = useQuery({
    queryKey: ["admin-crud-options", "nganh"],
    queryFn: () => adminCrudApi.list("nganh", { page: 1, limit: 100 }),
  });

  const majorOptions = useMemo(
    () =>
      buildSelectOptions(majorsQuery.data?.items ?? [], "nganhId", (row) =>
        `${String(row.maNganh ?? "")} - ${String(row.tenNganh ?? "")}`,
      ),
    [majorsQuery.data?.items],
  );

  const config = useMemo<AdminCrudConfig>(
    () => ({
      resource: "chuyennganh",
      path: "chuyennganh",
      title: "Chuyên ngành",
      description:
        "Quản lý chuyên ngành trực thuộc ngành đào tạo và nhãn phân loại chi tiết.",
      primaryAction: "Thêm chuyên ngành",
      icon: Layers3,
      idField: "chuyenNganhId",
      searchPlaceholder: "Tìm mã chuyên ngành, tên chuyên ngành...",
      fields: [
        {
          name: "nganhId",
          label: "Ngành",
          type: "select",
          required: true,
          options: majorOptions,
        },
        {
          name: "maChuyenNganh",
          label: "Mã chuyên ngành",
          type: "text",
          placeholder: "VD: CNPM",
        },
        {
          name: "tenChuyenNganh",
          label: "Tên chuyên ngành",
          type: "text",
          required: true,
          placeholder: "VD: Công nghệ phần mềm",
        },
      ],
      columns: [
        { key: "maChuyenNganh", label: "Mã chuyên ngành", fallback: "-" },
        { key: "tenChuyenNganh", label: "Tên chuyên ngành" },
        { key: "nganh.tenNganh", label: "Ngành" },
        { key: "ngayTao", label: "Ngày tạo" },
      ],
    }),
    [majorOptions],
  );

  return <AdminCrudPage config={config} />;
}
