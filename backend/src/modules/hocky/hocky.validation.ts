import { z } from "zod";

const nonEmptyText = (max = 255) => z.string().trim().min(1).max(max);
const optionalDate = z.coerce.date().nullable().optional();

const hocKyBodySchema = z.object({
  namHocId: z.coerce.number().int().positive(),
  maHocKy: nonEmptyText(20),
  tenHocKy: nonEmptyText(100),
  ngayBatDau: optionalDate,
  ngayKetThuc: optionalDate,
  trangThai: z.enum(["du_thao", "dang_ap_dung", "da_dong"]).optional(),
});

export const hocKyIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createHocKySchema = hocKyBodySchema.strict();

export const updateHocKySchema = hocKyBodySchema
  .partial()
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Can it nhat mot truong de cap nhat",
  });
