import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  ReferenceLine, Brush,
} from "recharts";
import { useMaratona } from "@/lib/maratona/store";
import { fmtBRL, idadeAtual, metaPatrimonio } from "@/lib/maratona/math";
import { CurrencyInput } from "@/components/maratona/CurrencyInput";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Users, AlertTriangle, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Mesmas referências usadas na onboarding (TaxaRetornoSelector). */
const TAXA_OPCOES = [
  { id: "poupanca", label: "Poupança", taxa: 0.06, desc: "rendimento histórico" },
  { id: "conservador", label: "Conservador", taxa: 0.09, desc: "próximo ao CDI" },
  { id: "cdi", label: "CDI", taxa: 0.10, desc: "média ~10% a.a." },
  { id: "moderado", label: "Moderado", taxa: 0.11, desc: "RF + RV" },
  { id: "ibov", label: "IBOVESPA", taxa: 0.12, desc: "média ~12% a.a." },
  { id: "agressivo", label: "Agressivo", taxa: 0.13, desc: "próximo ao IBOV" },
] as const;

const APORTE_MULTIPLIERS = [
  { id: "metade", label: "0,5×", mult: 0.5 },
  { id: "padrao", label: "1× (plano)", mult: 1 },
  { id: "mais25", label: "1,25×", mult: 1.25 },
  { id: "mais50", label: "1,5×", mult: 1.5 },
  { id: "dobro", label: "2×", mult: 2 },
] as const;

const SAVED_KEY = "maratona/cenarios-salvos/v1";

type ScenarioSnapshot = {
  id: string;
  name: string;
  taxa: number;
  aporte: number;
  comparePerson: boolean;
  otherIdade: number;
  otherPatrimonio: number;
  pauseMonths: number;
  withdrawNow: number;
};

function loadSaved(): ScenarioSnapshot[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}
function persistSaved(list: ScenarioSnapshot[]) {
  try { localStorage.setItem(SAVED_KEY, JSON.stringify(list)); } catch { /* noop */ }
}

export const Route = createFileRoute("/cenarios")({
  head: () => ({
    meta: [
      { title: "Cenários — Maratona Financeira" },
      { name: "description", content: "Projeções conservador, esperado e otimista." },
    ],
  }),
  component: Cenarios,
});

function Cenarios() {
  const { ready, hasPlan, data } = useMaratona();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && !hasPlan) navigate({ to: "/onboarding" });
  }, [ready, hasPlan, navigate]);

  const plan = data?.plan;
  // Patrimônio ATUAL = último registro do histórico, ou o inicial do plano.
  const patrimAtual =
    data?.entries[data.entries.length - 1]?.patrimonio ??
    plan?.patrimonioInicial ??
    0;

  // Estado interativo
  const [taxa, setTaxa] = useState<number>(plan?.taxaAnual ?? 0.10);
  const [aporte, setAporte] = useState<number>(plan?.aporteMensal ?? 0);
  const [aporteMode, setAporteMode] = useState<"preset" | "custom">("preset");
  const [aportePresetId, setAportePresetId] = useState<string>("padrao");

  // Comparação com outro corredor (idade e patrimônio diferentes)
  const [comparePerson, setComparePerson] = useState<boolean>(false);
  const [otherIdade, setOtherIdade] = useState<number>(30);
  const [otherPatrimonio, setOtherPatrimonio] = useState<number>(0);

  // Visibilidade por série (legenda interativa, sem recalcular).
  const [visible, setVisible] = useState<{ voce: boolean; impacto: boolean; outro: boolean }>({
    voce: true,
    impacto: true,
    outro: true,
  });
  const toggleSeries = (k: "voce" | "impacto" | "outro") =>
    setVisible((v) => ({ ...v, [k]: !v[k] }));

  // Cenários defensivos aplicados à SUA curva.
  const [pauseMonths, setPauseMonths] = useState<number>(0);
  const [withdrawNow, setWithdrawNow] = useState<number>(0);

  // Cenários salvos.
  const [saved, setSaved] = useState<ScenarioSnapshot[]>([]);
  const [newName, setNewName] = useState<string>("");
  useEffect(() => { setSaved(loadSaved()); }, []);

  // Sincroniza estado quando o plano carrega
  useEffect(() => {
    if (plan) {
      setTaxa((t) => (t === 0.10 && plan.taxaAnual !== 0.10 ? plan.taxaAnual : t));
      setAporte((a) => (a === 0 ? plan.aporteMensal : a));
      setOtherIdade((v) => (v === 30 ? Math.round(idadeAtual(plan)) : v));
      setOtherPatrimonio((v) => (v === 0 ? patrimAtual : v));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan?.taxaAnual, plan?.aporteMensal, patrimAtual]);

  const view = useMemo(() => {
    if (!plan) return null;
    const meta = metaPatrimonio(plan);
    const idadeNow = idadeAtual(plan);

    const i = Math.pow(1 + taxa, 1 / 12) - 1;

    // Simula mês a mês a partir de uma idade/patrimônio iniciais até os 80 anos.
    function simular(
      idadeStart: number,
      patrimInicial: number,
      opts: { pauseMonths?: number; withdrawNow?: number } = {},
    ) {
      const mesesAte80 = Math.max(0, Math.round((80 - idadeStart) * 12));
      const valores: number[] = new Array(mesesAte80 + 1);
      const startVal = Math.max(0, patrimInicial - (opts.withdrawNow ?? 0));
      valores[0] = startVal;
      let s = startVal;
      const pause = Math.max(0, opts.pauseMonths ?? 0);
      let mesesMeta: number | null = patrimInicial >= meta ? 0 : null;
      for (let m = 1; m <= mesesAte80; m++) {
        const ap = m <= pause ? 0 : aporte;
        s = s * (1 + i) + ap;
        valores[m] = s;
        if (mesesMeta === null && s >= meta) mesesMeta = m;
      }
      const idadeMeta = mesesMeta !== null ? idadeStart + mesesMeta / 12 : null;
      return { idadeStart, valores, idadeMeta };
    }

    const hasImpact = pauseMonths > 0 || withdrawNow > 0;
    const usr = simular(idadeNow, patrimAtual);
    const usrImpact = hasImpact
      ? simular(idadeNow, patrimAtual, { pauseMonths, withdrawNow })
      : null;
    const oth = comparePerson ? simular(otherIdade, otherPatrimonio) : null;

    const idadeMin = Math.min(idadeNow, comparePerson ? otherIdade : idadeNow);
    const idadeMax = 80;

    // Grid único de idades (passo de 3 meses) — todas as séries compartilham o mesmo X,
    // garantindo que o tooltip mostre todos os corredores na mesma idade.
    function valorEm(curva: { idadeStart: number; valores: number[] }, idade: number) {
      if (idade < curva.idadeStart - 1e-9) return undefined;
      const m = Math.round((idade - curva.idadeStart) * 12);
      if (m < 0 || m >= curva.valores.length) return undefined;
      return Math.round(curva.valores[m]);
    }

    type Row = { idade: number; voce?: number; impacto?: number; outro?: number };
    const data_chart: Row[] = [];
    const startGrid = Math.floor(idadeMin * 4) / 4;
    for (let idade = startGrid; idade <= idadeMax + 1e-9; idade += 0.25) {
      const idadeR = Math.round(idade * 100) / 100;
      data_chart.push({
        idade: idadeR,
        voce: valorEm(usr, idadeR),
        impacto: usrImpact ? valorEm(usrImpact, idadeR) : undefined,
        outro: oth ? valorEm(oth, idadeR) : undefined,
      });
    }

    return {
      meta,
      idadeNow,
      data_chart,
      hasImpact,
      idadeMetaUser: usr.idadeMeta,
      idadeMetaImpact: usrImpact?.idadeMeta ?? null,
      idadeMetaOther: oth?.idadeMeta ?? null,
      idadeMin,
      idadeMax,
    };
  }, [plan, patrimAtual, taxa, aporte, comparePerson, otherIdade, otherPatrimonio, pauseMonths, withdrawNow]);

  if (!ready || !plan || !view) return <div className="py-20 text-center text-muted-foreground">Carregando…</div>;

  const {
    meta, data_chart, idadeNow, idadeMetaUser, idadeMetaImpact, idadeMetaOther, hasImpact,
    idadeMin, idadeMax,
  } = view;

  function setAportePreset(p: typeof APORTE_MULTIPLIERS[number]) {
    setAporteMode("preset");
    setAportePresetId(p.id);
    setAporte(Math.round(plan!.aporteMensal * p.mult));
  }

  function applySnapshot(s: ScenarioSnapshot) {
    setTaxa(s.taxa);
    setAporte(s.aporte);
    setAporteMode("custom");
    setComparePerson(s.comparePerson);
    setOtherIdade(s.otherIdade);
    setOtherPatrimonio(s.otherPatrimonio);
    setPauseMonths(s.pauseMonths ?? 0);
    setWithdrawNow(s.withdrawNow ?? 0);
  }
  function saveScenario() {
    const name = newName.trim();
    if (!name) return;
    const snap: ScenarioSnapshot = {
      id: Math.random().toString(36).slice(2, 9),
      name, taxa, aporte,
      comparePerson, otherIdade, otherPatrimonio,
      pauseMonths, withdrawNow,
    };
    const next = [...saved.filter((s) => s.name !== name), snap];
    setSaved(next); persistSaved(next); setNewName("");
  }
  function deleteScenario(id: string) {
    const next = saved.filter((s) => s.id !== id);
    setSaved(next); persistSaved(next);
  }

  const taxaAtivaId = TAXA_OPCOES.find((o) => Math.abs(o.taxa - taxa) < 0.0005)?.id;

  // Tooltip customizado: mostra todos os corredores no mesmo box.
  const SERIES_META: Record<string, { label: string; color: string }> = {
    voce: { label: "Você", color: "var(--primary)" },
    impacto: { label: "Com pausa/saque", color: "var(--pace-behind, var(--accent))" },
    outro: { label: "Outro corredor", color: "var(--pace-behind, var(--accent))" },
  };
  const metaValor = view.meta;
  function ChartTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;
    const ordered = ["voce", "impacto", "outro"];
    const byKey = new Map<string, number>();
    payload.forEach((p: any) => {
      if (typeof p.value === "number") byKey.set(p.dataKey, p.value);
    });
    return (
      <div className="rounded-lg border border-border/60 bg-popover/95 backdrop-blur px-3 py-2 shadow-lg text-xs">
        <div className="font-semibold tabular-nums mb-1.5">
          {(label as number).toFixed(1)} anos
        </div>
        <div className="space-y-1">
          {ordered.map((k) => {
            if (!visible[k as "voce" | "impacto" | "outro"]) return null;
            const v = byKey.get(k);
            if (v === undefined) return null;
            const meta = SERIES_META[k];
            const pct = Math.min(999, Math.round((v / metaValor) * 100));
            return (
              <div key={k} className="flex items-center gap-2">
                <span
                  className="inline-block h-2 w-2 rounded-full shrink-0"
                  style={{ background: meta.color }}
                />
                <span className="text-muted-foreground w-24">{meta.label}</span>
                <span className="font-mono tabular-nums font-semibold ml-auto">
                  {fmtBRL(v)}
                </span>
                <span className="text-muted-foreground tabular-nums w-10 text-right">
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-1.5 pt-1.5 border-t border-border/40 text-[10px] text-muted-foreground">
          Meta: {fmtBRL(metaValor)}
        </div>
      </div>
    );
  }

  const legendItems: Array<{ key: "voce" | "impacto" | "outro"; label: string; color: string; show: boolean }> = [
    { key: "voce", label: "Você", color: "var(--primary)", show: true },
    { key: "impacto", label: "Com pausa/saque", color: "var(--pace-behind, var(--accent))", show: hasImpact },
    { key: "outro", label: "Outro corredor", color: "var(--pace-behind, var(--accent))", show: comparePerson },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Simule seus cenários</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Veja onde você está na curva de quem começou do zero com esses parâmetros.
        </p>
      </div>

      {/* Resumo da simulação — Você sempre primeiro */}
      <section className={cn("grid gap-3", (comparePerson || hasImpact) ? "grid-cols-2" : "grid-cols-1") }>
        <div className="rounded-2xl border-2 border-primary/40 bg-primary/5 p-4">
          <div className="text-[10px] uppercase tracking-wider text-primary font-semibold">
            Você
          </div>
          <div className="text-lg font-bold tabular-nums mt-1 text-primary">
            {idadeMetaUser === null ? "—" : `${idadeMetaUser.toFixed(1)} anos`}
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5 leading-snug">
            Bate a meta<br />Hoje {idadeNow.toFixed(0)}a • {fmtBRL(patrimAtual)}
          </div>
        </div>
        {hasImpact && (
          <div className="rounded-2xl border border-pace-behind/40 bg-pace-behind/5 p-4">
            <div className="text-[10px] uppercase tracking-wider text-pace-behind font-semibold">
              Com pausa/saque
            </div>
            <div className="text-lg font-bold tabular-nums mt-1 text-pace-behind">
              {idadeMetaImpact === null ? "—" : `${idadeMetaImpact.toFixed(1)} anos`}
            </div>
            <div className="text-[10px] text-muted-foreground mt-0.5 leading-snug">
              {idadeMetaUser !== null && idadeMetaImpact !== null
                ? `Atrasa ${(idadeMetaImpact - idadeMetaUser).toFixed(1)} ano${(idadeMetaImpact - idadeMetaUser) >= 1 ? "s" : ""}`
                : "Custo do desvio"}
              <br />
              {pauseMonths > 0 && (pauseMonths >= 9999 ? "Pausa permanente" : `Pausa ${pauseMonths}m`)}
              {pauseMonths > 0 && withdrawNow > 0 && " • "}
              {withdrawNow > 0 && `Saque ${fmtBRL(withdrawNow)}`}
            </div>
          </div>
        )}
        {comparePerson && (
          <div className="rounded-2xl border border-border/60 bg-card p-4">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Outro corredor
            </div>
            <div className="text-lg font-bold tabular-nums mt-1">
              {idadeMetaOther === null ? "—" : `${idadeMetaOther.toFixed(1)} anos`}
            </div>
            <div className="text-[10px] text-muted-foreground mt-0.5 leading-snug">
              Bate a meta<br />Hoje {otherIdade}a • {fmtBRL(otherPatrimonio)}
            </div>
          </div>
        )}
      </section>

      {/* Gráfico: curva desde o zero + sua posição */}
      <section className="rounded-2xl border border-border/60 bg-card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Trajetórias
          </h3>
          <span className="text-[10px] text-muted-foreground">
            Arraste a faixa abaixo para focar num intervalo
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {legendItems.filter((l) => l.show).map((l) => {
            const on = visible[l.key];
            return (
              <button
                key={l.key}
                type="button"
                onClick={() => toggleSeries(l.key)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                  on
                    ? "border-border/60 bg-secondary/40"
                    : "border-border/40 bg-transparent text-muted-foreground/60 line-through",
                )}
                aria-pressed={on}
              >
                <span
                  className="inline-block h-2 w-2 rounded-full shrink-0"
                  style={{ background: on ? l.color : "var(--muted-foreground)" }}
                />
                {l.label}
              </button>
            );
          })}
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data_chart} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
              <XAxis
                dataKey="idade"
                type="number"
                domain={[Math.floor(idadeMin), Math.ceil(idadeMax)]}
                tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                tickFormatter={(v) => `${Math.round(v as number)}a`}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                tickFormatter={(v) => fmtBRL(v as number)}
                width={70}
              />
              <Tooltip
                content={<ChartTooltip />}
                cursor={{ stroke: "var(--primary)", strokeWidth: 1, strokeDasharray: "3 3" }}
              />
              <ReferenceLine y={meta} stroke="var(--primary)" strokeDasharray="6 4" label={{ value: "Meta", position: "right", fill: "var(--primary)", fontSize: 11 }} />
              {visible.voce && <Line
                dataKey="voce"
                stroke="var(--primary)"
                strokeWidth={2.5}
                dot={false}
                name="Você"
                connectNulls
                isAnimationActive={false}
              />}
              {hasImpact && visible.impacto && (
                <Line
                  dataKey="impacto"
                  stroke="var(--pace-behind, var(--accent))"
                  strokeWidth={2}
                  strokeDasharray="5 4"
                  dot={false}
                  name="Com pausa/saque"
                  connectNulls
                  isAnimationActive={false}
                />
              )}
              {comparePerson && visible.outro && (
                <Line
                  dataKey="outro"
                  stroke="var(--pace-behind, var(--accent))"
                  strokeWidth={2}
                  strokeDasharray="2 3"
                  dot={false}
                  name="Outro corredor"
                  connectNulls
                  isAnimationActive={false}
                />
              )}
              <Brush
                dataKey="idade"
                height={24}
                travellerWidth={10}
                stroke="var(--primary)"
                fill="var(--secondary)"
                tickFormatter={(v) => `${Math.round(v as number)}a`}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[10px] text-muted-foreground leading-relaxed mt-2">
          Cada curva é independente — todas usam {(taxa * 100).toFixed(1)}% a.a. e
          {" "}{fmtBRL(aporte)}/mês, mas partem de idades e patrimônios diferentes.
        </p>
      </section>

      {/* Comparar com outro corredor */}
      {/* Toggle: Aporte */}
      <section className="rounded-2xl border border-border/60 bg-card p-3 space-y-2.5">
        <div className="flex items-baseline justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Aporte mensal
          </h3>
          <span className="font-mono text-base text-primary font-bold tabular-nums">
            {fmtBRL(aporte)}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {APORTE_MULTIPLIERS.map((p) => {
            const active = aporteMode === "preset" && aportePresetId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setAportePreset(p)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border/60 bg-secondary/40 hover:border-primary/40",
                )}
              >
                {p.label}
              </button>
            );
          })}
        </div>
        <div className="pt-1">
          {(() => {
            const aporteMax = Math.max(Math.round(plan.aporteMensal * 2), 5000);
            const step = aporteMax >= 20000 ? 500 : aporteMax >= 5000 ? 100 : 50;
            return (
              <>
                <input
                  type="range"
                  min={0}
                  max={aporteMax}
                  step={step}
                  value={Math.min(aporte, aporteMax)}
                  onChange={(e) => {
                    setAporteMode("custom");
                    setAporte(Number(e.target.value));
                  }}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-[9px] text-muted-foreground font-mono mt-0.5">
                  <span>{fmtBRL(0)}</span>
                  <span>{fmtBRL(Math.round(aporteMax / 2))}</span>
                  <span>{fmtBRL(aporteMax)}</span>
                </div>
              </>
            );
          })()}
        </div>
        <p className="text-[10px] text-muted-foreground">
          Plano: <span className="font-semibold">{fmtBRL(plan.aporteMensal)}/mês</span>
        </p>
      </section>

      {/* Toggle: Rentabilidade */}
      <section className="rounded-2xl border border-border/60 bg-card p-3 space-y-2.5">
        <div className="flex items-baseline justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Rentabilidade
          </h3>
          <span className="font-mono text-base text-primary font-bold tabular-nums">
            {(taxa * 100).toFixed(1)}%<span className="text-[10px] font-normal text-muted-foreground ml-0.5">a.a.</span>
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {TAXA_OPCOES.map((o) => {
            const active = taxaAtivaId === o.id;
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => setTaxa(o.taxa)}
                title={o.desc}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border/60 bg-secondary/40 hover:border-primary/40",
                )}
              >
                {o.label}
                <span className={cn("ml-1 font-mono", active ? "opacity-90" : "text-muted-foreground")}>
                  {(o.taxa * 100).toFixed(0)}%
                </span>
              </button>
            );
          })}
        </div>
        <div className="pt-1">
          <input
            type="range"
            min={0}
            max={20}
            step={0.5}
            value={taxa * 100}
            onChange={(e) => setTaxa(Number(e.target.value) / 100)}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-[9px] text-muted-foreground font-mono mt-0.5">
            <span>0%</span><span>10%</span><span>20%</span>
          </div>
        </div>
      </section>

      {/* Comparações: outro corredor */}
      <section className="rounded-2xl border border-border/60 bg-card p-3 space-y-3">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Comparações
          </h3>
        </div>

        <div className="rounded-xl border border-border/40 bg-secondary/20 p-2.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-semibold">Outro corredor</div>
            <Switch checked={comparePerson} onCheckedChange={setComparePerson} />
          </div>
          {comparePerson && (
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Idade hoje
                </label>
                <Input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={100}
                  value={otherIdade}
                  onChange={(e) => setOtherIdade(Math.max(0, Math.min(100, Number(e.target.value) || 0)))}
                  className="h-9"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Patrimônio atual
                </label>
                <CurrencyInput
                  value={otherPatrimonio}
                  onChange={setOtherPatrimonio}
                  className="h-9"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Cenários defensivos */}
      <section className="rounded-2xl border border-border/60 bg-card p-3 space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-pace-behind" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            E se eu atrasar ou parar?
          </h3>
        </div>
        <p className="text-[11px] text-muted-foreground -mt-1">
          Aplica-se à <span className="font-semibold">sua</span> curva. Útil para ver o custo real de uma pausa ou um saque.
        </p>

        <div className="rounded-xl border border-border/40 bg-secondary/20 p-2.5 space-y-2">
          <div className="flex items-baseline justify-between">
            <div className="text-[11px] font-semibold">Pausar aportes por</div>
            <span className="font-mono text-sm tabular-nums">
              {pauseMonths >= 9999
                ? "para sempre"
                : `${pauseMonths} ${pauseMonths === 1 ? "mês" : "meses"}`}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={60}
            step={1}
            value={Math.min(pauseMonths, 60)}
            onChange={(e) => setPauseMonths(Number(e.target.value))}
            className="w-full accent-primary disabled:opacity-50"
            disabled={pauseMonths >= 9999}
          />
          <div className="flex flex-wrap gap-1.5">
            {[0, 3, 6, 12, 24].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPauseMonths(n)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                  pauseMonths === n
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border/60 bg-secondary/40 hover:border-primary/40",
                )}
              >
                {n === 0 ? "sem pausa" : `${n}m`}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPauseMonths(9999)}
              className={cn(
                "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                pauseMonths >= 9999
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border/60 bg-secondary/40 hover:border-primary/40",
              )}
            >
              permanente
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-border/40 bg-secondary/20 p-2.5 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="text-[11px] font-semibold">Sacar agora</div>
            <CurrencyInput
              value={withdrawNow}
              onChange={setWithdrawNow}
              className="h-9 w-36"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[0, 10000, 50000, 100000].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setWithdrawNow(n)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                  withdrawNow === n
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border/60 bg-secondary/40 hover:border-primary/40",
                )}
              >
                {n === 0 ? "nenhum" : fmtBRL(n)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Cenários salvos */}
      <section className="rounded-2xl border border-border/60 bg-card p-3 space-y-3">
        <div className="flex items-center gap-2">
          <Save className="h-4 w-4 text-primary" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Cenários salvos
          </h3>
        </div>
        <p className="text-[11px] text-muted-foreground -mt-1">
          Salve combinações ("Plano A: agressivo", "Plano B: realista") para alternar com 1 toque.
        </p>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Nome do cenário"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="h-9"
          />
          <Button size="sm" onClick={saveScenario} disabled={!newName.trim()}>
            Salvar atual
          </Button>
        </div>
        {saved.length > 0 && (
          <ul className="space-y-1.5">
            {saved.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between gap-2 rounded-lg border border-border/40 bg-secondary/20 px-2.5 py-1.5"
              >
                <button
                  type="button"
                  onClick={() => applySnapshot(s)}
                  className="flex-1 min-w-0 text-left"
                >
                  <div className="text-sm font-medium truncate">{s.name}</div>
                  <div className="text-[10px] text-muted-foreground tabular-nums">
                    {(s.taxa * 100).toFixed(1)}% • {fmtBRL(s.aporte)}/mês
                    {s.pauseMonths > 0
                      ? s.pauseMonths >= 9999
                        ? " • pausa permanente"
                        : ` • pausa ${s.pauseMonths}m`
                      : ""}
                    {s.withdrawNow > 0 ? ` • saque ${fmtBRL(s.withdrawNow)}` : ""}
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => deleteScenario(s.id)}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-pace-behind hover:bg-secondary/40"
                  aria-label={`Excluir ${s.name}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
