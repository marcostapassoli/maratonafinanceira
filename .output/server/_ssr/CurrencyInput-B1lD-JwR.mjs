import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { I as Input } from "./input-DF1O2QaK.mjs";
const fmt = (n) => new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 }).format(n);
const CurrencyInput = reactExports.forwardRef(function CurrencyInput2({ value, onChange, id, placeholder, className, allowNegative = false, ...rest }, ref) {
  const [text, setText] = reactExports.useState(value !== 0 ? fmt(value) : "");
  reactExports.useEffect(() => {
    setText((prev) => {
      const prevDigits = prev.replace(/[^\d]/g, "");
      const prevSign = prev.trim().startsWith("-") ? -1 : 1;
      const prevNumber = (Number(prevDigits) || 0) * prevSign;
      if (prevNumber === value) return prev;
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground", children: "R$" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Input,
      {
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
      }
    )
  ] });
});
export {
  CurrencyInput as C
};
