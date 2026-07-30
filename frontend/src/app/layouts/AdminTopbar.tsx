import { Bell, Menu } from "lucide-react";
import Button from "../../components/ui/Button";
import { useAuthStore } from "../../features/auth/auth.store";
import { getRoleLabel, isLecturerRole } from "../../features/auth/role";

type AdminTopbarProps = {
  onOpenSidebar: () => void;
};

const getInitials = (name?: string) => {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const last = parts[parts.length - 1] ?? "";
  const first = parts.length > 1 ? parts[0] : "";
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase() || "U";
};

export default function AdminTopbar({ onOpenSidebar }: AdminTopbarProps) {
  const user = useAuthStore((state) => state.user);
  const isLecturer = isLecturerRole(user?.vaiTro);

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
            <p className="text-sm font-semibold text-brand-800">
              {isLecturer ? "Không gian giảng viên" : "Dashboard"}
            </p>
            <p className="text-base font-bold text-slate-950">
              {isLecturer ? "Lịch dạy của tôi" : "Quản trị đào tạo"}
            </p>
          </div>
        </div>

        <form className="relative flex-1" role="search"></form>

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
              {getInitials(user?.hoTen)}
            </div>
            <div className="pr-2">
              <p className="text-sm font-bold text-slate-950">
                {user?.hoTen ?? "Người dùng"}
              </p>
              <p className="text-xs font-medium text-slate-500">
                {getRoleLabel(user?.vaiTro)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
