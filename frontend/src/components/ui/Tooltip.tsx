import type { ReactNode } from "react";

type TooltipProps = {
  label: string;
  children: ReactNode;
  side?: "top" | "bottom";
};

export default function Tooltip({
  children,
  label,
  side = "top",
}: TooltipProps) {
  return (
    <span className="group relative inline-flex">
      {children}

      <span
        role="tooltip"
        className={[
          "pointer-events-none absolute left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-950 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition",
          "group-hover:opacity-100 group-focus-within:opacity-100",
          side === "top" ? "bottom-full mb-2" : "top-full mt-2",
        ].join(" ")}
      >
        {label}
      </span>
    </span>
  );
}
