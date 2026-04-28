import { useCallback, useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const openSidebar = useCallback(() => setIsSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);
  const toggleSidebarCollapsed = useCallback(
    () => setIsSidebarCollapsed((current) => !current),
    [],
  );

  return (
    <div className="min-h-screen bg-canvas text-slate-950">
      <AdminSidebar
        isCollapsed={isSidebarCollapsed}
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        onToggleCollapse={toggleSidebarCollapsed}
      />
      <div
        className={[
          "min-h-screen transition-all duration-200",
          isSidebarCollapsed ? "lg:pl-[88px]" : "lg:pl-72",
        ].join(" ")}
      >
        <AdminTopbar onOpenSidebar={openSidebar} />
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
