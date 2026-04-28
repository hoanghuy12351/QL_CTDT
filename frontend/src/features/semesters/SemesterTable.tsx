import { Edit3, Trash2 } from "lucide-react";
import { formatDate } from "../../lib/format";
import IconButton from "../../components/ui/IconButton";
import TableSkeleton from "../../components/ui/TableSkeleton";
import { semesterColumns } from "./semester.columns";
import type { Semester } from "./semester.types";

type SemesterTableProps = {
  rows: Semester[];
  page: number;
  limit: number;
  selectedIds: number[];
  isLoading?: boolean;
  deletingId?: number | null;
  onEdit: (semester: Semester) => void;
  onDelete: (semester: Semester) => void;
  onToggleRow: (id: number) => void;
  onToggleAll: () => void;
};

const statusLabelMap: Record<string, string> = {
  du_thao: "Dự thảo",
  dang_ap_dung: "Đang áp dụng",
  da_dong: "Đã đóng",
};

const statusClassMap: Record<string, string> = {
  du_thao: "bg-slate-100 text-slate-700",
  dang_ap_dung: "bg-emerald-50 text-emerald-700",
  da_dong: "bg-amber-50 text-amber-700",
};

export default function SemesterTable({
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
}: SemesterTableProps) {
  const selectedSet = new Set(selectedIds);
  const isAllCurrentPageSelected =
    rows.length > 0 && rows.every((row) => selectedSet.has(row.id));

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      {isLoading ? <TableSkeleton columns={semesterColumns.length + 2} rows={6} /> : null}

      <div
        className={[
          "max-h-[calc(100vh-360px)] min-h-[320px] overflow-auto",
          isLoading ? "hidden" : "",
        ].join(" ")}
      >
        <table className="w-full min-w-[1180px] table-fixed border-collapse text-left text-sm">
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
              {semesterColumns.map((column) => (
                <th
                  key={column.key}
                  className={`border-b border-slate-200 px-3 py-3 font-semibold ${column.className ?? ""}`}
                >
                  {column.label}
                </th>
              ))}
              <th className="sticky right-0 w-28 border-b border-slate-200 bg-slate-50 px-3 py-3 text-center font-semibold">
                Thao tác
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {rows.map((semester, index) => {
              const isSelected = selectedSet.has(semester.id);
              const statusKey = semester.status ?? "";

              return (
                <tr
                  key={semester.id}
                  className={[
                    "transition hover:bg-brand-50/45",
                    isSelected ? "bg-brand-50/80" : "bg-white",
                  ].join(" ")}
                >
                  <td className="px-3 py-3 text-center">
                    <input
                      type="checkbox"
                      aria-label={`Chọn học kỳ ${semester.name}`}
                      checked={isSelected}
                      onChange={() => onToggleRow(semester.id)}
                      className="size-4 rounded border-slate-300 text-brand-600 focus:ring-brand-200"
                    />
                  </td>
                  <td className="px-3 py-3 text-center text-slate-500">
                    {(page - 1) * limit + index + 1}
                  </td>
                  <td className="px-3 py-3">
                    <span className="inline-flex max-w-full rounded-md bg-slate-100 px-2 py-1 font-semibold text-slate-900">
                      <span className="truncate">{semester.code}</span>
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="block truncate font-medium text-slate-950">
                      {semester.name}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-slate-700">
                    {semester.schoolYearCode}
                  </td>
                  <td className="px-3 py-3 text-slate-600">
                    {semester.startDate ? formatDate(semester.startDate) : "-"}
                  </td>
                  <td className="px-3 py-3 text-slate-600">
                    {semester.endDate ? formatDate(semester.endDate) : "-"}
                  </td>
                  <td className="px-3 py-3">
                    {statusKey ? (
                      <span
                        className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ${statusClassMap[statusKey] ?? "bg-slate-100 text-slate-700"}`}
                      >
                        {statusLabelMap[statusKey] ?? statusKey}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td
                    className={[
                      "sticky right-0 px-3 py-2 shadow-[-10px_0_18px_-18px_rgba(15,23,42,0.5)]",
                      isSelected ? "bg-brand-50" : "bg-white",
                    ].join(" ")}
                  >
                    <div className="flex justify-center gap-1">
                      <IconButton label={`Sửa học kỳ ${semester.name}`} onClick={() => onEdit(semester)}>
                        <Edit3 size={16} aria-hidden="true" />
                      </IconButton>
                      <IconButton
                        label={`Xóa học kỳ ${semester.name}`}
                        variant="danger"
                        disabled={deletingId === semester.id}
                        onClick={() => onDelete(semester)}
                      >
                        <Trash2 size={16} aria-hidden="true" />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
