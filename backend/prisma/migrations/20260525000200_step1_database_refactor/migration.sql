-- Step 1: Database refactor for CTDT 8 ky, KHDT/KHGD without weekly teaching allocation.

-- 1) Nganh dao tao: bo mon quan ly CTDT cua nganh
ALTER TABLE `nganh`
  ADD COLUMN `bo_mon_quan_ly_id` INTEGER NULL AFTER `khoa_id`;

CREATE INDEX `fk_nganh_bo_mon_quan_ly` ON `nganh`(`bo_mon_quan_ly_id`);

ALTER TABLE `nganh`
  ADD CONSTRAINT `fk_nganh_bo_mon_quan_ly`
  FOREIGN KEY (`bo_mon_quan_ly_id`) REFERENCES `bo_mon`(`bo_mon_id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

-- 2) Giang vien: chuc vu de canh bao truong bo mon khi phan cong ly thuyet
ALTER TABLE `giang_vien`
  ADD COLUMN `chuc_vu` ENUM('giang_vien', 'tro_giang', 'pho_truong_bo_mon', 'truong_bo_mon', 'pho_truong_khoa', 'truong_khoa', 'khac') NULL DEFAULT 'giang_vien' AFTER `chuc_danh`;

-- 3) Hoc phan: them tin chi LT/TH va he so dac thu. he_so_si_so cu tam giu de khong vo du lieu cu.
ALTER TABLE `hoc_phan`
  ADD COLUMN `so_tin_chi_ly_thuyet` DECIMAL(4, 1) NULL DEFAULT 0.0 AFTER `so_tin_chi`,
  ADD COLUMN `so_tin_chi_thuc_hanh` DECIMAL(4, 1) NULL DEFAULT 0.0 AFTER `so_tin_chi_ly_thuyet`,
  ADD COLUMN `he_so_dac_thu` DECIMAL(4, 2) NULL DEFAULT 1.00 AFTER `he_so_si_so`;

-- 4) CTDT: mac dinh 8 ky, bo tien do trong chi tiet CTDT
ALTER TABLE `chuong_trinh_dao_tao`
  ADD COLUMN `so_hoc_ky` INTEGER NOT NULL DEFAULT 8 AFTER `khoa_hoc_id`;

ALTER TABLE `chuong_trinh_hoc_phan`
  DROP COLUMN `tien_do`,
  ADD COLUMN `dieu_kien_tien_quyet` VARCHAR(255) NULL AFTER `thu_tu`;

-- 5) Trang thai hoc phan lop: chi luu trang thai dong theo lop/ke hoach, khong luu tien do CTDT
ALTER TABLE `tien_do_hoc_phan_lop`
  DROP COLUMN `tien_do_du_kien`,
  ADD COLUMN `ke_hoach_hoc_ky_id` INTEGER NULL AFTER `trang_thai`;

CREATE INDEX `fk_tdhp_ke_hoach_hoc_ky` ON `tien_do_hoc_phan_lop`(`ke_hoach_hoc_ky_id`);

ALTER TABLE `tien_do_hoc_phan_lop`
  ADD CONSTRAINT `fk_tdhp_ke_hoach_hoc_ky`
  FOREIGN KEY (`ke_hoach_hoc_ky_id`) REFERENCES `ke_hoach_hoc_ky`(`ke_hoach_hoc_ky_id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

-- 6) KH lop hoc phan: bo tien do, vi KHDT chi can lop hoc mon gi trong nam hoc/hoc ky
ALTER TABLE `ke_hoach_lop_hoc_phan`
  DROP COLUMN `tien_do`;

-- 7) Phan cong giang day: luu snapshot du lieu tinh gio quy doi tai thoi diem phan cong
ALTER TABLE `phan_cong_giang_day`
  ADD COLUMN `loai_giang_day` ENUM('ly_thuyet', 'thuc_hanh', 'bai_tap', 'do_an', 'thuc_tap', 'tot_nghiep', 'khac') NULL AFTER `vai_tro`,
  ADD COLUMN `so_tin_chi_tinh_gio` DECIMAL(4, 1) NULL DEFAULT 0.0 AFTER `so_tiet_quy_doi`,
  ADD COLUMN `so_tiet_tinh_gio` INTEGER NULL DEFAULT 0 AFTER `so_tin_chi_tinh_gio`,
  ADD COLUMN `si_so` INTEGER NULL DEFAULT 0 AFTER `so_tiet_tinh_gio`,
  ADD COLUMN `he_so_si_so` DECIMAL(4, 2) NULL DEFAULT 1.00 AFTER `si_so`,
  ADD COLUMN `he_so_dac_thu` DECIMAL(4, 2) NULL DEFAULT 1.00 AFTER `he_so_si_so`,
  ADD COLUMN `he_so_vai_tro` DECIMAL(4, 2) NULL DEFAULT 1.00 AFTER `he_so_dac_thu`,
  ADD COLUMN `gio_co_ban` DECIMAL(8, 2) NULL DEFAULT 0.00 AFTER `he_so_vai_tro`,
  ADD COLUMN `gio_quy_doi` DECIMAL(8, 2) NULL DEFAULT 0.00 AFTER `gio_co_ban`,
  ADD COLUMN `canh_bao` TEXT NULL AFTER `gio_quy_doi`,
  ADD COLUMN `ngay_cap_nhat` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0) AFTER `ngay_tao`;

-- 8) Bang cau hinh he so si so
CREATE TABLE `quy_dinh_he_so_si_so` (
  `quy_dinh_he_so_si_so_id` INTEGER NOT NULL AUTO_INCREMENT,
  `loai_giang_day` ENUM('ly_thuyet', 'thuc_hanh', 'bai_tap', 'do_an', 'thuc_tap', 'tot_nghiep', 'khac') NOT NULL,
  `si_so_tu` INTEGER NOT NULL,
  `si_so_den` INTEGER NULL,
  `he_so` DECIMAL(4, 2) NOT NULL,
  `ma_he_so` VARCHAR(20) NULL,
  `nam_hoc_id` INTEGER NULL,
  `trang_thai` ENUM('dang_ap_dung', 'ngung_ap_dung') NULL DEFAULT 'dang_ap_dung',
  `ghi_chu` TEXT NULL,
  `ngay_tao` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`quy_dinh_he_so_si_so_id`),
  UNIQUE INDEX `uq_he_so_si_so`(`loai_giang_day`, `si_so_tu`, `si_so_den`, `nam_hoc_id`),
  INDEX `fk_qd_hs_ss_nam_hoc`(`nam_hoc_id`),
  CONSTRAINT `fk_qd_hs_ss_nam_hoc` FOREIGN KEY (`nam_hoc_id`) REFERENCES `nam_hoc`(`nam_hoc_id`) ON DELETE SET NULL ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 9) Bang cau hinh cong thuc tinh gio
CREATE TABLE `quy_dinh_tinh_gio` (
  `quy_dinh_tinh_gio_id` INTEGER NOT NULL AUTO_INCREMENT,
  `loai_giang_day` ENUM('ly_thuyet', 'thuc_hanh', 'bai_tap', 'do_an', 'thuc_tap', 'tot_nghiep', 'khac') NOT NULL,
  `don_vi_tinh` ENUM('tin_chi', 'tiet', 'hoc_phan', 'sinh_vien', 'khac') NOT NULL,
  `gio_co_ban` DECIMAL(8, 2) NOT NULL,
  `nam_hoc_id` INTEGER NULL,
  `trang_thai` ENUM('dang_ap_dung', 'ngung_ap_dung') NULL DEFAULT 'dang_ap_dung',
  `mo_ta` TEXT NULL,
  `ngay_tao` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`quy_dinh_tinh_gio_id`),
  UNIQUE INDEX `uq_quy_dinh_tinh_gio`(`loai_giang_day`, `don_vi_tinh`, `nam_hoc_id`),
  INDEX `fk_qd_tinh_gio_nam_hoc`(`nam_hoc_id`),
  CONSTRAINT `fk_qd_tinh_gio_nam_hoc` FOREIGN KEY (`nam_hoc_id`) REFERENCES `nam_hoc`(`nam_hoc_id`) ON DELETE SET NULL ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 10) Dinh muc gio giang vien theo nam hoc
CREATE TABLE `dinh_muc_giang_vien` (
  `dinh_muc_giang_vien_id` INTEGER NOT NULL AUTO_INCREMENT,
  `giang_vien_id` INTEGER NOT NULL,
  `nam_hoc_id` INTEGER NOT NULL,
  `gio_tieu_chuan` DECIMAL(8, 1) NOT NULL DEFAULT 0.0,
  `gio_mien_giam` DECIMAL(8, 1) NOT NULL DEFAULT 0.0,
  `gio_phai_day` DECIMAL(8, 1) NOT NULL DEFAULT 0.0,
  `ghi_chu` TEXT NULL,
  `ngay_tao` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
  `ngay_cap_nhat` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`dinh_muc_giang_vien_id`),
  UNIQUE INDEX `uq_dinh_muc_giang_vien_nam_hoc`(`giang_vien_id`, `nam_hoc_id`),
  INDEX `fk_dmgv_nam_hoc`(`nam_hoc_id`),
  CONSTRAINT `fk_dmgv_giang_vien` FOREIGN KEY (`giang_vien_id`) REFERENCES `giang_vien`(`giang_vien_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_dmgv_nam_hoc` FOREIGN KEY (`nam_hoc_id`) REFERENCES `nam_hoc`(`nam_hoc_id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 11) Du lieu mac dinh cho he so si so va quy dinh tinh gio
INSERT INTO `quy_dinh_he_so_si_so` (`loai_giang_day`, `si_so_tu`, `si_so_den`, `he_so`, `ma_he_so`, `nam_hoc_id`, `trang_thai`) VALUES
  ('ly_thuyet', 0, 19, 0.90, 'LT_0_19', NULL, 'dang_ap_dung'),
  ('ly_thuyet', 20, 40, 1.00, 'LT_20_40', NULL, 'dang_ap_dung'),
  ('ly_thuyet', 41, 60, 1.10, 'LT_41_60', NULL, 'dang_ap_dung'),
  ('ly_thuyet', 61, 80, 1.20, 'LT_61_80', NULL, 'dang_ap_dung'),
  ('ly_thuyet', 81, 100, 1.30, 'LT_81_100', NULL, 'dang_ap_dung'),
  ('ly_thuyet', 101, 120, 1.40, 'LT_101_120', NULL, 'dang_ap_dung'),
  ('ly_thuyet', 121, NULL, 1.50, 'LT_121_PLUS', NULL, 'dang_ap_dung'),
  ('thuc_hanh', 0, 19, 0.90, 'TH_0_19', NULL, 'dang_ap_dung'),
  ('thuc_hanh', 20, 25, 1.00, 'TH_20_25', NULL, 'dang_ap_dung'),
  ('thuc_hanh', 26, 30, 1.10, 'TH_26_30', NULL, 'dang_ap_dung'),
  ('thuc_hanh', 31, NULL, 1.20, 'TH_31_PLUS', NULL, 'dang_ap_dung');

INSERT INTO `quy_dinh_tinh_gio` (`loai_giang_day`, `don_vi_tinh`, `gio_co_ban`, `nam_hoc_id`, `trang_thai`, `mo_ta`) VALUES
  ('ly_thuyet', 'tin_chi', 20.00, NULL, 'dang_ap_dung', 'Gio co ban ly thuyet tinh theo tin chi'),
  ('thuc_hanh', 'tiet', 0.60, NULL, 'dang_ap_dung', 'Gio co ban thuc hanh tinh theo tiet'),
  ('bai_tap', 'tiet', 0.70, NULL, 'dang_ap_dung', 'Gio co ban bai tap tinh theo tiet'),
  ('do_an', 'tiet', 0.60, NULL, 'dang_ap_dung', 'Gio co ban do an tinh theo tiet'),
  ('thuc_tap', 'tiet', 0.60, NULL, 'dang_ap_dung', 'Gio co ban thuc tap tinh theo tiet'),
  ('tot_nghiep', 'tiet', 0.60, NULL, 'dang_ap_dung', 'Gio co ban tot nghiep tinh theo tiet');
