import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { Flag, TrendingUp, Wallet, Trophy, PlusCircle } from "lucide-react";
import { useMaratona } from "@/lib/maratona/store";
import {
  derivarEntries,
  fmtBRL,
  fmtKm,
  fmtPct,
  linhaIdeal,
  metaPatrimonio,
  taxaMensal,
  chegadaPrevistaAlvo,
  chegadaPrevistaDe,
  formatRef,
} from "@/lib/maratona/math";
import { gerarInsights, mensagemPrincipal } from "@/lib/maratona/insights";
import { Track } from "@/components/maratona/Track";
import { MetaExplain } from "@/components/maratona/MetaExplain";
import { PaceCard } from "@/components/maratona/PaceCard";
import { calcularPace } from "@/lib/maratona/pace";
import { Button } from "@/components/ui/button";
import { MARATHON_KM } from "@/lib/maratona/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pista — Maratona Financeira" },
      { name: "description", content: "Visualize seu progresso na maratona patrimonial." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { ready, hasPlan, data } = useMaratona();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && !hasPlan) navigate({ to: "/onboarding" });
  }, [ready, hasPlan, navigate]);

  const view = useMemo(() => {
    if (!data?.plan) return null;
    const plan = data.plan;
    const derived = derivarEntries(plan, data.entries);
    const passed = derived.length;
    const last = derived[derived.length - 1];
    const realPatrim = last?.patrimonio ?? plan.patrimonioInicial;
    // Tempo percorrido = quanto tempo o patrimônio REAL atual representa na
    // régua simulada (partindo de 0 com aportes+juros do plano). Tempo total =
    // quanto tempo levaria do 0 até a meta. Assim não há dupla contagem entre
    // "trecho pré-plano" e "entries históricas importadas".
    const mesAbs = (() => {
      const i = taxaMensal(plan.taxaAnual);
      if (plan.aporteMensal <= 0 && i <= 0) return 0;
      let s = 0;
      for (let m = 1; m <= 12 * 80; m++) {
        s = s * (1 + i) + plan.aporteMensal;
        if (s >= realPatrim) return m;
      }
      return 12 * 80;
    })();
    const totalAbs = (() => {
      const i = taxaMensal(plan.taxaAnual);
      const meta = metaPatrimonio(plan);
      if (plan.aporteMensal <= 0 && i <= 0) return 12 * 80;
      let s = 0;
      for (let m = 1; m <= 12 * 80; m++) {
        s = s * (1 + i) + plan.aporteMensal;
        if (s >= meta) return m;
      }
      return 12 * 80;
    })();
    // Meses restantes na maratona = quanto falta na régua simulada para chegar à meta.
    const mesesRestantes = Math.max(0, totalAbs - mesAbs);
    // Meses decorridos desde o início do plano (calendário), independente de registros.
    const mesesDesdeInicio = (() => {
      const ini = new Date(plan.dataInicio);
      const now = new Date();
      const m = (now.getFullYear() - ini.getFullYear()) * 12 + (now.getMonth() - ini.getMonth());
      return Math.max(0, m);
    })();
    // Patrimônio ideal = onde o plano projeta você estar HOJE (tempo de calendário).
    const mesesIdeal = Math.max(passed, mesesDesdeInicio);
    const idealLong = linhaIdeal(plan, Math.max(mesesIdeal, 1));
    const idealAtual = idealLong[mesesIdeal] ?? plan.patrimonioInicial;
    // Sem histórico: não classificar desempenho.
    const status: "ahead" | "on" | "behind" =
      last && last.status ? last.status : "on";
    const hasHistory = derived.length > 0;
    const insights = gerarInsights(
      plan,
      derived.map((e) => ({
        ...e,
        ideal: e.ideal ?? 0,
        delta: e.delta ?? 0,
        status: e.status ?? "on",
      })),
    );
    // Projeção a partir do patrimônio ATUAL (não do inicial do plano).
    const chegada = chegadaPrevistaDe(plan, realPatrim);

    const pace = calcularPace(plan, derived);

    // Ritmo ideal /mês: quanto o patrimônio precisa crescer em média por mês
    // para sair do patrimônio ATUAL e chegar à meta no prazo restante.
    const meta = metaPatrimonio(plan);
    const valorRestante = Math.max(0, meta - realPatrim);
    const ritmoIdealMensal =
      mesesRestantes > 0 ? valorRestante / mesesRestantes : 0;
    // Ritmo real: média de crescimento mensal sobre os meses registrados.
    // Usa o primeiro registro como linha de base (em vez do patrimonioInicial
    // do plano, que pode não corresponder ao início da série histórica).
    const ritmoRealMensal = (() => {
      if (passed < 2) return 0;
      const primeiro = derived[0].patrimonio;
      const ultimo = derived[passed - 1].patrimonio;
      return (ultimo - primeiro) / (passed - 1);
    })();

    const distanciaRS = Math.max(0, meta - realPatrim);

    // Streak: total de meses registrados (entries são sequenciais por design).
    const streak = data.entries.length;

    return {
      plan, meta, totalAbs, mesAbs,
      passed, status, last, derived, insights, hasHistory,
      idealAtual, realPatrim, ritmoIdealMensal, ritmoRealMensal,
      distanciaRS, mesesRestantes, streak,
      chegada, pace,
    };
  }, [data]);

  if (!ready || !view) {
    return <div className="py-20 text-center text-muted-foreground">Carregando…</div>;
  }

  const { plan, meta, totalAbs, mesAbs, status, last, idealAtual, realPatrim,
    distanciaRS, mesesRestantes,
    insights, streak, hasHistory, chegada, pace } = view;

  // Marcos intermediários — mostra quando você atinge cada nível.
  const marcos = (() => {
    // Distâncias clássicas de corrida mapeadas para o patrimônio
    // correspondente na régua simulada (0 → meta em totalAbs meses).
    const distancias = [
      { label: "5K", km: 5 },
      { label: "10K", km: 10 },
      { label: "16K", km: 16 },
      { label: "21K", km: 21.0975 },
      { label: "30K", km: 30 },
      { label: "42K", km: MARATHON_KM },
    ];
    const i = taxaMensal(plan.taxaAnual);
    // Pré-computa trajetória simulada (0 → meta) usada para totalAbs.
    const traj: number[] = [0];
    let s = 0;
    for (let m = 1; m <= totalAbs; m++) {
      s = s * (1 + i) + plan.aporteMensal;
      traj.push(s);
    }
    return distancias.map((d) => {
      const mesAlvo = Math.min(totalAbs, Math.max(1, Math.round((d.km / MARATHON_KM) * totalAbs)));
      const alvo = traj[mesAlvo] ?? meta;
      return { label: d.label, alvo, prev: chegadaPrevistaAlvo(plan, alvo, realPatrim) };
    });
  })();

  const vantagemForte = plan.patrimonioInicial >= 0.7 * meta;
  const mensagem = vantagemForte && !hasHistory
    ? "Você já iniciou com vantagem significativa"
    : mensagemPrincipal(status, streak);
  const delta = realPatrim - idealAtual;
  // % e km baseados em TEMPO percorrido na régua simulada.
  const pctMaratona = Math.min(1, Math.max(0, mesAbs / Math.max(1, totalAbs)));
  const km = pctMaratona * MARATHON_KM;

  // Status simples do plano (3 estados) baseado em delta vs ideal.
  // Tolerância de 3% sobre o ideal para considerar "no plano".
  const tol = Math.max(idealAtual * 0.03, 1);
  const planStatus: "ahead" | "on" | "behind" = !hasHistory
    ? "on"
    : delta > tol
      ? "ahead"
      : delta < -tol
        ? "behind"
        : "on";

  // Insight principal acionável (linguagem natural).
  const insightPrincipal = (() => {
    if (!hasHistory) {
      if (vantagemForte) return "Você já construiu grande parte do necessário para sua meta.";
      return "Registre seu primeiro mês para acompanhar seu progresso.";
    }
    if (planStatus === "ahead") {
      return "Você está acelerando — nesse ritmo, chega antes do plano base.";
    }
    if (planStatus === "behind") {
      return "Você está desacelerando. Um aporte extra recoloca a chegada no prazo.";
    }
    return "Você está exatamente no ritmo do seu plano base. Continue firme.";
  })();

  // Sugestão de ajuste opcional: quanto a mais por mês para antecipar 12 meses.
  const ajuste = (() => {
    if (!hasHistory || mesesRestantes <= 12) return null;
    const alvoMeses = Math.max(1, mesesRestantes - 12);
    // Busca aporte que faz cruzar a meta em alvoMeses partindo do patrimônio atual.
    const i = taxaMensal(plan.taxaAnual);
    const simular = (aporte: number) => {
      let s = realPatrim;
      for (let m = 1; m <= alvoMeses; m++) {
        s = s * (1 + i) + aporte;
      }
      return s;
    };
    let lo = plan.aporteMensal;
    let hi = plan.aporteMensal + 50000;
    if (simular(hi) < meta) return null;
    for (let k = 0; k < 40; k++) {
      const mid = (lo + hi) / 2;
      if (simular(mid) >= meta) hi = mid;
      else lo = mid;
    }
    const extra = Math.max(0, hi - plan.aporteMensal);
    if (extra < 50) return null;
    return extra;
  })();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero */}
      <section className="rounded-2xl border border-border/60 bg-card p-5 relative overflow-hidden">
        <div
          className="absolute -top-20 -right-20 h-48 w-48 rounded-full opacity-20 blur-3xl"
          style={{ background: "var(--gradient-progress)" }}
        />
        <div className="relative">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-primary font-semibold">
            <Flag className="h-3.5 w-3.5" /> Sua maratona
          </div>
          <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight leading-snug">
            {chegada
              ? <>No ritmo atual, você se aposenta aos{" "}
                  <span className="text-primary tabular-nums">{chegada.idade.toFixed(1)} anos</span>
                  <span className="text-muted-foreground font-medium"> — em {formatRef(chegada.ref)}.</span>
                </>
              : <>Vamos traçar quando sua aposentadoria pode acontecer.</>}
          </h2>
          <p className="text-xs text-muted-foreground mt-2">
            Já são <span className="font-semibold text-foreground tabular-nums">{fmtPct(pctMaratona, 1)}</span> da maratona
            {" • "}faltam <span className="font-semibold text-foreground tabular-nums">{mesesRestantes} meses</span>
            {" • "}meta de{" "}
            <MetaExplain plan={plan} className="font-semibold text-foreground tabular-nums">
              <span className="tabular-nums">{fmtBRL(meta)}</span>
            </MetaExplain>{" "}
            para {fmtBRL(plan.rendaMensalDesejada)}/mês
          </p>

          <Track km={km} />

          <div className="grid grid-cols-3 gap-3 mt-2 items-end">
            <Stat label="KM atual" value={fmtKm(km)} align="bottom" />
            <Stat label="Falta" value={fmtKm(MARATHON_KM - km)} align="bottom" />
            <Stat label="Meses restantes" value={String(mesesRestantes)} align="bottom" />
          </div>
        </div>
      </section>

      {/* Patrimônio atual */}
      <section className="rounded-2xl border border-border/60 bg-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
            <Wallet className="h-3 w-3" /> Patrimônio
          </div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground tabular-nums">
            {last ? `Atualizado em ${formatRef(last.ref)}` : "Sem registros"}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-secondary/40 p-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Já conquistado
            </div>
            <div className="text-lg font-bold tabular-nums mt-0.5 text-pace-ahead">
              {fmtBRL(realPatrim)}
            </div>
          </div>
          <div className="rounded-xl bg-secondary/40 p-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Falta
            </div>
            <div className="text-lg font-bold tabular-nums mt-0.5">
              {fmtBRL(distanciaRS)}
            </div>
          </div>
        </div>
      </section>

      {/* Ações rápidas */}
      <section className="grid grid-cols-2 gap-3">
        <Link
          to="/atualizar"
          className="group rounded-2xl border border-primary/40 bg-primary/10 hover:bg-primary/15 transition-colors p-4 flex flex-col items-start gap-2"
        >
          <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <div className="font-semibold leading-tight">Atualizar patrimônio</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              Registre o saldo do mês
            </div>
          </div>
        </Link>
        <Link
          to="/atualizar"
          hash="aporte"
          className="group rounded-2xl border border-border/60 bg-card hover:bg-secondary/40 transition-colors p-4 flex flex-col items-start gap-2"
        >
          <div className="h-10 w-10 rounded-xl bg-secondary/60 flex items-center justify-center text-foreground">
            <PlusCircle className="h-5 w-5" />
          </div>
          <div>
            <div className="font-semibold leading-tight">Registrar aporte</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              Adicione o que você guardou
            </div>
          </div>
        </Link>
      </section>

      {/* Pace */}
      <PaceCard pace={pace} />

      {/* Último mês */}
      {last && (
        <section className="rounded-2xl border border-border/60 bg-card p-5">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Último mês
            </h3>
            <span className="text-xs text-muted-foreground tabular-nums">
              {formatRef(last.ref)}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-3 items-start">
            <Stat label="Ganho total" value={fmtBRL(last.aportes + last.rentabilidade)} />
            <Stat label="Por aportes" value={fmtBRL(last.aportes)} />
            <Stat
              label="Rentabilidade"
              value={fmtBRL(last.rentabilidade)}
              hint={fmtPct(last.rentabilidadePct, 2)}
            />
          </div>
        </section>
      )}

      {/* Ajuste opcional */}
      {ajuste !== null && (
        <section className="rounded-2xl border border-border/60 bg-card p-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground font-semibold">
            <TrendingUp className="h-3.5 w-3.5" /> Ajuste opcional
          </div>
          <div className="text-sm mt-2">
            Para antecipar sua meta em <strong>1 ano</strong>, aumente seus aportes em{" "}
            <strong className="text-pace-ahead">{fmtBRL(ajuste)}/mês</strong>.
          </div>
        </section>
      )}

      {/* Marcos intermediários */}
      <section className="rounded-2xl border border-border/60 bg-card p-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-3">
          <Trophy className="h-3.5 w-3.5" /> Marcos no caminho
        </div>
        <ul className="divide-y divide-border/40">
          {marcos.map((m) => {
            const done = m.prev?.jaAtingido;
            return (
              <li key={m.label} className="py-2 flex items-baseline justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium">{m.label}</div>
                  <div className="text-[10px] text-muted-foreground tabular-nums">
                    {fmtBRL(m.alvo)}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  {done ? (
                    <span className="text-xs font-semibold text-pace-ahead">Atingido</span>
                  ) : m.prev ? (
                    <>
                      <div className="text-sm font-semibold tabular-nums">
                        {m.prev.idade.toFixed(1)} anos
                      </div>
                      <div className="text-[10px] text-muted-foreground tabular-nums">
                        {formatRef(m.prev.ref)}
                      </div>
                    </>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
        <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">
          Estimativas com aporte e taxa do plano atual.
        </p>
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
  accent,
  align = "top",
}: {
  label: string;
  value: string;
  hint?: string;
  accent?: string;
  align?: "top" | "bottom";
}) {
  const labelAlign = align === "bottom" ? "items-end" : "items-start";
  return (
    <div className="text-center flex flex-col">
      <div className={`text-[10px] uppercase tracking-wider text-muted-foreground min-h-[2.2em] flex ${labelAlign} justify-center`}>{label}</div>
      <div className={`text-base font-bold tabular-nums mt-0.5 ${accent ?? ""}`}>{value}</div>
      {hint && <div className="text-[10px] text-muted-foreground mt-0.5">{hint}</div>}
    </div>
  );
}

function nextRefLabel(entries: { ref: string }[]): string {
  if (entries.length === 0) {
    const d = new Date();
    return `${["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"][d.getMonth()]}/${d.getFullYear()}`;
  }
  const last = entries[entries.length - 1].ref;
  const [y, m] = last.split("-").map(Number);
  const d = new Date(y, m, 1);
  return `${["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"][d.getMonth()]}/${d.getFullYear()}`;
}
