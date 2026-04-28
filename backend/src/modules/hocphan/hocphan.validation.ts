import { z } from "zod";

const loaiHocPhanSchema = z.enum([
  "dai_cuong",
  "co_so_nganh",
  "chuyen_nganh",
  "do_an",
  "thuc_tap",
  "tot_nghiep",
  "khac",
]);

const baseHocPhanSchema = z.object({
  maHocPhan: z.string().trim().min(1).max(50),
  tenHocPhan: z.string().trim().min(1).max(255),
  soTinChi: z.coerce.number().min(0),
  soTietLyThuyet: z.coerce.number().int().min(0),
  soTietThucHanh: z.coerce.number().int().min(0),
  tongSoTiet: z.coerce.number().int().min(0).optional(),
  loaiHocPhan: loaiHocPhanSchema.optional(),
  boMonId: z.coerce.number().int().positive().optional(),
  moTa: z.string().trim().max(65535).optional(),
});

export const listHocPhanQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  keyword: z.string().trim().optional(),
});

export const hocPhanIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createHocPhanSchema = baseHocPhanSchema;

export const updateHocPhanSchema = baseHocPhanSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  "Can truyen it nhat mot truong de cap nhat",
);

export type HocPhanListQuery = z.infer<typeof listHocPhanQuerySchema>;
export type HocPhanCreateInput = z.infer<typeof createHocPhanSchema>;
export type HocPhanUpdateInput = z.infer<typeof updateHocPhanSchema>;

