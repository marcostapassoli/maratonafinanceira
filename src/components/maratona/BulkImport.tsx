import { useMemo, useState } from "react";
import { ClipboardPaste, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useMaratona } from "@/lib/maratona/store";
import { fmtBRL, formatRef } from "@/lib/maratona/math";
import { parseBulkPaste } from "@/lib/maratona/bulk-import";
import { cn } from "@/lib/utils";

/**
 * Cola série histórica vinda de planilha (Excel/Google Sheets/Numbers).
 * Aceita 2 ou 3 colunas: mês, patrimônio, [aportes].
 */
export function BulkImport() {
  const { addEntries, data } = useMaratona();
  const [text, setText] = useState("");

  const parsed = useMemo(() => (text.trim() ? parseBulkPaste(text) : []), [text]);
  const valid = parsed.filter((r) => r.ok);
  const errors = parsed.filter((r) => !r.ok);
  const existing = new Set((data?.entries ?? []).map((e) => e.ref));
  const sobrescreve = valid.filter((r) => r.ok && existing.has(r.entry.ref)).length;
  const novos = valid.length - sobrescreve;

  function aplicar() {
    const entries = valid
      .filter((r): r is typeof r & { ok: true } => r.ok)
      .map((r) => r.entry);
    if (!entries.length) return;
    addEntries(entries);
    toast.success(
      `${entries.length} mês${entries.length === 1 ? "" : "es"} importado${entries.length === 1 ? "" : "s"}` +
        (sobrescreve > 0 ? ` (${sobrescreve} sobrescrito${sobrescreve === 1 ? "" : "s"})` : ""),
    );
    setText("");
  }

  return (
    <section className="rounded-2xl border border-border/60 bg-card p-5 space-y-3">
      <div className="flex items-center gap-2">
        <ClipboardPaste className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">Importar série histórica</h3>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        Cola direto da sua planilha (Excel, Google Sheets, Numbers). Esperamos
        2 ou 3 colunas:{" "}
        <span className="font-mono text-foreground">mês</span>,{" "}
        <span className="font-mono text-foreground">patrimônio</span>,{" "}
        <span className="font-mono text-muted-foreground">aportes (opcional)</span>.
        Mês aceita formatos como{" "}
        <span className="font-mono">2024-03</span>,{" "}
        <span className="font-mono">03/2024</span> ou{" "}
        <span className="font-mono">mar/2024</span>.
      </p>

      <div className="space-y-1.5">
        <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
          Cole aqui
        </Label>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`mês\tpatrimônio\taportes\n2024-01\t125.000,00\t2.000\n2024-02\t128.500,00\t2.000\n2024-03\t130.200,00\t2.000`}
          className="min-h-[140px] font-mono text-xs"
          spellCheck={false}
        />
      </div>

      {parsed.length > 0 && (
        <div className="rounded-xl border border-border/60 bg-secondary/20 p-3 space-y-2">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1 text-pace-ahead">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span className="tabular-nums">{valid.length}</span> ok
            </span>
            {novos > 0 && (
              <span className="text-muted-foreground tabular-nums">
                {novos} novo{novos === 1 ? "" : "s"}
              </span>
            )}
            {sobrescreve > 0 && (
              <span className="text-muted-foreground tabular-nums">
                {sobrescreve} sobrescrev{sobrescreve === 1 ? "e" : "em"}
              </span>
            )}
            {errors.length > 0 && (
              <span className="inline-flex items-center gap-1 text-pace-behind">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span className="tabular-nums">{errors.length}</span> com erro
              </span>
            )}
          </div>

          {valid.length > 0 && (
            <div className="max-h-40 overflow-auto rounded-md border border-border/40 bg-background/40">
              <table className="w-full text-[11px] tabular-nums">
                <thead className="sticky top-0 bg-secondary/60 text-muted-foreground">
                  <tr>
                    <th className="text-left px-2 py-1 font-medium">Mês</th>
                    <th className="text-right px-2 py-1 font-medium">Patrimônio</th>
                    <th className="text-right px-2 py-1 font-medium">Aporte</th>
                  </tr>
                </thead>
                <tbody>
                  {valid.map(
                    (r) =>
                      r.ok && (
                        <tr
                          key={r.line}
                          className={cn(
                            "border-t border-border/30",
                            existing.has(r.entry.ref) && "bg-primary/5",
                          )}
                        >
                          <td className="px-2 py-1">{formatRef(r.entry.ref)}</td>
                          <td className="px-2 py-1 text-right">{fmtBRL(r.entry.patrimonio)}</td>
                          <td className="px-2 py-1 text-right text-muted-foreground">
                            {fmtBRL(r.entry.aportes)}
                          </td>
                        </tr>
                      ),
                  )}
                </tbody>
              </table>
            </div>
          )}

          {errors.length > 0 && (
            <ul className="space-y-1 text-[11px] text-pace-behind/90">
              {errors.slice(0, 5).map(
                (r) =>
                  !r.ok && (
                    <li key={r.line} className="leading-snug">
                      Linha {r.line}: {r.error}
                    </li>
                  ),
              )}
              {errors.length > 5 && (
                <li className="text-muted-foreground">
                  …e mais {errors.length - 5} linha{errors.length - 5 === 1 ? "" : "s"} com erro.
                </li>
              )}
            </ul>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <Button
          onClick={aplicar}
          disabled={valid.length === 0}
          className="flex-1"
        >
          Importar {valid.length > 0 ? `${valid.length} mês${valid.length === 1 ? "" : "es"}` : ""}
        </Button>
        {text && (
          <Button variant="secondary" onClick={() => setText("")}>
            Limpar
          </Button>
        )}
      </div>
    </section>
  );
}