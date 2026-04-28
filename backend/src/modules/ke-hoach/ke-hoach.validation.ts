import { z } from "zod";

const nonEmptyText = (max = 255) => z.string().trim().min(1).max(max);
const nullableText = (max = 1000) =>
  z
    .string()
    .trim()
    .max(max)
    .nullable()
    .optional();

export const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  keyword: z.string().trim().optional(),
  keHoachId: z.coerce.number().int().positive().optional(),
});

const groupTypeSchema = z.preprocess((value) => {
  if (value === "LT") return "ly_thuyet";
  if (value === "TH") return "thuc_hanh";
  return value;
}, z.enum(["ly_thuyet", "thuc_hanh", "do_an", "thuc_tap", "tot_nghiep"]));

export const groupListQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  keyword: z.string().trim().optional(),
  keHoachHocKyId: z.coerce.number().int().positive().optional(),
  lopId: z.coerce.number().int().positive().optional(),
  hocPhanId: z.coerce.number().int().positive().optional(),
  loaiNhom: groupTypeSchema.optional(),
});

export const keHoachDaoTaoIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const keHoachHocKyIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const keHoachDaoTaoBodySchema = z.object({
  maKeHoach: nonEmptyText(50),
  tenKeHoach: nonEmptyText(255),
  namHocId: z.coerce.number().int().positive(),
  khoaId: z.coerce.number().int().positive(),
  trangThai: z.enum(["du_thao", "da_duyet", "dang_thuc_hien", "da_dong"]).optional(),
  ghiChu: nullableText(2000),
});

const keHoachHocKyBodySchema = z.object({
  keHoachId: z.coerce.number().int().positive(),
  hocKyId: z.coerce.number().int().positive(),
  tenKeHoachHocKy: nonEmptyText(255).optional(),
  trangThai: z.enum(["du_thao", "dang_thuc_hien", "da_dong"]).optional(),
  ghiChu: nullableText(2000),
});

export const createKeHoachDaoTaoSchema = keHoachDaoTaoBodySchema.strict();

export const updateKeHoachDaoTaoSchema = keHoachDaoTaoBodySchema
  .partial()
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Can it nhat mot truong de cap nhat",
  });

export const createKeHoachHocKySchema = keHoachHocKyBodySchema.strict();

export const updateKeHoachHocKySchema = keHoachHocKyBodySchema
  .partial()
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Can it nhat mot truong de cap nhat",
  });

export const goiYHocPhanSchema = z.object({
  keHoachHocKyId: z.coerce.number().int().positive(),
  lopIds: z.array(z.coerce.number().int().positive()).min(1),
  hocKyDuKien: z.coerce.number().int().positive().optional(),
});

export const moHocPhanItemSchema = z.object({
  lopId: z.coerce.number().int().positive(),
  hocPhanId: z.coerce.number().int().positive(),
  chuongTrinhHocPhanId: z.coerce.number().int().positive().optional(),
  tienDo: z.enum(["tien_do_1", "tien_do_2", "ca_ky"]).default("ca_ky"),
  siSo: z.coerce.number().int().min(0).default(0),
  coThucHanh: z.boolean().default(false),
  coChiaNhomThucHanh: z.boolean().default(false),
  soNhomThucHanh: z.coerce.number().int().min(0).default(0),
  nguonTao: z.enum(["goi_y_tu_ctdt", "them_thu_cong"]).default("goi_y_tu_ctdt"),
  lyDoThem: z.string().optional(),
});

export const moHocPhanSchema = z.object({
  keHoachHocKyId: z.coerce.number().int().positive(),
  items: z.array(moHocPhanItemSchema).min(1),
});

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const taoNhomSchema = z.object({
  coChiaNhomThucHanh: z.boolean().default(false),
  soNhomThucHanh: z.coerce.number().int().min(0).default(0),
});

export const createNhomHocPhanSchema = z
  .object({
    maNhom: nonEmptyText(50).optional(),
    tenNhom: nonEmptyText(100),
    loaiNhom: groupTypeSchema,
    siSo: z.coerce.number().int().min(0).default(0),
    soTiet: z.coerce.number().int().min(0),
    ghiChu: nullableText(2000),
  })
  .strict();

export const updateNhomHocPhanSchema = z
  .object({
    maNhom: nonEmptyText(50).optional(),
    tenNhom: nonEmptyText(100).optional(),
    siSo: z.coerce.number().int().min(0).optional(),
    soTiet: z.coerce.number().int().min(0).optional(),
    ghiChu: nullableText(2000),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Can it nhat mot truong de cap nhat",
  });

export const taoNhomNhanhSchema = z
  .object({
    taoNhomLyThuyet: z.boolean().default(true),
    soNhomThucHanh: z.coerce.number().int().min(0).default(0),
    siSoToiDaNhomThucHanh: z.coerce.number().int().positive().default(30),
  })
  .strict();

export const phanCongSchema = z.object({
  nhomHocPhanId: z.coerce.number().int().positive(),
  giangVienId: z.coerce.number().int().positive(),
  vaiTro: z.enum(["chinh", "tro_giang", "thuc_hanh", "huong_dan_do_an", "huong_dan_thuc_tap"]).default("chinh"),
  heSoLop: z.coerce.number().min(0).default(1),
  ghiChu: z.string().optional(),
});

export const lichTuanItemSchema = z.object({
  tuanId: z.coerce.number().int().positive(),
  phongHocId: z.coerce.number().int().positive().optional(),
  soTiet: z.coerce.number().min(0),
  noiDungGiangDay: z.string().optional(),
  ghiChu: z.string().optional(),
});

export const capNhatLichTuanSchema = z.object({
  phanCongId: z.coerce.number().int().positive(),
  lich: z.array(lichTuanItemSchema).min(1),
});

export const baoCaoTheoLopQuerySchema = z.object({
  keHoachHocKyId: z.coerce.number().int().positive(),
  lopId: z.coerce.number().int().positive(),
});

export const baoCaoTheoGiangVienQuerySchema = z.object({
  keHoachHocKyId: z.coerce.number().int().positive(),
  giangVienId: z.coerce.number().int().positive(),
});

export type GoiYHocPhanInput = z.infer<typeof goiYHocPhanSchema>;
export type MoHocPhanInput = z.infer<typeof moHocPhanSchema>;
export type TaoNhomInput = z.infer<typeof taoNhomSchema>;
export type PhanCongInput = z.infer<typeof phanCongSchema>;
export type CapNhatLichTuanInput = z.infer<typeof capNhatLichTuanSchema>;
export type BaoCaoTheoLopQuery = z.infer<typeof baoCaoTheoLopQuerySchema>;
export type BaoCaoTheoGiangVienQuery = z.infer<typeof baoCaoTheoGiangVienQuerySchema>;
export type ListQuery = z.infer<typeof listQuerySchema>;
export type KeHoachDaoTaoIdParam = z.infer<typeof keHoachDaoTaoIdParamSchema>;
export type KeHoachHocKyIdParam = z.infer<typeof keHoachHocKyIdParamSchema>;
export type CreateKeHoachDaoTaoInput = z.infer<typeof createKeHoachDaoTaoSchema>;
export type UpdateKeHoachDaoTaoInput = z.infer<typeof updateKeHoachDaoTaoSchema>;
export type CreateKeHoachHocKyInput = z.infer<typeof createKeHoachHocKySchema>;
export type UpdateKeHoachHocKyInput = z.infer<typeof updateKeHoachHocKySchema>;
export type GroupListQuery = z.infer<typeof groupListQuerySchema>;
export type CreateNhomHocPhanInput = z.infer<typeof createNhomHocPhanSchema>;
export type UpdateNhomHocPhanInput = z.infer<typeof updateNhomHocPhanSchema>;
export type TaoNhomNhanhInput = z.infer<typeof taoNhomNhanhSchema>;
