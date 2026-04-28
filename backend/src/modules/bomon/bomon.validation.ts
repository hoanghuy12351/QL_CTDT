import { z } from "zod";

const nonEmptyText = (max = 255) => z.string().trim().min(1).max(max);

const boMonBodySchema = z.object({
  khoaId: z.coerce.number().int().positive(),
  maBoMon: nonEmptyText(50),
  tenBoMon: nonEmptyText(),
});

export const boMonIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createBoMonSchema = boMonBodySchema.strict();

export const updateBoMonSchema = boMonBodySchema
  .partial()
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Can it nhat mot truong de cap nhat",
  });
