import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import TextInput from "../../components/ui/TextInput";
import { authService } from "../../features/auth/auth.service";
import { useAuthStore } from "../../features/auth/auth.store";

const getErrorMessage = (error: unknown) => {
  if (error && typeof error === "object" && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } })
      .response;
    return response?.data?.message ?? "Dang nhap that bai";
  }

  return "Dang nhap that bai";
};

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: string } | null)?.from ?? "/admin/dashboard";

  const setSession = useAuthStore((state) => state.setSession);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await authService.login({ email, password });
      setSession(result.user, result.token);
      navigate(from, { replace: true });
    } catch (loginError) {
      setError(getErrorMessage(loginError));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-brand-600 text-sm font-bold text-white">
          CT
        </div>
        <h1 className="mt-4 text-2xl font-bold text-slate-950">Dang nhap</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Truy cap trang quan tri chuong trinh dao tao va ke hoach dao tao.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <TextInput
          disabled={isLoading}
          label="Email"
          name="email"
          placeholder="giaovu@utehy.edu.vn"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <TextInput
          disabled={isLoading}
          label="Mat khau"
          name="password"
          placeholder="Nhap mat khau"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {error ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}
        <Button className="w-full" isLoading={isLoading} type="submit">
          Dang nhap
        </Button>
      </form>
    </section>
  );
}
