export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};

export type PaginatedResponse<T> = {
  items: T[];
  pagination: PaginationMeta;
};

export type ApiErrorResponse = {
  success?: boolean;
  message?: string;
  errors?: unknown[];
};

export const getApiErrorMessage = (
  error: unknown,
  fallback = "Khong the thuc hien thao tac",
) => {
  if (error && typeof error === "object" && "response" in error) {
    const response = (
      error as {
        response?: {
          data?: ApiErrorResponse;
        };
      }
    ).response;

    return response?.data?.message ?? fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};
