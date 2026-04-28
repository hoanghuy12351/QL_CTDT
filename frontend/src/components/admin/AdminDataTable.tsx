import Badge from "../ui/Badge";
import TableSkeleton from "../ui/TableSkeleton";

type AdminDataRow = {
  id: string;
  name: string;
  owner: string;
  status: "draft" | "active" | "warning";
  updatedAt: string;
};

type AdminDataTableProps = {
  rows: AdminDataRow[];
  isLoading?: boolean;
};

const statusLabel: Record<AdminDataRow["status"], string> = {
  active: "Đang áp dụng",
  draft: "Dự thảo",
  warning: "Cần xử lý",
};

const statusTone: Record<AdminDataRow["status"], "blue" | "green" | "amber"> = {
  active: "green",
  draft: "blue",
  warning: "amber",
};

export default function AdminDataTable({
  isLoading = false,
  rows,
}: AdminDataTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      {isLoading ? <TableSkeleton rows={5} /> : null}
      <div className="overflow-x-auto">
        <table
          className={[
            "w-full min-w-[720px] text-left text-sm",
            isLoading ? "hidden" : "",
          ].join(" ")}
        >
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Nội dung</th>
              <th className="px-4 py-3 font-semibold">Phụ trách</th>
              <th className="px-4 py-3 font-semibold">Trạng thái</th>
              <th className="px-4 py-3 font-semibold">Cập nhật</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.id} className="transition hover:bg-slate-50">
                <td className="px-4 py-4 font-medium text-slate-950">
                  {row.name}
                </td>
                <td className="px-4 py-4 text-slate-600">{row.owner}</td>
                <td className="px-4 py-4">
                  <Badge tone={statusTone[row.status]}>
                    {statusLabel[row.status]}
                  </Badge>
                </td>
                <td className="px-4 py-4 text-slate-500">{row.updatedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
