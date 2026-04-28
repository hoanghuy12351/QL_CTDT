import type { AdminFeatureStatus } from "../../../features/admin/feature-name/adminFeature.types";

type AdminFeatureStatusBadgeProps = {
  status: AdminFeatureStatus;
};

const statusClassName: Record<AdminFeatureStatus, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  inactive: "bg-slate-100 text-slate-700 ring-slate-200",
};

export default function AdminFeatureStatusBadge({
  status,
}: AdminFeatureStatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${statusClassName[status]}`}
    >
      {status}
    </span>
  );
}

