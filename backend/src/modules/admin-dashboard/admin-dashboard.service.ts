import { serializeData } from "../../common/utils/serialize.js";
import { adminDashboardRepository } from "./admin-dashboard.repository.js";

type StatusCounter = Array<{
  trangThai: string | null;
  _count: { _all: number };
}>;

const toNumber = (value: unknown) => {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value) || 0;
  if (value && typeof value === "object" && "toNumber" in value) {
    const decimal = value as { toNumber: () => number };
    return decimal.toNumber();
  }

  return 0;
};

const mapStatusCounts = (rows: StatusCounter) =>
  rows.reduce<Record<string, number>>((acc, row) => {
    acc[row.trangThai ?? "khac"] = row._count._all;
    return acc;
  }, {});

const formatDate = (value?: Date | string | null) => {
  if (!value) return "Chưa có ngày";

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "Chưa có ngày";

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getSemesterPlanName = (plan: {
  tenKeHoachHocKy: string | null;
  hocKy?: { tenHocKy: string } | null;
  keHoachDaoTao?: { tenKeHoach: string; namHoc?: { maNamHoc: string } | null };
}) => {
  if (plan.tenKeHoachHocKy) return plan.tenKeHoachHocKy;

  return [
    plan.hocKy?.tenHocKy,
    plan.keHoachDaoTao?.namHoc?.maNamHoc,
    plan.keHoachDaoTao?.tenKeHoach,
  ]
    .filter(Boolean)
    .join(" - ");
};

export const adminDashboardService = {
  async overview() {
    const [
      counts,
      actionCounters,
      yearPlanStatuses,
      semesterPlanStatuses,
      recentYearPlans,
      recentSemesterPlans,
      recentAssignments,
      lecturerWorkloads,
      weeklyProgress,
    ] = await Promise.all([
      adminDashboardRepository.getCounts(),
      adminDashboardRepository.getActionCounters(),
      adminDashboardRepository.getYearPlanStatusCounts(),
      adminDashboardRepository.getSemesterPlanStatusCounts(),
      adminDashboardRepository.getRecentYearPlans(),
      adminDashboardRepository.getRecentSemesterPlans(),
      adminDashboardRepository.getRecentAssignments(),
      adminDashboardRepository.getLecturerWorkloads(),
      adminDashboardRepository.getWeeklyProgress(),
    ]);

    const totalActionItems =
      actionCounters.lopChuaGanChuongTrinh +
      actionCounters.keHoachNamDuThao +
      actionCounters.keHoachHocKyDuThao +
      actionCounters.hocPhanMoChuaCoNhom +
      actionCounters.nhomChuaPhanCong +
      actionCounters.phanCongChuaCoLichTuan;

    const alerts = [
      {
        key: "classes-without-curriculum",
        title: "Lớp chưa gán chương trình đào tạo",
        description:
          "Các lớp này chưa có CTĐT đang áp dụng nên dễ bị thiếu dữ liệu khi lập kế hoạch học kỳ.",
        count: actionCounters.lopChuaGanChuongTrinh,
        tone: "red",
        href: "/admin/lop",
      },
      {
        key: "semester-plans-draft",
        title: "Kế hoạch học kỳ còn ở dự thảo",
        description:
          "Cần rà soát, duyệt và khóa kế hoạch trước khi xuất báo cáo chính thức.",
        count: actionCounters.keHoachHocKyDuThao,
        tone: "amber",
        href: "/admin/training/plans/semesters",
      },
      {
        key: "opened-subjects-without-groups",
        title: "Học phần đã mở nhưng chưa tạo nhóm",
        description:
          "Mỗi lớp - học phần cần có nhóm LT/TH trước khi phân công giảng viên.",
        count: actionCounters.hocPhanMoChuaCoNhom,
        tone: "amber",
        href: "/admin/teaching-groups",
      },
      {
        key: "groups-without-assignments",
        title: "Nhóm học phần chưa phân công giảng viên",
        description:
          "Các nhóm này cần được gán giảng viên để hoàn thiện kế hoạch giảng dạy.",
        count: actionCounters.nhomChuaPhanCong,
        tone: "red",
        href: "/admin/assignments",
      },
      {
        key: "assignments-without-weekly-schedule",
        title: "Phân công chưa phân bổ tuần",
        description:
          "Cần chia số tiết theo tuần để báo cáo kế hoạch giảng dạy có dữ liệu đầy đủ.",
        count: actionCounters.phanCongChuaCoLichTuan,
        tone: "amber",
        href: "/admin/assignments",
      },
    ];

    const yearStatus = mapStatusCounts(yearPlanStatuses);
    const semesterStatus = mapStatusCounts(semesterPlanStatuses);

    const workloadTop = lecturerWorkloads
      .map((item) => ({
        giangVienId: item.giangVienId,
        maGiangVien: item.giangVien?.maGiangVien ?? "",
        hoTen: item.giangVien?.hoTen ?? "Chưa rõ giảng viên",
        boMon: item.giangVien?.boMon?.tenBoMon ?? "Chưa có bộ môn",
        soPhanCong: item._count._all,
        soTietPhanCong: toNumber(item._sum.soTietPhanCong),
        soTietQuyDoi: toNumber(item._sum.soTietQuyDoi),
      }))
      .sort((a, b) => b.soTietQuyDoi - a.soTietQuyDoi)
      .slice(0, 6);

    const progress = weeklyProgress
      .slice()
      .reverse()
      .map((week) => ({
        tuanId: week.tuanId,
        label: `Tuần ${week.soTuan}`,
        subtitle: week.keHoachDaoTao.namHoc?.maNamHoc ?? week.keHoachDaoTao.maKeHoach,
        value: week.lichDayTheoTuan.reduce(
          (total, item) => total + toNumber(item.soTiet),
          0,
        ),
      }));

    const recentItems = [
      ...recentSemesterPlans.map((plan) => ({
        id: `semester-${plan.keHoachHocKyId}`,
        title: getSemesterPlanName(plan),
        meta: `${plan.keHoachDaoTao.khoa?.tenKhoa ?? "Khoa"} · ${plan._count.keHoachLopHocPhan} học phần mở`,
        status: plan.trangThai ?? "du_thao",
        href: `/admin/training/plans/semesters/${plan.keHoachHocKyId}`,
        updatedAt: "Kế hoạch học kỳ",
      })),
      ...recentAssignments.map((assignment) => ({
        id: `assignment-${assignment.phanCongId}`,
        title: `${assignment.giangVien.hoTen} · ${assignment.nhomHocPhan.keHoachLopHocPhan.hocPhan.tenHocPhan}`,
        meta: `${assignment.nhomHocPhan.keHoachLopHocPhan.lop.maLop} · ${assignment.nhomHocPhan.maNhom} · ${assignment._count.lichDayTheoTuan} tuần`,
        status:
          assignment._count.lichDayTheoTuan > 0
            ? (assignment.trangThai ?? "du_thao")
            : "can_bo_sung",
        href: "/admin/assignments",
        updatedAt: formatDate(assignment.ngayTao),
      })),
    ].slice(0, 8);

    return serializeData({
      generatedAt: new Date(),
      counts: {
        ...counts,
        viecCanXuLy: totalActionItems,
      },
      actionCounters,
      alerts,
      workflow: {
        yearPlans: {
          duThao: yearStatus.du_thao ?? 0,
          daDuyet: yearStatus.da_duyet ?? 0,
          dangThucHien: yearStatus.dang_thuc_hien ?? 0,
          daDong: yearStatus.da_dong ?? 0,
        },
        semesterPlans: {
          duThao: semesterStatus.du_thao ?? 0,
          dangThucHien: semesterStatus.dang_thuc_hien ?? 0,
          daDong: semesterStatus.da_dong ?? 0,
        },
      },
      recentYearPlans: recentYearPlans.map((plan) => ({
        id: plan.keHoachId,
        maKeHoach: plan.maKeHoach,
        tenKeHoach: plan.tenKeHoach,
        namHoc: plan.namHoc.maNamHoc,
        khoa: plan.khoa.tenKhoa,
        trangThai: plan.trangThai,
        soKeHoachHocKy: plan._count.keHoachHocKy,
        soTuanDaoTao: plan._count.tuanDaoTao,
        href: `/admin/training/plans/year/${plan.keHoachId}`,
      })),
      recentItems,
      workloadTop,
      progress,
    });
  },
};
