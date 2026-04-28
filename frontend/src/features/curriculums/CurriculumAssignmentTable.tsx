import { formatDate } from "../../lib/format";
import { assignmentColumns } from "./curriculum.columns";
import type { CurriculumAssignment } from "./curriculum.types";

type CurriculumAssignmentTableProps = {
  rows: CurriculumAssignment[];
  isLoading?: boolean;
  onSelectClass: (classId: number) => void;
};

export default function CurriculumAssignmentTable({
  isLoading = false,
  onSelectClass,
  rows,
}: CurriculumAssignmentTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="overflow-auto">
        <table className="w-full min-w-[680px] table-fixed text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-600">
            <tr>
              {assignmentColumns.map((column) => (
                <th key={column.key} className="border-b border-slate-200 px-3 py-3 font-semibold">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((assignment) => (
              <tr
                key={assignment.id}
                className="cursor-pointer bg-white transition hover:bg-brand-50/50"
                onClick={() => onSelectClass(assignment.classId)}
              >
                <td className="px-3 py-3">
                  <span className="block truncate font-semibold text-slate-950">
                    {assignment.className}
                  </span>
                  <span className="mt-1 block truncate text-xs text-slate-500">
                    {assignment.classCode || "-"}
                  </span>
                </td>
                <td className="px-3 py-3 text-slate-600">
                  {assignment.appliedAt ? formatDate(assignment.appliedAt) : "-"}
                </td>
                <td className="px-3 py-3">
                  <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
                    {assignment.status === "dang_ap_dung" ? "Đang áp dụng" : "Ngưng áp dụng"}
                  </span>
                </td>
                <td className="px-3 py-3 text-slate-600">
                  <span className="block truncate">{assignment.note || "-"}</span>
                </td>
              </tr>
            ))}
            {rows.length === 0 && !isLoading ? (
              <tr>
                <td className="px-3 py-8 text-center text-sm text-slate-500" colSpan={assignmentColumns.length}>
                  Chưa có lớp nào áp dụng CTĐT này.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
