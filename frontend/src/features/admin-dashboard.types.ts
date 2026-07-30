export type DashboardAlertTone = "red" | "amber" | "blue" | "green" | "slate";

export type DashboardAlert = {
  key: string;
  title: string;
  description: string;
  count: number;
  tone: DashboardAlertTone;
  href: string;
};

export type DashboardCounts = {
  tongLop: number;
  tongGiangVien: number;
  tongHocPhan: number;
  tongChuongTrinh: number;
  tongKeHoachNam: number;
  tongKeHoachHocKy: number;
  tongNhomHocPhan: number;
  tongPhanCong: number;
  baoCaoSanSang: number;
  viecCanXuLy: number;
};

export type DashboardWorkflow = {
  yearPlans: {
    duThao: number;
    daDuyet: number;
    dangThucHien: number;
    daDong: number;
  };
  semesterPlans: {
    duThao: number;
    dangThucHien: number;
    daDong: number;
  };
};

export type DashboardRecentYearPlan = {
  id: number;
  maKeHoach: string;
  tenKeHoach: string;
  namHoc: string;
  khoa: string;
  trangThai: string;
  soKeHoachHocKy: number;
  soTuanDaoTao: number;
  href: string;
};

export type DashboardRecentItem = {
  id: string;
  title: string;
  meta: string;
  status: string;
  href: string;
  updatedAt: string;
};

export type DashboardWorkload = {
  giangVienId: number;
  maGiangVien: string;
  hoTen: string;
  boMon: string;
  soPhanCong: number;
  soTietPhanCong: number;
  soTietQuyDoi: number;
};

export type DashboardProgressItem = {
  tuanId: number;
  label: string;
  subtitle: string;
  value: number;
};

export type DashboardOverview = {
  generatedAt: string;
  counts: DashboardCounts;
  alerts: DashboardAlert[];
  workflow: DashboardWorkflow;
  recentYearPlans: DashboardRecentYearPlan[];
  recentItems: DashboardRecentItem[];
  workloadTop: DashboardWorkload[];
  progress: DashboardProgressItem[];
};
