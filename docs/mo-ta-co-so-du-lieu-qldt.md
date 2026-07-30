# Mô tả cơ sở dữ liệu hệ thống quản lý chương trình đào tạo

## Hình 3. Mô tả cơ sở dữ liệu

Cơ sở dữ liệu của hệ thống quản lý chương trình đào tạo được thiết kế để lưu trữ thông tin về cơ cấu đào tạo, chương trình đào tạo, học phần, lớp sinh viên, kế hoạch đào tạo theo năm học - học kỳ và phân công giảng dạy cho giảng viên. Các bảng được liên kết bằng khóa ngoại nhằm đảm bảo dữ liệu nhất quán giữa chương trình đào tạo, lớp áp dụng, kế hoạch mở học phần và khối lượng giảng dạy.

## Các bảng trong cơ sở dữ liệu

### Bảng 3.1 `khoa`

Bảng `khoa` lưu thông tin các khoa trong trường, là đơn vị quản lý cấp cao của bộ môn, ngành và kế hoạch đào tạo.

| Thuộc tính | Kiểu dữ liệu | Khóa chính | Khóa ngoại | Mô tả |
|---|---:|:---:|:---:|---|
| `khoa_id` | int | x | | ID của khoa |
| `ma_khoa` | varchar(50) | | | Mã khoa, không trùng lặp |
| `ten_khoa` | varchar(255) | | | Tên đầy đủ của khoa |
| `ngay_tao` | datetime | | | Thời gian tạo bản ghi |

### Bảng 3.2 `bo_mon`

Bảng `bo_mon` lưu thông tin bộ môn trực thuộc khoa, dùng để quản lý giảng viên, học phần và một số chương trình đào tạo.

| Thuộc tính | Kiểu dữ liệu | Khóa chính | Khóa ngoại | Mô tả |
|---|---:|:---:|:---:|---|
| `bo_mon_id` | int | x | | ID của bộ môn |
| `khoa_id` | int | | x | Khoa quản lý bộ môn |
| `ma_bo_mon` | varchar(50) | | | Mã bộ môn |
| `ten_bo_mon` | varchar(255) | | | Tên bộ môn |
| `ngay_tao` | datetime | | | Thời gian tạo bản ghi |

### Bảng 3.3 `nganh`

Bảng `nganh` lưu thông tin ngành đào tạo thuộc khoa và có thể gắn bộ môn quản lý.

| Thuộc tính | Kiểu dữ liệu | Khóa chính | Khóa ngoại | Mô tả |
|---|---:|:---:|:---:|---|
| `nganh_id` | int | x | | ID của ngành |
| `khoa_id` | int | | x | Khoa phụ trách ngành |
| `bo_mon_quan_ly_id` | int | | x | Bộ môn quản lý ngành, có thể để trống |
| `ma_nganh` | varchar(50) | | | Mã ngành đào tạo |
| `ten_nganh` | varchar(255) | | | Tên ngành đào tạo |
| `ngay_tao` | datetime | | | Thời gian tạo bản ghi |

### Bảng 3.4 `chuyen_nganh`

Bảng `chuyen_nganh` lưu các chuyên ngành thuộc một ngành đào tạo.

| Thuộc tính | Kiểu dữ liệu | Khóa chính | Khóa ngoại | Mô tả |
|---|---:|:---:|:---:|---|
| `chuyen_nganh_id` | int | x | | ID của chuyên ngành |
| `nganh_id` | int | | x | Ngành chứa chuyên ngành |
| `ma_chuyen_nganh` | varchar(50) | | | Mã chuyên ngành |
| `ten_chuyen_nganh` | varchar(255) | | | Tên chuyên ngành |
| `ngay_tao` | datetime | | | Thời gian tạo bản ghi |

### Bảng 3.5 `co_so`

Bảng `co_so` lưu thông tin các cơ sở đào tạo của trường.

| Thuộc tính | Kiểu dữ liệu | Khóa chính | Khóa ngoại | Mô tả |
|---|---:|:---:|:---:|---|
| `co_so_id` | int | x | | ID của cơ sở |
| `ma_co_so` | varchar(50) | | | Mã cơ sở, không trùng lặp |
| `ten_co_so` | varchar(255) | | | Tên cơ sở đào tạo |
| `dia_chi` | varchar(255) | | | Địa chỉ cơ sở |

### Bảng 3.6 `phong_hoc`

Bảng `phong_hoc` lưu thông tin phòng học tại từng cơ sở để phục vụ lập lịch giảng dạy.

| Thuộc tính | Kiểu dữ liệu | Khóa chính | Khóa ngoại | Mô tả |
|---|---:|:---:|:---:|---|
| `phong_hoc_id` | int | x | | ID của phòng học |
| `co_so_id` | int | | x | Cơ sở chứa phòng học |
| `ma_phong` | varchar(50) | | | Mã phòng học |
| `ten_phong` | varchar(100) | | | Tên phòng học |
| `suc_chua` | int | | | Sức chứa của phòng |
| `loai_phong` | enum | | | Loại phòng: lý thuyết, thực hành, phòng máy... |

### Bảng 3.7 `khoa_hoc`

Bảng `khoa_hoc` lưu thông tin khóa đào tạo, ví dụ K20, K21.

| Thuộc tính | Kiểu dữ liệu | Khóa chính | Khóa ngoại | Mô tả |
|---|---:|:---:|:---:|---|
| `khoa_hoc_id` | int | x | | ID của khóa học |
| `ma_khoa_hoc` | varchar(50) | | | Mã khóa học, không trùng lặp |
| `ten_khoa_hoc` | varchar(100) | | | Tên khóa học |
| `nam_bat_dau` | int | | | Năm bắt đầu khóa học |
| `nam_ket_thuc` | int | | | Năm kết thúc khóa học |

### Bảng 3.8 `lop`

Bảng `lop` lưu thông tin lớp sinh viên, gắn với khóa học, ngành, chuyên ngành và cơ sở đào tạo.

| Thuộc tính | Kiểu dữ liệu | Khóa chính | Khóa ngoại | Mô tả |
|---|---:|:---:|:---:|---|
| `lop_id` | int | x | | ID của lớp |
| `ma_lop` | varchar(50) | | | Mã lớp, không trùng lặp |
| `ten_lop` | varchar(100) | | | Tên lớp |
| `khoa_hoc_id` | int | | x | Khóa học của lớp |
| `nganh_id` | int | | x | Ngành đào tạo của lớp |
| `chuyen_nganh_id` | int | | x | Chuyên ngành của lớp |
| `co_so_id` | int | | x | Cơ sở học tập của lớp |
| `he_dao_tao` | varchar(50) | | | Hệ đào tạo |
| `si_so` | int | | | Sĩ số lớp |
| `trang_thai` | enum | | | Trạng thái lớp |
| `ghi_chu` | text | | | Ghi chú bổ sung |

### Bảng 3.9 `nguoi_dung`

Bảng `nguoi_dung` lưu tài khoản đăng nhập và quyền truy cập của người dùng trong hệ thống.

| Thuộc tính | Kiểu dữ liệu | Khóa chính | Khóa ngoại | Mô tả |
|---|---:|:---:|:---:|---|
| `nguoi_dung_id` | int | x | | ID của người dùng |
| `email` | varchar(100) | | | Email đăng nhập, không trùng lặp |
| `mat_khau_hash` | varchar(255) | | | Mật khẩu đã được mã hóa |
| `ho_ten` | varchar(150) | | | Họ tên người dùng |
| `vai_tro` | enum | | | Vai trò: quản trị, giáo vụ, trưởng bộ môn... |
| `trang_thai` | enum | | | Trạng thái tài khoản |
| `ngay_tao` | datetime | | | Thời gian tạo tài khoản |
| `ngay_cap_nhat` | datetime | | | Thời gian cập nhật tài khoản |

### Bảng 3.10 `giang_vien`

Bảng `giang_vien` lưu hồ sơ giảng viên và thông tin phục vụ phân công giảng dạy.

| Thuộc tính | Kiểu dữ liệu | Khóa chính | Khóa ngoại | Mô tả |
|---|---:|:---:|:---:|---|
| `giang_vien_id` | int | x | | ID của giảng viên |
| `nguoi_dung_id` | int | | x | Tài khoản người dùng liên kết với giảng viên |
| `bo_mon_id` | int | | x | Bộ môn công tác |
| `ma_giang_vien` | varchar(50) | | | Mã giảng viên |
| `ho_ten` | varchar(150) | | | Họ tên giảng viên |
| `email` | varchar(100) | | | Email giảng viên |
| `so_dien_thoai` | varchar(20) | | | Số điện thoại |
| `hoc_vi` | varchar(100) | | | Học vị |
| `chuc_danh` | varchar(100) | | | Chức danh |
| `chuc_vu` | enum | | | Chức vụ trong đơn vị |
| `dinh_muc_gio` | decimal | | | Định mức giờ giảng |
| `trang_thai` | enum | | | Trạng thái giảng dạy |

### Bảng 3.11 `hoc_phan`

Bảng `hoc_phan` lưu danh mục học phần, số tín chỉ, số tiết và loại học phần.

| Thuộc tính | Kiểu dữ liệu | Khóa chính | Khóa ngoại | Mô tả |
|---|---:|:---:|:---:|---|
| `hoc_phan_id` | int | x | | ID của học phần |
| `ma_hoc_phan` | varchar(50) | | | Mã học phần, không trùng lặp |
| `ten_hoc_phan` | varchar(255) | | | Tên học phần |
| `so_tin_chi` | decimal | | | Tổng số tín chỉ |
| `so_tin_chi_ly_thuyet` | decimal | | | Số tín chỉ lý thuyết |
| `so_tin_chi_thuc_hanh` | decimal | | | Số tín chỉ thực hành |
| `so_tiet_ly_thuyet` | int | | | Số tiết lý thuyết |
| `so_tiet_thuc_hanh` | int | | | Số tiết thực hành |
| `tong_so_tiet` | int | | | Tổng số tiết |
| `he_so_si_so` | decimal | | | Hệ số theo sĩ số |
| `he_so_dac_thu` | decimal | | | Hệ số đặc thù của học phần |
| `loai_hoc_phan` | enum | | | Loại học phần |
| `bo_mon_id` | int | | x | Bộ môn phụ trách học phần |
| `mo_ta` | text | | | Mô tả học phần |

### Bảng 3.12 `giang_vien_hoc_phan`

Bảng `giang_vien_hoc_phan` xác định giảng viên có thể giảng dạy học phần nào, dùng để lọc danh sách giảng viên khi phân công.

| Thuộc tính | Kiểu dữ liệu | Khóa chính | Khóa ngoại | Mô tả |
|---|---:|:---:|:---:|---|
| `giang_vien_hoc_phan_id` | int | x | | ID bản ghi phân quyền giảng dạy |
| `giang_vien_id` | int | | x | Giảng viên được phân công năng lực dạy |
| `hoc_phan_id` | int | | x | Học phần giảng viên có thể dạy |
| `co_the_day_ly_thuyet` | boolean | | | Có thể dạy phần lý thuyết |
| `co_the_day_thuc_hanh` | boolean | | | Có thể dạy phần thực hành |
| `muc_do_uu_tien` | int | | | Mức độ ưu tiên khi gợi ý phân công |
| `ghi_chu` | text | | | Ghi chú |

### Bảng 3.13 `nam_hoc`

Bảng `nam_hoc` lưu năm học dùng khi lập kế hoạch đào tạo và quy định tính giờ.

| Thuộc tính | Kiểu dữ liệu | Khóa chính | Khóa ngoại | Mô tả |
|---|---:|:---:|:---:|---|
| `nam_hoc_id` | int | x | | ID của năm học |
| `ma_nam_hoc` | varchar(20) | | | Mã năm học, ví dụ 2025-2026 |
| `ngay_bat_dau` | date | | | Ngày bắt đầu năm học |
| `ngay_ket_thuc` | date | | | Ngày kết thúc năm học |
| `trang_thai` | enum | | | Trạng thái năm học |
| `ngay_tao` | datetime | | | Thời gian tạo bản ghi |

### Bảng 3.14 `hoc_ky`

Bảng `hoc_ky` lưu danh mục học kỳ trong năm học.

| Thuộc tính | Kiểu dữ liệu | Khóa chính | Khóa ngoại | Mô tả |
|---|---:|:---:|:---:|---|
| `hoc_ky_id` | int | x | | ID của học kỳ |
| `ma_hoc_ky` | varchar(20) | | | Mã học kỳ |
| `ten_hoc_ky` | varchar(100) | | | Tên học kỳ |
| `thu_tu_trong_nam` | int | | | Thứ tự học kỳ trong năm học |
| `trang_thai` | enum | | | Trạng thái học kỳ |

### Bảng 3.15 `chuong_trinh_dao_tao`

Bảng `chuong_trinh_dao_tao` lưu thông tin chung của chương trình đào tạo theo ngành, chuyên ngành và khóa học.

| Thuộc tính | Kiểu dữ liệu | Khóa chính | Khóa ngoại | Mô tả |
|---|---:|:---:|:---:|---|
| `chuong_trinh_id` | int | x | | ID của chương trình đào tạo |
| `ma_chuong_trinh` | varchar(50) | | | Mã chương trình đào tạo |
| `ten_chuong_trinh` | varchar(255) | | | Tên chương trình đào tạo |
| `nganh_id` | int | | x | Ngành áp dụng chương trình |
| `bo_mon_id` | int | | x | Bộ môn quản lý chương trình |
| `chuyen_nganh_id` | int | | x | Chuyên ngành áp dụng |
| `khoa_hoc_id` | int | | x | Khóa học áp dụng |
| `so_hoc_ky` | int | | | Số học kỳ của chương trình |
| `tong_tin_chi` | decimal | | | Tổng số tín chỉ |
| `trinh_do_dao_tao` | varchar(100) | | | Trình độ đào tạo |
| `hinh_thuc_dao_tao` | varchar(100) | | | Hình thức đào tạo |
| `trang_thai` | enum | | | Trạng thái chương trình |
| `mo_ta` | text | | | Mô tả chương trình |

### Bảng 3.16 `chuong_trinh_hoc_phan`

Bảng `chuong_trinh_hoc_phan` lưu danh sách học phần thuộc chương trình đào tạo, học kỳ dự kiến và thứ tự hiển thị trong từng học kỳ.

| Thuộc tính | Kiểu dữ liệu | Khóa chính | Khóa ngoại | Mô tả |
|---|---:|:---:|:---:|---|
| `chuong_trinh_hoc_phan_id` | int | x | | ID của học phần trong chương trình |
| `chuong_trinh_id` | int | | x | Chương trình đào tạo |
| `hoc_phan_id` | int | | x | Học phần thuộc chương trình |
| `hoc_ky_du_kien` | int | | | Học kỳ dự kiến học học phần |
| `bat_buoc` | boolean | | | Xác định học phần bắt buộc hay tự chọn |
| `thu_tu` | int | | | Thứ tự học phần trong học kỳ dự kiến |
| `dieu_kien_tien_quyet` | varchar(255) | | | Điều kiện tiên quyết |
| `ghi_chu` | text | | | Ghi chú |

### Bảng 3.17 `lop_chuong_trinh`

Bảng `lop_chuong_trinh` lưu quan hệ áp dụng chương trình đào tạo cho từng lớp.

| Thuộc tính | Kiểu dữ liệu | Khóa chính | Khóa ngoại | Mô tả |
|---|---:|:---:|:---:|---|
| `lop_chuong_trinh_id` | int | x | | ID bản ghi áp dụng chương trình |
| `lop_id` | int | | x | Lớp được áp dụng chương trình |
| `chuong_trinh_id` | int | | x | Chương trình đào tạo áp dụng |
| `ngay_ap_dung` | date | | | Ngày bắt đầu áp dụng |
| `trang_thai` | enum | | | Trạng thái áp dụng |
| `ghi_chu` | text | | | Ghi chú |

### Bảng 3.18 `tien_do_hoc_phan_lop`

Bảng `tien_do_hoc_phan_lop` theo dõi tiến độ thực hiện học phần của từng lớp theo chương trình đào tạo.

| Thuộc tính | Kiểu dữ liệu | Khóa chính | Khóa ngoại | Mô tả |
|---|---:|:---:|:---:|---|
| `tien_do_id` | int | x | | ID tiến độ học phần |
| `lop_id` | int | | x | Lớp được theo dõi |
| `chuong_trinh_hoc_phan_id` | int | | x | Học phần trong chương trình |
| `hoc_ky_du_kien` | int | | | Học kỳ dự kiến |
| `trang_thai` | enum | | | Trạng thái học phần của lớp |
| `ke_hoach_hoc_ky_id` | int | | x | Kế hoạch học kỳ đã mở học phần |
| `nam_hoc_hoan_thanh_id` | int | | x | Năm học hoàn thành học phần |
| `hoc_ky_hoan_thanh_id` | int | | x | Học kỳ hoàn thành học phần |
| `ghi_chu` | text | | | Ghi chú |

### Bảng 3.19 `ke_hoach_dao_tao`

Bảng `ke_hoach_dao_tao` lưu kế hoạch đào tạo cấp năm học của một khoa.

| Thuộc tính | Kiểu dữ liệu | Khóa chính | Khóa ngoại | Mô tả |
|---|---:|:---:|:---:|---|
| `ke_hoach_id` | int | x | | ID kế hoạch đào tạo |
| `nam_hoc_id` | int | | x | Năm học của kế hoạch |
| `khoa_id` | int | | x | Khoa lập kế hoạch |
| `ma_ke_hoach` | varchar(50) | | | Mã kế hoạch |
| `ten_ke_hoach` | varchar(255) | | | Tên kế hoạch |
| `trang_thai` | enum | | | Trạng thái kế hoạch |
| `ghi_chu` | text | | | Ghi chú |
| `nguoi_tao_id` | int | | x | Người tạo kế hoạch |
| `nguoi_duyet_id` | int | | x | Người duyệt kế hoạch |
| `ngay_tao` | datetime | | | Thời gian tạo |
| `ngay_cap_nhat` | datetime | | | Thời gian cập nhật |

### Bảng 3.20 `ke_hoach_hoc_ky`

Bảng `ke_hoach_hoc_ky` lưu kế hoạch đào tạo theo từng học kỳ thuộc kế hoạch năm học.

| Thuộc tính | Kiểu dữ liệu | Khóa chính | Khóa ngoại | Mô tả |
|---|---:|:---:|:---:|---|
| `ke_hoach_hoc_ky_id` | int | x | | ID kế hoạch học kỳ |
| `ke_hoach_id` | int | | x | Kế hoạch đào tạo năm học |
| `hoc_ky_id` | int | | x | Học kỳ tương ứng |
| `ten_ke_hoach_hoc_ky` | varchar(255) | | | Tên kế hoạch học kỳ |
| `trang_thai` | enum | | | Trạng thái kế hoạch học kỳ |
| `ghi_chu` | text | | | Ghi chú |

### Bảng 3.21 `tuan_dao_tao`

Bảng `tuan_dao_tao` lưu danh sách tuần trong kế hoạch năm học, phục vụ lập lịch giảng dạy theo tuần.

| Thuộc tính | Kiểu dữ liệu | Khóa chính | Khóa ngoại | Mô tả |
|---|---:|:---:|:---:|---|
| `tuan_id` | int | x | | ID tuần đào tạo |
| `ke_hoach_id` | int | | x | Kế hoạch đào tạo năm học |
| `so_tuan` | int | | | Số thứ tự tuần |
| `ten_tuan` | varchar(50) | | | Tên tuần |
| `ngay_bat_dau` | date | | | Ngày bắt đầu tuần |
| `ngay_ket_thuc` | date | | | Ngày kết thúc tuần |
| `loai_tuan` | enum | | | Loại tuần: học, thi, nghỉ... |
| `ghi_chu` | text | | | Ghi chú |

### Bảng 3.22 `ke_hoach_lop_hoc_phan`

Bảng `ke_hoach_lop_hoc_phan` lưu các học phần được mở cho từng lớp trong một kế hoạch học kỳ.

| Thuộc tính | Kiểu dữ liệu | Khóa chính | Khóa ngoại | Mô tả |
|---|---:|:---:|:---:|---|
| `ke_hoach_lop_hoc_phan_id` | int | x | | ID kế hoạch lớp học phần |
| `ke_hoach_hoc_ky_id` | int | | x | Kế hoạch học kỳ |
| `lop_id` | int | | x | Lớp học |
| `hoc_phan_id` | int | | x | Học phần được mở |
| `chuong_trinh_hoc_phan_id` | int | | x | Học phần tương ứng trong chương trình |
| `si_so` | int | | | Sĩ số dự kiến |
| `co_thuc_hanh` | boolean | | | Học phần có thực hành hay không |
| `co_chia_nhom_thuc_hanh` | boolean | | | Có chia nhóm thực hành hay không |
| `so_nhom_thuc_hanh` | int | | | Số nhóm thực hành |
| `nguon_tao` | enum | | | Nguồn tạo: gợi ý từ CTĐT hoặc thêm thủ công |
| `trang_thai` | enum | | | Trạng thái lớp học phần |
| `ghi_chu` | text | | | Ghi chú |

### Bảng 3.23 `nhom_hoc_phan`

Bảng `nhom_hoc_phan` lưu các nhóm lý thuyết hoặc thực hành được tách ra từ một lớp học phần.

| Thuộc tính | Kiểu dữ liệu | Khóa chính | Khóa ngoại | Mô tả |
|---|---:|:---:|:---:|---|
| `nhom_hoc_phan_id` | int | x | | ID nhóm học phần |
| `ke_hoach_lop_hoc_phan_id` | int | | x | Lớp học phần chứa nhóm |
| `ma_nhom` | varchar(50) | | | Mã nhóm |
| `ten_nhom` | varchar(100) | | | Tên nhóm |
| `loai_nhom` | enum | | | Loại nhóm: lý thuyết hoặc thực hành |
| `si_so` | int | | | Sĩ số nhóm |
| `so_tiet` | int | | | Số tiết của nhóm |
| `ghi_chu` | text | | | Ghi chú |

### Bảng 3.24 `phan_cong_giang_day`

Bảng `phan_cong_giang_day` lưu thông tin giảng viên được phân công dạy từng nhóm học phần và khối lượng giờ giảng.

| Thuộc tính | Kiểu dữ liệu | Khóa chính | Khóa ngoại | Mô tả |
|---|---:|:---:|:---:|---|
| `phan_cong_id` | int | x | | ID phân công giảng dạy |
| `nhom_hoc_phan_id` | int | | x | Nhóm học phần được phân công |
| `giang_vien_id` | int | | x | Giảng viên giảng dạy |
| `vai_tro` | enum | | | Vai trò giảng viên trong phân công |
| `loai_giang_day` | enum | | | Loại giảng dạy: lý thuyết, thực hành, đồ án... |
| `so_tiet_phan_cong` | decimal | | | Số tiết được phân công |
| `he_so_lop` | decimal | | | Hệ số lớp |
| `so_tiet_quy_doi` | decimal | | | Số tiết quy đổi |
| `so_tin_chi_tinh_gio` | decimal | | | Số tín chỉ dùng để tính giờ |
| `gio_co_ban` | decimal | | | Giờ cơ bản |
| `gio_quy_doi` | decimal | | | Giờ quy đổi sau khi áp dụng hệ số |
| `canh_bao` | text | | | Cảnh báo khi phân công vượt điều kiện |
| `trang_thai` | enum | | | Trạng thái phân công |
| `ghi_chu` | text | | | Ghi chú |

### Bảng 3.25 `lich_day_theo_tuan`

Bảng `lich_day_theo_tuan` lưu chi tiết lịch giảng dạy theo từng tuần cho mỗi phân công.

| Thuộc tính | Kiểu dữ liệu | Khóa chính | Khóa ngoại | Mô tả |
|---|---:|:---:|:---:|---|
| `lich_tuan_id` | int | x | | ID lịch dạy theo tuần |
| `phan_cong_id` | int | | x | Phân công giảng dạy |
| `tuan_id` | int | | x | Tuần đào tạo |
| `phong_hoc_id` | int | | x | Phòng học |
| `so_tiet` | decimal | | | Số tiết dạy trong tuần |
| `noi_dung_giang_day` | text | | | Nội dung giảng dạy |
| `ghi_chu` | text | | | Ghi chú |

### Bảng 3.26 `quy_dinh_he_so_si_so`

Bảng `quy_dinh_he_so_si_so` lưu quy định hệ số tính giờ theo sĩ số và loại giảng dạy.

| Thuộc tính | Kiểu dữ liệu | Khóa chính | Khóa ngoại | Mô tả |
|---|---:|:---:|:---:|---|
| `quy_dinh_he_so_si_so_id` | int | x | | ID quy định hệ số sĩ số |
| `loai_giang_day` | enum | | | Loại giảng dạy áp dụng |
| `si_so_tu` | int | | | Ngưỡng sĩ số bắt đầu |
| `si_so_den` | int | | | Ngưỡng sĩ số kết thúc |
| `he_so` | decimal | | | Hệ số áp dụng |
| `ma_he_so` | varchar(20) | | | Mã hệ số |
| `nam_hoc_id` | int | | x | Năm học áp dụng |
| `trang_thai` | enum | | | Trạng thái quy định |
| `ghi_chu` | text | | | Ghi chú |

### Bảng 3.27 `quy_dinh_tinh_gio`

Bảng `quy_dinh_tinh_gio` lưu quy định số giờ cơ bản theo loại giảng dạy và đơn vị tính.

| Thuộc tính | Kiểu dữ liệu | Khóa chính | Khóa ngoại | Mô tả |
|---|---:|:---:|:---:|---|
| `quy_dinh_tinh_gio_id` | int | x | | ID quy định tính giờ |
| `loai_giang_day` | enum | | | Loại giảng dạy |
| `don_vi_tinh` | enum | | | Đơn vị tính giờ |
| `gio_co_ban` | decimal | | | Số giờ cơ bản |
| `nam_hoc_id` | int | | x | Năm học áp dụng |
| `trang_thai` | enum | | | Trạng thái quy định |
| `mo_ta` | text | | | Mô tả quy định |

### Bảng 3.28 `dinh_muc_giang_vien`

Bảng `dinh_muc_giang_vien` lưu định mức giờ giảng của từng giảng viên theo năm học.

| Thuộc tính | Kiểu dữ liệu | Khóa chính | Khóa ngoại | Mô tả |
|---|---:|:---:|:---:|---|
| `dinh_muc_id` | int | x | | ID định mức giảng viên |
| `giang_vien_id` | int | | x | Giảng viên được áp dụng định mức |
| `nam_hoc_id` | int | | x | Năm học áp dụng |
| `loai_dinh_muc` | enum | | | Loại định mức |
| `ty_le_dinh_muc` | decimal | | | Tỷ lệ định mức |
| `gio_tieu_chuan` | decimal | | | Số giờ tiêu chuẩn |
| `gio_mien_giam` | decimal | | | Số giờ miễn giảm |
| `gio_phai_day` | decimal | | | Số giờ giảng viên phải dạy |
| `ghi_chu` | text | | | Ghi chú |
| `ngay_tao` | datetime | | | Thời gian tạo |
| `ngay_cap_nhat` | datetime | | | Thời gian cập nhật |

