import { z } from "zod";

const optionalText = (max = 255) => z.string().trim().max(max).nullable().optional();
const booleanInput = z.preprocess((value) => {
  if (typeof value === "string") {
    if (value === "true") return true;
    if (value === "false") return false;
  }

  return value;
}, z.boolean());

const giangVienHocPhanBodySchema = z.object({
  giangVienId: z.coerce.number().int().positive(),
  hocPhanId: z.coerce.number().int().positive(),
  coTheDayLyThuyet: booleanInput.optional(),
  coTheDayThucHanh: booleanInput.optional(),
  mucDoUuTien: z.coerce.number().int().min(1).max(3).nullable().optional(),
  ghiChu: optionalText(1000),
});

export const giangVienHocPhanIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createGiangVienHocPhanSchema = giangVienHocPhanBodySchema.strict();

export const updateGiangVienHocPhanSchema = giangVienHocPhanBodySchema
  .partial()
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Can it nhat mot truong de cap nhat",
  });
