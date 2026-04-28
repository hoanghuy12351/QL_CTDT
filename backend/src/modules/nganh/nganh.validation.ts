import { z } from "zod";

const nonEmptyText = (max = 255) => z.string().trim().min(1).max(max);

const nganhBodySchema = z.object({
  khoaId: z.coerce.number().int().positive(),
  maNganh: nonEmptyText(50),
  tenNganh: nonEmptyText(),
});

export const nganhIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createNganhSchema = nganhBodySchema.strict();

export const updateNganhSchema = nganhBodySchema
  .partial()
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Can it nhat mot truong de cap nhat",
  });
