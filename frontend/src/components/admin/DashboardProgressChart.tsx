import { RefreshCw } from "lucide-react";
import Button from "../ui/Button";
import Card from "../ui/Card";

const chartBars = [
  "h-16",
  "h-24",
  "h-20",
  "h-32",
  "h-28",
  "h-36",
  "h-24",
  "h-40",
  "h-32",
  "h-44",
  "h-36",
  "h-48",
];

export default function DashboardProgressChart() {
  return (
    <Card className="p-5">
      <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-950">
            Tiến độ xử lý gần đây
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Biểu đồ nhanh theo 12 tuần gần nhất.
          </p>
        </div>
        <Button
          leftIcon={<RefreshCw size={18} aria-hidden="true" />}
          variant="ghost"
        >
          Làm mới
        </Button>
      </div>

      <div className="mt-6 flex h-64 items-end gap-3 rounded-lg bg-slate-50 p-4">
        {chartBars.map((heightClass, index) => (
          <div
            key={index}
            className="flex min-w-0 flex-1 items-end rounded-md bg-brand-100"
          >
            <div
              className={`${heightClass} w-full rounded-md bg-brand-700 transition hover:bg-brand-800`}
              aria-hidden="true"
            />
          </div>
        ))}
      </div>
    </Card>
  );
}

