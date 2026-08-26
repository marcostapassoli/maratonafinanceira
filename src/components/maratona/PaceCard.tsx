import { Timer, TrendingUp } from "lucide-react";
import type { Pace } from "@/lib/maratona/pace";
import { fmtMeses } from "@/lib/maratona/pace";

type Props = {
  pace: Pace;
  /** Variante compacta sem título; usada dentro de outras seções. */
  bare?: boolean;
};

export function PaceCard({ pace, bare }: Props) {
  if (pace.mesesUltimoKm === null && pace.mesesProxKm === null) return null;

  const formatKmMarker = (km: number) =>
    Number.isInteger(km) ? String(km) : km.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
  const kmUltimo = Math.max(0, pace.kmProx - 2);
  const kmUltimoFim = Math.max(0, pace.kmProx - 1);
  const kmProxInicio = Math.max(0, pace.kmProx - 1);
  const kmProxFim = pace.kmProx;

  const content = (
    <div className="space-y-3">
      <p className="text-[11px] text-muted-foreground leading-snug">
        Quanto tempo você levou para fazer o último km e quanto deve levar para o próximo, mantendo aporte e taxa do plano.
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-secondary/40 p-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Último km
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">km</span>
            <span className="text-3xl font-bold tabular-nums leading-none">{formatKmMarker(kmUltimo)}</span>
          </div>
          <div className="text-sm font-semibold tabular-nums mt-2">
            {pace.mesesUltimoKm !== null ? fmtMeses(pace.mesesUltimoKm) : "—"}
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5">
            {pace.mesesUltimoKm !== null
              ? `tempo no km ${formatKmMarker(kmUltimo)} antes de chegar ao ${formatKmMarker(kmUltimoFim)}`
              : "série insuficiente p/ medir esse km"}
          </div>
        </div>
        <div className="rounded-xl bg-secondary/40 p-3">
          <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
            <TrendingUp className="h-3 w-3" /> Próximo km
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">km</span>
            <span className="text-3xl font-bold tabular-nums leading-none text-pace-on">{formatKmMarker(kmProxFim)}</span>
          </div>
          <div className="text-sm font-semibold tabular-nums mt-2 text-pace-on">
            {pace.mesesProxKm !== null ? `≈ ${fmtMeses(pace.mesesProxKm)}` : "—"}
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5">
            previsão do km {formatKmMarker(kmProxInicio)} ao {formatKmMarker(kmProxFim)} · estimativa
          </div>
        </div>
      </div>
    </div>
  );

  if (bare) return content;

  return (
    <section className="rounded-2xl border border-border/60 bg-card p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-3">
        <Timer className="h-3.5 w-3.5" /> Seu pace
      </div>
      {content}
    </section>
  );
}