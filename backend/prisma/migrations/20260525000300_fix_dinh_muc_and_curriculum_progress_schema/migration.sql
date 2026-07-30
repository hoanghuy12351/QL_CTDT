-- Align current database with Prisma schema and backend services.
-- 1) `dinh_muc_giang_vien`: normalize primary key and required columns.
-- 2) Remove legacy progress columns from code paths already dropped in step 1.

SET @has_old_pk := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'dinh_muc_giang_vien'
    AND COLUMN_NAME = 'dinh_muc_giang_vien_id'
);

SET @has_new_pk := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'dinh_muc_giang_vien'
    AND COLUMN_NAME = 'dinh_muc_id'
);

SET @rename_pk_sql := IF(
  @has_old_pk = 1 AND @has_new_pk = 0,
  'ALTER TABLE `dinh_muc_giang_vien` CHANGE COLUMN `dinh_muc_giang_vien_id` `dinh_muc_id` INTEGER NOT NULL AUTO_INCREMENT',
  'SELECT 1'
);
PREPARE stmt FROM @rename_pk_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @has_loai_dinh_muc := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'dinh_muc_giang_vien'
    AND COLUMN_NAME = 'loai_dinh_muc'
);

SET @add_loai_dinh_muc_sql := IF(
  @has_loai_dinh_muc = 0,
  'ALTER TABLE `dinh_muc_giang_vien` ADD COLUMN `loai_dinh_muc` ENUM(''giang_vien_thuong'', ''truong_bo_mon'', ''pho_truong_bo_mon'', ''tro_giang'') NOT NULL DEFAULT ''giang_vien_thuong'' AFTER `nam_hoc_id`',
  'SELECT 1'
);
PREPARE stmt FROM @add_loai_dinh_muc_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @has_ty_le_dinh_muc := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'dinh_muc_giang_vien'
    AND COLUMN_NAME = 'ty_le_dinh_muc'
);

SET @add_ty_le_dinh_muc_sql := IF(
  @has_ty_le_dinh_muc = 0,
  'ALTER TABLE `dinh_muc_giang_vien` ADD COLUMN `ty_le_dinh_muc` DECIMAL(5, 2) NOT NULL DEFAULT 100.00 AFTER `loai_dinh_muc`',
  'SELECT 1'
);
PREPARE stmt FROM @add_ty_le_dinh_muc_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

UPDATE `dinh_muc_giang_vien`
SET
  `ty_le_dinh_muc` = CASE `loai_dinh_muc`
    WHEN 'truong_bo_mon' THEN 80.00
    WHEN 'pho_truong_bo_mon' THEN 85.00
    WHEN 'tro_giang' THEN 70.00
    ELSE 100.00
  END,
  `gio_phai_day` = CASE `loai_dinh_muc`
    WHEN 'truong_bo_mon' THEN ROUND(`gio_tieu_chuan` * 0.80, 1)
    WHEN 'pho_truong_bo_mon' THEN ROUND(`gio_tieu_chuan` * 0.85, 1)
    WHEN 'tro_giang' THEN ROUND(`gio_tieu_chuan` * 0.70, 1)
    ELSE ROUND(`gio_tieu_chuan`, 1)
  END,
  `gio_mien_giam` = ROUND(
    `gio_tieu_chuan` - CASE `loai_dinh_muc`
      WHEN 'truong_bo_mon' THEN ROUND(`gio_tieu_chuan` * 0.80, 1)
      WHEN 'pho_truong_bo_mon' THEN ROUND(`gio_tieu_chuan` * 0.85, 1)
      WHEN 'tro_giang' THEN ROUND(`gio_tieu_chuan` * 0.70, 1)
      ELSE ROUND(`gio_tieu_chuan`, 1)
    END,
    1
  );
