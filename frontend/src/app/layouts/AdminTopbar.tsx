import { Bell, Menu } from "lucide-react";
import Button from "../../components/ui/Button";

type AdminTopbarProps = {
  onOpenSidebar: () => void;
};

export default function AdminTopbar({ onOpenSidebar }: AdminTopbarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-20 max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:px-8">
        <div className="flex items-center justify-between gap-3 lg:w-64">
          <Button
            aria-label="Mở menu"
            className="size-11 px-0 lg:hidden"
            variant="secondary"
            onClick={onOpenSidebar}
          >
            <Menu size={20} aria-hidden="true" />
          </Button>
          <div>
            <p className="text-sm font-semibold text-brand-800">Dashboard</p>
            <p className="text-base font-bold text-slate-950">
              Quản trị đào tạo
            </p>
          </div>
        </div>

        <form className="relative flex-1" role="search">
          <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-400 sm:block">
            Ctrl K
          </kbd>
        </form>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Thông báo"
            className="relative flex size-11 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 active:bg-brand-100"
          >
            <Bell size={18} aria-hidden="true" />
            <span className="absolute right-3 top-3 size-2 rounded-full bg-red-500" />
          </button>

          <div className="hidden min-h-11 items-center gap-3 rounded-lg border border-slate-200 bg-white px-2 py-1 sm:flex">
            <div className="flex size-9 items-center justify-center rounded-lg bg-brand-900 text-xs font-bold text-white">
              A
            </div>
            <div className="pr-2">
              <p className="text-sm font-bold text-slate-950">Admin CTĐT</p>
              <p className="text-xs font-medium text-slate-500">
                Quản trị viên
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
