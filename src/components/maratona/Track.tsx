import { MARATHON_KM } from "@/lib/maratona/types";
import { cn } from "@/lib/utils";

const MARCOS = [
  { km: 5, label: "5K" },
  { km: 10, label: "10K" },
  { km: 21.1, label: "21K" },
  { km: 30, label: "30K" },
  { km: 42.195, label: "42K" },
];

type Props = {
  km: number;
  status?: "ahead" | "on" | "behind";
  /** segunda posição opcional para a "linha financeira" */
  financialKm?: number;
};

export function Track({ km, status, financialKm }: Props) {
  const pct = Math.min(100, Math.max(0, (km / MARATHON_KM) * 100));
  const finPct =
    typeof financialKm === "number"
      ? Math.min(100, Math.max(0, (financialKm / MARATHON_KM) * 100))
      : null;

  const statusColor =
    status === "ahead"
      ? "bg-pace-ahead text-background"
      : status === "behind"
        ? "bg-pace-behind text-background"
        : "bg-pace-on text-background";

  const statusLabel =
    status === "ahead" ? "Acima do ritmo" : status === "behind" ? "Abaixo do ritmo" : "Dentro do ritmo";

  return (
    <div className="w-full">
      <div className="relative w-full pt-7 pb-4">
        {/* Pista */}
        <div className="relative h-3 w-full rounded-full bg-secondary overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-700 ease-out"
            style={{
              width: `${pct}%`,
              background: "var(--gradient-progress)",
              boxShadow: "var(--shadow-glow)",
            }}
          />
          {/* Marcos */}
          {MARCOS.map((m) => {
            const p = (m.km / MARATHON_KM) * 100;
            const reached = pct >= p;
            return (
              <div
                key={m.km}
                className={cn(
                  "absolute top-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-1 rounded-sm transition-colors",
                  reached ? "bg-primary" : "bg-muted-foreground/40",
                )}
                style={{ left: `${p}%` }}
              />
            );
          })}
        </div>

        {/* Labels dos marcos */}
        <div className="relative h-5 mt-2">
          {MARCOS.map((m) => {
            const p = (m.km / MARATHON_KM) * 100;
            return (
              <span
                key={m.km}
                className="absolute -translate-x-1/2 text-[10px] font-mono text-muted-foreground"
                style={{ left: `${p}%` }}
              >
                {m.label}
              </span>
            );
          })}
        </div>

        {/* Runner (tempo) */}
        <div
          className="absolute -top-1 -translate-x-1/2 transition-[left] duration-700 ease-out"
          style={{ left: `${pct}%`, top: 0 }}
        >
          <div className="flex flex-col items-center gap-1 animate-fade-in">
            {status && (
              <span
                className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap shadow-md",
                  statusColor,
                )}
              >
                {statusLabel}
              </span>
            )}
            <div
              className="text-2xl drop-shadow-lg [transform:scaleX(-1)]"
              aria-label="runner"
            >
              🏃
            </div>
          </div>
        </div>

        {/* Marcador da posição financeira (se diferente do tempo) */}
        {finPct !== null && Math.abs(finPct - pct) > 0.5 && (
          <div
            className="absolute -translate-x-1/2 transition-[left] duration-700"
            style={{ left: `${finPct}%`, top: "calc(50% + 8px)" }}
          >
            <div className="flex flex-col items-center">
              <div className="h-3 w-3 rounded-full bg-accent border-2 border-background shadow" />
              <span className="text-[9px] text-accent font-mono mt-0.5">$</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
