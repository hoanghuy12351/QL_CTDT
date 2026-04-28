import Button from "../ui/Button";
import Card from "../ui/Card";

const alerts = [
  "6 lớp chưa khóa kế hoạch học kỳ",
  "18 nhóm LT/TH chưa có giảng viên",
  "4 học phần chưa khai báo đủ số tiết",
];

export default function DashboardAlerts() {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-950">
            Cảnh báo vận hành
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Các điểm cần ưu tiên để không trễ kế hoạch.
          </p>
        </div>
        <Button className="px-3" variant="ghost">
          Xem
        </Button>
      </div>
      <ul className="mt-4 space-y-3">
        {alerts.map((alert) => (
          <li
            key={alert}
            className="flex items-start gap-3 rounded-lg border border-brand-100 bg-brand-50 p-4"
          >
            <span className="mt-1 size-2 rounded-full bg-brand-700" />
            <span className="text-sm font-medium leading-6 text-slate-700">
              {alert}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

