import { z } from "zod";

const optionalId = z.coerce.number().int().positive().nullable().optional();
const nonEmptyText = (max = 255) => z.string().trim().min(1).max(max);
const optionalText = (max = 255) => z.string().trim().max(max).nullable().optional();

const giangVienBodySchema = z.object({
  nguoiDungId: optionalId,
  boMonId: optionalId,
  maGiangVien: optionalText(50),
  hoTen: nonEmptyText(),
  email: z.string().trim().email().max(255).nullable().optional(),
  soDienThoai: optionalText(20),
  hocVi: optionalText(50),
  chucDanh: optionalText(100),
  dinhMucGio: z.coerce.number().nonnegative().nullable().optional(),
  trangThai: z.enum(["dang_giang_day", "tam_nghi"]).optional(),
});

export const giangVienIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createGiangVienSchema = giangVienBodySchema.strict();

export const updateGiangVienSchema = giangVienBodySchema
  .partial()
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Can it nhat mot truong de cap nhat",
  });
