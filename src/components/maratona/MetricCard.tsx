import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  tone?: "default" | "positive" | "warning" | "info";
  className?: string;
};

export function MetricCard({ label, value, hint, tone = "default", className }: Props) {
  const toneClass =
    tone === "positive"
      ? "text-pace-ahead"
      : tone === "warning"
        ? "text-pace-behind"
        : tone === "info"
          ? "text-pace-on"
          : "text-foreground";
  return (
    <div className={cn("rounded-xl border border-border/60 bg-card p-4", className)}>
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
        {label}
      </div>
      <div className={cn("mt-1 text-xl font-bold tabular-nums", toneClass)}>{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}
