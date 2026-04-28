import { serializeData } from "../../common/utils/serialize.js";
import { adminDashboardRepository } from "./admin-dashboard.repository.js";

export const adminDashboardService = {
  async overview() {
    const [counts, recentPlans, recentAssignments] = await Promise.all([
      adminDashboardRepository.getCounts(),
      adminDashboardRepository.getRecentPlans(),
      adminDashboardRepository.getRecentAssignments(),
    ]);

    return serializeData({
      counts,
      recentPlans,
      recentAssignments,
    });
  },
};
