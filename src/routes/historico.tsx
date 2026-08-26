import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMaratona } from "@/lib/maratona/store";
import { fmtBRL, fmtKm, fmtPct, formatRef, metaPatrimonio, taxaMensal } from "@/lib/maratona/math";
import { MARATHON_KM, type MonthEntry, type Plan } from "@/lib/maratona/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { CurrencyInput } from "@/components/maratona/CurrencyInput";
import { toast } from "sonner";
import { PaceCard } from "@/components/maratona/PaceCard";
import { calcularPace, fmtMeses } from "@/lib/maratona/pace";
import { derivarEntries } from "@/lib/maratona/math";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/historico")({
  head: () => ({
    meta: [
      { title: "Histórico — Maratona Financeira" },
      { name: "description", content: "Veja seu progresso histórico na maratona financeira." },
    ],
  }),
  component: Historico,
});

function Historico() {
  const { ready, hasPlan, data, deleteEntry, updateEntry } = useMaratona();
  const navigate = useNavigate();
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [editing, setEditing] = useState<MonthEntry | null>(null);
  const [editPatrim, setEditPatrim] = useState(0);
  const [editAportes, setEditAportes] = useState(0);

  useEffect(() => {
    if (ready && !hasPlan) navigate({ to: "/onboarding" });
  }, [ready, hasPlan, navigate]);

  const view = useMemo(() => {
    if (!data) return null;
    const entries = [...data.entries].sort((a, b) => a.ref.localeCompare(b.ref));
    const points = derivarProgressoHistorico(data.plan, entries);
    const derived = derivarEntries(data.plan, entries);
    const pace = calcularPace(data.plan, derived);
    // Pace mês a mês: km ganhos em cada mês usando a mesma régua dos points.
    const kmDeltas: (number | null)[] = points.map((p, i) =>
      i === 0 ? null : p.km - points[i - 1].km,
    );
    const kmGanhos = kmDeltas.filter((d): d is number => d !== null && d > 0);
    const melhorKm = kmGanhos.length ? Math.max(...kmGanhos) : null;
    const melhorMes = melhorKm !== null
      ? points[kmDeltas.findIndex((d) => d === melhorKm)]
      : null;
    const totalKm = points[points.length - 1]?.km ?? 0;
    const ritmoMedio = points.length >= 2 && totalKm > 0.001
      ? (points.length - 1) / totalKm
      : null;
    return { points, latest: points[points.length - 1], pace, melhorKm, melhorMes, ritmoMedio, kmDeltas };
  }, [data]);

  if (!ready || !data || !view) {
    return <div className="py-20 text-center text-muted-foreground">Carregando…</div>;
  }

  if (view.points.length === 0) {
    return (
      <div className="py-20 text-center space-y-3">
        <p className="text-muted-foreground">Sem meses reportados ainda.</p>
        <Button onClick={() => navigate({ to: "/atualizar" })}>Registrar primeiro mês</Button>
      </div>
    );
  }

  const latest = view.latest;
  const reversed = view.points.slice().reverse();

  return (
    <div className="space-y-6 animate-fade-in">
      <section className="rounded-2xl border border-border/60 bg-card p-5 overflow-hidden">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Progresso histórico</div>
            <h1 className="mt-2 text-5xl font-bold tabular-nums leading-none">{fmtPct(latest.pct, 1)}</h1>
            <div className="mt-2 text-sm text-muted-foreground">
              {formatRef(latest.ref)} · {fmtKm(latest.km)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl">🏃</div>
            <div className="text-xs font-mono text-muted-foreground">42,195 km</div>
          </div>
        </div>

        <div className="mt-5 h-3 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full rounded-full transition-[width] duration-700"
            style={{ width: `${latest.pct * 100}%`, background: "var(--gradient-progress)" }}
          />
        </div>

        {view.points.length > 1 && (
          <Sparkline values={view.points.map((p) => p.patrimonio)} />
        )}
      </section>

      <PaceCard pace={view.pace} />

      {(view.ritmoMedio !== null || view.melhorMes) && (
        <section className="rounded-2xl border border-border/60 bg-card p-4">
          <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-3">
            Pace histórico
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-secondary/40 p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Ritmo médio
              </div>
              <div className="text-base font-bold tabular-nums mt-0.5">
                {view.ritmoMedio !== null ? `${fmtMeses(view.ritmoMedio)} / km` : "—"}
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">
                média de toda a série
              </div>
            </div>
            <div className="rounded-xl bg-secondary/40 p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Melhor mês
              </div>
              <div className="text-base font-bold tabular-nums mt-0.5 text-pace-ahead">
                {view.melhorKm !== null ? `+${view.melhorKm.toFixed(2)} km` : "—"}
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">
                {view.melhorMes ? formatRef(view.melhorMes.ref) : "—"}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="space-y-2">
        {reversed.map((point, idx) => {
          // reversed[idx + 1] = mês anterior em ordem cronológica
          const previous = reversed[idx + 1];
          const delta = previous ? point.patrimonio - previous.patrimonio : null;
          const deltaKm = previous ? point.km - previous.km : null;
          const deltaPct = previous ? point.pct - previous.pct : null;
          return (
            <div key={point.ref} className="rounded-xl border border-border/60 bg-card px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div className="font-medium">{formatRef(point.ref)}</div>
                <div className="flex items-center gap-3">
                  <div className="text-right tabular-nums">
                    <div className="font-semibold">{fmtPct(point.pct, 1)}</div>
                    <div className="text-[10px] text-muted-foreground">{fmtKm(point.km)}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(point);
                      setEditPatrim(point.patrimonio);
                      setEditAportes(point.aportes);
                    }}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                    aria-label={`Editar ${formatRef(point.ref)}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingDelete(point.ref)}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                    aria-label={`Excluir ${formatRef(point.ref)}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-2 h-2 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${point.pct * 100}%`, background: "var(--gradient-progress)" }}
                />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Patrimônio</div>
                  <div className="text-sm font-semibold tabular-nums mt-0.5">{fmtBRL(point.patrimonio)}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Aporte</div>
                  <div className="text-sm font-semibold tabular-nums mt-0.5">{fmtBRL(point.aportes)}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">vs mês ant.</div>
                  <div
                    className={`text-sm font-semibold tabular-nums mt-0.5 ${
                      delta === null
                        ? "text-muted-foreground"
                        : delta >= 0
                          ? "text-pace-ahead"
                          : "text-pace-behind"
                    }`}
                  >
                    {delta === null ? "—" : `${delta >= 0 ? "+" : "−"}${fmtBRL(Math.abs(delta))}`}
                  </div>
                  {deltaKm !== null && deltaPct !== null && (
                    <div
                      className={`text-[10px] tabular-nums mt-0.5 ${
                        deltaKm >= 0 ? "text-pace-ahead/80" : "text-pace-behind/80"
                      }`}
                    >
                      {deltaKm >= 0 ? "+" : "−"}{fmtKm(Math.abs(deltaKm))} ·{" "}
                      {deltaPct >= 0 ? "+" : "−"}{fmtPct(Math.abs(deltaPct), 2)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <AlertDialog open={pendingDelete !== null} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir registro?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete && `O mês ${formatRef(pendingDelete)} será removido do histórico. Esta ação não pode ser desfeita.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingDelete) deleteEntry(pendingDelete);
                setPendingDelete(null);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar {editing && formatRef(editing.ref)}</DialogTitle>
            <DialogDescription>
              Corrija o patrimônio ou o aporte registrado neste mês.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Patrimônio no fim do mês
              </Label>
              <CurrencyInput value={editPatrim} onChange={setEditPatrim} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Aportes do mês
              </Label>
              <CurrencyInput value={editAportes} onChange={setEditAportes} allowNegative />
              <p className="text-[11px] text-muted-foreground">
                Use valor negativo para retiradas/saques.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setEditing(null)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                if (!editing) return;
                updateEntry(editing.ref, { patrimonio: editPatrim, aportes: editAportes });
                toast.success(`${formatRef(editing.ref)} atualizado`);
                setEditing(null);
              }}
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

type ProgressPoint = MonthEntry & {
  pct: number;
  km: number;
};

function derivarProgressoHistorico(plan: Plan, entries: MonthEntry[]): ProgressPoint[] {
  const meta = metaPatrimonio(plan);
  const totalMeses = mesesAteValor(plan, meta);
  const usaReguaTemporal = totalMeses !== null;

  return entries.map((entry) => {
    const meses = usaReguaTemporal ? mesesAteValor(plan, entry.patrimonio) : null;
    const bruto = meses !== null && totalMeses !== null ? meses / totalMeses : entry.patrimonio / Math.max(1, meta);
    const pct = Math.min(1, Math.max(0, bruto));
    return { ...entry, pct, km: pct * MARATHON_KM };
  });
}

function mesesAteValor(plan: Plan, valor: number): number | null {
  if (valor <= 0) return 0;
  const i = taxaMensal(plan.taxaAnual);
  if (plan.aporteMensal <= 0) return null;

  let saldo = 0;
  for (let mes = 1; mes <= 12 * 80; mes++) {
    saldo = saldo * (1 + i) + plan.aporteMensal;
    if (saldo >= valor) return mes;
  }
  return null;
}

function Sparkline({ values }: { values: number[] }) {
  const n = values.length;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = Math.max(max - min, 1);
  const xOf = (i: number) => (i / (n - 1)) * 100;
  const yOf = (v: number) => 18 - ((v - min) / range) * 16;
  const path = values.map((v, i) => `${xOf(i).toFixed(2)},${yOf(v).toFixed(2)}`).join(" ");
  const area = `0,18 ${path} 100,18`;
  return (
    <svg
      viewBox="0 0 100 20"
      preserveAspectRatio="none"
      className="mt-4 h-10 w-full"
      role="img"
      aria-label="Tendência do patrimônio"
    >
      <polygon points={area} fill="var(--primary)" opacity="0.15" />
      <polyline
        points={path}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}