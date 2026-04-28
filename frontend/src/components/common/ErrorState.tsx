import { AlertTriangle, RotateCcw } from "lucide-react";
import Button from "../ui/Button";

type ErrorStateProps = {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export default function ErrorState({
  actionLabel = "Thử lại",
  description = "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
  onAction,
  title = "Không tải được dữ liệu",
}: ErrorStateProps) {
  return (
    <div
      className="rounded-lg border border-red-200 bg-red-50 p-6 text-center"
      role="alert"
    >
      <div className="mx-auto flex size-12 items-center justify-center rounded-lg bg-white text-red-600 ring-1 ring-red-100">
        <AlertTriangle size={22} aria-hidden="true" />
      </div>

      <h2 className="mt-4 text-lg font-bold text-red-900">{title}</h2>

      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-red-700">
        {description}
      </p>

      {onAction ? (
        <div className="mt-5">
          <Button
            type="button"
            variant="secondary"
            leftIcon={<RotateCcw size={18} aria-hidden="true" />}
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
