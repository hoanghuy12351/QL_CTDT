import {
  BarChart3,
  BookOpen,
  BookOpenCheck,
  Building2,
  CalendarDays,
  CalendarRange,
  Calculator,
  ClipboardList,
  DoorOpen,
  FileSpreadsheet,
  GraduationCap,
  GitBranchPlus,
  Layers3,
  School,
  UserCog,
  Users,
  type LucideIcon,
} from "lucide-react";

export const APP_NAME = "Quản lý CTĐT";

export type AdminNavItem = {
  label: string;
  description: string;
  to: string;
  shortLabel: string;
  icon: LucideIcon;
  children?: AdminNavItem[];
};

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    label: "Tổng quan",
    description: "Số liệu và việc cần xử lý",
    to: "/admin/dashboard",
    shortLabel: "TQ",
    icon: BarChart3,
  },
  {
    label: "Khoa",
    description: "Khoa quản lý ngành và bộ môn",
    to: "/admin/khoa",
    shortLabel: "K",
    icon: School,
  },
  {
    label: "Bộ môn",
    description: "Đơn vị chuyên môn theo khoa",
    to: "/admin/bomon",
    shortLabel: "BM",
    icon: Building2,
  },
  {
    label: "Ngành",
    description: "Ngành đào tạo theo khoa",
    to: "/admin/nganh",
    shortLabel: "N",
    icon: GraduationCap,
  },
  {
    label: "Chuyên ngành",
    description: "Chuyên ngành theo ngành đào tạo",
    to: "/admin/chuyennganh",
    shortLabel: "CN",
    icon: Layers3,
  },
  {
    label: "Lớp",
    description: "Khóa học, sĩ số, ngành, chuyên ngành",
    to: "/admin/lop",
    shortLabel: "LH",
    icon: Layers3,
  },
  {
    label: "Giảng viên",
    description: "Bộ môn và học phần có thể dạy",
    to: "/admin/giangvien",
    shortLabel: "GV",
    icon: Users,
  },
  {
    label: "Định mức giảng viên",
    description: "Giờ tiêu chuẩn, tỷ lệ định mức và giờ phải dạy theo năm học",
    to: "/admin/dinh-muc-giang-vien",
    shortLabel: "ĐMGV",
    icon: Calculator,
  },
  {
    label: "Tài khoản giảng viên",
    description: "Tạo, sửa và khóa tài khoản đăng nhập của giảng viên",
    to: "/admin/tai-khoan-giang-vien",
    shortLabel: "TKGV",
    icon: UserCog,
  },
  {
    label: "Giảng viên học phần",
    description: "Khai báo giảng viên có thể dạy từng học phần",
    to: "/admin/giang-vien-hoc-phan",
    shortLabel: "GVHP",
    icon: BookOpenCheck,
  },
  {
    label: "Học phần",
    description: "Tín chỉ, LT, TH, tổng tiết",
    to: "/admin/hocphan",
    shortLabel: "HP",
    icon: BookOpen,
  },
  {
    label: "Khóa học",
    description: "Niên khóa, năm bắt đầu, năm kết thúc",
    to: "/admin/khoahoc",
    shortLabel: "KH",
    icon: GraduationCap,
  },
  {
    label: "Cơ sở",
    description: "Địa điểm đào tạo và vận hành lớp học",
    to: "/admin/coso",
    shortLabel: "CS",
    icon: Building2,
  },
  {
    label: "Phòng học",
    description: "Phòng theo cơ sở, loại phòng và sức chứa",
    to: "/admin/phonghoc",
    shortLabel: "PH",
    icon: DoorOpen,
  },
  {
    label: "Năm học",
    description: "Mốc thời gian vận hành kế hoạch đào tạo",
    to: "/admin/namhoc",
    shortLabel: "NH",
    icon: CalendarDays,
  },
  {
    label: "Học kỳ",
    description: "Học kỳ thuộc năm học và trạng thái sử dụng",
    to: "/admin/hocky",
    shortLabel: "HK",
    icon: CalendarRange,
  },
  {
    label: "Chương trình đào tạo",
    description: "CTĐT, học kỳ, tiến độ học phần",
    to: "/admin/curriculums",
    shortLabel: "CT",
    icon: GraduationCap,
  },
  {
    label: "Kế hoạch đào tạo",
    description: "Năm học, học kỳ, học phần mở lớp",
    to: "/admin/training/plans/year",
    shortLabel: "KH",
    icon: CalendarDays,
    children: [
      {
        label: "Kế hoạch năm học",
        description: "Danh sách kế hoạch đào tạo theo năm học",
        to: "/admin/training/plans/year",
        shortLabel: "KN",
        icon: CalendarDays,
      },
      {
        label: "Kế hoạch học kỳ",
        description: "Mở học phần cho lớp theo học kỳ",
        to: "/admin/training/plans/semesters",
        shortLabel: "HK",
        icon: CalendarRange,
      },
    ],
  },
  {
    label: "Nhóm học phần",
    description: "Chia nhóm LT/TH cho học phần đã mở",
    to: "/admin/teaching-groups",
    shortLabel: "NH",
    icon: GitBranchPlus,
  },
  {
    label: "Phân công giảng dạy",
    description: "Nhóm LT/TH và số tiết theo tuần",
    to: "/admin/assignments",
    shortLabel: "PC",
    icon: ClipboardList,
  },
  {
    label: "Báo cáo",
    description: "Xuất kế hoạch theo lớp, GV, học kỳ",
    to: "/admin/reports",
    shortLabel: "BC",
    icon: FileSpreadsheet,
  },
];

export const LECTURER_NAV_ITEMS: AdminNavItem[] = [
  {
    label: "Tổng quan",
    description: "Số liệu và lịch dạy của giảng viên",
    to: "/lecturer/dashboard",
    shortLabel: "TQ",
    icon: BarChart3,
  },
  {
    label: "Phân công của tôi",
    description: "Danh sách nhóm học phần được phân công",
    to: "/lecturer/assignments",
    shortLabel: "PC",
    icon: ClipboardList,
  },
];

export const getNavigationItemsForRole = (role?: string | null) => {
  if (role === "giang_vien") {
    return LECTURER_NAV_ITEMS;
  }

  return ADMIN_NAV_ITEMS;
};
