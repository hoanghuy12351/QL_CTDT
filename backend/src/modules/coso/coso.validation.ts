import { z } from "zod";

const nonEmptyText = (max = 255) => z.string().trim().min(1).max(max);
const optionalText = (max = 255) =>
  z.string().trim().max(max).nullable().optional();

const coSoBodySchema = z.object({
  maCoSo: nonEmptyText(50),
  tenCoSo: nonEmptyText(),
  diaChi: optionalText(255),
});

export const coSoIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createCoSoSchema = coSoBodySchema.strict();

export const updateCoSoSchema = coSoBodySchema
  .partial()
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Can it nhat mot truong de cap nhat",
  });
