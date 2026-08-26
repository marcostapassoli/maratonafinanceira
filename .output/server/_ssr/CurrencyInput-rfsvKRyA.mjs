import { i as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/@hookform/resolvers+[...].mjs";
import { E as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as Input } from "./input-wdZzgl11.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/CurrencyInput-rfsvKRyA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var fmt = (n) => new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 }).format(n);
/**
* Input de moeda BRL com máscara amigável: digita "1000000" e mostra "R$ 1.000.000".
* Trabalha apenas com valores inteiros (reais), suficiente para o domínio da app.
*/
var CurrencyInput = (0, import_react.forwardRef)(function CurrencyInput({ value, onChange, id, placeholder, className, allowNegative = false, ...rest }, ref) {
	const [text, setText] = (0, import_react.useState)(value !== 0 ? fmt(value) : "");
	(0, import_react.useEffect)(() => {
		setText((prev) => {
			const prevDigits = prev.replace(/[^\d]/g, "");
			const prevSign = prev.trim().startsWith("-") ? -1 : 1;
			if ((Number(prevDigits) || 0) * prevSign === value) return prev;
			return value !== 0 ? fmt(value) : "";
		});
	}, [value]);
	function handleChange(e) {
		const raw = e.target.value;
		const isNegative = allowNegative && /-/.test(raw);
		const digits = raw.replace(/\D/g, "");
		if (digits === "") {
			setText("");
			onChange(0);
			return;
		}
		const n = Number(digits) * (isNegative ? -1 : 1);
		setText(fmt(n));
		onChange(n);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground",
			children: "R$"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			ref,
			id,
			type: "text",
			inputMode: "numeric",
			autoComplete: "off",
			value: text,
			onChange: handleChange,
			placeholder: placeholder ?? "0",
			className: `pl-9 tabular-nums ${className ?? ""}`,
			...rest
		})]
	});
});
//#endregion
export { CurrencyInput as t };
