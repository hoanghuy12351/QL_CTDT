import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { BookOpenCheck } from "lucide-react";
import { adminCrudApi } from "../../api/adminCrud.api";
import AdminCrudPage from "../../pages/admin/AdminCrudPage";
import { buildSelectOptions } from "../admin/crud/adminCrudPage.utils";
import type { AdminCrudConfig } from "../admin/crud/adminCrud.types";

const priorityOptions = [
  { label: "Ưu tiên cao", value: "1" },
  { label: "Ưu tiên trung bình", value: "2" },
  { label: "Ưu tiên thấp", value: "3" },
];

export default function LecturerCoursePage() {
  const lecturersQuery = useQuery({
    queryKey: ["admin-crud-options", "giang-vien"],
    queryFn: () => adminCrudApi.list("giang-vien", { page: 1, limit: 500 }),
  });

  const coursesQuery = useQuery({
    queryKey: ["admin-crud-options", "hoc-phan"],
    queryFn: () => adminCrudApi.list("hoc-phan", { page: 1, limit: 500 }),
  });

  const lecturerOptions = useMemo(
    () =>
      buildSelectOptions(
        lecturersQuery.data?.items ?? [],
        "giangVienId",
        (row) => {
          const code = String(row.maGiangVien ?? "").trim();
          const name = String(row.hoTen ?? "").trim();

          return code ? `${code} - ${name}` : name;
        },
      ),
    [lecturersQuery.data?.items],
  );

  const courseOptions = useMemo(
    () =>
      buildSelectOptions(coursesQuery.data?.items ?? [], "hocPhanId", (row) => {
        const code = String(row.maHocPhan ?? "").trim();
        const name = String(row.tenHocPhan ?? "").trim();

        return code ? `${code} - ${name}` : name;
      }),
    [coursesQuery.data?.items],
  );

  const config = useMemo<AdminCrudConfig>(
    () => ({
      resource: "giang-vien-hoc-phan",
      path: "giang-vien-hoc-phan",
      title: "Giảng viên - Học phần",
      description:
        "Khai báo giảng viên có thể dạy học phần nào, dùng để kiểm tra cảnh báo khi phân công giảng dạy.",
      primaryAction: "Thêm khai báo",
      icon: BookOpenCheck,
      idField: "giangVienHocPhanId",
      searchPlaceholder:
        "Tìm theo ghi chú. Có thể lọc nâng cao ở danh sách giảng viên/học phần.",
      fields: [
        {
          name: "giangVienId",
          label: "Giảng viên",
          type: "select",
          required: true,
          options: lecturerOptions,
        },
        {
          name: "hocPhanId",
          label: "Học phần",
          type: "select",
          required: true,
          options: courseOptions,
        },
        {
          name: "coTheDayLyThuyet",
          label: "Có thể dạy lý thuyết",
          type: "checkbox",
        },
        {
          name: "coTheDayThucHanh",
          label: "Có thể dạy thực hành",
          type: "checkbox",
        },
        {
          name: "mucDoUuTien",
          label: "Mức độ ưu tiên",
          type: "select",
          options: priorityOptions,
        },
        {
          name: "ghiChu",
          label: "Ghi chú",
          type: "textarea",
          placeholder: "VD: Giảng viên phụ trách chính học phần này",
        },
      ],
      columns: [
        {
          key: "giangVien.maGiangVien",
          label: "Mã GV",
          fallback: "-",
        },
        {
          key: "giangVien.hoTen",
          label: "Giảng viên",
          fallback: "-",
        },
        {
          key: "hocPhan.maHocPhan",
          label: "Mã HP",
          fallback: "-",
        },
        {
          key: "hocPhan.tenHocPhan",
          label: "Học phần",
          fallback: "-",
        },
        {
          key: "coTheDayLyThuyet",
          label: "Dạy LT",
          fallback: "-",
        },
        {
          key: "coTheDayThucHanh",
          label: "Dạy TH",
          fallback: "-",
        },
        {
          key: "mucDoUuTien",
          label: "Ưu tiên",
          fallback: "-",
        },
        {
          key: "ghiChu",
          label: "Ghi chú",
          fallback: "-",
        },
      ],
    }),
    [courseOptions, lecturerOptions],
  );

  return <AdminCrudPage config={config} />;
}
