import { HTTP_STATUS } from "../../common/constants/http-status.js";
import {
  buildPaginationMeta,
  getPagination,
} from "../../common/helpers/pagination.js";
import { AppError } from "../../common/utils/app-error.js";
import { lecturerRepository } from "./lecturer.repository.js";
import type { LecturerAssignmentListQuery } from "./lecturer.validation.js";

const toNumber = (value: unknown) => Number(value ?? 0);

const ensureLecturerProfile = async (userId: number) => {
  const lecturer = await lecturerRepository.findLecturerByUserId(userId);

  if (!lecturer) {
    throw new AppError(
      "Tai khoan giang vien chua duoc gan voi ho so giang vien",
      HTTP_STATUS.FORBIDDEN,
    );
  }

  return lecturer;
};

export const lecturerService = {
  async dashboard(userId: number) {
    const lecturer = await ensureLecturerProfile(userId);

    const [activeAssignments, confirmedAssignments, workload, schedules] =
      await Promise.all([
        lecturerRepository.countActiveAssignments(lecturer.giangVienId),
        lecturerRepository.countConfirmedAssignments(lecturer.giangVienId),
        lecturerRepository.sumWorkload(lecturer.giangVienId),
        lecturerRepository.findUpcomingWeeklySchedules({
          lecturerId: lecturer.giangVienId,
          limit: 8,
        }),
      ]);

    return {
      lecturer,
      stats: {
        activeAssignments,
        confirmedAssignments,
        totalAssignedPeriods: toNumber(workload._sum.soTietPhanCong),
        totalConvertedPeriods: toNumber(workload._sum.soTietQuyDoi),
      },
      upcomingSchedules: schedules,
    };
  },

  async listAssignments(userId: number, query: LecturerAssignmentListQuery) {
    const lecturer = await ensureLecturerProfile(userId);
    const { page, limit, skip } = getPagination(query);

    const [items, totalItems] = await lecturerRepository.findAssignments({
      lecturerId: lecturer.giangVienId,
      skip,
      limit,
      keyword: query.keyword,
      keHoachHocKyId: query.keHoachHocKyId,
      trangThai: query.trangThai,
    });

    return {
      lecturer,
      items,
      pagination: buildPaginationMeta(page, limit, totalItems),
    };
  },

  async weeklySchedule(userId: number) {
    const lecturer = await ensureLecturerProfile(userId);
    const items = await lecturerRepository.findUpcomingWeeklySchedules({
      lecturerId: lecturer.giangVienId,
      limit: 500,
    });

    return {
      lecturer,
      items,
    };
  },
};
