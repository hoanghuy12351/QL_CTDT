import { LoaderCircle } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  leftIcon?: ReactNode;
  variant?: ButtonVariant;
  isLoading?: boolean;
};

const variantClassName: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-700 text-white shadow-sm hover:bg-brand-800 active:bg-brand-900",
  secondary:
    "border border-slate-200 bg-white text-slate-800 shadow-sm hover:border-brand-200 hover:bg-brand-50 hover:text-brand-800 active:bg-brand-100",
  ghost:
    "text-slate-600 hover:bg-brand-50 hover:text-brand-800 active:bg-brand-100",
  danger: "bg-red-600 text-white shadow-sm hover:bg-red-700 active:bg-red-800",
};

export default function Button({
  children,
  className = "",
  disabled,
  isLoading = false,
  leftIcon,
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={isLoading}
      className={[
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variantClassName[variant],
        className,
      ].join(" ")}
      {...props}
    >
      {isLoading ? (
        <LoaderCircle size={16} className="animate-spin" aria-hidden="true" />
      ) : (
        leftIcon
      )}
      <span>{isLoading ? "Đang xử lý..." : children}</span>
    </button>
  );
}
