import { Link } from "react-router-dom";
import TableSkeleton from "../../components/ui/TableSkeleton";
import {
  semesterPlanColumns,
  semesterPlanStatusLabels,
  statusClassNames,
} from "./trainingPlan.columns";
import type { SemesterPlan } from "./trainingPlan.types";

type SemesterPlanTableProps = {
  rows: SemesterPlan[];
  isLoading?: boolean;
  selectedId?: number | null;
  onSelect?: (plan: SemesterPlan) => void;
  onStatusClick?: (plan: SemesterPlan) => void;
};

export default function SemesterPlanTable({
  isLoading = false,
  onSelect,
  onStatusClick,
  rows,
  selectedId,
}: SemesterPlanTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      {isLoading ? <TableSkeleton columns={semesterPlanColumns.length} rows={5} /> : null}
      <div className={["overflow-auto", isLoading ? "hidden" : ""].join(" ")}>
        <table className="w-full min-w-[860px] table-fixed text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-600">
            <tr>
              {semesterPlanColumns.map((column) => (
                <th key={column} className="border-b border-slate-200 px-3 py-3 font-semibold">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((plan) => (
              <tr
                key={plan.id}
                className={[
                  "transition hover:bg-brand-50/45",
                  selectedId === plan.id ? "bg-brand-50" : "bg-white",
                  onSelect ? "cursor-pointer" : "",
                ].join(" ")}
                onClick={() => onSelect?.(plan)}
              >
                <td className="px-3 py-3">
                  <Link
                    to={`/admin/training/plans/semesters/${plan.id}`}
                    className="block truncate font-semibold text-brand-700 underline-offset-4 hover:text-brand-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
                    onClick={(event) => event.stopPropagation()}
                  >
                    {plan.name}
                  </Link>
                </td>
                <td className="px-3 py-3 text-slate-700">#{plan.trainingPlanId}</td>
                <td className="px-3 py-3 text-slate-700">{plan.semesterName}</td>
                <td className="px-3 py-3 text-slate-700">{plan.openedCount}</td>
                <td className="px-3 py-3">
                  <button
                    type="button"
                    className={[
                      "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 transition hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
                      statusClassNames[plan.status],
                    ].join(" ")}
                    title="Bấm để xem và cập nhật trạng thái kế hoạch học kỳ"
                    onClick={(event) => {
                      event.stopPropagation();
                      onStatusClick?.(plan);
                    }}
                  >
                    {semesterPlanStatusLabels[plan.status]}
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td className="px-3 py-8 text-center text-sm text-slate-500" colSpan={semesterPlanColumns.length}>
                  Chưa có kế hoạch học kỳ.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
