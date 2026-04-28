import { Plus, Wand2 } from "lucide-react";
import Button from "../../components/ui/Button";
import { openedClassCourseColumns } from "./teachingGroup.columns";
import type { OpenedClassCourse } from "./teachingGroup.types";

type OpenedClassCourseTableProps = {
  rows: OpenedClassCourse[];
  selectedId?: number | null;
  onSelect: (row: OpenedClassCourse) => void;
  onCreateGroup: (row: OpenedClassCourse) => void;
  onQuickCreate: (row: OpenedClassCourse) => void;
};

export default function OpenedClassCourseTable({
  onCreateGroup,
  onQuickCreate,
  onSelect,
  rows,
  selectedId,
}: OpenedClassCourseTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="overflow-auto">
        <table className="w-full min-w-[920px] table-fixed text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-600">
            <tr>
              {openedClassCourseColumns.map((column) => (
                <th key={column} className="border-b border-slate-200 px-3 py-3 font-semibold">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => {
              const selected = selectedId === row.id;

              return (
                <tr
                  key={row.id}
                  className={[
                    "cursor-pointer transition hover:bg-brand-50/45",
                    selected ? "bg-brand-50/80" : "bg-white",
                  ].join(" ")}
                  onClick={() => onSelect(row)}
                >
                  <td className="px-3 py-3">
                    <span className="block truncate font-semibold text-slate-950">{row.className}</span>
                    <span className="mt-1 block truncate text-xs text-slate-500">{row.classCode || "-"}</span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="block truncate font-semibold text-slate-950">{row.courseName}</span>
                    <span className="mt-1 block truncate text-xs text-slate-500">{row.courseCode || "-"}</span>
                  </td>
                  <td className="px-3 py-3 text-slate-700">{row.credits}</td>
                  <td className="px-3 py-3 text-slate-700">{row.theoryPeriods}</td>
                  <td className="px-3 py-3 text-slate-700">{row.practicePeriods}</td>
                  <td className="px-3 py-3 text-slate-700">{row.classSize}</td>
                  <td className="px-3 py-3">
                    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                      {row.groupCount}
                    </span>
                  </td>
                  <td className="px-3 py-2" onClick={(event) => event.stopPropagation()}>
                    <div className="flex flex-wrap gap-1">
                      <Button className="min-h-8 px-2 text-xs" variant="secondary" leftIcon={<Wand2 size={14} aria-hidden="true" />} onClick={() => onQuickCreate(row)}>
                        Nhanh
                      </Button>
                      <Button className="min-h-8 px-2 text-xs" variant="secondary" leftIcon={<Plus size={14} aria-hidden="true" />} onClick={() => onCreateGroup(row)}>
                        Nhóm
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 ? (
              <tr>
                <td className="px-3 py-8 text-center text-sm text-slate-500" colSpan={openedClassCourseColumns.length}>
                  Chưa có lớp - học phần đã mở trong kế hoạch học kỳ này.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
