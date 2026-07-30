import { useEffect, useState, type ReactNode } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { authService } from "../../features/auth/auth.service";
import { useAuthStore } from "../../features/auth/auth.store";
import { getHomePathByRole, isLecturerRole } from "../../features/auth/role";

type RequireLecturerProps = {
  children: ReactNode;
};

export function RequireLecturer({ children }: RequireLecturerProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);

  const [isChecking, setIsChecking] = useState(Boolean(accessToken));

  useEffect(() => {
    if (!accessToken) {
      setIsChecking(false);
      return;
    }

    let isMounted = true;

    const checkCurrentUser = async () => {
      setIsChecking(true);

      try {
        const currentUser = await authService.me();

        if (!isMounted) return;

        if (currentUser.trangThai !== "hoat_dong") {
          clearSession();
          navigate("/auth/login", { replace: true });
          return;
        }

        setSession(currentUser, accessToken);

        if (!isLecturerRole(currentUser.vaiTro)) {
          navigate(getHomePathByRole(currentUser.vaiTro), { replace: true });
          return;
        }
      } catch {
        if (!isMounted) return;

        clearSession();
        navigate("/auth/login", { replace: true });
      } finally {
        if (isMounted) {
          setIsChecking(false);
        }
      }
    };

    void checkCurrentUser();

    return () => {
      isMounted = false;
    };
  }, [accessToken, clearSession, navigate, setSession]);

  if (!accessToken || !user) {
    return (
      <Navigate to="/auth/login" replace state={{ from: location.pathname }} />
    );
  }

  if (user.trangThai !== "hoat_dong") {
    return <Navigate to="/auth/login" replace />;
  }

  if (!isLecturerRole(user.vaiTro)) {
    return <Navigate to={getHomePathByRole(user.vaiTro)} replace />;
  }

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas px-4 text-center">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-950">
            Đang kiểm tra phiên đăng nhập...
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Vui lòng chờ trong giây lát.
          </p>
        </div>
      </div>
    );
  }

  return children;
}
