import { forwardRef, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

type Props = {
  value: number;
  onChange: (value: number) => void;
  id?: string;
  placeholder?: string;
  className?: string;
  allowNegative?: boolean;
  "aria-invalid"?: boolean;
};

const fmt = (n: number) =>
  new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 }).format(n);

/**
 * Input de moeda BRL com máscara amigável: digita "1000000" e mostra "R$ 1.000.000".
 * Trabalha apenas com valores inteiros (reais), suficiente para o domínio da app.
 */
export const CurrencyInput = forwardRef<HTMLInputElement, Props>(function CurrencyInput(
  { value, onChange, id, placeholder, className, allowNegative = false, ...rest },
  ref,
) {
  const [text, setText] = useState<string>(value !== 0 ? fmt(value) : "");

  // Reflete mudanças externas (ex: reset, defaultValues do form)
  useEffect(() => {
    setText((prev) => {
      const prevDigits = prev.replace(/[^\d]/g, "");
      const prevSign = prev.trim().startsWith("-") ? -1 : 1;
      const prevNumber = (Number(prevDigits) || 0) * prevSign;
      if (prevNumber === value) return prev;
      return value !== 0 ? fmt(value) : "";
    });
  }, [value]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
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

  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
        R$
      </span>
      <Input
        ref={ref}
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        value={text}
        onChange={handleChange}
        placeholder={placeholder ?? "0"}
        className={`pl-9 tabular-nums ${className ?? ""}`}
        {...rest}
      />
    </div>
  );
});