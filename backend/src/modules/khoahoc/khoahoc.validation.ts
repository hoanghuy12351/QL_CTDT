import { z } from "zod";

const nonEmptyText = (max = 255) => z.string().trim().min(1).max(max);

const khoaHocBodySchema = z.object({
  maKhoaHoc: nonEmptyText(50),
  tenKhoaHoc: nonEmptyText(100),
  namBatDau: z.coerce.number().int(),
  namKetThuc: z.coerce.number().int(),
});

export const khoaHocIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createKhoaHocSchema = khoaHocBodySchema.strict();

export const updateKhoaHocSchema = khoaHocBodySchema
  .partial()
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Can it nhat mot truong de cap nhat",
  });
