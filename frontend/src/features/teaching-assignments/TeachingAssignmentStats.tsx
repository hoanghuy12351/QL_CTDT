import { BookOpenCheck, CheckCircle2, Clock3, Users } from "lucide-react";
import type { TeachingAssignmentStats as Stats } from "./teachingAssignment.types";

type TeachingAssignmentStatsProps = {
  stats: Stats;
};

const formatNumber = (value: number) =>
  new Intl.NumberFormat("vi-VN").format(value);

export default function TeachingAssignmentStats({
  stats,
}: TeachingAssignmentStatsProps) {
  const cards = [
    {
      label: "Tổng nhóm",
      value: stats.totalGroups,
      helper: "Nhóm học phần trong học kỳ",
      icon: BookOpenCheck,
    },
    {
      label: "Đã phân công",
      value: stats.assignedGroups,
      helper: "Nhóm đã có giảng viên",
      icon: CheckCircle2,
    },
    {
      label: "Chưa phân công",
      value: stats.unassignedGroups,
      helper: "Cần xử lý tiếp",
      icon: Clock3,
    },
    {
      label: "Tổng số tiết",
      value: stats.totalPeriods,
      helper: `${stats.lecturerCount} giảng viên tham gia`,
      icon: Users,
    },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.label}
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {card.label}
                </p>
                <p className="mt-2 text-2xl font-extrabold text-slate-950">
                  {formatNumber(card.value)}
                </p>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  {card.helper}
                </p>
              </div>

              <div className="flex size-11 items-center justify-center rounded-lg bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                <Icon size={21} aria-hidden="true" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
