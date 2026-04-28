import { CheckCircle2, XCircle, X } from "lucide-react";

export type ToastType = "success" | "error";

type ToastProps = {
  type: ToastType;
  message: string;
  onClose: () => void;
};

export default function Toast({ message, onClose, type }: ToastProps) {
  const isSuccess = type === "success";

  return (
    <div
      className={[
        "fixed right-5 top-5 z-[70] flex w-[360px] max-w-[calc(100vw-40px)] items-start gap-3 rounded-lg border bg-white p-4 shadow-2xl",
        isSuccess ? "border-emerald-200" : "border-red-200",
      ].join(" ")}
      role="status"
    >
      <div
        className={[
          "flex size-10 shrink-0 items-center justify-center rounded-lg",
          isSuccess
            ? "bg-emerald-50 text-emerald-600"
            : "bg-red-50 text-red-600",
        ].join(" ")}
      >
        {isSuccess ? (
          <CheckCircle2 size={20} aria-hidden="true" />
        ) : (
          <XCircle size={20} aria-hidden="true" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-slate-950">
          {isSuccess ? "Thành công" : "Có lỗi xảy ra"}
        </p>
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
