import Button from "../../components/ui/Button";
import {
  classCourseStatusClassNames,
  classCourseStatusLabels,
  classProgressColumns,
  progressLabels,
} from "./curriculum.columns";
import type { ClassCourseStatus, ClassProgress } from "./curriculum.types";

type ClassProgressTableProps = {
  rows: ClassProgress[];
  isLoading?: boolean;
  updatingId?: number | null;
  onUpdateStatus: (progressId: number, status: ClassCourseStatus) => void;
};

export default function ClassProgressTable({
  isLoading = false,
  onUpdateStatus,
  rows,
  updatingId,
}: ClassProgressTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="overflow-auto">
        <table className="w-full min-w-[860px] table-fixed text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-600">
            <tr>
              {classProgressColumns.map((column) => (
                <th
                  key={column.key}
                  className={[
                    "border-b border-slate-200 px-3 py-3 font-semibold",
                    column.key === "semester" ? "w-24 text-center" : "",
                    column.key === "credits" ? "w-16 text-center" : "",
                    column.key === "progress" ? "w-28" : "",
                    column.key === "status" ? "w-36" : "",
                    column.key === "actions" ? "w-44 text-center" : "",
                  ].join(" ")}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((progress) => (
              <tr key={progress.id} className="bg-white transition hover:bg-slate-50">
                <td className="px-3 py-3 text-center font-semibold text-slate-800">
                  {progress.semester}
                </td>
                <td className="px-3 py-3">
                  <span className="block truncate font-semibold text-slate-950">
                    {progress.courseName}
                  </span>
                  <span className="mt-1 block truncate text-xs text-slate-500">
                    {progress.courseCode || "-"}
                  </span>
                </td>
                <td className="px-3 py-3 text-center text-slate-700">{progress.credits}</td>
                <td className="px-3 py-3 text-slate-700">{progressLabels[progress.progress]}</td>
                <td className="px-3 py-3">
                  <span
                    className={[
                      "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
                      classCourseStatusClassNames[progress.status],
                    ].join(" ")}
                  >
                    {classCourseStatusLabels[progress.status]}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <div className="flex justify-center gap-1">
                    <Button
                      className="min-h-8 px-2 text-xs"
                      variant="secondary"
                      disabled={updatingId === progress.id || progress.status === "dang_hoc"}
                      onClick={() => onUpdateStatus(progress.id, "dang_hoc")}
                    >
                      Đang học
                    </Button>
                    <Button
                      className="min-h-8 px-2 text-xs"
                      variant="secondary"
                      disabled={updatingId === progress.id || progress.status === "da_hoc"}
                      onClick={() => onUpdateStatus(progress.id, "da_hoc")}
                    >
                      Đã học
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && !isLoading ? (
              <tr>
                <td className="px-3 py-8 text-center text-sm text-slate-500" colSpan={classProgressColumns.length}>
                  Chưa có tiến độ cho lớp đã chọn.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
