import { z } from "zod";

const nonEmptyText = (max = 255) => z.string().trim().min(1).max(max);
const nullableText = (max = 1000) =>
  z
    .string()
    .trim()
    .max(max)
    .nullable()
    .optional();

const nullablePositiveId = z
  .union([z.coerce.number().int().positive(), z.null()])
  .optional();

export const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  keyword: z.string().trim().optional(),
});

export const curriculumIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const curriculumCourseIdParamSchema = z.object({
  entryId: z.coerce.number().int().positive(),
});

export const classProgressParamSchema = z.object({
  id: z.coerce.number().int().positive(),
  lopId: z.coerce.number().int().positive(),
});

export const progressIdParamSchema = z.object({
  tienDoId: z.coerce.number().int().positive(),
});

const curriculumBodySchema = z.object({
  maChuongTrinh: nonEmptyText(50),
  tenChuongTrinh: nonEmptyText(255),
  nganhId: z.coerce.number().int().positive(),
  chuyenNganhId: nullablePositiveId,
  khoaHocId: nullablePositiveId,
  tongTinChi: z.union([z.coerce.number().nonnegative(), z.null()]).optional(),
  trinhDoDaoTao: nullableText(100),
  hinhThucDaoTao: nullableText(100),
  trangThai: z.enum(["du_thao", "dang_ap_dung", "luu_tru"]).optional(),
  moTa: nullableText(5000),
});

const curriculumCourseBodySchema = z.object({
  hocPhanId: z.coerce.number().int().positive(),
  hocKyDuKien: z.coerce.number().int().min(1),
  tienDo: z.enum(["tien_do_1", "tien_do_2", "ca_ky"]).optional(),
  batBuoc: z.coerce.boolean().optional(),
  thuTu: z.coerce.number().int().min(0).optional(),
  ghiChu: nullableText(1000),
});

export const createCurriculumSchema = curriculumBodySchema.strict();

export const updateCurriculumSchema = curriculumBodySchema
  .partial()
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Can it nhat mot truong de cap nhat",
  });

export const createCurriculumCourseSchema = curriculumCourseBodySchema.strict();

export const updateCurriculumCourseSchema = curriculumCourseBodySchema
  .partial()
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Can it nhat mot truong de cap nhat",
  });

export const assignClassSchema = z
  .object({
    lopId: z.coerce.number().int().positive(),
    ngayApDung: z.string().trim().optional().nullable(),
    ghiChu: nullableText(1000),
  })
  .strict();

export const updateProgressSchema = z
  .object({
    trangThai: z
      .enum(["chua_hoc", "da_len_ke_hoach", "dang_hoc", "da_hoc", "tam_hoan", "da_huy"])
      .optional(),
    namHocHoanThanhId: nullablePositiveId,
    hocKyHoanThanhId: nullablePositiveId,
    ghiChu: nullableText(1000),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Can it nhat mot truong de cap nhat",
  });

export type CurriculumListQuery = z.infer<typeof listQuerySchema>;
export type CurriculumIdParam = z.infer<typeof curriculumIdParamSchema>;
export type CurriculumCourseIdParam = z.infer<typeof curriculumCourseIdParamSchema>;
export type ClassProgressParam = z.infer<typeof classProgressParamSchema>;
export type ProgressIdParam = z.infer<typeof progressIdParamSchema>;
export type CreateCurriculumInput = z.infer<typeof createCurriculumSchema>;
export type UpdateCurriculumInput = z.infer<typeof updateCurriculumSchema>;
export type CreateCurriculumCourseInput = z.infer<typeof createCurriculumCourseSchema>;
export type UpdateCurriculumCourseInput = z.infer<typeof updateCurriculumCourseSchema>;
export type AssignClassInput = z.infer<typeof assignClassSchema>;
export type UpdateProgressInput = z.infer<typeof updateProgressSchema>;
