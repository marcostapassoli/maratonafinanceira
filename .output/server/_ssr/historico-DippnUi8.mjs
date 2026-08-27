import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { B as Button, b as buttonVariants } from "./input-DA1lb6-r.mjs";
import { u as useMaratona, M as MARATHON_KM, c as cn } from "./router-BVyf5xBN.mjs";
import { d as derivarEntries, b as fmtPct, c as formatRef, e as fmtKm, f as fmtBRL, g as metaPatrimonio, t as taxaMensal } from "./math-5GrSvXuq.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-7ZH9g1It.mjs";
import { L as Label } from "./label-L9dZHOwh.mjs";
import { C as CurrencyInput } from "./CurrencyInput-BfmobuDU.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { c as calcularPace, P as PaceCard, f as fmtMeses } from "./PaceCard-DykCj5Ol.mjs";
import { R as Root2, P as Portal2, C as Content2, T as Title2, D as Description2, a as Cancel, A as Action, O as Overlay2 } from "../_libs/radix-ui__react-alert-dialog.mjs";
import { g as Pencil, h as Trash2 } from "../_libs/lucide-react.mjs";

import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/unenv.mjs";


import "../_libs/seroval-plugins.mjs";


import "../_libs/react-dom.mjs";
import "../_libs/isbot.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/tslib.mjs";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/zod.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
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
import "../_libs/radix-ui__react-label.mjs";
const AlertDialog = Root2;
const AlertDialogPortal = Portal2;
const AlertDialogOverlay = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Overlay2,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
AlertDialogOverlay.displayName = Overlay2.displayName;
const AlertDialogContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogPortal, { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogOverlay, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsx(
    Content2,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      ),
      ...props
    }
  )
] }));
AlertDialogContent.displayName = Content2.displayName;
const AlertDialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("flex flex-col space-y-2 text-center sm:text-left", className), ...props });
AlertDialogHeader.displayName = "AlertDialogHeader";
const AlertDialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
    ...props
  }
);
AlertDialogFooter.displayName = "AlertDialogFooter";
const AlertDialogTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Title2,
  {
    ref,
    className: cn("text-lg font-semibold", className),
    ...props
  }
));
AlertDialogTitle.displayName = Title2.displayName;
const AlertDialogDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Description2,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
AlertDialogDescription.displayName = Description2.displayName;
const AlertDialogAction = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Action, { ref, className: cn(buttonVariants(), className), ...props }));
AlertDialogAction.displayName = Action.displayName;
const AlertDialogCancel = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Cancel,
  {
    ref,
    className: cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className),
    ...props
  }
));
AlertDialogCancel.displayName = Cancel.displayName;
function Historico() {
  const {
    ready,
    hasPlan,
    data,
    deleteEntry,
    updateEntry
  } = useMaratona();
  const navigate = useNavigate();
  const [pendingDelete, setPendingDelete] = reactExports.useState(null);
  const [editing, setEditing] = reactExports.useState(null);
  const [editPatrim, setEditPatrim] = reactExports.useState(0);
  const [editAportes, setEditAportes] = reactExports.useState(0);
  reactExports.useEffect(() => {
    if (ready && !hasPlan) navigate({
      to: "/onboarding"
    });
  }, [ready, hasPlan, navigate]);
  const view = reactExports.useMemo(() => {
    if (!data) return null;
    const entries = [...data.entries].sort((a, b) => a.ref.localeCompare(b.ref));
    const points = derivarProgressoHistorico(data.plan, entries);
    const derived = derivarEntries(data.plan, entries);
    const pace = calcularPace(data.plan, derived);
    const kmDeltas = points.map((p, i) => i === 0 ? null : p.km - points[i - 1].km);
    const kmGanhos = kmDeltas.filter((d) => d !== null && d > 0);
    const melhorKm = kmGanhos.length ? Math.max(...kmGanhos) : null;
    const melhorMes = melhorKm !== null ? points[kmDeltas.findIndex((d) => d === melhorKm)] : null;
    const totalKm = points[points.length - 1]?.km ?? 0;
    const ritmoMedio = points.length >= 2 && totalKm > 1e-3 ? (points.length - 1) / totalKm : null;
    return {
      points,
      latest: points[points.length - 1],
      pace,
      melhorKm,
      melhorMes,
      ritmoMedio,
      kmDeltas
    };
  }, [data]);
  if (!ready || !data || !view) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-20 text-center text-muted-foreground", children: "Carregando…" });
  }
  if (view.points.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-20 text-center space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Sem meses reportados ainda." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => navigate({
        to: "/atualizar"
      }), children: "Registrar primeiro mês" })
    ] });
  }
  const latest = view.latest;
  const reversed = view.points.slice().reverse();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-border/60 bg-card p-5 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Progresso histórico" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-2 text-5xl font-bold tabular-nums leading-none", children: fmtPct(latest.pct, 1) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 text-sm text-muted-foreground", children: [
            formatRef(latest.ref),
            " · ",
            fmtKm(latest.km)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl", children: "🏃" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-mono text-muted-foreground", children: "42,195 km" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 h-3 rounded-full bg-secondary overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full rounded-full transition-[width] duration-700", style: {
        width: `${latest.pct * 100}%`,
        background: "var(--gradient-progress)"
      } }) }),
      view.points.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkline, { values: view.points.map((p) => p.patrimonio) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PaceCard, { pace: view.pace }),
    (view.ritmoMedio !== null || view.melhorMes) && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-border/60 bg-card p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-3", children: "Pace histórico" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-secondary/40 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "Ritmo médio" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-base font-bold tabular-nums mt-0.5", children: view.ritmoMedio !== null ? `${fmtMeses(view.ritmoMedio)} / km` : "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground mt-0.5", children: "média de toda a série" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-secondary/40 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "Melhor mês" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-base font-bold tabular-nums mt-0.5 text-pace-ahead", children: view.melhorKm !== null ? `+${view.melhorKm.toFixed(2)} km` : "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground mt-0.5", children: view.melhorMes ? formatRef(view.melhorMes.ref) : "—" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "space-y-2", children: reversed.map((point, idx) => {
      const previous = reversed[idx + 1];
      const delta = previous ? point.patrimonio - previous.patrimonio : null;
      const deltaKm = previous ? point.km - previous.km : null;
      const deltaPct = previous ? point.pct - previous.pct : null;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/60 bg-card px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: formatRef(point.ref) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right tabular-nums", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: fmtPct(point.pct, 1) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground", children: fmtKm(point.km) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
              setEditing(point);
              setEditPatrim(point.patrimonio);
              setEditAportes(point.aportes);
            }, className: "rounded-md p-1.5 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors", "aria-label": `Editar ${formatRef(point.ref)}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setPendingDelete(point.ref), className: "rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors", "aria-label": `Excluir ${formatRef(point.ref)}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 h-2 rounded-full bg-secondary overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full rounded-full", style: {
          width: `${point.pct * 100}%`,
          background: "var(--gradient-progress)"
        } }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 grid grid-cols-3 gap-2 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "Patrimônio" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold tabular-nums mt-0.5", children: fmtBRL(point.patrimonio) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "Aporte" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold tabular-nums mt-0.5", children: fmtBRL(point.aportes) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "vs mês ant." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-sm font-semibold tabular-nums mt-0.5 ${delta === null ? "text-muted-foreground" : delta >= 0 ? "text-pace-ahead" : "text-pace-behind"}`, children: delta === null ? "—" : `${delta >= 0 ? "+" : "−"}${fmtBRL(Math.abs(delta))}` }),
            deltaKm !== null && deltaPct !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `text-[10px] tabular-nums mt-0.5 ${deltaKm >= 0 ? "text-pace-ahead/80" : "text-pace-behind/80"}`, children: [
              deltaKm >= 0 ? "+" : "−",
              fmtKm(Math.abs(deltaKm)),
              " ·",
              " ",
              deltaPct >= 0 ? "+" : "−",
              fmtPct(Math.abs(deltaPct), 2)
            ] })
          ] })
        ] })
      ] }, point.ref);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: pendingDelete !== null, onOpenChange: (open) => !open && setPendingDelete(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Excluir registro?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: pendingDelete && `O mês ${formatRef(pendingDelete)} será removido do histórico. Esta ação não pode ser desfeita.` })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancelar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { onClick: () => {
          if (pendingDelete) deleteEntry(pendingDelete);
          setPendingDelete(null);
        }, className: "bg-destructive text-destructive-foreground hover:bg-destructive/90", children: "Excluir" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: editing !== null, onOpenChange: (open) => !open && setEditing(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { children: [
          "Editar ",
          editing && formatRef(editing.ref)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Corrija o patrimônio ou o aporte registrado neste mês." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs uppercase tracking-wider text-muted-foreground", children: "Patrimônio no fim do mês" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CurrencyInput, { value: editPatrim, onChange: setEditPatrim })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs uppercase tracking-wider text-muted-foreground", children: "Aportes do mês" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CurrencyInput, { value: editAportes, onChange: setEditAportes, allowNegative: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "Use valor negativo para retiradas/saques." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "secondary", onClick: () => setEditing(null), children: "Cancelar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => {
          if (!editing) return;
          updateEntry(editing.ref, {
            patrimonio: editPatrim,
            aportes: editAportes
          });
          toast.success(`${formatRef(editing.ref)} atualizado`);
          setEditing(null);
        }, children: "Salvar" })
      ] })
    ] }) })
  ] });
}
function derivarProgressoHistorico(plan, entries) {
  const meta = metaPatrimonio(plan);
  const totalMeses = mesesAteValor(plan, meta);
  const usaReguaTemporal = totalMeses !== null;
  return entries.map((entry) => {
    const meses = usaReguaTemporal ? mesesAteValor(plan, entry.patrimonio) : null;
    const bruto = meses !== null && totalMeses !== null ? meses / totalMeses : entry.patrimonio / Math.max(1, meta);
    const pct = Math.min(1, Math.max(0, bruto));
    return {
      ...entry,
      pct,
      km: pct * MARATHON_KM
    };
  });
}
function mesesAteValor(plan, valor) {
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
function Sparkline({
  values
}) {
  const n = values.length;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = Math.max(max - min, 1);
  const xOf = (i) => i / (n - 1) * 100;
  const yOf = (v) => 18 - (v - min) / range * 16;
  const path = values.map((v, i) => `${xOf(i).toFixed(2)},${yOf(v).toFixed(2)}`).join(" ");
  const area = `0,18 ${path} 100,18`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 100 20", preserveAspectRatio: "none", className: "mt-4 h-10 w-full", role: "img", "aria-label": "Tendência do patrimônio", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: area, fill: "var(--primary)", opacity: "0.15" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: path, fill: "none", stroke: "var(--primary)", strokeWidth: "1.2", strokeLinecap: "round", strokeLinejoin: "round", vectorEffect: "non-scaling-stroke" })
  ] });
}
export {
  Historico as component
};
