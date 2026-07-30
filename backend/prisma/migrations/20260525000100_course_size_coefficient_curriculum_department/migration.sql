ALTER TABLE `hoc_phan`
  ADD COLUMN `he_so_si_so` DECIMAL(4, 2) NULL DEFAULT 1.00 AFTER `tong_so_tiet`;

ALTER TABLE `chuong_trinh_dao_tao`
  ADD COLUMN `bo_mon_id` INTEGER NULL AFTER `nganh_id`;

CREATE INDEX `fk_ctdt_bo_mon` ON `chuong_trinh_dao_tao`(`bo_mon_id`);

ALTER TABLE `chuong_trinh_dao_tao`
  ADD CONSTRAINT `fk_ctdt_bo_mon`
  FOREIGN KEY (`bo_mon_id`) REFERENCES `bo_mon`(`bo_mon_id`)
  ON DELETE SET NULL ON UPDATE CASCADE;
