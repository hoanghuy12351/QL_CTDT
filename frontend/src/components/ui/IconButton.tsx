import type { ButtonHTMLAttributes, ReactNode } from "react";
import Tooltip from "./Tooltip";

type IconButtonVariant = "default" | "danger" | "subtle";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  children: ReactNode;
  variant?: IconButtonVariant;
  tooltipSide?: "top" | "bottom";
};

const variantClassName: Record<IconButtonVariant, string> = {
  default:
    "text-brand-800 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-900",
  danger: "text-red-600 hover:border-red-200 hover:bg-red-50 hover:text-red-700",
  subtle:
    "text-slate-500 hover:border-slate-200 hover:bg-slate-100 hover:text-slate-900",
};

export default function IconButton({
  children,
  className = "",
  disabled,
  label,
  tooltipSide = "top",
  type = "button",
  variant = "default",
  ...props
}: IconButtonProps) {
  return (
    <Tooltip label={label} side={tooltipSide}>
      <button
        type={type}
        disabled={disabled}
        aria-label={label}
        className={[
          "inline-flex size-9 shrink-0 items-center justify-center rounded-md border border-transparent transition",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-45",
          variantClassName[variant],
          className,
        ].join(" ")}
        {...props}
      >
        {children}
      </button>
    </Tooltip>
  );
}
