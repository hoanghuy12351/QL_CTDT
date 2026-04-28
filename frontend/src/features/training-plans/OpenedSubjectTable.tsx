import { openedSubjectColumns, progressLabels } from "./trainingPlan.columns";
import type { OpenedSubject } from "./trainingPlan.types";

type OpenedSubjectTableProps = {
  rows: OpenedSubject[];
};

export default function OpenedSubjectTable({ rows }: OpenedSubjectTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="overflow-auto">
        <table className="w-full min-w-[760px] table-fixed text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-600">
            <tr>
              {openedSubjectColumns.map((column) => (
                <th key={column} className="border-b border-slate-200 px-3 py-3 font-semibold">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.id} className="bg-white hover:bg-slate-50">
                <td className="px-3 py-3">
                  <span className="block truncate font-semibold text-slate-950">{row.className}</span>
                  <span className="mt-1 block truncate text-xs text-slate-500">{row.classCode || "-"}</span>
                </td>
                <td className="px-3 py-3">
                  <span className="block truncate font-semibold text-slate-950">{row.courseName}</span>
                  <span className="mt-1 block truncate text-xs text-slate-500">{row.courseCode || "-"}</span>
                </td>
                <td className="px-3 py-3 text-slate-700">{row.credits}</td>
                <td className="px-3 py-3 text-slate-700">{progressLabels[row.progress]}</td>
                <td className="px-3 py-3">
                  <span className="inline-flex rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-100">
                    {row.status}
                  </span>
                </td>
                <td className="px-3 py-3 text-slate-700">{row.groupCount}</td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td className="px-3 py-8 text-center text-sm text-slate-500" colSpan={openedSubjectColumns.length}>
                  Chưa có học phần nào được mở trong kế hoạch học kỳ này.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
