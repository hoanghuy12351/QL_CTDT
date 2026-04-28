import type { ReactNode } from "react";
import { Loader2, RotateCcw, Search, X } from "lucide-react";
import IconButton from "../../ui/IconButton";

type AdminCrudToolbarProps = {
  keyword: string;
  searchPlaceholder?: string;
  isSearching?: boolean;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
  onKeywordChange: (value: string) => void;
  onSearch?: () => void;
  onReset?: () => void;
};

export default function AdminCrudToolbar({
  isSearching = false,
  keyword,
  leftSlot,
  onKeywordChange,
  onReset,
  rightSlot,
  searchPlaceholder = "Tìm kiếm...",
}: AdminCrudToolbarProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-2">{leftSlot}</div>

        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-end">
          {rightSlot}

          <div className="flex w-full items-center gap-2 md:w-auto">
            <div className="flex size-5 shrink-0 items-center justify-center">
              {isSearching ? (
                <Loader2
                  size={18}
                  aria-hidden="true"
                  className="animate-spin text-brand-700"
                />
              ) : null}
            </div>

            <div className="relative w-full md:w-[360px]">
              <Search
                size={16}
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                className="h-10 w-full rounded-md border border-slate-200 bg-white pl-9 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                placeholder={searchPlaceholder}
                value={keyword}
                onChange={(event) => onKeywordChange(event.target.value)}
              />

              {keyword ? (
                <button
                  type="button"
                  aria-label="Xóa nội dung tìm kiếm"
                  className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  onClick={() => onKeywordChange("")}
                >
                  <X size={15} aria-hidden="true" />
                </button>
              ) : null}
            </div>
          </div>

          {onReset ? (
            <IconButton
              label="Đặt lại bộ lọc"
              variant="subtle"
              disabled={isSearching}
              className="h-10 w-full md:w-10"
              onClick={onReset}
            >
              <RotateCcw size={16} aria-hidden="true" />
            </IconButton>
          ) : null}
        </div>
      </div>
    </div>
  );
}
