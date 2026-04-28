import { Edit3, Trash2 } from "lucide-react";
import IconButton from "../../components/ui/IconButton";
import TableSkeleton from "../../components/ui/TableSkeleton";
import { curriculumCourseColumns, progressLabels } from "./curriculum.columns";
import type { CurriculumCourse } from "./curriculum.types";

type CurriculumCourseTableProps = {
  rows: CurriculumCourse[];
  isLoading?: boolean;
  deletingId?: number | null;
  onEdit: (course: CurriculumCourse) => void;
  onDelete: (course: CurriculumCourse) => void;
};

export default function CurriculumCourseTable({
  deletingId,
  isLoading = false,
  onDelete,
  onEdit,
  rows,
}: CurriculumCourseTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      {isLoading ? <TableSkeleton columns={curriculumCourseColumns.length} rows={5} /> : null}
      <div className={["overflow-auto", isLoading ? "hidden" : ""].join(" ")}>
        <table className="w-full min-w-[760px] table-fixed text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-600">
            <tr>
              {curriculumCourseColumns.map((column) => (
                <th
                  key={column.key}
                  className={[
                    "border-b border-slate-200 px-3 py-3 font-semibold",
                    column.key === "semester" ? "w-24 text-center" : "",
                    column.key === "credits" ? "w-16 text-center" : "",
                    column.key === "progress" ? "w-28" : "",
                    column.key === "required" ? "w-28" : "",
                    column.key === "actions" ? "w-24 text-center" : "",
                  ].join(" ")}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((course) => (
              <tr key={course.id} className="bg-white transition hover:bg-slate-50">
                <td className="px-3 py-3 text-center font-semibold text-slate-800">
                  {course.semester}
                </td>
                <td className="px-3 py-3">
                  <span className="block truncate font-semibold text-slate-950">
                    {course.courseName}
                  </span>
                  <span className="mt-1 block truncate text-xs text-slate-500">
                    {course.courseCode || "-"} · {course.courseType}
                  </span>
                </td>
                <td className="px-3 py-3 text-center text-slate-700">{course.credits}</td>
                <td className="px-3 py-3 text-slate-700">{progressLabels[course.progress]}</td>
                <td className="px-3 py-3">
                  <span
                    className={[
                      "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
                      course.required
                        ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
                        : "bg-sky-50 text-sky-700 ring-sky-100",
                    ].join(" ")}
                  >
                    {course.required ? "Bắt buộc" : "Tự chọn"}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <div className="flex justify-center gap-1">
                    <IconButton label={`Sửa ${course.courseName}`} onClick={() => onEdit(course)}>
                      <Edit3 size={16} aria-hidden="true" />
                    </IconButton>
                    <IconButton
                      label={`Xóa ${course.courseName}`}
                      variant="danger"
                      disabled={deletingId === course.id}
                      onClick={() => onDelete(course)}
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </IconButton>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && !isLoading ? (
              <tr>
                <td className="px-3 py-8 text-center text-sm text-slate-500" colSpan={curriculumCourseColumns.length}>
                  Chưa có học phần trong chương trình này.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
