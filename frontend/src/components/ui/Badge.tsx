import type { ReactNode } from "react";

export type BadgeTone = "blue" | "green" | "amber" | "red" | "slate";

type BadgeProps = {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
};

const toneClassName: Record<BadgeTone, string> = {
  blue: "bg-brand-50 text-brand-700 ring-brand-100",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  amber: "bg-amber-50 text-amber-700 ring-amber-100",
  red: "bg-red-50 text-red-700 ring-red-100",
  slate: "bg-slate-100 text-slate-700 ring-slate-200",
};

export default function Badge({
  children,
  className = "",
  tone = "slate",
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex min-h-6 items-center rounded-md px-2 py-1 text-xs font-semibold ring-1 ring-inset",
        toneClassName[tone],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
