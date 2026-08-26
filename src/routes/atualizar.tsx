import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useMaratona } from "@/lib/maratona/store";
import {
  derivarEntries,
  fmtBRL,
  fmtPct,
  formatRef,
  linhaIdeal,
  prazoMeses,
  proximoRefMes,
  classificarRitmo,
} from "@/lib/maratona/math";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CurrencyInput } from "@/components/maratona/CurrencyInput";
import { toast } from "sonner";

const schema = z.object({
  ref: z.string().regex(/^\d{4}-\d{2}$/),
  patrimonio: z.coerce.number().min(0),
  aportes: z.coerce.number(),
});
type FormValues = z.infer<typeof schema>;

export const Route = createFileRoute("/atualizar")({
  head: () => ({
    meta: [
      { title: "Atualizar mês — Maratona Financeira" },
      { name: "description", content: "Registre o patrimônio do mês e avance na pista." },
    ],
  }),
  component: Atualizar,
});

function Atualizar() {
  const { ready, hasPlan, data, addEntry } = useMaratona();
  const navigate = useNavigate();
  const [savedRef, setSavedRef] = useState<string | null>(null);
  const [showBulk, setShowBulk] = useState(false);
  const [bulkText, setBulkText] = useState("");
  const [bulkPreview, setBulkPreview] = useState<{
    rows: { ref: string; patrimonio: number; aportes: number }[];
    errors: string[];
  } | null>(null);

  useEffect(() => {
    if (ready && !hasPlan) navigate({ to: "/onboarding" });
  }, [ready, hasPlan, navigate]);

  const sugerido = useMemo(() => {
    if (!data) return "";
    return proximoRefMes(data.entries);
  }, [data]);

  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: {
      ref: sugerido,
      patrimonio: data?.entries[data.entries.length - 1]?.patrimonio ?? data?.plan.patrimonioInicial ?? 0,
      aportes: data?.plan.aporteMensal ?? 0,
    },
  });

  if (!ready || !data) return <div className="py-20 text-center text-muted-foreground">Carregando…</div>;

  const lastSaved =
    savedRef ? data.entries.find((e) => e.ref === savedRef) : null;

  function onSubmit(v: FormValues) {
    addEntry({ ref: v.ref, patrimonio: v.patrimonio, aportes: v.aportes });
    setSavedRef(v.ref);
    toast.success(`Mês ${formatRef(v.ref)} registrado!`);
  }

  if (lastSaved && data) {
    const derived = derivarEntries(data.plan, data.entries);
    const found = derived.find((e) => e.ref === lastSaved.ref)!;
    const total = prazoMeses(data.plan);
    const ideal = linhaIdeal(data.plan, total);
    const idealMes = ideal[derived.findIndex((e) => e.ref === lastSaved.ref) + 1];
    const status = classificarRitmo(found.patrimonio, idealMes);

    return (
      <div className="max-w-md mx-auto space-y-5 animate-fade-in py-6">
        <div className="text-center">
          <CheckCircle2 className="h-14 w-14 text-pace-ahead mx-auto" />
          <h2 className="text-2xl font-bold mt-3">Mês registrado!</h2>
          <p className="text-muted-foreground mt-1">{formatRef(lastSaved.ref)}</p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-5 space-y-3">
          <Row label="Ganho total" value={fmtBRL(found.aportes + found.rentabilidade)} />
          <Row label="Aportes" value={fmtBRL(found.aportes)} />
          <Row
            label="Rentabilidade"
            value={fmtBRL(found.rentabilidade)}
            hint={fmtPct(found.rentabilidadePct, 2)}
            accent={found.rentabilidade >= 0 ? "text-pace-ahead" : "text-pace-behind"}
          />
          <hr className="border-border/40" />
          <Row label="Patrimônio" value={fmtBRL(found.patrimonio)} />
        </div>

        <div
          className={`rounded-2xl p-4 text-center font-semibold ${
            status === "ahead"
              ? "bg-pace-ahead/10 text-pace-ahead"
              : status === "behind"
                ? "bg-pace-behind/10 text-pace-behind"
                : "bg-pace-on/10 text-pace-on"
          }`}
        >
          {status === "ahead" && "Você está à frente do plano. Excelente!"}
          {status === "on" && "Você está mantendo o ritmo. Disciplina é tudo."}
          {status === "behind" && "Hora de acelerar — pequenos ajustes mudam a corrida."}
        </div>

        <div className="flex gap-3">
          <Button asChild variant="secondary" className="flex-1">
            <Link to="/">Ver pista</Link>
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              setSavedRef(null);
              reset({
                ref: proximoRefMes(data.entries),
                patrimonio: found.patrimonio,
                aportes: data.plan.aporteMensal,
              });
            }}
          >
            Registrar próximo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-4 animate-fade-in">
      <h2 className="text-2xl font-bold tracking-tight">Ritual mensal</h2>
      <p className="text-muted-foreground mt-1 text-sm">
        Atualize o patrimônio do fim do mês e o quanto você aportou.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Mês de referência</Label>
          <Input type="month" {...register("ref")} />
          {errors.ref && <p className="text-xs text-destructive">Mês inválido</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">
            Patrimônio total no fim do mês
          </Label>
          <Controller
            name="patrimonio"
            control={control}
            render={({ field }) => (
              <CurrencyInput value={Number(field.value) || 0} onChange={field.onChange} />
            )}
          />
          {errors.patrimonio && <p className="text-xs text-destructive">{errors.patrimonio.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">
            Aportes feitos no mês
          </Label>
          <Controller
            name="aportes"
            control={control}
            render={({ field }) => (
              <CurrencyInput
                value={Number(field.value) || 0}
                onChange={field.onChange}
                allowNegative
              />
            )}
          />
          {errors.aportes && <p className="text-xs text-destructive">{errors.aportes.message}</p>}
          <p className="text-[11px] text-muted-foreground">
            Use valor negativo para retiradas/saques no mês.
          </p>
        </div>

        <Button type="submit" size="lg" className="w-full font-semibold">
          Registrar mês <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-border/50">
        <button
          type="button"
          onClick={() => setShowBulk((v) => !v)}
          className="text-sm text-primary font-medium hover:underline"
        >
          {showBulk ? "− Ocultar importação em massa" : "+ Colar série histórica (vários meses)"}
        </button>

        {showBulk && (
          <div className="mt-4 space-y-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Cole linhas no formato <code className="text-foreground">mês&nbsp;patrimônio&nbsp;aportes</code>.
              Aceita separadores: tab, vírgula, ponto-e-vírgula ou espaço. Mês: <code className="text-foreground">2024-01</code>,
              <code className="text-foreground"> 01/2024</code> ou <code className="text-foreground">jan/2024</code>.
              Aportes são opcionais (assume o aporte do plano).
            </p>
            <div className="rounded-md bg-muted/50 p-2 text-[11px] font-mono text-muted-foreground whitespace-pre">
{`2024-01  120000  3000
2024-02  124500  3000
03/2024  128900  3500`}
            </div>
            <Textarea
              rows={8}
              placeholder="Cole aqui sua série histórica..."
              value={bulkText}
              onChange={(e) => {
                setBulkText(e.target.value);
                setBulkPreview(null);
              }}
              className="font-mono text-xs"
            />
            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => {
                  const result = parseBulk(bulkText, data.plan.aporteMensal);
                  setBulkPreview(result);
                }}
                disabled={!bulkText.trim()}
              >
                Pré-visualizar
              </Button>
              <Button
                type="button"
                className="flex-1"
                disabled={!bulkPreview || bulkPreview.rows.length === 0}
                onClick={() => {
                  if (!bulkPreview) return;
                  bulkPreview.rows.forEach((r) => addEntry(r));
                  toast.success(`${bulkPreview.rows.length} meses importados!`);
                  setBulkText("");
                  setBulkPreview(null);
                  setShowBulk(false);
                }}
              >
                Importar {bulkPreview?.rows.length ? `(${bulkPreview.rows.length})` : ""}
              </Button>
            </div>

            {bulkPreview && (
              <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
                {bulkPreview.errors.length > 0 && (
                  <div className="p-3 bg-destructive/10 text-destructive text-xs space-y-0.5">
                    {bulkPreview.errors.slice(0, 5).map((er, i) => (
                      <div key={i}>• {er}</div>
                    ))}
                    {bulkPreview.errors.length > 5 && (
                      <div>… e mais {bulkPreview.errors.length - 5} erro(s)</div>
                    )}
                  </div>
                )}
                {bulkPreview.rows.length > 0 && (
                  <table className="w-full text-xs">
                    <thead className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      <tr className="border-b border-border/50">
                        <th className="text-left p-2">Mês</th>
                        <th className="text-right p-2">Patrimônio</th>
                        <th className="text-right p-2">Aportes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bulkPreview.rows.map((r) => (
                        <tr key={r.ref} className="border-b border-border/30">
                          <td className="p-2 font-medium">{formatRef(r.ref)}</td>
                          <td className="p-2 text-right tabular-nums">{fmtBRL(r.patrimonio)}</td>
                          <td className="p-2 text-right tabular-nums">{fmtBRL(r.aportes)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, hint, accent }: { label: string; value: string; hint?: string; accent?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`font-semibold tabular-nums ${accent ?? ""}`}>
        {value}
        {hint && <span className="text-xs text-muted-foreground ml-2">({hint})</span>}
      </span>
    </div>
  );
}

const MESES_PT: Record<string, string> = {
  jan: "01", fev: "02", mar: "03", abr: "04", mai: "05", jun: "06",
  jul: "07", ago: "08", set: "09", out: "10", nov: "11", dez: "12",
};

function parseRefToken(tok: string): string | null {
  const t = tok.trim().toLowerCase();
  // YYYY-MM ou YYYY/MM
  let m = t.match(/^(\d{4})[-/](\d{1,2})$/);
  if (m) return `${m[1]}-${m[2].padStart(2, "0")}`;
  // MM/YYYY ou MM-YYYY
  m = t.match(/^(\d{1,2})[-/](\d{4})$/);
  if (m) return `${m[2]}-${m[1].padStart(2, "0")}`;
  // jan/2024, jan-24, jan 2024
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

function parseNumber(tok: string): number | null {
  if (!tok) return null;
  let s = tok.trim().replace(/r\$\s*/i, "").replace(/\s/g, "");
  // Remove separadores de milhar; aceita vírgula como decimal
  if (s.includes(",") && s.includes(".")) {
    s = s.replace(/\./g, "").replace(",", ".");
  } else if (s.includes(",")) {
    s = s.replace(",", ".");
  }
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function parseBulk(
  text: string,
  aporteDefault: number,
): { rows: { ref: string; patrimonio: number; aportes: number }[]; errors: string[] } {
  const errors: string[] = [];
  const map = new Map<string, { ref: string; patrimonio: number; aportes: number }>();
  const lines = text.split(/\r?\n/);
  lines.forEach((rawLine, idx) => {
    const line = rawLine.trim();
    if (!line) return;
    // Split por tab, vírgula, ponto-e-vírgula ou espaços múltiplos.
    // Cuidado: vírgula pode ser decimal — só usamos como separador se houver tab/;/2+ espaços.
    let parts: string[];
    if (/\t|;/.test(line)) {
      parts = line.split(/[\t;]+/);
    } else if (/\s{2,}/.test(line)) {
      parts = line.split(/\s{2,}/);
    } else {
      // Tenta padrão: ref + dois números
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
      const a = parseNumber(parts[2]);
      if (a === null) {
        errors.push(`Linha ${idx + 1}: aporte inválido "${parts[2]}"`);
        return;
      }
      aportes = a;
    }
    map.set(ref, { ref, patrimonio, aportes });
  });
  const rows = [...map.values()].sort((a, b) => a.ref.localeCompare(b.ref));
  return { rows, errors };
}
