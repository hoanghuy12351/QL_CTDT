import Card from "../ui/Card";
import Badge from "../ui/Badge";

type AdminStatCardProps = {
  label: string;
  value: string;
  helper: string;
  badge: string;
  emphasis?: boolean;
};

export default function AdminStatCard({
  badge,
  emphasis = false,
  helper,
  label,
  value,
}: AdminStatCardProps) {
  return (
    <Card
      className={[
        "p-5 transition hover:-translate-y-1 hover:shadow-md",
        emphasis ? "border-brand-200 bg-brand-50" : "",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-600">{label}</p>
          <p className="mt-3 text-3xl font-extrabold text-slate-950">
            {value}
          </p>
        </div>
        <Badge tone="blue">{badge}</Badge>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-500">{helper}</p>
    </Card>
  );
}
