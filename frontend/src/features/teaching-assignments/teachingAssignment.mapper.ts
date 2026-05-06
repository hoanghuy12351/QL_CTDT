import { mapTeachingGroup } from "../teaching-groups/teachingGroup.mapper";
import type {
  AssignmentRole,
  AssignmentStatus,
  LecturerDto,
  LecturerOption,
  LecturerWorkload,
  TeachingAssignment,
  TeachingAssignmentDto,
  TeachingAssignmentFormValues,
  TeachingAssignmentRow,
  TeachingAssignmentStats,
  WorkloadStatus,
} from "./teachingAssignment.types";

export const assignmentRoleLabels: Record<AssignmentRole, string> = {
  chinh: "Phụ trách chính",
  tro_giang: "Trợ giảng",
  thuc_hanh: "Thực hành",
  huong_dan_do_an: "Hướng dẫn đồ án",
  huong_dan_thuc_tap: "Hướng dẫn thực tập",
};

export const assignmentStatusLabels: Record<AssignmentStatus, string> = {
  du_thao: "Dự thảo",
  da_phan_cong: "Đã phân công",
  da_xac_nhan: "Đã xác nhận",
  da_huy: "Đã hủy",
};

export const workloadStatusLabels: Record<WorkloadStatus, string> = {
  chua_phan_cong: "Chưa phân công",
  binh_thuong: "Bình thường",
  cao: "Cao",
  qua_tai: "Quá tải",
};

const toNumber = (value: number | string | null | undefined, fallback = 0) => {
  const parsed = Number(value ?? fallback);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export function mapLecturer(dto: LecturerDto): LecturerOption {
  return {
    id: dto.giangVienId,
    code: dto.maGiangVien ?? "",
    name: dto.hoTen,
    departmentName: dto.boMon?.tenBoMon ?? "-",
    quota: toNumber(dto.dinhMucGio, 0),
    status: dto.trangThai ?? "",
  };
}

export function mapTeachingAssignment(
  dto: TeachingAssignmentDto,
): TeachingAssignment {
  const role = dto.vaiTro ?? "chinh";
  const status = dto.trangThai ?? "da_phan_cong";
  const group = dto.nhomHocPhan ? mapTeachingGroup(dto.nhomHocPhan) : undefined;

  return {
    id: dto.phanCongId,
    groupId: dto.nhomHocPhanId,
    lecturerId: dto.giangVienId,
    lecturerCode: dto.giangVien?.maGiangVien ?? "",
    lecturerName: dto.giangVien?.hoTen ?? "-",
    departmentName: dto.giangVien?.boMon?.tenBoMon ?? "-",
    role,
    roleLabel: assignmentRoleLabels[role] ?? role,
    assignedPeriods: toNumber(dto.soTietPhanCong, 0),
    classCoefficient: toNumber(dto.heSoLop, 1),
    convertedPeriods: toNumber(dto.soTietQuyDoi, 0),
    status,
    statusLabel: assignmentStatusLabels[status] ?? status,
    note: dto.ghiChu?.trim() ?? "",
    weeklyScheduleCount: dto._count?.lichDayTheoTuan ?? 0,
    group,
  };
}

export function mapTeachingAssignmentForm(
  values: TeachingAssignmentFormValues,
) {
  return {
    giangVienId: Number(values.lecturerId),
    vaiTro: values.role,
    soTietPhanCong: Number(values.assignedPeriods || 0),
    heSoLop: Number(values.classCoefficient || 1),
    trangThai: values.status,
    ghiChu: values.note.trim() || undefined,
  };
}

export function buildAssignmentStats(
  rows: TeachingAssignmentRow[],
): TeachingAssignmentStats {
  const allGroupIds = new Set(rows.map((row) => row.group.id));
  const assignedGroupIds = new Set<number>();
  const lecturerIds = new Set<number>();

  let totalAssignments = 0;
  let totalPeriods = 0;

  rows.forEach((row) => {
    if (!row.assignment) return;

    assignedGroupIds.add(row.group.id);
    lecturerIds.add(row.assignment.lecturerId);
    totalAssignments += 1;
    totalPeriods += row.assignment.assignedPeriods;
  });

  return {
    totalGroups: allGroupIds.size,
    assignedGroups: assignedGroupIds.size,
    unassignedGroups: allGroupIds.size - assignedGroupIds.size,
    totalAssignments,
    totalPeriods,
    lecturerCount: lecturerIds.size,
  };
}

export function getWorkloadStatus(
  totalPeriods: number,
  quota: number,
): WorkloadStatus {
  if (totalPeriods <= 0) return "chua_phan_cong";
  if (quota > 0 && totalPeriods > quota) return "qua_tai";
  if (quota > 0 && totalPeriods >= quota * 0.8) return "cao";
  if (totalPeriods > 220) return "qua_tai";
  if (totalPeriods > 120) return "cao";

  return "binh_thuong";
}

export function buildLecturerWorkloads(
  lecturers: LecturerOption[],
  assignments: TeachingAssignment[],
): LecturerWorkload[] {
  return lecturers.map((lecturer) => {
    const lecturerAssignments = assignments.filter(
      (assignment) =>
        assignment.lecturerId === lecturer.id && assignment.status !== "da_huy",
    );

    const theoryGroupCount = lecturerAssignments.filter(
      (assignment) => assignment.group?.type === "ly_thuyet",
    ).length;

    const practiceGroupCount = lecturerAssignments.filter(
      (assignment) => assignment.group?.type === "thuc_hanh",
    ).length;

    const projectGroupCount = lecturerAssignments.filter(
      (assignment) =>
        assignment.group?.type === "do_an" ||
        assignment.group?.type === "tot_nghiep",
    ).length;

    const internshipGroupCount = lecturerAssignments.filter(
      (assignment) => assignment.group?.type === "thuc_tap",
    ).length;

    const totalPeriods = lecturerAssignments.reduce(
      (total, assignment) => total + assignment.assignedPeriods,
      0,
    );

    const status = getWorkloadStatus(totalPeriods, lecturer.quota);

    return {
      lecturerId: lecturer.id,
      lecturerCode: lecturer.code,
      lecturerName: lecturer.name,
      departmentName: lecturer.departmentName,
      theoryGroupCount,
      practiceGroupCount,
      projectGroupCount,
      internshipGroupCount,
      totalGroupCount: lecturerAssignments.length,
      totalPeriods,
      quota: lecturer.quota,
      status,
      statusLabel: workloadStatusLabels[status],
    };
  });
}
