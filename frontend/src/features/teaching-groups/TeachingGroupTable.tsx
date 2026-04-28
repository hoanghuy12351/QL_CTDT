import { Edit3, Trash2 } from "lucide-react";
import IconButton from "../../components/ui/IconButton";
import TableSkeleton from "../../components/ui/TableSkeleton";
import { groupTypeClassNames, teachingGroupColumns } from "./teachingGroup.columns";
import type { TeachingGroup } from "./teachingGroup.types";

type TeachingGroupTableProps = {
  rows: TeachingGroup[];
  isLoading?: boolean;
  deletingId?: number | null;
  onEdit: (group: TeachingGroup) => void;
  onDelete: (group: TeachingGroup) => void;
};

export default function TeachingGroupTable({
  deletingId,
  isLoading = false,
  onDelete,
  onEdit,
  rows,
}: TeachingGroupTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      {isLoading ? <TableSkeleton columns={teachingGroupColumns.length} rows={5} /> : null}
      <div className={["overflow-auto", isLoading ? "hidden" : ""].join(" ")}>
        <table className="w-full min-w-[980px] table-fixed text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-600">
            <tr>
              {teachingGroupColumns.map((column) => (
                <th key={column} className="border-b border-slate-200 px-3 py-3 font-semibold">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((group) => (
              <tr key={group.id} className="bg-white hover:bg-slate-50">
                <td className="px-3 py-3">
                  <span className="block truncate font-semibold text-slate-950">{group.name}</span>
                  <span className="mt-1 block truncate text-xs text-slate-500">{group.code}</span>
                </td>
                <td className="px-3 py-3">
                  <span className={["inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1", groupTypeClassNames[group.type]].join(" ")}>
                    {group.typeLabel}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <span className="block truncate font-medium text-slate-950">{group.className}</span>
                  <span className="mt-1 block truncate text-xs text-slate-500">{group.classCode || "-"}</span>
                </td>
                <td className="px-3 py-3">
                  <span className="block truncate font-medium text-slate-950">{group.courseName}</span>
                  <span className="mt-1 block truncate text-xs text-slate-500">{group.courseCode || "-"}</span>
                </td>
                <td className="px-3 py-3 text-slate-700">{group.classSize}</td>
                <td className="px-3 py-3 text-slate-700">{group.periods}</td>
                <td className="px-3 py-3">
                  <span className={["inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1", group.assignmentCount > 0 ? "bg-emerald-50 text-emerald-700 ring-emerald-100" : "bg-slate-100 text-slate-700 ring-slate-200"].join(" ")}>
                    {group.assignmentCount > 0 ? "Đã phân công" : "Chưa phân công"}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <div className="flex justify-center gap-1">
                    <IconButton label={`Sửa ${group.name}`} onClick={() => onEdit(group)}>
                      <Edit3 size={16} aria-hidden="true" />
                    </IconButton>
                    <IconButton label={`Xóa ${group.name}`} variant="danger" disabled={deletingId === group.id} onClick={() => onDelete(group)}>
                      <Trash2 size={16} aria-hidden="true" />
                    </IconButton>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && !isLoading ? (
              <tr>
                <td className="px-3 py-8 text-center text-sm text-slate-500" colSpan={teachingGroupColumns.length}>
                  Chưa có nhóm học phần theo bộ lọc hiện tại.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
