ALTER TABLE `hoc_ky` DROP FOREIGN KEY `fk_hoc_ky_nam_hoc`;

DROP INDEX `uq_hoc_ky_trong_nam` ON `hoc_ky`;

ALTER TABLE `hoc_ky` MODIFY `nam_hoc_id` INTEGER NULL;

CREATE UNIQUE INDEX `uq_hoc_ky_ma` ON `hoc_ky`(`ma_hoc_ky`);

ALTER TABLE `hoc_ky`
  ADD CONSTRAINT `fk_hoc_ky_nam_hoc`
  FOREIGN KEY (`nam_hoc_id`) REFERENCES `nam_hoc`(`nam_hoc_id`)
  ON DELETE SET NULL ON UPDATE CASCADE;
