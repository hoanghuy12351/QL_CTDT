export const serializeValue = (value: unknown): unknown => {
  if (typeof value === "bigint") return value.toString();

  if (value instanceof Date) return value.toISOString();

  if (Array.isArray(value)) {
    return value.map((item) => serializeValue(item));
  }

  if (value && typeof value === "object") {
    if ("toNumber" in value && typeof value.toNumber === "function") {
      return value.toNumber();
    }

    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [
        key,
        serializeValue(item),
      ]),
    );
  }

  return value;
};

export const serializeData = <T>(data: T): T => {
  return serializeValue(data) as T;
};
