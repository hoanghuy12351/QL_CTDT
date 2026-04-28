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
  selectedId?: number | null;
  isLoading?: boolean;
  deletingId?: number | null;
  onSelect: (plan: TrainingPlan) => void;
  onEdit: (plan: TrainingPlan) => void;
  onDelete: (plan: TrainingPlan) => void;
};

export default function TrainingPlanTable({
  deletingId,
  isLoading = false,
  onDelete,
  onEdit,
  onSelect,
  rows,
  selectedId,
}: TrainingPlanTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      {isLoading ? <TableSkeleton columns={trainingPlanColumns.length} rows={5} /> : null}
      <div className={["overflow-auto", isLoading ? "hidden" : ""].join(" ")}>
        <table className="w-full min-w-[980px] table-fixed text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-600">
            <tr>
              {trainingPlanColumns.map((column) => (
                <th key={column} className="border-b border-slate-200 px-3 py-3 font-semibold">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((plan) => {
              const selected = selectedId === plan.id;

              return (
                <tr
                  key={plan.id}
                  className={[
                    "cursor-pointer transition hover:bg-brand-50/45",
                    selected ? "bg-brand-50/80" : "bg-white",
                  ].join(" ")}
                  onClick={() => onSelect(plan)}
                >
                  <td className="px-3 py-3">
                    <span className="inline-flex max-w-full rounded-md bg-slate-100 px-2 py-1 font-semibold text-slate-900">
                      <span className="truncate">{plan.code}</span>
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="block truncate font-semibold text-slate-950">{plan.name}</span>
                    <span className="mt-1 block truncate text-xs text-slate-500">{plan.note || "Không có ghi chú"}</span>
                  </td>
                  <td className="px-3 py-3 text-slate-700">{plan.schoolYearName}</td>
                  <td className="px-3 py-3 text-slate-700">{plan.facultyName}</td>
                  <td className="px-3 py-3 text-slate-700">{plan.semesterCount}</td>
                  <td className="px-3 py-3">
                    <span className={["inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1", statusClassNames[plan.status]].join(" ")}>
                      {trainingPlanStatusLabels[plan.status]}
                    </span>
                  </td>
                  <td className="px-3 py-2" onClick={(event) => event.stopPropagation()}>
                    <div className="flex justify-center gap-1">
                      <IconButton label={`Sửa ${plan.name}`} onClick={() => onEdit(plan)}>
                        <Edit3 size={16} aria-hidden="true" />
                      </IconButton>
                      <IconButton label={`Xóa ${plan.name}`} variant="danger" disabled={deletingId === plan.id} onClick={() => onDelete(plan)}>
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
