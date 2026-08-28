import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useForm, C as Controller } from "../_libs/react-hook-form.mjs";
import { a } from "../_libs/hookform__resolvers.mjs";
import { u as useMaratona } from "./router-BPjxctTH.mjs";
import { p as proximoRefMes, d as derivarEntries, n as prazoMeses, o as linhaIdeal, q as classificarRitmo, c as formatRef, f as fmtBRL, b as fmtPct } from "./math-5GrSvXuq.mjs";
import { B as Button, I as Input } from "./input-DIT_x3rb.mjs";
import { L as Label } from "./label-5tzGalHm.mjs";
import { T as Textarea } from "./textarea-DK42xwRU.mjs";
import { C as CurrencyInput } from "./CurrencyInput-xihhgJk0.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { p as CircleCheck, d as ArrowRight } from "../_libs/lucide-react.mjs";
import { o as objectType, c as coerce, s as stringType } from "../_libs/zod.mjs";

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
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
const schema = objectType({
  ref: stringType().regex(/^\d{4}-\d{2}$/),
  patrimonio: coerce.number().min(0),
  aportes: coerce.number()
});
function Atualizar() {
  const {
    ready,
    hasPlan,
    data,
    addEntry
  } = useMaratona();
  const navigate = useNavigate();
  const [savedRef, setSavedRef] = reactExports.useState(null);
  const [showBulk, setShowBulk] = reactExports.useState(false);
  const [bulkText, setBulkText] = reactExports.useState("");
  const [bulkPreview, setBulkPreview] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (ready && !hasPlan) navigate({
      to: "/onboarding"
    });
  }, [ready, hasPlan, navigate]);
  const sugerido = reactExports.useMemo(() => {
    if (!data) return "";
    return proximoRefMes(data.entries);
  }, [data]);
  const {
    register,
    handleSubmit,
    control,
    formState: {
      errors
    },
    reset
  } = useForm({
    resolver: a(schema),
    values: {
      ref: sugerido,
      patrimonio: data?.entries[data.entries.length - 1]?.patrimonio ?? data?.plan.patrimonioInicial ?? 0,
      aportes: data?.plan.aporteMensal ?? 0
    }
  });
  if (!ready || !data) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-20 text-center text-muted-foreground", children: "Carregando…" });
  const lastSaved = savedRef ? data.entries.find((e) => e.ref === savedRef) : null;
  function onSubmit(v) {
    addEntry({
      ref: v.ref,
      patrimonio: v.patrimonio,
      aportes: v.aportes
    });
    setSavedRef(v.ref);
    toast.success(`Mês ${formatRef(v.ref)} registrado!`);
  }
  if (lastSaved && data) {
    const derived = derivarEntries(data.plan, data.entries);
    const found = derived.find((e) => e.ref === lastSaved.ref);
    const total = prazoMeses(data.plan);
    const ideal = linhaIdeal(data.plan, total);
    const idealMes = ideal[derived.findIndex((e) => e.ref === lastSaved.ref) + 1];
    const status = classificarRitmo(found.patrimonio, idealMes);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md mx-auto space-y-5 animate-fade-in py-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-14 w-14 text-pace-ahead mx-auto" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold mt-3", children: "Mês registrado!" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: formatRef(lastSaved.ref) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border/60 bg-card p-5 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Ganho total", value: fmtBRL(found.aportes + found.rentabilidade) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Aportes", value: fmtBRL(found.aportes) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Rentabilidade", value: fmtBRL(found.rentabilidade), hint: fmtPct(found.rentabilidadePct, 2), accent: found.rentabilidade >= 0 ? "text-pace-ahead" : "text-pace-behind" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("hr", { className: "border-border/40" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Patrimônio", value: fmtBRL(found.patrimonio) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-2xl p-4 text-center font-semibold ${status === "ahead" ? "bg-pace-ahead/10 text-pace-ahead" : status === "behind" ? "bg-pace-behind/10 text-pace-behind" : "bg-pace-on/10 text-pace-on"}`, children: [
        status === "ahead" && "Você está à frente do plano. Excelente!",
        status === "on" && "Você está mantendo o ritmo. Disciplina é tudo.",
        status === "behind" && "Hora de acelerar — pequenos ajustes mudam a corrida."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "secondary", className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: "Ver pista" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "flex-1", onClick: () => {
          setSavedRef(null);
          reset({
            ref: proximoRefMes(data.entries),
            patrimonio: found.patrimonio,
            aportes: data.plan.aporteMensal
          });
        }, children: "Registrar próximo" })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md mx-auto py-4 animate-fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold tracking-tight", children: "Ritual mensal" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1 text-sm", children: "Atualize o patrimônio do fim do mês e o quanto você aportou." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "mt-6 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs uppercase tracking-wider text-muted-foreground", children: "Mês de referência" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "month", ...register("ref") }),
        errors.ref && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: "Mês inválido" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs uppercase tracking-wider text-muted-foreground", children: "Patrimônio total no fim do mês" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Controller, { name: "patrimonio", control, render: ({
          field
        }) => /* @__PURE__ */ jsxRuntimeExports.jsx(CurrencyInput, { value: Number(field.value) || 0, onChange: field.onChange }) }),
        errors.patrimonio && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: errors.patrimonio.message })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs uppercase tracking-wider text-muted-foreground", children: "Aportes feitos no mês" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Controller, { name: "aportes", control, render: ({
          field
        }) => /* @__PURE__ */ jsxRuntimeExports.jsx(CurrencyInput, { value: Number(field.value) || 0, onChange: field.onChange, allowNegative: true }) }),
        errors.aportes && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: errors.aportes.message }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "Use valor negativo para retiradas/saques no mês." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", size: "lg", className: "w-full font-semibold", children: [
        "Registrar mês ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 ml-1" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 pt-6 border-t border-border/50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShowBulk((v) => !v), className: "text-sm text-primary font-medium hover:underline", children: showBulk ? "− Ocultar importação em massa" : "+ Colar série histórica (vários meses)" }),
      showBulk && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground leading-relaxed", children: [
          "Cole linhas no formato ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-foreground", children: "mês patrimônio aportes" }),
          ". Aceita separadores: tab, vírgula, ponto-e-vírgula ou espaço. Mês: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-foreground", children: "2024-01" }),
          ",",
          /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-foreground", children: " 01/2024" }),
          " ou ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-foreground", children: "jan/2024" }),
          ". Aportes são opcionais (assume o aporte do plano)."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md bg-muted/50 p-2 text-[11px] font-mono text-muted-foreground whitespace-pre", children: `2024-01  120000  3000
2024-02  124500  3000
03/2024  128900  3500` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 8, placeholder: "Cole aqui sua série histórica...", value: bulkText, onChange: (e) => {
          setBulkText(e.target.value);
          setBulkPreview(null);
        }, className: "font-mono text-xs" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "secondary", className: "flex-1", onClick: () => {
            const result = parseBulk(bulkText, data.plan.aporteMensal);
            setBulkPreview(result);
          }, disabled: !bulkText.trim(), children: "Pré-visualizar" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", className: "flex-1", disabled: !bulkPreview || bulkPreview.rows.length === 0, onClick: () => {
            if (!bulkPreview) return;
            bulkPreview.rows.forEach((r) => addEntry(r));
            toast.success(`${bulkPreview.rows.length} meses importados!`);
            setBulkText("");
            setBulkPreview(null);
            setShowBulk(false);
          }, children: [
            "Importar ",
            bulkPreview?.rows.length ? `(${bulkPreview.rows.length})` : ""
          ] })
        ] }),
        bulkPreview && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/60 bg-card overflow-hidden", children: [
          bulkPreview.errors.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-destructive/10 text-destructive text-xs space-y-0.5", children: [
            bulkPreview.errors.slice(0, 5).map((er, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              "• ",
              er
            ] }, i)),
            bulkPreview.errors.length > 5 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              "… e mais ",
              bulkPreview.errors.length - 5,
              " erro(s)"
            ] })
          ] }),
          bulkPreview.rows.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border/50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-2", children: "Mês" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right p-2", children: "Patrimônio" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right p-2", children: "Aportes" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: bulkPreview.rows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border/30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2 font-medium", children: formatRef(r.ref) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2 text-right tabular-nums", children: fmtBRL(r.patrimonio) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2 text-right tabular-nums", children: fmtBRL(r.aportes) })
            ] }, r.ref)) })
          ] })
        ] })
      ] })
    ] })
  ] });
}
function Row({
  label,
  value,
  hint,
  accent
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `font-semibold tabular-nums ${accent ?? ""}`, children: [
      value,
      hint && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground ml-2", children: [
        "(",
        hint,
        ")"
      ] })
    ] })
  ] });
}
const MESES_PT = {
  jan: "01",
  fev: "02",
  mar: "03",
  abr: "04",
  mai: "05",
  jun: "06",
  jul: "07",
  ago: "08",
  set: "09",
  out: "10",
  nov: "11",
  dez: "12"
};
function parseRefToken(tok) {
  const t = tok.trim().toLowerCase();
  let m = t.match(/^(\d{4})[-/](\d{1,2})$/);
  if (m) return `${m[1]}-${m[2].padStart(2, "0")}`;
  m = t.match(/^(\d{1,2})[-/](\d{4})$/);
  if (m) return `${m[2]}-${m[1].padStart(2, "0")}`;
  m = t.match(/^([a-zç]{3,})[\s/.-]+(\d{2,4})$/);
  if (m) {
    const mes = MESES_PT[m[1].slice(0, 3)];
    if (!mes) return null;
    let ano = m[2];
    if (ano.length === 2) ano = `20${ano}`;
    return `${ano}-${mes}`;
  }
  return null;
}
function parseNumber(tok) {
  if (!tok) return null;
  let s = tok.trim().replace(/r\$\s*/i, "").replace(/\s/g, "");
  if (s.includes(",") && s.includes(".")) {
    s = s.replace(/\./g, "").replace(",", ".");
  } else if (s.includes(",")) {
    s = s.replace(",", ".");
  }
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}
function parseBulk(text, aporteDefault) {
  const errors = [];
  const map = /* @__PURE__ */ new Map();
  const lines = text.split(/\r?\n/);
  lines.forEach((rawLine, idx) => {
    const line = rawLine.trim();
    if (!line) return;
    let parts;
    if (/\t|;/.test(line)) {
      parts = line.split(/[\t;]+/);
    } else if (/\s{2,}/.test(line)) {
      parts = line.split(/\s{2,}/);
    } else {
      const m = line.match(/^(\S+(?:\s\S+)?)\s+(\S+)(?:\s+(\S+))?$/);
      parts = m ? [m[1], m[2], m[3] ?? ""].filter(Boolean) : line.split(/\s+/);
    }
    parts = parts.map((p) => p.trim()).filter(Boolean);
    if (parts.length < 2) {
      errors.push(`Linha ${idx + 1}: precisa de mês e patrimônio`);
      return;
    }
    const ref = parseRefToken(parts[0]);
    if (!ref) {
      errors.push(`Linha ${idx + 1}: mês inválido "${parts[0]}"`);
      return;
    }
    const patrimonio = parseNumber(parts[1]);
    if (patrimonio === null || patrimonio < 0) {
      errors.push(`Linha ${idx + 1}: patrimônio inválido "${parts[1]}"`);
      return;
    }
    let aportes = aporteDefault;
    if (parts[2] != null && parts[2] !== "") {
      const a2 = parseNumber(parts[2]);
      if (a2 === null) {
        errors.push(`Linha ${idx + 1}: aporte inválido "${parts[2]}"`);
        return;
      }
      aportes = a2;
    }
    map.set(ref, {
      ref,
      patrimonio,
      aportes
    });
  });
  const rows = [...map.values()].sort((a2, b) => a2.ref.localeCompare(b.ref));
  return {
    rows,
    errors
  };
}
export {
  Atualizar as component
};
