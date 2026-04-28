import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useMemo } from "react";
import type { PaginationMeta } from "../../../types/api.types";
import IconButton from "../../ui/IconButton";

type AdminCrudPaginationProps = {
  pagination: PaginationMeta;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
};

const limitOptions = [10, 20, 50];

const getPageItems = (currentPage: number, totalPages: number) => {
  const pages = new Set([1, totalPages, currentPage]);

  if (currentPage > 1) pages.add(currentPage - 1);
  if (currentPage < totalPages) pages.add(currentPage + 1);

  return Array.from(pages)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);
};

export default function AdminCrudPagination({
  isLoading = false,
  onLimitChange,
  onPageChange,
  pagination,
}: AdminCrudPaginationProps) {
  const currentPage = Math.min(
    Math.max(pagination.page, 1),
    Math.max(pagination.totalPages, 1),
  );
  const totalPages = Math.max(pagination.totalPages, 1);
  const totalItems = Math.max(pagination.totalItems, 0);
  const startItem =
    totalItems === 0 ? 0 : (currentPage - 1) * pagination.limit + 1;
  const endItem = Math.min(currentPage * pagination.limit, totalItems);

  const pageItems = useMemo(
    () => getPageItems(currentPage, totalPages),
    [currentPage, totalPages],
  );

  const canPrevious = currentPage > 1;
  const canNext = currentPage < totalPages;

  return (
    <div className="mt-3 rounded-lg border border-slate-200 bg-white px-3 py-3 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="text-sm text-slate-600">
          Hiển thị{" "}
          <span className="font-semibold text-slate-900">
            {startItem}-{endItem}
          </span>{" "}
          trên{" "}
          <span className="font-semibold text-slate-900">{totalItems}</span>{" "}
          bản ghi
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          {onLimitChange ? (
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <span>Số dòng</span>
              <select
                value={pagination.limit}
                disabled={isLoading}
                className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition hover:border-slate-300 focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                onChange={(event) => onLimitChange(Number(event.target.value))}
              >
                {limitOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          <div className="flex items-center justify-end gap-1">
            <IconButton
              label="Trang đầu"
              variant="subtle"
              disabled={!canPrevious || isLoading}
              onClick={() => onPageChange(1)}
            >
              <ChevronsLeft size={17} aria-hidden="true" />
            </IconButton>

            <IconButton
              label="Trang trước"
              variant="subtle"
              disabled={!canPrevious || isLoading}
              onClick={() => onPageChange(currentPage - 1)}
            >
              <ChevronLeft size={17} aria-hidden="true" />
            </IconButton>

            {pageItems.map((pageNumber, index) => {
              const previousPage = pageItems[index - 1];
              const hasGap = previousPage && pageNumber - previousPage > 1;

              return (
                <span key={pageNumber} className="flex items-center gap-1">
                  {hasGap ? (
                    <span className="px-1 text-sm text-slate-400">...</span>
                  ) : null}
                  <button
                    type="button"
                    disabled={isLoading || pageNumber === currentPage}
                    className={[
                      "inline-flex size-9 items-center justify-center rounded-md text-sm font-semibold transition",
                      pageNumber === currentPage
                        ? "bg-brand-700 text-white"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                      "disabled:cursor-default disabled:opacity-100",
                    ].join(" ")}
                    onClick={() => onPageChange(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                </span>
              );
            })}

            <IconButton
              label="Trang sau"
              variant="subtle"
              disabled={!canNext || isLoading}
              onClick={() => onPageChange(currentPage + 1)}
            >
              <ChevronRight size={17} aria-hidden="true" />
            </IconButton>

            <IconButton
              label="Trang cuối"
              variant="subtle"
              disabled={!canNext || isLoading}
              onClick={() => onPageChange(totalPages)}
            >
              <ChevronsRight size={17} aria-hidden="true" />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
}
