import { z } from "zod";

export const userRoleSchema = z.enum(["quan_tri", "giang_vien"]);
export const userStatusSchema = z.enum(["hoat_dong", "tam_khoa", "bi_khoa"]);

export const listUsersQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  keyword: z.string().trim().optional(),
  vaiTro: userRoleSchema.optional(),
  trangThai: userStatusSchema.optional(),
});

export const createUserSchema = z.object({
  email: z.string().trim().toLowerCase().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
  hoTen: z.string().trim().min(2, "Họ tên không được để trống"),
  vaiTro: userRoleSchema,
  trangThai: userStatusSchema.optional(),
  giangVienId: z.number().int().positive().optional(),
});

export const updateUserSchema = z.object({
  email: z.string().trim().toLowerCase().email("Email không hợp lệ").optional(),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự").optional(),
  hoTen: z.string().trim().min(2, "Họ tên không được để trống").optional(),
  vaiTro: userRoleSchema.optional(),
  trangThai: userStatusSchema.optional(),
  giangVienId: z.number().int().positive().nullable().optional(),
});

export const userIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserIdParam = z.infer<typeof userIdParamSchema>;
