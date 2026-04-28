import { Link } from "react-router-dom";
import type { AdminNavItem } from "../../lib/constants";

export default function AdminModuleCard({
  description,
  icon: Icon,
  label,
  shortLabel,
  to,
}: AdminNavItem) {
  return (
    <Link
      to={to}
      className="group block rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 active:bg-brand-50"
    >
      <div className="flex items-start gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 transition group-hover:bg-brand-700 group-hover:text-white">
          <Icon size={22} aria-hidden="true" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-950">{label}</h3>
            <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-500">
              {shortLabel}
            </span>
          </div>
          <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
        </div>
      </div>
    </Link>
  );
}
