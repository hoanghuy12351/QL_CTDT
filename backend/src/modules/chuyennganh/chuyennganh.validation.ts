import { z } from "zod";

const nonEmptyText = (max = 255) => z.string().trim().min(1).max(max);
const optionalText = (max = 255) => z.string().trim().max(max).nullable().optional();

const chuyenNganhBodySchema = z.object({
  nganhId: z.coerce.number().int().positive(),
  maChuyenNganh: optionalText(50),
  tenChuyenNganh: nonEmptyText(),
});

export const chuyenNganhIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createChuyenNganhSchema = chuyenNganhBodySchema.strict();

export const updateChuyenNganhSchema = chuyenNganhBodySchema
  .partial()
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Can it nhat mot truong de cap nhat",
  });
