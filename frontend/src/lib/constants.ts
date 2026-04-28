import {
  BarChart3,
  BookOpen,
  Building2,
  CalendarDays,
  CalendarRange,
  ClipboardList,
  DoorOpen,
  FileSpreadsheet,
  GraduationCap,
  GitBranchPlus,
  Layers3,
  School,
  Users,
  type LucideIcon,
} from "lucide-react";

export const APP_NAME = "Quan ly CTDT";

export type AdminNavItem = {
  label: string;
  description: string;
  to: string;
  shortLabel: string;
  icon: LucideIcon;
};

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    label: "Tong quan",
    description: "So lieu va viec can xu ly",
    to: "/admin/dashboard",
    shortLabel: "TQ",
    icon: BarChart3,
  },
  {
    label: "Khoa",
    description: "Khoa quan ly nganh va bo mon",
    to: "/admin/khoa",
    shortLabel: "K",
    icon: School,
  },
  {
    label: "Bo mon",
    description: "Don vi chuyen mon theo khoa",
    to: "/admin/bomon",
    shortLabel: "BM",
    icon: Building2,
  },
  {
    label: "Nganh",
    description: "Nganh dao tao theo khoa",
    to: "/admin/nganh",
    shortLabel: "N",
    icon: GraduationCap,
  },
  {
    label: "Chuyen nganh",
    description: "Chuyen nganh theo nganh dao tao",
    to: "/admin/chuyennganh",
    shortLabel: "CN",
    icon: Layers3,
  },
  {
    label: "Lop",
    description: "Khoa hoc, si so, nganh, chuyen nganh",
    to: "/admin/lop",
    shortLabel: "LH",
    icon: Layers3,
  },
  {
    label: "Giang vien",
    description: "Bo mon va hoc phan co the day",
    to: "/admin/giangvien",
    shortLabel: "GV",
    icon: Users,
  },
  {
    label: "Hoc phan",
    description: "Tin chi, LT, TH, tong tiet",
    to: "/admin/hocphan",
    shortLabel: "HP",
    icon: BookOpen,
  },
  {
    label: "Khoa hoc",
    description: "Nien khoa, nam bat dau, nam ket thuc",
    to: "/admin/khoahoc",
    shortLabel: "KH",
    icon: GraduationCap,
  },
  {
    label: "Co so",
    description: "Dia diem dao tao va van hanh lop hoc",
    to: "/admin/coso",
    shortLabel: "CS",
    icon: Building2,
  },
  {
    label: "Phong hoc",
    description: "Phong theo co so, loai phong va suc chua",
    to: "/admin/phonghoc",
    shortLabel: "PH",
    icon: DoorOpen,
  },
  {
    label: "Nam hoc",
    description: "Moc thoi gian van hanh ke hoach dao tao",
    to: "/admin/namhoc",
    shortLabel: "NH",
    icon: CalendarDays,
  },
  {
    label: "Hoc ky",
    description: "Hoc ky thuoc nam hoc va trang thai su dung",
    to: "/admin/hocky",
    shortLabel: "HK",
    icon: CalendarRange,
  },
  {
    label: "Chuong trinh dao tao",
    description: "CTDT, hoc ky, tien do hoc phan",
    to: "/admin/curriculums",
    shortLabel: "CT",
    icon: GraduationCap,
  },
  {
    label: "Ke hoach dao tao",
    description: "Nam hoc, hoc ky, hoc phan mo lop",
    to: "/admin/training-plans",
    shortLabel: "KH",
    icon: CalendarDays,
  },
  {
    label: "Nhom hoc phan",
    description: "Chia nhom LT/TH cho hoc phan da mo",
    to: "/admin/teaching-groups",
    shortLabel: "NH",
    icon: GitBranchPlus,
  },
  {
    label: "Phan cong giang day",
    description: "Nhom LT/TH va so tiet theo tuan",
    to: "/admin/assignments",
    shortLabel: "PC",
    icon: ClipboardList,
  },
  {
    label: "Bao cao",
    description: "Xuat ke hoach theo lop, GV, hoc ky",
    to: "/admin/reports",
    shortLabel: "BC",
    icon: FileSpreadsheet,
  },
];
