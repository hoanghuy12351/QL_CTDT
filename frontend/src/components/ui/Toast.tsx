import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

type ToastProps = {
  type: ToastType;
  message: string;
  onClose: () => void;
};

const toastConfig: Record<
  ToastType,
  {
    title: string;
    borderClass: string;
    iconBoxClass: string;
    icon: typeof CheckCircle2;
  }
> = {
  success: {
    title: "Thành công",
    borderClass: "border-emerald-200",
    iconBoxClass: "bg-emerald-50 text-emerald-600",
    icon: CheckCircle2,
  },
  error: {
    title: "Có lỗi xảy ra",
    borderClass: "border-red-200",
    iconBoxClass: "bg-red-50 text-red-600",
    icon: XCircle,
  },
  info: {
    title: "Thông tin",
    borderClass: "border-sky-200",
    iconBoxClass: "bg-sky-50 text-sky-600",
    icon: Info,
  },
  warning: {
    title: "Cảnh báo",
    borderClass: "border-amber-200",
    iconBoxClass: "bg-amber-50 text-amber-600",
    icon: AlertTriangle,
  },
};

export default function Toast({ message, onClose, type }: ToastProps) {
  const config = toastConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={[
        "fixed right-5 top-5 z-[70] flex w-[360px] max-w-[calc(100vw-40px)] items-start gap-3 rounded-lg border bg-white p-4 shadow-2xl",
        config.borderClass,
      ].join(" ")}
      role="status"
    >
      <div
        className={[
          "flex size-10 shrink-0 items-center justify-center rounded-lg",
          config.iconBoxClass,
        ].join(" ")}
      >
        <Icon size={20} aria-hidden="true" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-slate-950">{config.title}</p>
        <p className="mt-1 text-sm leading-5 text-slate-600">{message}</p>
      </div>

      <button
        type="button"
        aria-label="Đóng thông báo"
        className="flex size-8 shrink-0 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        onClick={onClose}
      >
        <X size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
