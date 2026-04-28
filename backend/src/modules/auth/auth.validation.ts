import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email("Email khong hop le"),
  password: z.string().min(6, "Mat khau toi thieu 6 ky tu"),
  hoTen: z.string().trim().min(2, "Ho ten khong duoc de trong"),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Email khong hop le"),
  password: z.string().min(1, "Mat khau khong duoc de trong"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
