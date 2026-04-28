import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import Button from "../../ui/Button";

type FormModalProps = {
  isOpen: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
};

export default function FormModal({
  children,
  description,
  footer,
  isOpen,
  onClose,
  title,
}: FormModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-6 backdrop-blur-sm">
      <div
        className="flex max-h-[86vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="form-modal-title"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div className="min-w-0">
            <h2
              id="form-modal-title"
              className="text-center text-xl font-extrabold tracking-tight text-slate-950 sm:text-left"
            >
              {title}
            </h2>

            {description ? (
              <p className="mt-1 text-sm leading-6 text-slate-500">
                {description}
              </p>
            ) : null}
          </div>

          <Button
            type="button"
            variant="ghost"
            className="size-10 shrink-0 px-0"
            aria-label="Đóng form"
            onClick={onClose}
          >
            <X size={20} aria-hidden="true" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>

        {footer ? (
          <div className="border-t border-slate-100 bg-slate-50 px-6 py-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
