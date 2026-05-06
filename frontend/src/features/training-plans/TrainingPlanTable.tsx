import { Link } from "react-router-dom";
import { Edit3, Trash2 } from "lucide-react";
import IconButton from "../../components/ui/IconButton";
import TableSkeleton from "../../components/ui/TableSkeleton";
import {
  statusClassNames,
  trainingPlanColumns,
  trainingPlanStatusLabels,
} from "./trainingPlan.columns";
import type { TrainingPlan } from "./trainingPlan.types";

type TrainingPlanTableProps = {
  rows: TrainingPlan[];
  page: number;
  limit: number;
  selectedIds: number[];
  selectedId?: number | null;
  isLoading?: boolean;
  deletingId?: number | null;
  detailPath?: (plan: TrainingPlan) => string;
  onSelect?: (plan: TrainingPlan) => void;
  onEdit: (plan: TrainingPlan) => void;
  onDelete: (plan: TrainingPlan) => void;
  onStatusClick?: (plan: TrainingPlan) => void;
  onToggleRow: (id: number) => void;
  onToggleAll: () => void;
};

export default function TrainingPlanTable({
  deletingId,
  detailPath = (plan) => `/admin/training/plans/year/${plan.id}`,
  isLoading = false,
  limit,
  onDelete,
  onEdit,
  onSelect,
  onStatusClick,
  onToggleAll,
  onToggleRow,
  page,
  rows,
  selectedIds,
  selectedId,
}: TrainingPlanTableProps) {
  const selectedSet = new Set(selectedIds);
  const isAllCurrentPageSelected =
    rows.length > 0 && rows.every((row) => selectedSet.has(row.id));

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      {isLoading ? (
        <TableSkeleton columns={trainingPlanColumns.length + 3} rows={6} />
      ) : null}
      <div
        className={[
          "max-h-[calc(100vh-360px)] min-h-[320px] overflow-auto",
          isLoading ? "hidden" : "",
        ].join(" ")}
      >
        <table className="w-full min-w-[1120px] table-fixed border-collapse text-left text-sm">
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
              <th className="w-16 border-b border-slate-200 px-3 py-3 text-center font-semibold">
                STT
              </th>
              {trainingPlanColumns.map((column) => (
                <th
                  key={column}
                  className="border-b border-slate-200 px-3 py-3 font-semibold"
                >
                  {column}
                </th>
              ))}
              <th className="sticky right-0 w-28 border-b border-slate-200 bg-slate-50 px-3 py-3 text-center font-semibold">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((plan, index) => {
              const isSelected =
                selectedSet.has(plan.id) || selectedId === plan.id;

              return (
                <tr
                  key={plan.id}
                  className={[
                    "transition hover:bg-brand-50/45",
                    isSelected ? "bg-brand-50/80" : "bg-white",
                    onSelect ? "cursor-pointer" : "",
                  ].join(" ")}
                  onClick={() => onSelect?.(plan)}
                >
                  <td className="px-3 py-3 text-center">
                    <input
                      type="checkbox"
                      aria-label={`Chọn kế hoạch ${plan.name}`}
                      checked={selectedSet.has(plan.id)}
                      onChange={() => onToggleRow(plan.id)}
                      onClick={(event) => event.stopPropagation()}
                      className="size-4 rounded border-slate-300 text-brand-600 focus:ring-brand-200"
                    />
                  </td>
                  <td className="px-3 py-3 text-center text-slate-500">
                    {(page - 1) * limit + index + 1}
                  </td>
                  <td className="px-3 py-3">
                    <span className="inline-flex max-w-full rounded-md bg-slate-100 px-2 py-1 font-semibold text-slate-900">
                      <span className="truncate">{plan.code}</span>
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <Link
                      to={detailPath(plan)}
                      className="block truncate font-semibold text-brand-700 underline-offset-4 hover:text-brand-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
                      onClick={(event) => event.stopPropagation()}
                    >
                      {plan.name}
                    </Link>
                    <span className="mt-1 block truncate text-xs text-slate-500">
                      {plan.note || "Không có ghi chú"}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-slate-700">
                    {plan.schoolYearName}
                  </td>
                  <td className="px-3 py-3 text-slate-700">
                    {plan.facultyName}
                  </td>
                  <td className="px-3 py-3 text-slate-700">
                    {plan.semesterCount}
                  </td>
                  <td className="px-3 py-3">
                    <button
                      type="button"
                      className={[
                        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 transition hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
                        statusClassNames[plan.status],
                      ].join(" ")}
                      title="Bấm để xem và cập nhật trạng thái kế hoạch"
                      onClick={(event) => {
                        event.stopPropagation();
                        onStatusClick?.(plan);
                      }}
                    >
                      {trainingPlanStatusLabels[plan.status]}
                    </button>
                  </td>
                  <td
                    className={[
                      "sticky right-0 px-3 py-2 shadow-[-10px_0_18px_-18px_rgba(15,23,42,0.5)]",
                      isSelected ? "bg-brand-50" : "bg-white",
                    ].join(" ")}
                    onClick={(event) => event.stopPropagation()}
                  >
                    <div className="flex justify-center gap-1">
                      <IconButton
                        label={
                          plan.status === "du_thao"
                            ? `Sửa ${plan.name}`
                            : "Chỉ có thể sửa khi kế hoạch ở trạng thái dự thảo"
                        }
                        disabled={plan.status !== "du_thao"}
                        onClick={() => onEdit(plan)}
                      >
                        <Edit3 size={16} aria-hidden="true" />
                      </IconButton>
                      <IconButton
                        label={
                          plan.status === "du_thao"
                            ? `Xóa ${plan.name}`
                            : "Chỉ có thể xóa khi kế hoạch ở trạng thái dự thảo"
                        }
                        variant="danger"
                        disabled={
                          deletingId === plan.id || plan.status !== "du_thao"
                        }
                        onClick={() => onDelete(plan)}
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
                  className="px-3 py-8 text-center text-sm text-slate-500"
                  colSpan={trainingPlanColumns.length + 3}
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
