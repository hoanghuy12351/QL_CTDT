import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware.js";
import { requireRole } from "../../common/middlewares/role.middleware.js";
import { validate } from "../../common/middlewares/validate.middleware.js";
import { asyncHandler } from "../../common/utils/async-handler.js";
import { keHoachController } from "./ke-hoach.controller.js";
import {
  baoCaoTheoGiangVienQuerySchema,
  baoCaoTheoLopQuerySchema,
  capNhatLichTuanSchema,
  createNhomHocPhanSchema,
  createKeHoachDaoTaoSchema,
  createKeHoachHocKySchema,
  goiYHocPhanSchema,
  groupListQuerySchema,
  idParamSchema,
  keHoachDaoTaoIdParamSchema,
  keHoachHocKyIdParamSchema,
  listQuerySchema,
  moHocPhanSchema,
  phanCongSchema,
  taoNhomNhanhSchema,
  taoNhomSchema,
  updateNhomHocPhanSchema,
  updateKeHoachDaoTaoSchema,
  updateKeHoachHocKySchema,
} from "./ke-hoach.validation.js";

const router = Router();

router.use(authMiddleware, requireRole("quan_tri", "giao_vu"));

router.get(
  "/dao-tao",
  validate({ query: listQuerySchema }),
  asyncHandler(keHoachController.listKeHoachDaoTao),
);

router.post(
  "/dao-tao",
  validate({ body: createKeHoachDaoTaoSchema }),
  asyncHandler(keHoachController.createKeHoachDaoTao),
);

router.get(
  "/dao-tao/:id",
  validate({ params: keHoachDaoTaoIdParamSchema }),
  asyncHandler(keHoachController.detailKeHoachDaoTao),
);

router.put(
  "/dao-tao/:id",
  validate({ params: keHoachDaoTaoIdParamSchema, body: updateKeHoachDaoTaoSchema }),
  asyncHandler(keHoachController.updateKeHoachDaoTao),
);

router.delete(
  "/dao-tao/:id",
  validate({ params: keHoachDaoTaoIdParamSchema }),
  asyncHandler(keHoachController.deleteKeHoachDaoTao),
);

router.get(
  "/hoc-ky",
  validate({ query: listQuerySchema }),
  asyncHandler(keHoachController.listKeHoachHocKy),
);

router.post(
  "/hoc-ky",
  validate({ body: createKeHoachHocKySchema }),
  asyncHandler(keHoachController.createKeHoachHocKy),
);

router.get(
  "/hoc-ky/:id",
  validate({ params: keHoachHocKyIdParamSchema }),
  asyncHandler(keHoachController.detailKeHoachHocKy),
);

router.put(
  "/hoc-ky/:id",
  validate({ params: keHoachHocKyIdParamSchema, body: updateKeHoachHocKySchema }),
  asyncHandler(keHoachController.updateKeHoachHocKy),
);

router.get(
  "/hoc-ky/:id/lop-hoc-phan",
  validate({ params: keHoachHocKyIdParamSchema }),
  asyncHandler(keHoachController.listLopHocPhanDaMo),
);

router.get(
  "/nhom-hoc-phan",
  validate({ query: groupListQuerySchema }),
  asyncHandler(keHoachController.listNhomHocPhan),
);

router.put(
  "/nhom-hoc-phan/:id",
  validate({ params: idParamSchema, body: updateNhomHocPhanSchema }),
  asyncHandler(keHoachController.updateNhomHocPhan),
);

router.delete(
  "/nhom-hoc-phan/:id",
  validate({ params: idParamSchema }),
  asyncHandler(keHoachController.deleteNhomHocPhan),
);

router.post(
  "/goi-y-hoc-phan",
  validate({ body: goiYHocPhanSchema }),
  asyncHandler(keHoachController.goiYHocPhan),
);

router.post(
  "/mo-hoc-phan",
  validate({ body: moHocPhanSchema }),
  asyncHandler(keHoachController.moHocPhan),
);

router.post(
  "/lop-hoc-phan/:id/tao-nhom",
  validate({ params: idParamSchema, body: taoNhomSchema }),
  asyncHandler(keHoachController.taoNhomHocPhan),
);

router.get(
  "/lop-hoc-phan/:id/nhom",
  validate({ params: idParamSchema }),
  asyncHandler(keHoachController.listNhomTheoLopHocPhan),
);

router.post(
  "/lop-hoc-phan/:id/nhom",
  validate({ params: idParamSchema, body: createNhomHocPhanSchema }),
  asyncHandler(keHoachController.createNhomHocPhan),
);

router.post(
  "/lop-hoc-phan/:id/tao-nhom-nhanh",
  validate({ params: idParamSchema, body: taoNhomNhanhSchema }),
  asyncHandler(keHoachController.taoNhomNhanh),
);

router.post(
  "/phan-cong",
  validate({ body: phanCongSchema }),
  asyncHandler(keHoachController.phanCongGiangVien),
);

router.post(
  "/lich-tuan",
  validate({ body: capNhatLichTuanSchema }),
  asyncHandler(keHoachController.capNhatLichTheoTuan),
);

router.get(
  "/bao-cao-theo-lop",
  validate({ query: baoCaoTheoLopQuerySchema }),
  asyncHandler(keHoachController.baoCaoTheoLop),
);

router.get(
  "/bao-cao-theo-giang-vien",
  validate({ query: baoCaoTheoGiangVienQuerySchema }),
  asyncHandler(keHoachController.baoCaoTheoGiangVien),
);

export default router;
