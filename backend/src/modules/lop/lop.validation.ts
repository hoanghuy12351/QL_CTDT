import { z } from "zod";

const optionalId = z.coerce.number().int().positive().nullable().optional();
const nonEmptyText = (max = 255) => z.string().trim().min(1).max(max);
const optionalText = (max = 255) => z.string().trim().max(max).nullable().optional();
const optionalMonthYear = z
  .string()
  .trim()
  .regex(/^(0[1-9]|1[0-2])\/\d{4}$/, "Dinh dang phai la MM/YYYY")
  .nullable()
  .optional();

const lopBodySchema = z.object({
  maLop: nonEmptyText(50),
  tenLop: nonEmptyText(),
  khoaHocId: z.coerce.number().int().positive(),
  nganhId: z.coerce.number().int().positive(),
  chuyenNganhId: optionalId,
  coSoId: optionalId,
  heDaoTao: optionalText(100),
  siSo: z.coerce.number().int().nonnegative().optional(),
  thoiGianNhapHoc: optionalMonthYear,
  thoiGianTotNghiep: optionalMonthYear,
  trangThai: z.enum(["dang_hoc", "da_tot_nghiep", "tam_ngung"]).optional(),
  ghiChu: optionalText(1000),
});

export const lopIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createLopSchema = lopBodySchema.strict();

export const updateLopSchema = lopBodySchema
  .partial()
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Can it nhat mot truong de cap nhat",
  });
