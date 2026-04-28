import { AlertTriangle } from "lucide-react";
import Button from "../../ui/Button";

type ConfirmDeleteDialogProps = {
  isOpen: boolean;
  title?: string;
  description?: string;
  itemName?: string;
  isDeleting?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmDeleteDialog({
  description,
  isDeleting = false,
  isOpen,
  itemName,
  onCancel,
  onConfirm,
  title = "Xác nhận xóa dữ liệu",
}: ConfirmDeleteDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/45 px-4 py-4 backdrop-blur-sm sm:items-center">
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-delete-title"
      >
        <div className="px-5 py-5">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 ring-1 ring-red-100">
              <AlertTriangle size={22} aria-hidden="true" />
            </div>

            <div>
              <h2
                id="confirm-delete-title"
                className="text-lg font-bold text-slate-950"
              >
                {title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {description ??
                  `Bạn có chắc chắn muốn xóa${
                    itemName ? ` "${itemName}"` : " bản ghi này"
                  } không? Hành động này không thể hoàn tác.`}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            disabled={isDeleting}
            onClick={onCancel}
          >
            Hủy
          </Button>

          <Button
            type="button"
            variant="danger"
            isLoading={isDeleting}
            onClick={onConfirm}
          >
            Xóa
          </Button>
        </div>
      </div>
    </div>
  );
}
