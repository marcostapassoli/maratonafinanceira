import { E as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { S as Info } from "../_libs/lucide-react.mjs";
import { n as cn } from "./router-DuEozytO.mjs";
import { _ as metaPatrimonio, c as fmtBRL, l as fmtBRLFull } from "./math-DPowjGZA.mjs";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, r as DialogDescription, s as DialogTrigger, t as Dialog } from "./dialog-D43C7BpT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/MetaExplain-Ba_RCvnd.js
var import_jsx_runtime = require_jsx_runtime();
/**
* Botão que abre uma explicação detalhada de como a meta de patrimônio
* é calculada a partir da renda desejada e da taxa de retirada.
*/
function MetaExplain({ plan, className, children }) {
	const meta = metaPatrimonio(plan);
	const taxaPct = (plan.taxaRetirada * 100).toFixed(1);
	const anual = plan.rendaMensalDesejada * 12;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: cn("inline-flex items-center gap-1 rounded-md text-left transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40", className),
			"aria-label": "Como a meta foi calculada?",
			children: [children ?? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "tabular-nums",
				children: fmtBRL(meta)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-3.5 w-3.5 opacity-60" })]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
		className: "max-w-md",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Como sua meta foi calculada" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "A meta é o patrimônio que, investido, gera sua renda passiva desejada — sem precisar consumir o principal." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4 text-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border/60 bg-secondary/30 p-4 font-mono text-[13px] leading-relaxed",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-muted-foreground text-[11px] uppercase tracking-wider mb-2",
							children: "Fórmula"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "meta = renda anual ÷ taxa de retirada" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 text-muted-foreground",
							children: [
								fmtBRLFull(plan.rendaMensalDesejada),
								" × 12 ÷ ",
								taxaPct,
								"%"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 font-semibold text-foreground tabular-nums",
							children: ["= ", fmtBRLFull(meta)]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Linha, {
							label: "Renda mensal desejada",
							value: fmtBRLFull(plan.rendaMensalDesejada)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Linha, {
							label: "Renda anual (×12)",
							value: fmtBRLFull(anual)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Linha, {
							label: "Taxa de retirada",
							value: `${taxaPct}% ao ano`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Linha, {
							label: "Patrimônio necessário",
							value: fmtBRLFull(meta),
							destaque: true
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground leading-relaxed",
					children: [
						"A taxa de retirada de ",
						taxaPct,
						"% vem da",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium text-foreground",
							children: "regra de Bengen"
						}),
						" ",
						"(a clássica \"regra dos 4%\"): historicamente, retirar essa fração do patrimônio por ano sustenta a renda por décadas mesmo em mercados ruins. Pode ajustar isso nas configurações do plano."
					]
				})
			]
		})]
	})] });
}
function Linha({ label, value, destaque }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex items-baseline justify-between gap-3 rounded-lg px-3 py-2", destaque ? "bg-primary/10 border border-primary/30" : "bg-secondary/30"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("tabular-nums text-sm", destaque && "font-bold text-primary"),
			children: value
		})]
	});
}
//#endregion
export { MetaExplain as t };
