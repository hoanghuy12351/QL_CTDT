import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronLeft, ChevronRight, LogOut, X } from "lucide-react";
import { APP_NAME, getNavigationItemsForRole } from "../../lib/constants";
import Button from "../../components/ui/Button";
import { authService } from "../../features/auth/auth.service";
import { useAuthStore } from "../../features/auth/auth.store";
import { getRoleLabel, isLecturerRole } from "../../features/auth/role";
import logo from "./school-logo.png";

type AdminSidebarProps = {
  isCollapsed: boolean;
  isOpen: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
};

export default function AdminSidebar({
  isCollapsed,
  isOpen,
  onClose,
  onToggleCollapse,
}: AdminSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const clearSession = useAuthStore((state) => state.clearSession);
  const user = useAuthStore((state) => state.user);
  const navItems = getNavigationItemsForRole(user?.vaiTro);
  const isLecturer = isLecturerRole(user?.vaiTro);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const activeGroups = navItems.reduce<Record<string, boolean>>((groups, item) => {
      const hasActiveChild = item.children?.some((child) =>
        location.pathname.startsWith(child.to),
      );

      if (hasActiveChild) {
        groups[item.to] = true;
      }

      return groups;
    }, {});

    if (Object.keys(activeGroups).length > 0) {
      setOpenGroups((current) => ({ ...current, ...activeGroups }));
    }
  }, [location.pathname, navItems]);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } finally {
      clearSession();
      navigate("/auth/login", { replace: true });
    }
  };

  const toggleGroup = (to: string) => {
    setOpenGroups((current) => ({
      ...current,
      [to]: !current[to],
    }));
  };

  return (
    <>
      {isOpen ? (
        <button
          type="button"
          aria-label="Đóng menu"
          className="fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      ) : null}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-40 flex flex-col border-r border-white/10 bg-brand-950 text-white shadow-xl transition-all duration-200 lg:translate-x-0 lg:shadow-none",
          isCollapsed ? "w-[88px]" : "w-72",
          isOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
        aria-label="Điều hướng quản trị"
      >
        <button
          type="button"
          aria-label={isCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
          className="absolute -right-4 top-1/2 hidden size-8 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-500 shadow-sm transition hover:bg-white hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-950 lg:flex"
          onClick={onToggleCollapse}
        >
          {isCollapsed ? (
            <ChevronRight size={16} aria-hidden="true" />
          ) : (
            <ChevronLeft size={16} aria-hidden="true" />
          )}
        </button>

        <div
          className={[
            "flex h-20 items-center border-b border-white/10 px-4",
            isCollapsed ? "justify-center" : "justify-between",
          ].join(" ")}
        >
          <div
            className={[
              "flex items-center",
              isCollapsed ? "justify-center" : "gap-3",
            ].join(" ")}
          >
            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-white p-1 shadow-sm">
              <img
                src={logo}
                alt="Logo Trường Đại học Sư phạm Kỹ thuật Hưng Yên"
                className="h-full w-full object-contain"
              />
            </div>
            {isCollapsed ? null : (
              <div>
                <p className="text-base font-extrabold">{APP_NAME}</p>
                <p className="text-xs font-medium text-blue-100">
                  {isLecturer ? "Không gian giảng viên" : "Admin Center"}
                </p>
              </div>
            )}
          </div>

          {isCollapsed ? null : (
            <Button
              aria-label="Đóng menu"
              className="size-11 px-0 text-white hover:bg-white/10 hover:text-white lg:hidden"
              variant="ghost"
              onClick={onClose}
            >
              <X size={20} aria-hidden="true" />
            </Button>
          )}
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navItems.map((item) => {
            const hasChildren = Boolean(item.children?.length);
            const isGroupActive =
              hasChildren &&
              item.children!.some((child) => location.pathname.startsWith(child.to));
            const isGroupOpen = isGroupActive || openGroups[item.to];

            return (
              <div key={item.to} className="space-y-1">
                {hasChildren ? (
                  <button
                    type="button"
                    title={isCollapsed ? item.label : undefined}
                    aria-expanded={isGroupOpen}
                    className={[
                      "group flex min-h-11 w-full items-center rounded-lg text-sm font-semibold transition",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-950",
                      isCollapsed ? "justify-center px-0 py-2" : "gap-3 px-3 py-2",
                      isGroupActive
                        ? "bg-white text-brand-950 shadow-sm"
                        : "text-blue-50 hover:bg-white/10 hover:text-white active:bg-white/15",
                    ].join(" ")}
                    onClick={() => {
                      if (isCollapsed) {
                        navigate(item.to);
                        onClose();
                        return;
                      }

                      toggleGroup(item.to);
                    }}
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/10 ring-1 ring-inset ring-white/10">
                      <item.icon size={18} aria-hidden="true" />
                    </span>
                    {isCollapsed ? null : (
                      <>
                        <span className="min-w-0 flex-1 truncate text-left">
                          {item.label}
                        </span>
                        <ChevronDown
                          size={16}
                          aria-hidden="true"
                          className={[
                            "shrink-0 transition-transform",
                            isGroupOpen ? "rotate-180" : "",
                          ].join(" ")}
                        />
                      </>
                    )}
                  </button>
                ) : (
                  <NavLink
                    to={item.to}
                    title={isCollapsed ? item.label : undefined}
                    onClick={onClose}
                    className={({ isActive }) =>
                      [
                        "group flex min-h-11 items-center rounded-lg text-sm font-semibold transition",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-950",
                        isCollapsed ? "justify-center px-0 py-2" : "gap-3 px-3 py-2",
                        isActive
                          ? "bg-white text-brand-950 shadow-sm"
                          : "text-blue-50 hover:bg-white/10 hover:text-white active:bg-white/15",
                      ].join(" ")
                    }
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/10 ring-1 ring-inset ring-white/10">
                      <item.icon size={18} aria-hidden="true" />
                    </span>
                    {isCollapsed ? null : (
                      <span className="min-w-0 truncate">{item.label}</span>
                    )}
                  </NavLink>
                )}

                {hasChildren && isGroupOpen ? (
                  <div className={isCollapsed ? "space-y-1" : "space-y-1 pl-4"}>
                    {item.children!.map((child) => (
                      <NavLink
                        key={child.to}
                        to={child.to}
                        title={isCollapsed ? child.label : undefined}
                        onClick={onClose}
                        className={({ isActive }) =>
                          [
                            "group flex min-h-10 items-center rounded-lg text-sm font-semibold transition",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-950",
                            isCollapsed ? "justify-center px-0 py-2" : "gap-3 px-3 py-2",
                            isActive
                              ? "bg-white/90 text-brand-950 shadow-sm"
                              : "text-blue-100 hover:bg-white/10 hover:text-white active:bg-white/15",
                          ].join(" ")
                        }
                      >
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/10 ring-1 ring-inset ring-white/10">
                          <child.icon size={16} aria-hidden="true" />
                        </span>
                        {isCollapsed ? null : (
                          <span className="min-w-0 truncate">{child.label}</span>
                        )}
                      </NavLink>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          {isCollapsed ? null : (
            <div className="mb-3 rounded-xl border border-white/10 bg-white/10 px-3 py-2">
              <p className="truncate text-sm font-bold text-white">
                {user?.hoTen ?? "Người dùng"}
              </p>
              <p className="mt-0.5 truncate text-xs font-medium text-blue-100">
                {getRoleLabel(user?.vaiTro)}
              </p>
            </div>
          )}
          <button
            type="button"
            aria-label="Đăng xuất"
            title="Đăng xuất"
            className={[
              "flex min-h-11 w-full items-center rounded-lg text-blue-50 transition",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-950",
              "hover:bg-white/10 hover:text-white active:bg-white/15",
              isCollapsed
                ? "justify-center px-0 py-2"
                : "justify-center px-3 py-2",
            ].join(" ")}
            onClick={handleLogout}
          >
            <LogOut size={18} aria-hidden="true" />
          </button>
        </div>
      </aside>
    </>
  );
}
