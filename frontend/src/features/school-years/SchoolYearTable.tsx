import { Edit3, Trash2 } from "lucide-react";
import { formatDate } from "../../lib/format";
import IconButton from "../../components/ui/IconButton";
import TableSkeleton from "../../components/ui/TableSkeleton";
import { schoolYearColumns } from "./schoolYear.columns";
import type { SchoolYear } from "./schoolYear.types";

type SchoolYearTableProps = {
  rows: SchoolYear[];
  page: number;
  limit: number;
  selectedIds: number[];
  isLoading?: boolean;
  deletingId?: number | null;
  onEdit: (schoolYear: SchoolYear) => void;
  onDelete: (schoolYear: SchoolYear) => void;
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

export default function SchoolYearTable({
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
}: SchoolYearTableProps) {
  const selectedSet = new Set(selectedIds);
  const isAllCurrentPageSelected =
    rows.length > 0 && rows.every((row) => selectedSet.has(row.id));

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      {isLoading ? <TableSkeleton columns={schoolYearColumns.length + 2} rows={6} /> : null}
      <div className={["max-h-[calc(100vh-360px)] min-h-[320px] overflow-auto", isLoading ? "hidden" : ""].join(" ")}>
        <table className="w-full min-w-[1100px] table-fixed border-collapse text-left text-sm">
          <thead className="sticky top-0 z-10 bg-slate-50 text-xs uppercase text-slate-600">
            <tr>
              <th className="w-12 border-b border-slate-200 px-3 py-3 text-center">
                <input type="checkbox" aria-label="Chọn tất cả dòng hiện tại" checked={isAllCurrentPageSelected} onChange={onToggleAll} className="size-4 rounded border-slate-300 text-brand-600 focus:ring-brand-200" />
              </th>
              {schoolYearColumns.map((column) => (
                <th key={column.key} className={`border-b border-slate-200 px-3 py-3 font-semibold ${column.className ?? ""}`}>{column.label}</th>
              ))}
              <th className="sticky right-0 w-28 border-b border-slate-200 bg-slate-50 px-3 py-3 text-center font-semibold">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((schoolYear, index) => {
              const isSelected = selectedSet.has(schoolYear.id);
              const statusKey = schoolYear.status ?? "";
              return (
                <tr key={schoolYear.id} className={["transition hover:bg-brand-50/45", isSelected ? "bg-brand-50/80" : "bg-white"].join(" ")}>
                  <td className="px-3 py-3 text-center">
                    <input type="checkbox" aria-label={`Chọn năm học ${schoolYear.code}`} checked={isSelected} onChange={() => onToggleRow(schoolYear.id)} className="size-4 rounded border-slate-300 text-brand-600 focus:ring-brand-200" />
                  </td>
                  <td className="px-3 py-3 text-center text-slate-500">{(page - 1) * limit + index + 1}</td>
                  <td className="px-3 py-3"><span className="inline-flex max-w-full rounded-md bg-slate-100 px-2 py-1 font-semibold text-slate-900"><span className="truncate">{schoolYear.code}</span></span></td>
                  <td className="px-3 py-3 text-slate-600">{schoolYear.startDate ? formatDate(schoolYear.startDate) : "-"}</td>
                  <td className="px-3 py-3 text-slate-600">{schoolYear.endDate ? formatDate(schoolYear.endDate) : "-"}</td>
                  <td className="px-3 py-3">{statusKey ? <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ${statusClassMap[statusKey] ?? "bg-slate-100 text-slate-700"}`}>{statusLabelMap[statusKey] ?? statusKey}</span> : "-"}</td>
                  <td className="px-3 py-3 text-slate-600">{schoolYear.createdAt ? formatDate(schoolYear.createdAt) : "-"}</td>
                  <td className={["sticky right-0 px-3 py-2 shadow-[-10px_0_18px_-18px_rgba(15,23,42,0.5)]", isSelected ? "bg-brand-50" : "bg-white"].join(" ")}>
                    <div className="flex justify-center gap-1">
                      <IconButton label={`Sửa năm học ${schoolYear.code}`} onClick={() => onEdit(schoolYear)}><Edit3 size={16} aria-hidden="true" /></IconButton>
                      <IconButton label={`Xóa năm học ${schoolYear.code}`} variant="danger" disabled={deletingId === schoolYear.id} onClick={() => onDelete(schoolYear)}><Trash2 size={16} aria-hidden="true" /></IconButton>
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
