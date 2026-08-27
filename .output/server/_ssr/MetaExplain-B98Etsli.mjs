import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { D as Dialog, f as DialogTrigger, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription } from "./dialog-kK_91IIf.mjs";
import { g as metaPatrimonio, f as fmtBRL, l as fmtBRLFull } from "./math-5GrSvXuq.mjs";
import { c as cn } from "./router-B5HLbIzO.mjs";
import { I as Info } from "../_libs/lucide-react.mjs";
function MetaExplain({
  plan,
  className,
  children
}) {
  const meta = metaPatrimonio(plan);
  const taxaPct = (plan.taxaRetirada * 100).toFixed(1);
  const anual = plan.rendaMensalDesejada * 12;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        className: cn(
          "inline-flex items-center gap-1 rounded-md text-left transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
          className
        ),
        "aria-label": "Como a meta foi calculada?",
        children: [
          children ?? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums", children: fmtBRL(meta) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-3.5 w-3.5 opacity-60" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Como sua meta foi calculada" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "A meta é o patrimônio que, investido, gera sua renda passiva desejada — sem precisar consumir o principal." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/60 bg-secondary/30 p-4 font-mono text-[13px] leading-relaxed", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground text-[11px] uppercase tracking-wider mb-2", children: "Fórmula" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "meta = renda anual ÷ taxa de retirada" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 text-muted-foreground", children: [
            fmtBRLFull(plan.rendaMensalDesejada),
            " × 12 ÷ ",
            taxaPct,
            "%"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 font-semibold text-foreground tabular-nums", children: [
            "= ",
            fmtBRLFull(meta)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Linha, { label: "Renda mensal desejada", value: fmtBRLFull(plan.rendaMensalDesejada) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Linha, { label: "Renda anual (×12)", value: fmtBRLFull(anual) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Linha, { label: "Taxa de retirada", value: `${taxaPct}% ao ano` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Linha,
            {
              label: "Patrimônio necessário",
              value: fmtBRLFull(meta),
              destaque: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground leading-relaxed", children: [
          "A taxa de retirada de ",
          taxaPct,
          "% vem da",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: "regra de Bengen" }),
          " ",
          '(a clássica "regra dos 4%"): historicamente, retirar essa fração do patrimônio por ano sustenta a renda por décadas mesmo em mercados ruins. Pode ajustar isso nas configurações do plano.'
        ] })
      ] })
    ] })
  ] });
}
function Linha({ label, value, destaque }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "flex items-baseline justify-between gap-3 rounded-lg px-3 py-2",
        destaque ? "bg-primary/10 border border-primary/30" : "bg-secondary/30"
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("tabular-nums text-sm", destaque && "font-bold text-primary"), children: value })
      ]
    }
  );
}
export {
  MetaExplain as M
};
