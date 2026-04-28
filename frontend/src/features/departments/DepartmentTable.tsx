import { Edit3, Trash2 } from "lucide-react";
import IconButton from "../../components/ui/IconButton";
import TableSkeleton from "../../components/ui/TableSkeleton";
import type { Department } from "./department.types";

type DepartmentTableProps = {
  rows: Department[];
  page: number;
  limit: number;
  selectedIds: number[];
  isLoading?: boolean;
  deletingId?: number | null;
  onEdit: (department: Department) => void;
  onDelete: (department: Department) => void;
  onToggleRow: (id: number) => void;
  onToggleAll: () => void;
};

const formatDate = (value: string | null) => {
  if (!value) return "-";

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
};

export default function DepartmentTable({
  deletingId,
  isLoading = false,
  limit,
  onDelete,
  onEdit,
  onToggleAll,
  onToggleRow,
  page,
  rows,
  selectedIds,
}: DepartmentTableProps) {
  const selectedSet = new Set(selectedIds);

  const isAllCurrentPageSelected =
    rows.length > 0 &&
    rows.every((department) => selectedSet.has(department.id));

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      {isLoading ? <TableSkeleton columns={7} rows={6} /> : null}

      <div
        className={[
          "max-h-[calc(100vh-360px)] min-h-[320px] overflow-auto",
          isLoading ? "hidden" : "",
        ].join(" ")}
      >
        <table className="w-full min-w-[1040px] table-fixed border-collapse text-left text-sm">
          <thead className="sticky top-0 z-10 bg-slate-50 text-xs uppercase text-slate-600">
            <tr>
              <th className="w-12 border-b border-slate-200 px-3 py-3 text-center">
                <input
                  type="checkbox"
                  aria-label="Chọn tất cả dòng hiện tại"
                  checked={isAllCurrentPageSelected}
                  onChange={onToggleAll}
                  className="size-4 rounded border-slate-300 text-brand-600 focus:ring-brand-200"
                />
              </th>

              <th className="w-20 border-b border-slate-200 px-3 py-3 text-center font-semibold">
                STT
              </th>

              <th className="w-44 border-b border-slate-200 px-3 py-3 font-semibold">
                Mã bộ môn
              </th>

              <th className="border-b border-slate-200 px-3 py-3 font-semibold">
                Tên bộ môn
              </th>

              <th className="w-64 border-b border-slate-200 px-3 py-3 font-semibold">
                Khoa
              </th>

              <th className="w-44 border-b border-slate-200 px-3 py-3 font-semibold">
                Ngày tạo
              </th>

              <th className="sticky right-0 w-28 border-b border-slate-200 bg-slate-50 px-3 py-3 text-center font-semibold">
                Thao tác
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {rows.map((department, index) => {
              const isSelected = selectedSet.has(department.id);

              return (
                <tr
                  key={department.id}
                  className={[
                    "transition hover:bg-brand-50/45",
                    isSelected ? "bg-brand-50/80" : "bg-white",
                  ].join(" ")}
                >
                  <td className="px-3 py-3 text-center">
                    <input
                      type="checkbox"
                      aria-label={`Chọn bộ môn ${department.name}`}
                      checked={isSelected}
                      onChange={() => onToggleRow(department.id)}
                      className="size-4 rounded border-slate-300 text-brand-600 focus:ring-brand-200"
                    />
                  </td>

                  <td className="px-3 py-3 text-center text-slate-500">
                    {(page - 1) * limit + index + 1}
                  </td>

                  <td className="px-3 py-3">
                    <span className="inline-flex max-w-full items-center rounded-md bg-slate-100 px-2 py-1 font-semibold text-slate-900">
                      <span className="truncate">{department.code}</span>
                    </span>
                  </td>

                  <td className="px-3 py-3">
                    <span className="block truncate font-medium text-slate-950">
                      {department.name}
                    </span>
                  </td>

                  <td className="px-3 py-3 text-slate-700">
                    <span className="block truncate">
                      {department.facultyName}
                    </span>
                  </td>

                  <td className="px-3 py-3 text-slate-500">
                    {formatDate(department.createdAt)}
                  </td>

                  <td
                    className={[
                      "sticky right-0 px-3 py-2 shadow-[-10px_0_18px_-18px_rgba(15,23,42,0.5)]",
                      isSelected ? "bg-brand-50" : "bg-white",
                    ].join(" ")}
                  >
                    <div className="flex justify-center gap-1">
                      <IconButton
                        label={`Sửa bộ môn ${department.name}`}
                        onClick={() => onEdit(department)}
                      >
                        <Edit3 size={16} aria-hidden="true" />
                      </IconButton>

                      <IconButton
                        label={`Xóa bộ môn ${department.name}`}
                        variant="danger"
                        disabled={deletingId === department.id}
                        onClick={() => onDelete(department)}
                      >
                        <Trash2 size={16} aria-hidden="true" />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              );
            })}

            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-12 text-center text-sm text-slate-500"
                >
                  Không có dữ liệu phù hợp.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
