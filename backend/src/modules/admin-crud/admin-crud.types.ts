export type AdminResourceConfig = {
  resource: string;
  modelKey: string;
  idField: string;
  searchFields: string[];
  defaultOrderBy?: Record<string, "asc" | "desc">;
  include?: Record<string, unknown>;
};

export type AdminListQuery = {
  page: number;
  limit: number;
  keyword?: string;
};
