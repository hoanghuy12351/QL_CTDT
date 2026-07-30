import TableSkeleton from "../../components/ui/TableSkeleton";
import {
  workloadColumns,
  workloadStatusClassNames,
} from "./teachingAssignment.columns";
import type { LecturerWorkload } from "./teachingAssignment.types";

type TeachingWorkloadMatrixProps = {
  rows: LecturerWorkload[];
  isLoading?: boolean;
};

const formatHour = (value: number) => {
  if (!Number.isFinite(value)) return "-";
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
};

export default function TeachingWorkloadMatrix({
  isLoading = false,
  rows,
}: TeachingWorkloadMatrixProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      {isLoading ? (
        <TableSkeleton columns={workloadColumns.length} rows={6} />
      ) : null}

      <div className={["overflow-auto", isLoading ? "hidden" : ""].join(" ")}>
        <table className="w-full min-w-[1240px] table-fixed text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-600">
            <tr>
              {workloadColumns.map((column) => (
                <th
                  key={column}
                  className="border-b border-slate-200 px-3 py-3 font-semibold"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.lecturerId} className="bg-white hover:bg-slate-50">
                <td className="px-3 py-3">
                  <span className="block truncate font-semibold text-slate-950">
                    {row.lecturerName}
                  </span>
                  <span className="mt-1 block truncate text-xs text-slate-500">
                    {row.lecturerCode || "-"}
                  </span>
                </td>

                <td className="px-3 py-3 text-slate-700">
                  {row.departmentName}
                </td>
                <td className="px-3 py-3 font-semibold text-slate-800">
                  {row.theoryGroupCount}
                </td>
                <td className="px-3 py-3 font-semibold text-slate-800">
                  {row.practiceGroupCount}
                </td>
                <td className="px-3 py-3 font-semibold text-slate-800">
                  {row.projectGroupCount}
                </td>
                <td className="px-3 py-3 font-semibold text-slate-800">
                  {row.internshipGroupCount}
                </td>
                <td className="px-3 py-3 font-semibold text-slate-950">
                  {row.totalGroupCount}
                </td>
                <td className="px-3 py-3 font-semibold text-slate-950">
                  {formatHour(row.totalPeriods)}
                </td>
                <td className="px-3 py-3 font-semibold text-brand-700">
                  {formatHour(row.totalStandardHours)}
                </td>
                <td className="px-3 py-3 font-semibold text-slate-950">
                  {row.semesterQuota > 0 ? formatHour(row.semesterQuota) : "-"}
                </td>
                <td className="px-3 py-3 font-semibold text-red-700">
                  {row.excessHours > 0 ? formatHour(row.excessHours) : "-"}
                </td>
                <td className="px-3 py-3 font-semibold text-amber-700">
                  {row.shortageHours > 0 ? formatHour(row.shortageHours) : "-"}
                </td>

                <td className="px-3 py-3">
                  <span
                    className={[
                      "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
                      workloadStatusClassNames[row.status],
                    ].join(" ")}
                  >
                    {row.statusLabel}
                  </span>
                </td>
              </tr>
            ))}

            {rows.length === 0 && !isLoading ? (
              <tr>
                <td
                  className="px-3 py-8 text-center text-sm text-slate-500"
                  colSpan={workloadColumns.length}
                >
                  Chưa có dữ liệu tải giảng dạy.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
