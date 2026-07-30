import { z } from "zod";
import { MAX_PAGE_SIZE } from "../../common/helpers/pagination.js";

const accountStatusValues = ["hoat_dong", "tam_khoa", "bi_khoa"] as const;

export const lecturerAccountListQuerySchema = z.object({
  page: z.coerce.number().int().positive().max(MAX_PAGE_SIZE).optional(),
  limit: z.coerce.number().int().positive().max(MAX_PAGE_SIZE).optional(),
  keyword: z.string().trim().optional(),
});

export const lecturerAccountIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createLecturerAccountSchema = z
  .object({
    giangVienId: z.coerce.number().int().positive(),
    email: z.string().trim().email("Email khong hop le").max(100),
    password: z.string().min(6, "Mat khau toi thieu 6 ky tu").max(72),
    trangThai: z.enum(accountStatusValues).optional(),
  })
  .strict();

export const updateLecturerAccountSchema = z
  .object({
    email: z.string().trim().email("Email khong hop le").max(100).optional(),
    password: z
      .string()
      .trim()
      .transform((value) => (value === "" ? undefined : value))
      .pipe(z.string().min(6, "Mat khau toi thieu 6 ky tu").max(72).optional())
      .optional(),
    trangThai: z.enum(accountStatusValues).optional(),
  })
  .strict();

export type LecturerAccountListQuery = z.infer<typeof lecturerAccountListQuerySchema>;
export type LecturerAccountIdParam = z.infer<typeof lecturerAccountIdParamSchema>;
export type CreateLecturerAccountInput = z.infer<typeof createLecturerAccountSchema>;
export type UpdateLecturerAccountInput = z.infer<typeof updateLecturerAccountSchema>;
