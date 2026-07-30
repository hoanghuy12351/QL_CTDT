import { z } from "zod";

export const lecturerAssignmentListQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  keyword: z.string().trim().optional(),
  keHoachHocKyId: z.coerce.number().int().positive().optional(),
  trangThai: z
    .enum(["du_thao", "da_phan_cong", "da_xac_nhan", "da_huy"])
    .optional(),
});

export type LecturerAssignmentListQuery = z.infer<
  typeof lecturerAssignmentListQuerySchema
>;
