ALTER TABLE `hoc_phan`
  MODIFY `loai_hoc_phan` VARCHAR(50) NULL DEFAULT 'dai_hoc_thong_thuong';

UPDATE `hoc_phan`
SET `loai_hoc_phan` = CASE `loai_hoc_phan`
  WHEN 'dai_cuong' THEN 'dai_hoc_thong_thuong'
  WHEN 'co_so_nganh' THEN 'dai_hoc_thong_thuong'
  WHEN 'chuyen_nganh' THEN 'dai_hoc_thong_thuong'
  WHEN 'do_an' THEN 'do_an_du_an'
  WHEN 'tot_nghiep' THEN 'do_an_khoa_luan_tot_nghiep'
  ELSE `loai_hoc_phan`
END;

ALTER TABLE `hoc_phan`
  MODIFY `loai_hoc_phan` ENUM(
    'dai_hoc_thong_thuong',
    'thuc_hanh',
    'do_an_du_an',
    'thuc_tap',
    'do_an_khoa_luan_tot_nghiep',
    'cao_hoc',
    'huong_dan_luan_van',
    'khac'
  ) NULL DEFAULT 'dai_hoc_thong_thuong';
