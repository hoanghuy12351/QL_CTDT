import { Edit3, Trash2 } from "lucide-react";
import IconButton from "../../components/ui/IconButton";
import TableSkeleton from "../../components/ui/TableSkeleton";
import { classroomColumns } from "./classroom.columns";
import type { Classroom } from "./classroom.types";

type ClassroomTableProps = {
  rows: Classroom[];
  page: number;
  limit: number;
  selectedIds: number[];
  isLoading?: boolean;
  deletingId?: number | null;
  onEdit: (classroom: Classroom) => void;
  onDelete: (classroom: Classroom) => void;
  onToggleRow: (id: number) => void;
  onToggleAll: () => void;
};

const roomTypeLabelMap: Record<string, string> = {
  ly_thuyet: "Lý thuyết",
  thuc_hanh: "Thực hành",
  lab: "Lab",
  do_an: "Đồ án",
  online: "Online",
};

export default function ClassroomTable({
  deletingId,
  isLoading = false,
  limit,
  onDelete,
  onEdit,
  onToggleAll,
  onToggleRow,
  page,
  rows,
  selectedIds,
}: ClassroomTableProps) {
  const selectedSet = new Set(selectedIds);
  const isAllCurrentPageSelected =
    rows.length > 0 && rows.every((row) => selectedSet.has(row.id));

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      {isLoading ? <TableSkeleton columns={classroomColumns.length + 2} rows={6} /> : null}

      <div
        className={[
          "max-h-[calc(100vh-360px)] min-h-[320px] overflow-auto",
          isLoading ? "hidden" : "",
        ].join(" ")}
      >
        <table className="w-full min-w-[1080px] table-fixed border-collapse text-left text-sm">
          <thead className="sticky top-0 z-10 bg-slate-50 text-xs uppercase text-slate-600">
            <tr>
              <th className="w-12 border-b border-slate-200 px-3 py-3 text-center">
                <input
                  type="checkbox"
                  aria-label="Chọn tất cả dòng hiện tại"
                  checked={isAllCurrentPageSelected}
                  onChange={onToggleAll}
                  className="size-4 rounded border-slate-300 text-brand-600 focus:ring-brand-200"
                />
              </th>
              {classroomColumns.map((column) => (
                <th
                  key={column.key}
                  className={`border-b border-slate-200 px-3 py-3 font-semibold ${column.className ?? ""}`}
                >
                  {column.label}
                </th>
              ))}
              <th className="sticky right-0 w-28 border-b border-slate-200 bg-slate-50 px-3 py-3 text-center font-semibold">
                Thao tác
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {rows.map((classroom, index) => {
              const isSelected = selectedSet.has(classroom.id);

              return (
                <tr
                  key={classroom.id}
                  className={[
                    "transition hover:bg-brand-50/45",
                    isSelected ? "bg-brand-50/80" : "bg-white",
                  ].join(" ")}
                >
                  <td className="px-3 py-3 text-center">
                    <input
                      type="checkbox"
                      aria-label={`Chọn phòng học ${classroom.code}`}
                      checked={isSelected}
                      onChange={() => onToggleRow(classroom.id)}
                      className="size-4 rounded border-slate-300 text-brand-600 focus:ring-brand-200"
                    />
                  </td>
                  <td className="px-3 py-3 text-center text-slate-500">
                    {(page - 1) * limit + index + 1}
                  </td>
                  <td className="px-3 py-3">
                    <span className="inline-flex max-w-full rounded-md bg-slate-100 px-2 py-1 font-semibold text-slate-900">
                      <span className="truncate">{classroom.code}</span>
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="block truncate font-medium text-slate-950">
                      {classroom.name ?? "-"}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-slate-700">
                    <span className="block truncate">{classroom.campusName}</span>
                  </td>
                  <td className="px-3 py-3 text-slate-600">
                    {classroom.roomType
                      ? (roomTypeLabelMap[classroom.roomType] ?? classroom.roomType)
                      : "-"}
                  </td>
                  <td className="px-3 py-3 text-slate-600">
                    {classroom.capacity ?? "-"}
                  </td>
                  <td
                    className={[
                      "sticky right-0 px-3 py-2 shadow-[-10px_0_18px_-18px_rgba(15,23,42,0.5)]",
                      isSelected ? "bg-brand-50" : "bg-white",
                    ].join(" ")}
                  >
                    <div className="flex justify-center gap-1">
                      <IconButton label={`Sửa phòng học ${classroom.code}`} onClick={() => onEdit(classroom)}>
                        <Edit3 size={16} aria-hidden="true" />
                      </IconButton>
                      <IconButton
                        label={`Xóa phòng học ${classroom.code}`}
                        variant="danger"
                        disabled={deletingId === classroom.id}
                        onClick={() => onDelete(classroom)}
                      >
                        <Trash2 size={16} aria-hidden="true" />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
