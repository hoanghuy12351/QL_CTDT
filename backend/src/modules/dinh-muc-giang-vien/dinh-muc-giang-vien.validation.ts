import { z } from "zod";

export const loaiDinhMucValues = [
  "giang_vien_thuong",
  "truong_bo_mon",
  "pho_truong_bo_mon",
  "tro_giang",
] as const;

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const listDinhMucQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(500).optional().default(20),
  keyword: z.string().trim().optional(),
  namHocId: z.coerce.number().int().positive().optional(),
  boMonId: z.coerce.number().int().positive().optional(),
});

const bodySchema = z.object({
  giangVienId: z.coerce.number().int().positive(),
  namHocId: z.coerce.number().int().positive(),
  loaiDinhMuc: z.enum(loaiDinhMucValues).default("giang_vien_thuong"),
  gioTieuChuan: z.coerce.number().nonnegative().default(270),
  ghiChu: z.string().trim().max(1000).optional().nullable(),
});

export const createDinhMucSchema = bodySchema.strict();

export const updateDinhMucSchema = bodySchema
  .partial()
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Can it nhat mot truong de cap nhat",
  });

export const generateDinhMucSchema = z
  .object({
    namHocId: z.coerce.number().int().positive(),
    gioTieuChuanMacDinh: z.coerce.number().nonnegative().default(270),
    boMonId: z.coerce.number().int().positive().optional(),
  })
  .strict();

export type ListDinhMucQuery = z.infer<typeof listDinhMucQuerySchema>;
export type CreateDinhMucInput = z.infer<typeof createDinhMucSchema>;
export type UpdateDinhMucInput = z.infer<typeof updateDinhMucSchema>;
export type GenerateDinhMucInput = z.infer<typeof generateDinhMucSchema>;
export type LoaiDinhMuc = (typeof loaiDinhMucValues)[number];
