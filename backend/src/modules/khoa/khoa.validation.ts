import { z } from "zod";

const nonEmptyText = (max = 255) => z.string().trim().min(1).max(max);

const khoaBodySchema = z.object({
  maKhoa: nonEmptyText(50),
  tenKhoa: nonEmptyText(),
});

export const khoaIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createKhoaSchema = khoaBodySchema.strict();

export const updateKhoaSchema = khoaBodySchema
  .partial()
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Can it nhat mot truong de cap nhat",
  });
