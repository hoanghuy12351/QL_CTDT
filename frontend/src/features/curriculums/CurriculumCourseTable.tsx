import { Edit3, Trash2 } from "lucide-react";
import IconButton from "../../components/ui/IconButton";
import TableSkeleton from "../../components/ui/TableSkeleton";
import { curriculumCourseColumns } from "./curriculum.columns";
import { getSemesterLabel } from "./curriculum.helpers";
import type { CurriculumCourse } from "./curriculum.types";

type CurriculumCourseTableProps = {
  rows: CurriculumCourse[];
  isLoading?: boolean;
  deletingId?: number | null;
  onEdit?: (course: CurriculumCourse) => void;
  onDelete?: (course: CurriculumCourse) => void;
};

export default function CurriculumCourseTable({
  deletingId,
  isLoading = false,
  onDelete,
  onEdit,
  rows,
}: CurriculumCourseTableProps) {
  const showActions = Boolean(onEdit && onDelete);

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      {isLoading ? (
        <TableSkeleton
          columns={curriculumCourseColumns.length + (showActions ? 1 : 0)}
          rows={5}
        />
      ) : null}
      <div className={["max-h-[calc(100vh-360px)] min-h-[280px] overflow-auto", isLoading ? "hidden" : ""].join(" ")}>
        <table className="w-full min-w-[1180px] table-fixed border-collapse text-left text-sm">
          <thead className="sticky top-0 z-10 bg-slate-50 text-xs uppercase text-slate-600">
            <tr>
              {curriculumCourseColumns.map((column) => (
                <th
                  key={column.key}
                  className={[
                    "border-b border-slate-200 px-3 py-3 font-semibold",
                    column.key === "index" ? "w-16 text-center" : "",
                    column.key === "semester" ? "w-24 text-center" : "",
                    column.key === "code" ? "w-36" : "",
                    column.key === "credits" ? "w-24 text-center" : "",
                    column.key === "theoryHours" ? "w-28 text-center" : "",
                    column.key === "practiceHours" ? "w-36 text-center" : "",
                    column.key === "totalHours" ? "w-32 text-center" : "",
                    column.key === "type" ? "w-32" : "",
                  ].join(" ")}
                >
                  {column.label}
                </th>
              ))}
              {showActions ? (
                <th className="sticky right-0 w-28 border-b border-slate-200 bg-slate-50 px-3 py-3 text-center font-semibold">
                  Thao tác
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((course, index) => (
              <tr key={course.id} className="bg-white transition hover:bg-slate-50">
                <td className="px-3 py-3 text-center text-slate-500">
                  {index + 1}
                </td>
                <td className="px-3 py-3 text-center font-semibold text-slate-800">
                  {getSemesterLabel(course.semester)}
                </td>
                <td className="px-3 py-3">
                  <span className="inline-flex max-w-full rounded-md bg-slate-100 px-2 py-1 font-semibold text-slate-900">
                    <span className="truncate">{course.courseCode || "-"}</span>
                  </span>
                </td>
                <td className="px-3 py-3">
                  <span className="block truncate font-semibold text-slate-950">
                    {course.courseName}
                  </span>
                </td>
                <td className="px-3 py-3 text-center text-slate-700">{course.credits}</td>
                <td className="px-3 py-3 text-center text-slate-700">{course.theoryHours}</td>
                <td className="px-3 py-3 text-center text-slate-700">{course.practiceHours}</td>
                <td className="px-3 py-3 text-center font-semibold text-slate-800">{course.totalHours}</td>
                <td className="px-3 py-3">
                  <span className="inline-flex max-w-full rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                    <span className="truncate">{course.courseType}</span>
                  </span>
                </td>
                {showActions ? (
                  <td className="sticky right-0 bg-white px-3 py-2 shadow-[-10px_0_18px_-18px_rgba(15,23,42,0.5)]">
                    <div className="flex justify-center gap-1">
                      <IconButton label={`Sửa ${course.courseName}`} onClick={() => onEdit?.(course)}>
                        <Edit3 size={16} aria-hidden="true" />
                      </IconButton>
                      <IconButton
                        label={`Xóa ${course.courseName}`}
                        variant="danger"
                        disabled={deletingId === course.id}
                        onClick={() => onDelete?.(course)}
                      >
                        <Trash2 size={16} aria-hidden="true" />
                      </IconButton>
                    </div>
                  </td>
                ) : null}
              </tr>
            ))}
            {rows.length === 0 && !isLoading ? (
              <tr>
                <td
                  className="px-3 py-8 text-center text-sm text-slate-500"
                  colSpan={curriculumCourseColumns.length + (showActions ? 1 : 0)}
                >
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
