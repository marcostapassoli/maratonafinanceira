import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AlertTriangle, Info } from "lucide-react";

/**
 * Referências históricas (médias aproximadas dos últimos ~20 anos, nominais brutas, em BRL).
 * Fontes: B3/Ipeadata/Banco Central (médias geométricas aproximadas, 2005-2024).
 * Esses valores são ilustrativos e arredondados para facilitar a leitura.
 */
const REFERENCIAS = [
  { label: "Poupança", taxa: 0.06, hint: "rendimento histórico aproximado" },
  { label: "CDI", taxa: 0.10, hint: "média ~10% a.a. nos últimos 20 anos" },
  { label: "IBOVESPA", taxa: 0.12, hint: "média ~12% a.a., com forte volatilidade" },
];

const PERFIS = [
  {
    id: "conservador",
    label: "Conservador",
    taxa: 0.09,
    desc: "Próximo ao CDI. Foco em renda fixa.",
  },
  {
    id: "moderado",
    label: "Moderado",
    taxa: 0.11,
    desc: "Mix de renda fixa com renda variável.",
  },
  {
    id: "agressivo",
    label: "Agressivo",
    taxa: 0.13,
    desc: "Próximo ao IBOV. Mais risco e oscilação.",
  },
] as const;

type Props = {
  /** Taxa em percentual (ex: 10 para 10%). */
  value: number;
  onChange: (v: number) => void;
};

export function TaxaRetornoSelector({ value, onChange }: Props) {
  const perfilAtivo = useMemo(() => {
    const v = Number(value);
    return PERFIS.find((p) => Math.abs(p.taxa * 100 - v) < 0.05)?.id ?? null;
  }, [value]);

  const taxaAlta = Number(value) > 13;

  // Mantém texto local para permitir campo vazio enquanto o usuário digita.
  const [text, setText] = useState<string>(
    Number.isFinite(Number(value)) ? String(value) : "",
  );
  useEffect(() => {
    const parsed = Number(text);
    if (text === "" || !Number.isFinite(parsed) || parsed !== Number(value)) {
      setText(Number.isFinite(Number(value)) ? String(value) : "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="space-y-3">
      {/* Perfis rápidos */}
      <div className="grid grid-cols-3 gap-2">
        {PERFIS.map((p) => {
          const active = perfilAtivo === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onChange(p.taxa * 100)}
              className={cn(
                "rounded-lg border p-2.5 text-left transition-colors",
                active
                  ? "border-primary bg-primary/10"
                  : "border-border/60 bg-card hover:border-primary/40",
              )}
            >
              <div className="text-xs font-semibold">{p.label}</div>
              <div className="text-[11px] font-mono text-primary mt-0.5">
                {(p.taxa * 100).toFixed(1)}% a.a.
              </div>
              <div className="text-[10px] text-muted-foreground mt-1 leading-tight">
                {p.desc}
              </div>
            </button>
          );
        })}
      </div>

      {/* Input manual */}
      <div className="space-y-1.5">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
          Personalizar (% ao ano)
        </div>
        <Input
          type="number"
          inputMode="decimal"
          step="0.1"
          value={text}
          onChange={(e) => {
            const raw = e.target.value;
            setText(raw);
            if (raw === "") {
              onChange(0);
              return;
            }
            const n = Number(raw);
            if (Number.isFinite(n)) onChange(n);
          }}
          onBlur={() => {
            if (text === "") setText("0");
          }}
        />
      </div>

      {/* Referências históricas */}
      <div className="rounded-lg border border-border/60 bg-secondary/30 p-3">
        <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
          <Info className="h-3 w-3" /> Referências dos últimos 20 anos
        </div>
        <div className="space-y-1.5">
          {REFERENCIAS.map((r) => (
            <button
              key={r.label}
              type="button"
              onClick={() => onChange(r.taxa * 100)}
              className="w-full flex items-baseline justify-between gap-3 text-left hover:text-primary transition-colors"
            >
              <span className="text-xs font-semibold">{r.label}</span>
              <span className="font-mono text-xs">{(r.taxa * 100).toFixed(1)}% a.a.</span>
            </button>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">
          Valores baseados no passado. O futuro pode ser diferente.
        </p>
      </div>

      {/* Explicação simples */}
      <p className="text-[11px] text-muted-foreground leading-relaxed">
        Essa taxa representa o crescimento esperado do seu patrimônio ao longo do tempo,
        antes de considerar a inflação. A inflação pode reduzir o poder de compra ao longo dos anos.
      </p>

      {/* Alerta de taxa alta */}
      {taxaAlta && (
        <div className="flex items-start gap-2 rounded-lg border border-pace-behind/40 bg-pace-behind/10 p-3">
          <AlertTriangle className="h-4 w-4 text-pace-behind shrink-0 mt-0.5" />
          <p className="text-[11px] text-pace-behind leading-relaxed">
            Retornos mais altos normalmente envolvem maior risco e podem não se repetir no futuro.
            Considere se você está confortável com oscilações fortes.
          </p>
        </div>
      )}
    </div>
  );
}