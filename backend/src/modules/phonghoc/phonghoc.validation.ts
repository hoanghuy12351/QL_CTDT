import { z } from "zod";

const nonEmptyText = (max = 255) => z.string().trim().min(1).max(max);
const optionalText = (max = 255) =>
  z.string().trim().max(max).nullable().optional();

const phongHocBodySchema = z.object({
  coSoId: z.coerce.number().int().positive(),
  maPhong: nonEmptyText(50),
  tenPhong: optionalText(100),
  sucChua: z.coerce.number().int().nonnegative().nullable().optional(),
  loaiPhong: z
    .enum(["ly_thuyet", "thuc_hanh", "lab", "do_an", "online"])
    .optional(),
});

export const phongHocIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createPhongHocSchema = phongHocBodySchema.strict();

export const updatePhongHocSchema = phongHocBodySchema
  .partial()
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Can it nhat mot truong de cap nhat",
  });
