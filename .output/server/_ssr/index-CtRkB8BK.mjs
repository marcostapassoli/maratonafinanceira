import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useMaratona, M as MARATHON_KM, c as cn } from "./router-BPjxctTH.mjs";
import { d as derivarEntries, t as taxaMensal, g as metaPatrimonio, o as linhaIdeal, r as chegadaPrevistaDe, s as chegadaPrevistaAlvo, c as formatRef, b as fmtPct, f as fmtBRL, e as fmtKm, n as prazoMeses } from "./math-5GrSvXuq.mjs";
import { M as MetaExplain } from "./MetaExplain-lTrKXXdx.mjs";
import { c as calcularPace, P as PaceCard } from "./PaceCard-ATg0ePvI.mjs";
import "../_libs/sonner.mjs";
import { F as Flag, W as Wallet, u as CirclePlus, i as TrendingUp, T as Trophy } from "../_libs/lucide-react.mjs";

import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/unenv.mjs";


import "../_libs/seroval-plugins.mjs";


import "../_libs/react-dom.mjs";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/tslib.mjs";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/zod.mjs";
import "./dialog-D_tSw37C.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
function gerarInsights(plan, derived) {
  const insights = [];
  if (derived.length === 0) return insights;
  const last = derived[derived.length - 1];
  const avgRentPct = derived.reduce((acc, e) => acc + e.rentabilidadePct, 0) / derived.length;
  if (derived.length >= 2 && last.rentabilidadePct > avgRentPct + 5e-3) {
    insights.push({
      id: "rent-acima",
      tone: "positive",
      title: "Mês acima da média",
      message: `Sua rentabilidade foi ${fmtPct(last.rentabilidadePct, 2)}, acima da sua média histórica de ${fmtPct(avgRentPct, 2)}.`
    });
  }
  if (last.aportes + 1 < plan.aporteMensal) {
    const falta = plan.aporteMensal - last.aportes;
    insights.push({
      id: "aporte-baixo",
      tone: "warning",
      title: "Aporte menor que o planejado",
      message: `Faltaram ${fmtBRL(falta)} para bater o aporte do mês. Consistência vence velocidade.`
    });
  } else if (last.aportes >= plan.aporteMensal) {
    insights.push({
      id: "aporte-ok",
      tone: "positive",
      title: "Aporte em dia",
      message: `Você manteve o aporte planejado este mês. Continue assim!`
    });
  }
  const ult = derived.slice(-2);
  if (ult.length === 2 && ult.every((e) => e.status === "behind")) {
    insights.push({
      id: "atraso",
      tone: "warning",
      title: "Abaixo do ritmo há 2 meses",
      message: `Que tal um aporte extra ou revisar a estratégia? Pequenos ajustes recolocam você na pista.`
    });
  }
  if (last.status === "ahead") {
    insights.push({
      id: "frente",
      tone: "positive",
      title: "Você está à frente do plano",
      message: `Seu patrimônio está ${fmtBRL(last.delta ?? 0)} acima da linha ideal. Excelente!`
    });
  }
  const prazo = prazoMeses(plan);
  const kmAgora = derived.length / prazo * MARATHON_KM;
  const kmAntes = (derived.length - 1) / prazo * MARATHON_KM;
  const marcos = [5, 10, 21.1, 30, 42.195];
  for (const m of marcos) {
    if (kmAntes < m && kmAgora >= m) {
      insights.push({
        id: `marco-${m}`,
        tone: "positive",
        title: `Marco de ${m} km cruzado!`,
        message: m === 42.195 ? "Você completou a maratona do tempo. Parabéns pela disciplina!" : `Mais um marco conquistado. Siga firme até a chegada.`
      });
    }
  }
  return insights.slice(0, 4);
}
const MARCOS = [
  { km: 5, label: "5K" },
  { km: 10, label: "10K" },
  { km: 21.1, label: "21K" },
  { km: 30, label: "30K" },
  { km: 42.195, label: "42K" }
];
function Track({ km, status, financialKm }) {
  const pct = Math.min(100, Math.max(0, km / MARATHON_KM * 100));
  const finPct = typeof financialKm === "number" ? Math.min(100, Math.max(0, financialKm / MARATHON_KM * 100)) : null;
  const statusColor = status === "ahead" ? "bg-pace-ahead text-background" : status === "behind" ? "bg-pace-behind text-background" : "bg-pace-on text-background";
  const statusLabel = status === "ahead" ? "Acima do ritmo" : status === "behind" ? "Abaixo do ritmo" : "Dentro do ritmo";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full pt-7 pb-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-3 w-full rounded-full bg-secondary overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "absolute inset-y-0 left-0 rounded-full transition-[width] duration-700 ease-out",
          style: {
            width: `${pct}%`,
            background: "var(--gradient-progress)",
            boxShadow: "var(--shadow-glow)"
          }
        }
      ),
      MARCOS.map((m) => {
        const p = m.km / MARATHON_KM * 100;
        const reached = pct >= p;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: cn(
              "absolute top-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-1 rounded-sm transition-colors",
              reached ? "bg-primary" : "bg-muted-foreground/40"
            ),
            style: { left: `${p}%` }
          },
          m.km
        );
      })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative h-5 mt-2", children: MARCOS.map((m) => {
      const p = m.km / MARATHON_KM * 100;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "absolute -translate-x-1/2 text-[10px] font-mono text-muted-foreground",
          style: { left: `${p}%` },
          children: m.label
        },
        m.km
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "absolute -top-1 -translate-x-1/2 transition-[left] duration-700 ease-out",
        style: { left: `${pct}%`, top: 0 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-1 animate-fade-in", children: [
          status && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: cn(
                "px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap shadow-md",
                statusColor
              ),
              children: statusLabel
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "text-2xl drop-shadow-lg [transform:scaleX(-1)]",
              "aria-label": "runner",
              children: "🏃"
            }
          )
        ] })
      }
    ),
    finPct !== null && Math.abs(finPct - pct) > 0.5 && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "absolute -translate-x-1/2 transition-[left] duration-700",
        style: { left: `${finPct}%`, top: "calc(50% + 8px)" },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-3 rounded-full bg-accent border-2 border-background shadow" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-accent font-mono mt-0.5", children: "$" })
        ] })
      }
    )
  ] }) });
}
function Dashboard() {
  const {
    ready,
    hasPlan,
    data
  } = useMaratona();
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    if (ready && !hasPlan) navigate({
      to: "/onboarding"
    });
  }, [ready, hasPlan, navigate]);
  const view = reactExports.useMemo(() => {
    if (!data?.plan) return null;
    try {
      const plan2 = data.plan;
      const derived = derivarEntries(plan2, data.entries);
      const passed = derived.length;
      const last2 = derived[derived.length - 1];
      const realPatrim2 = last2?.patrimonio ?? plan2.patrimonioInicial;
      const mesAbs2 = (() => {
        const i = taxaMensal(plan2.taxaAnual);
        if (plan2.aporteMensal <= 0 && i <= 0) return 0;
        let s = 0;
        for (let m = 1; m <= 12 * 80; m++) {
          s = s * (1 + i) + plan2.aporteMensal;
          if (s >= realPatrim2) return m;
        }
        return 12 * 80;
      })();
      const totalAbs2 = (() => {
        const i = taxaMensal(plan2.taxaAnual);
        const meta3 = metaPatrimonio(plan2);
        if (plan2.aporteMensal <= 0 && i <= 0) return 12 * 80;
        let s = 0;
        for (let m = 1; m <= 12 * 80; m++) {
          s = s * (1 + i) + plan2.aporteMensal;
          if (s >= meta3) return m;
        }
        return 12 * 80;
      })();
      const mesesRestantes2 = Math.max(0, totalAbs2 - mesAbs2);
      const mesesDesdeInicio = (() => {
        const ini = new Date(plan2.dataInicio);
        const now = /* @__PURE__ */ new Date();
        const m = (now.getFullYear() - ini.getFullYear()) * 12 + (now.getMonth() - ini.getMonth());
        return Math.max(0, m);
      })();
      const mesesIdeal = Math.max(passed, mesesDesdeInicio);
      const idealLong = linhaIdeal(plan2, Math.max(mesesIdeal, 1));
      const idealAtual2 = idealLong[mesesIdeal] ?? plan2.patrimonioInicial;
      const status2 = last2 && last2.status ? last2.status : "on";
      const hasHistory2 = derived.length > 0;
      const insights2 = gerarInsights(plan2, derived.map((e) => ({
        ...e,
        ideal: e.ideal ?? 0,
        delta: e.delta ?? 0,
        status: e.status ?? "on"
      })));
      const chegada2 = chegadaPrevistaDe(plan2, realPatrim2);
      const pace2 = calcularPace(plan2, derived);
      const meta2 = metaPatrimonio(plan2);
      const valorRestante = Math.max(0, meta2 - realPatrim2);
      const ritmoIdealMensal = mesesRestantes2 > 0 ? valorRestante / mesesRestantes2 : 0;
      const ritmoRealMensal = (() => {
        if (passed < 2) return 0;
        const primeiro = derived[0].patrimonio;
        const ultimo = derived[passed - 1].patrimonio;
        return (ultimo - primeiro) / (passed - 1);
      })();
      const distanciaRS2 = Math.max(0, meta2 - realPatrim2);
      const streak2 = data.entries.length;
      return {
        plan: plan2,
        meta: meta2,
        totalAbs: totalAbs2,
        mesAbs: mesAbs2,
        passed,
        status: status2,
        last: last2,
        derived,
        insights: insights2,
        hasHistory: hasHistory2,
        idealAtual: idealAtual2,
        realPatrim: realPatrim2,
        ritmoIdealMensal,
        ritmoRealMensal,
        distanciaRS: distanciaRS2,
        mesesRestantes: mesesRestantes2,
        streak: streak2,
        chegada: chegada2,
        pace: pace2
      };
    } catch (err) {
      console.error("Dashboard useMemo error:", err);
      return null;
    }
  }, [data]);
  if (!ready || !view) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-20 text-center text-muted-foreground", children: "Carregando…" });
  }
  const {
    plan,
    meta,
    totalAbs,
    mesAbs,
    status,
    last,
    idealAtual,
    realPatrim,
    distanciaRS,
    mesesRestantes,
    insights,
    streak,
    hasHistory,
    chegada,
    pace
  } = view;
  const marcos = (() => {
    const distancias = [{
      label: "5K",
      km: 5
    }, {
      label: "10K",
      km: 10
    }, {
      label: "16K",
      km: 16
    }, {
      label: "21K",
      km: 21.0975
    }, {
      label: "30K",
      km: 30
    }, {
      label: "42K",
      km: MARATHON_KM
    }];
    const i = taxaMensal(plan.taxaAnual);
    const traj = [0];
    let s = 0;
    for (let m = 1; m <= totalAbs; m++) {
      s = s * (1 + i) + plan.aporteMensal;
      traj.push(s);
    }
    return distancias.map((d) => {
      const mesAlvo = Math.min(totalAbs, Math.max(1, Math.round(d.km / MARATHON_KM * totalAbs)));
      const alvo = traj[mesAlvo] ?? meta;
      return {
        label: d.label,
        alvo,
        prev: chegadaPrevistaAlvo(plan, alvo, realPatrim)
      };
    });
  })();
  plan.patrimonioInicial >= 0.7 * meta;
  const pctMaratona = Math.min(1, Math.max(0, mesAbs / Math.max(1, totalAbs)));
  const km = pctMaratona * MARATHON_KM;
  const ajuste = (() => {
    if (!hasHistory || mesesRestantes <= 12) return null;
    const alvoMeses = Math.max(1, mesesRestantes - 12);
    const i = taxaMensal(plan.taxaAnual);
    const simular = (aporte) => {
      let s = realPatrim;
      for (let m = 1; m <= alvoMeses; m++) {
        s = s * (1 + i) + aporte;
      }
      return s;
    };
    let lo = plan.aporteMensal;
    let hi = plan.aporteMensal + 5e4;
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-border/60 bg-card p-5 relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-20 -right-20 h-48 w-48 rounded-full opacity-20 blur-3xl", style: {
        background: "var(--gradient-progress)"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs uppercase tracking-widest text-primary font-semibold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Flag, { className: "h-3.5 w-3.5" }),
          " Sua maratona"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 text-2xl sm:text-3xl font-bold tracking-tight leading-snug", children: chegada ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          "No ritmo atual, você se aposenta aos",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary tabular-nums", children: [
            chegada.idade.toFixed(1),
            " anos"
          ] }),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-sm font-semibold text-primary align-middle", children: formatRef(chegada.ref) })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: "Vamos traçar quando sua aposentadoria pode acontecer." }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-2", children: [
          "Já são ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground tabular-nums", children: fmtPct(pctMaratona, 1) }),
          " da maratona",
          " • ",
          "faltam ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-foreground tabular-nums", children: [
            mesesRestantes,
            " meses"
          ] }),
          " • ",
          "meta de",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(MetaExplain, { plan, className: "font-semibold text-foreground tabular-nums", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums", children: fmtBRL(meta) }) }),
          " ",
          "para ",
          fmtBRL(plan.rendaMensalDesejada),
          "/mês"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Track, { km }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3 mt-2 items-end", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "KM atual", value: fmtKm(km), align: "bottom" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Falta", value: fmtKm(MARATHON_KM - km), align: "bottom" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Meses restantes", value: String(mesesRestantes), align: "bottom" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-border/60 bg-card p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-3 w-3" }),
          " Patrimônio"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-wider text-muted-foreground tabular-nums", children: last ? `Atualizado em ${formatRef(last.ref)}` : "Sem registros" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-secondary/40 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "Já conquistado" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-bold tabular-nums mt-0.5 text-pace-ahead", children: fmtBRL(realPatrim) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-secondary/40 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "Falta" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-bold tabular-nums mt-0.5", children: fmtBRL(distanciaRS) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/atualizar", className: "group rounded-2xl border border-primary/40 bg-primary/10 hover:bg-primary/15 transition-colors p-4 flex flex-col items-start gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold leading-tight", children: "Atualizar patrimônio" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground mt-0.5", children: "Registre o saldo do mês" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/atualizar", hash: "aporte", className: "group rounded-2xl border border-border/60 bg-card hover:bg-secondary/40 transition-colors p-4 flex flex-col items-start gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-secondary/60 flex items-center justify-center text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlus, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold leading-tight", children: "Registrar aporte" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground mt-0.5", children: "Adicione o que você guardou" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PaceCard, { pace }),
    last && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-border/60 bg-card p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold uppercase tracking-wider text-muted-foreground", children: "Último mês" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground tabular-nums", children: formatRef(last.ref) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3 mt-3 items-start", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Ganho total", value: fmtBRL(last.aportes + last.rentabilidade) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Por aportes", value: fmtBRL(last.aportes) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Rentabilidade", value: fmtBRL(last.rentabilidade), hint: fmtPct(last.rentabilidadePct, 2) })
      ] })
    ] }),
    ajuste !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-border/60 bg-card p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground font-semibold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3.5 w-3.5" }),
        " Ajuste opcional"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm mt-2", children: [
        "Para antecipar sua meta em ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "1 ano" }),
        ", aumente seus aportes em",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-pace-ahead", children: [
          fmtBRL(ajuste),
          "/mês"
        ] }),
        "."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-border/60 bg-card p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "h-3.5 w-3.5" }),
        " Marcos no caminho"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border/40", children: marcos.map((m) => {
        const done = m.prev?.jaAtingido;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "py-2 flex items-baseline justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: m.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground tabular-nums", children: fmtBRL(m.alvo) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right shrink-0", children: done ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-pace-ahead", children: "Atingido" }) : m.prev ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-semibold tabular-nums", children: [
              m.prev.idade.toFixed(1),
              " anos"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground tabular-nums", children: formatRef(m.prev.ref) })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "—" }) })
        ] }, m.label);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-2 leading-relaxed", children: "Estimativas com aporte e taxa do plano atual." })
    ] })
  ] });
}
function Stat({
  label,
  value,
  hint,
  accent,
  align = "top"
}) {
  const labelAlign = align === "bottom" ? "items-end" : "items-start";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-[10px] uppercase tracking-wider text-muted-foreground min-h-[2.2em] flex ${labelAlign} justify-center`, children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-base font-bold tabular-nums mt-0.5 ${accent ?? ""}`, children: value }),
    hint && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground mt-0.5", children: hint })
  ] });
}
export {
  Dashboard as component
};
