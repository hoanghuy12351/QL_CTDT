import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../features/auth/auth.store";
import { getHomePathByRole } from "../../features/auth/role";

export default function HomeRedirect() {
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);

  if (!accessToken || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Navigate to={getHomePathByRole(user.vaiTro)} replace />;
}
