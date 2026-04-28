import { Edit3, Trash2 } from "lucide-react";
import IconButton from "../../components/ui/IconButton";
import TableSkeleton from "../../components/ui/TableSkeleton";
import { formatNumber } from "../../lib/format";
import {
  curriculumColumns,
  curriculumStatusClassNames,
  curriculumStatusLabels,
} from "./curriculum.columns";
import type { Curriculum } from "./curriculum.types";

type CurriculumTableProps = {
  rows: Curriculum[];
  page: number;
  limit: number;
  selectedId?: number | null;
  isLoading?: boolean;
  deletingId?: number | null;
  onSelect: (curriculum: Curriculum) => void;
  onEdit: (curriculum: Curriculum) => void;
  onDelete: (curriculum: Curriculum) => void;
};

export default function CurriculumTable({
  deletingId,
  isLoading = false,
  limit,
  onDelete,
  onEdit,
  onSelect,
  page,
  rows,
  selectedId,
}: CurriculumTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      {isLoading ? <TableSkeleton columns={curriculumColumns.length + 1} rows={6} /> : null}
      <div className={["max-h-[calc(100vh-390px)] min-h-[320px] overflow-auto", isLoading ? "hidden" : ""].join(" ")}>
        <table className="w-full min-w-[1040px] table-fixed border-collapse text-left text-sm">
          <thead className="sticky top-0 z-10 bg-slate-50 text-xs uppercase text-slate-600">
            <tr>
              {curriculumColumns.map((column) => (
                <th
                  key={column.key}
                  className={[
                    "border-b border-slate-200 px-3 py-3 font-semibold",
                    column.key === "index" ? "w-14 text-center" : "",
                    column.key === "code" ? "w-36" : "",
                    column.key === "credits" ? "w-24 text-center" : "",
                    column.key === "status" ? "w-36" : "",
                  ].join(" ")}
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
            {rows.map((curriculum, index) => {
              const isSelected = selectedId === curriculum.id;

              return (
                <tr
                  key={curriculum.id}
                  className={[
                    "cursor-pointer transition hover:bg-brand-50/45",
                    isSelected ? "bg-brand-50/80" : "bg-white",
                  ].join(" ")}
                  onClick={() => onSelect(curriculum)}
                >
                  <td className="px-3 py-3 text-center text-slate-500">
                    {(page - 1) * limit + index + 1}
                  </td>
                  <td className="px-3 py-3">
                    <span className="inline-flex max-w-full rounded-md bg-slate-100 px-2 py-1 font-semibold text-slate-900">
                      <span className="truncate">{curriculum.code}</span>
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="block truncate font-semibold text-slate-950">
                      {curriculum.name}
                    </span>
                    <span className="mt-1 block truncate text-xs text-slate-500">
                      {curriculum.courseCount} học phần · {curriculum.classCount} lớp
                    </span>
                  </td>
                  <td className="px-3 py-3 text-slate-600">
                    <span className="block truncate">{curriculum.majorName}</span>
                    <span className="mt-1 block truncate text-xs text-slate-400">
                      {curriculum.specializationName}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-slate-600">
                    <span className="block truncate">{curriculum.cohortName}</span>
                  </td>
                  <td className="px-3 py-3 text-center font-semibold text-slate-800">
                    {formatNumber(curriculum.totalCredits)}
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={[
                        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
                        curriculumStatusClassNames[curriculum.status],
                      ].join(" ")}
                    >
                      {curriculumStatusLabels[curriculum.status]}
                    </span>
                  </td>
                  <td
                    className={[
                      "sticky right-0 px-3 py-2 shadow-[-10px_0_18px_-18px_rgba(15,23,42,0.5)]",
                      isSelected ? "bg-brand-50" : "bg-white",
                    ].join(" ")}
                    onClick={(event) => event.stopPropagation()}
                  >
                    <div className="flex justify-center gap-1">
                      <IconButton label={`Sửa ${curriculum.name}`} onClick={() => onEdit(curriculum)}>
                        <Edit3 size={16} aria-hidden="true" />
                      </IconButton>
                      <IconButton
                        label={`Xóa ${curriculum.name}`}
                        variant="danger"
                        disabled={deletingId === curriculum.id}
                        onClick={() => onDelete(curriculum)}
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
