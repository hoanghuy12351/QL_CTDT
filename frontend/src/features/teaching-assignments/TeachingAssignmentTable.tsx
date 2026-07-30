import { Edit3, Plus, Trash2 } from "lucide-react";
import IconButton from "../../components/ui/IconButton";
import TableSkeleton from "../../components/ui/TableSkeleton";
import { groupTypeClassNames } from "../teaching-groups/teachingGroup.columns";
import {
  assignmentStatusClassNames,
  teachingAssignmentColumns,
} from "./teachingAssignment.columns";
import type {
  TeachingAssignment,
  TeachingAssignmentRow,
} from "./teachingAssignment.types";

type TeachingAssignmentTableProps = {
  rows: TeachingAssignmentRow[];
  isLoading?: boolean;
  deletingId?: number | null;
  onAssign: (row: TeachingAssignmentRow) => void;
  onEdit: (row: TeachingAssignmentRow) => void;
  onDelete: (assignment: TeachingAssignment) => void;
  onSchedule?: (assignment: TeachingAssignment) => void;
};
export default function TeachingAssignmentTable({
  deletingId,
  isLoading = false,
  onAssign,
  onDelete,
  onEdit,
  rows,
}: TeachingAssignmentTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      {isLoading ? (
        <TableSkeleton columns={teachingAssignmentColumns.length} rows={6} />
      ) : null}

      <div className={["overflow-auto", isLoading ? "hidden" : ""].join(" ")}>
        <table className="w-full min-w-[1120px] table-fixed text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-600">
            <tr>
              {teachingAssignmentColumns.map((column) => (
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
            {rows.map((row) => {
              const assignment = row.assignment;

              return (
                <tr key={row.rowId} className="bg-white hover:bg-slate-50">
                  <td className="px-3 py-3">
                    <span className="block truncate font-semibold text-slate-950">
                      {row.group.name}
                    </span>
                    <span
                      className={[
                        "mt-1 inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ring-1",
                        groupTypeClassNames[row.group.type],
                      ].join(" ")}
                    >
                      {row.group.typeLabel}
                    </span>
                  </td>

                  <td className="px-3 py-3">
                    <span className="block truncate font-medium text-slate-950">
                      {row.group.className}
                    </span>
                    <span className="mt-1 block truncate text-xs text-slate-500">
                      {row.group.classCode || "-"}
                    </span>
                  </td>

                  <td className="px-3 py-3">
                    <span className="block truncate font-medium text-slate-950">
                      {row.group.courseName}
                    </span>
                    <span className="mt-1 block truncate text-xs text-slate-500">
                      {row.group.courseCode || "-"}
                    </span>
                  </td>

                  <td className="px-3 py-3">
                    {assignment ? (
                      <>
                        <span className="block truncate font-semibold text-slate-950">
                          {assignment.lecturerName}
                        </span>
                        <span className="mt-1 block truncate text-xs text-slate-500">
                          {assignment.lecturerCode || assignment.departmentName}
                        </span>
                      </>
                    ) : (
                      <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-100">
                        Chưa có giảng viên
                      </span>
                    )}
                  </td>

                  <td className="px-3 py-3 text-slate-700">
                    {assignment?.roleLabel ?? "-"}
                  </td>

                  <td className="px-3 py-3">
                    <span className="font-semibold text-slate-950">
                      {assignment?.assignedPeriods ?? row.group.periods}
                    </span>
                    <span className="ml-1 text-xs text-slate-500">tiết</span>

                    {assignment ? (
                      <span className="mt-1 block text-xs text-slate-500">
                        Quy đổi: {assignment.convertedPeriods}
                      </span>
                    ) : null}
                  </td>

                  <td className="px-3 py-3">
                    <span className="font-semibold text-slate-950">
                      {assignment?.convertedPeriods ?? "-"}
                    </span>
                  </td>

                  <td className="px-3 py-3">
                    {assignment ? (
                      <span
                        className={[
                          "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
                          assignmentStatusClassNames[assignment.status],
                        ].join(" ")}
                      >
                        {assignment.statusLabel}
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                        Chưa phân công
                      </span>
                    )}
                  </td>

                  <td className="px-3 py-2">
                    <div className="flex justify-center gap-1">
                      {!assignment ? (
                        <IconButton
                          label="Phân công giảng viên"
                          onClick={() => onAssign(row)}
                        >
                          <Plus size={16} aria-hidden="true" />
                        </IconButton>
                      ) : (
                        <>
                          <IconButton
                            label="Thêm giảng viên khác"
                            onClick={() => onAssign(row)}
                          >
                            <Plus size={16} aria-hidden="true" />
                          </IconButton>
                          <IconButton
                            label="Sửa phân công"
                            onClick={() => onEdit(row)}
                          >
                            <Edit3 size={16} aria-hidden="true" />
                          </IconButton>

                          <IconButton
                            label="Xóa phân công"
                            variant="danger"
                            disabled={deletingId === assignment.id}
                            onClick={() => onDelete(assignment)}
                          >
                            <Trash2 size={16} aria-hidden="true" />
                          </IconButton>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}

            {rows.length === 0 && !isLoading ? (
              <tr>
                <td
                  className="px-3 py-8 text-center text-sm text-slate-500"
                  colSpan={teachingAssignmentColumns.length}
                >
                  Chưa có nhóm học phần phù hợp với bộ lọc hiện tại.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
