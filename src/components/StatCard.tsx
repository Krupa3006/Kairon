import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string | number;
  sub?: string;
  icon?: React.ReactNode;
  trend?: { value: number; label: string };
  highlight?: boolean;
};

export default function StatCard({
  label,
  value,
  sub,
  icon,
  trend,
  highlight,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "card flex flex-col gap-3",
        highlight && "border-brand/30 bg-brand/5"
      )}
    >
      <div className="flex items-start justify-between">
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        {icon && (
          <div className="p-2 rounded-lg bg-surface">{icon}</div>
        )}
      </div>
      <div>
        <p
          className={cn(
            "text-3xl font-bold tracking-tight",
            highlight ? "text-brand" : "text-gray-900"
          )}
        >
          {value}
        </p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
      {trend && (
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "text-xs font-semibold",
              trend.value >= 0 ? "text-success" : "text-danger"
            )}
          >
            {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}%
          </span>
          <span className="text-xs text-gray-400">{trend.label}</span>
        </div>
      )}
    </div>
  );
}
