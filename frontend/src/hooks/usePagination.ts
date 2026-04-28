import { useCallback, useState } from "react";

type UsePaginationOptions = {
  initialPage?: number;
  initialLimit?: number;
};

export function usePagination(options: UsePaginationOptions = {}) {
  const [page, setPage] = useState(options.initialPage ?? 1);
  const [limit, setLimitState] = useState(options.initialLimit ?? 10);

  const nextPage = useCallback(() => {
    setPage((current) => current + 1);
  }, []);

  const previousPage = useCallback(() => {
    setPage((current) => Math.max(current - 1, 1));
  }, []);

  const resetPage = useCallback(() => {
    setPage(1);
  }, []);

  const setLimit = useCallback((nextLimit: number) => {
    setLimitState(nextLimit);
    setPage(1);
  }, []);

  return {
    page,
    limit,
    setPage,
    setLimit,
    nextPage,
    previousPage,
    resetPage,
  };
}
