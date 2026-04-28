import { Edit3, Trash2 } from "lucide-react";
import type {
  AdminCrudConfig,
  AdminCrudRecord,
} from "../../../features/admin/crud/adminCrud.types";
import IconButton from "../../ui/IconButton";
import TableSkeleton from "../../ui/TableSkeleton";

type AdminCrudTableProps = {
  config: AdminCrudConfig;
  rows: AdminCrudRecord[];
  isLoading: boolean;
  deletingId?: string | number | null;
  onEdit: (record: AdminCrudRecord) => void;
  onDelete: (record: AdminCrudRecord) => void;
};

const getValueByPath = (record: AdminCrudRecord, path: string) => {
  return path.split(".").reduce<unknown>((value, key) => {
    if (!value || typeof value !== "object") return undefined;
    return (value as Record<string, unknown>)[key];
  }, record);
};

const formatCellValue = (value: unknown, fallback = "-") => {
  if (value === null || value === undefined || value === "") return fallback;
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    return new Intl.DateTimeFormat("vi-VN").format(new Date(value));
  }
  return String(value).replaceAll("_", " ");
};

export default function AdminCrudTable({
  config,
  deletingId,
  isLoading,
  onDelete,
  onEdit,
  rows,
}: AdminCrudTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      {isLoading ? <TableSkeleton columns={config.columns.length + 1} rows={6} /> : null}

      <div
        className={[
          "max-h-[calc(100vh-330px)] min-h-[280px] overflow-auto",
          isLoading ? "hidden" : "",
        ].join(" ")}
      >
        <table className="w-full min-w-[760px] table-fixed border-collapse text-left text-sm">
          <thead className="sticky top-0 z-10 bg-slate-50 text-xs uppercase text-slate-600">
            <tr>
              {config.columns.map((column) => (
                <th
                  key={column.key}
                  className="border-b border-slate-200 px-4 py-3 font-semibold"
                >
                  {column.label}
                </th>
              ))}
              <th className="sticky right-0 w-28 border-b border-slate-200 bg-slate-50 px-4 py-3 text-center font-semibold">
                Thao tác
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => {
              const rowId = row[config.idField] as string | number;

              return (
                <tr key={String(rowId)} className="transition hover:bg-brand-50/45">
                  {config.columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-4 py-3 text-slate-700"
                      title={formatCellValue(
                        getValueByPath(row, column.key),
                        column.fallback,
                      )}
                    >
                      <span className="block truncate">
                        {formatCellValue(
                          getValueByPath(row, column.key),
                          column.fallback,
                        )}
                      </span>
                    </td>
                  ))}
                  <td className="sticky right-0 bg-white px-3 py-2 shadow-[-10px_0_18px_-18px_rgba(15,23,42,0.5)]">
                    <div className="flex justify-center gap-1">
                      <IconButton
                        label="Sửa bản ghi"
                        onClick={() => onEdit(row)}
                      >
                        <Edit3 size={16} aria-hidden="true" />
                      </IconButton>
                      <IconButton
                        label="Xóa bản ghi"
                        variant="danger"
                        disabled={deletingId === rowId}
                        onClick={() => onDelete(row)}
                      >
                        <Trash2 size={16} aria-hidden="true" />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              );
            })}

            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={config.columns.length + 1}
                  className="px-4 py-12 text-center text-sm text-slate-500"
                >
                  Không có dữ liệu phù hợp.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
