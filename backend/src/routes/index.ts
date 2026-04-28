import { Router } from "express";
import authRoute from "../modules/auth/auth.route.js";
import healthRoute from "../modules/health/health.route.js";
import adminDashboardRoute from "../modules/admin-dashboard/admin-dashboard.route.js";
import keHoachRoute from "../modules/ke-hoach/ke-hoach.route.js";
import hocPhanRoute from "../modules/hocphan/hocphan.route.js";
import khoaRoute from "../modules/khoa/khoa.route.js";
import boMonRoute from "../modules/bomon/bomon.route.js";
import nganhRoute from "../modules/nganh/nganh.route.js";
import chuyenNganhRoute from "../modules/chuyennganh/chuyennganh.route.js";
import giangVienRoute from "../modules/giangvien/giangvien.route.js";
import lopRoute from "../modules/lop/lop.route.js";
import coSoRoute from "../modules/coso/coso.route.js";
import phongHocRoute from "../modules/phonghoc/phonghoc.route.js";
import khoaHocRoute from "../modules/khoahoc/khoahoc.route.js";
import namHocRoute from "../modules/namhoc/namhoc.route.js";
import hocKyRoute from "../modules/hocky/hocky.route.js";
import chuongTrinhRoute from "../modules/chuongtrinh/chuongtrinh.route.js";
import adminCrudRoute from "../modules/admin-crud/admin-crud.route.js";

const router = Router();

router.use("/", healthRoute);
router.use("/auth", authRoute);

router.use("/admin/dashboard", adminDashboardRoute);
router.use("/admin/ke-hoach", keHoachRoute);
router.use("/admin/hocphan", hocPhanRoute);
router.use("/admin/hoc-phan", hocPhanRoute);
router.use("/admin/khoa", khoaRoute);
router.use("/admin/bomon", boMonRoute);
router.use("/admin/bo-mon", boMonRoute);
router.use("/admin/nganh", nganhRoute);
router.use("/admin/chuyennganh", chuyenNganhRoute);
router.use("/admin/chuyen-nganh", chuyenNganhRoute);
router.use("/admin/giangvien", giangVienRoute);
router.use("/admin/giang-vien", giangVienRoute);
router.use("/admin/lop", lopRoute);
router.use("/admin/coso", coSoRoute);
router.use("/admin/co-so", coSoRoute);
router.use("/admin/phonghoc", phongHocRoute);
router.use("/admin/phong-hoc", phongHocRoute);
router.use("/admin/khoahoc", khoaHocRoute);
router.use("/admin/khoa-hoc", khoaHocRoute);
router.use("/admin/namhoc", namHocRoute);
router.use("/admin/nam-hoc", namHocRoute);
router.use("/admin/hocky", hocKyRoute);
router.use("/admin/hoc-ky", hocKyRoute);
router.use("/admin/chuongtrinh", chuongTrinhRoute);
router.use("/admin/chuong-trinh-dao-tao", chuongTrinhRoute);
router.use("/admin/ctdt", chuongTrinhRoute);
router.use("/admin/curriculums", chuongTrinhRoute);

// Dat route CRUD cuoi cung de khong an cac route cu the o tren.
router.use("/admin", adminCrudRoute);

export default router;
