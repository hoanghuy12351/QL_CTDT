import { z } from "zod";

const nonEmptyText = (max = 255) => z.string().trim().min(1).max(max);
const optionalDate = z.coerce.date().nullable().optional();

const namHocBodySchema = z.object({
  maNamHoc: nonEmptyText(20),
  ngayBatDau: optionalDate,
  ngayKetThuc: optionalDate,
  trangThai: z.enum(["du_thao", "dang_ap_dung", "da_dong"]).optional(),
});

export const namHocIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createNamHocSchema = namHocBodySchema.strict();

export const updateNamHocSchema = namHocBodySchema
  .partial()
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Can it nhat mot truong de cap nhat",
  });
