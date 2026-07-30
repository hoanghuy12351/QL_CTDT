CREATE TABLE IF NOT EXISTS dinh_muc_giang_vien (
  dinh_muc_id INT AUTO_INCREMENT PRIMARY KEY,
  giang_vien_id INT NOT NULL,
  nam_hoc_id INT NOT NULL,
  loai_dinh_muc ENUM('giang_vien_thuong','truong_bo_mon','pho_truong_bo_mon','tro_giang') NOT NULL DEFAULT 'giang_vien_thuong',
  ty_le_dinh_muc DECIMAL(5,2) NOT NULL DEFAULT 100.00,
  gio_tieu_chuan DECIMAL(8,1) NOT NULL DEFAULT 270.0,
  gio_mien_giam DECIMAL(8,1) NOT NULL DEFAULT 0.0,
  gio_phai_day DECIMAL(8,1) NOT NULL DEFAULT 270.0,
  ghi_chu TEXT NULL,
  ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP,
  ngay_cap_nhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_dinh_muc_gv_nam_hoc (giang_vien_id, nam_hoc_id),
  KEY fk_dmgv_nam_hoc (nam_hoc_id),
  CONSTRAINT fk_dmgv_giang_vien FOREIGN KEY (giang_vien_id) REFERENCES giang_vien(giang_vien_id),
  CONSTRAINT fk_dmgv_nam_hoc FOREIGN KEY (nam_hoc_id) REFERENCES nam_hoc(nam_hoc_id)
);

ALTER TABLE giang_vien
  ADD COLUMN IF NOT EXISTS chuc_vu ENUM('giang_vien','tro_giang','pho_truong_bo_mon','truong_bo_mon','pho_truong_khoa','truong_khoa','khac') DEFAULT 'giang_vien';
