export const toInt = (value: string | number) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : NaN;
};

export const pickDefined = <T extends Record<string, unknown>>(data: T) => {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined),
  ) as Partial<T>;
};
