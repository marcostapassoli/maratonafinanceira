import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { fmtBRL, fmtBRLFull, metaPatrimonio } from "@/lib/maratona/math";
import type { Plan } from "@/lib/maratona/types";
import { cn } from "@/lib/utils";

/**
 * Botão que abre uma explicação detalhada de como a meta de patrimônio
 * é calculada a partir da renda desejada e da taxa de retirada.
 */
export function MetaExplain({
  plan,
  className,
  children,
}: {
  plan: Plan;
  className?: string;
  children?: React.ReactNode;
}) {
  const meta = metaPatrimonio(plan);
  const taxaPct = (plan.taxaRetirada * 100).toFixed(1);
  const anual = plan.rendaMensalDesejada * 12;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-1 rounded-md text-left transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
            className,
          )}
          aria-label="Como a meta foi calculada?"
        >
          {children ?? <span className="tabular-nums">{fmtBRL(meta)}</span>}
          <Info className="h-3.5 w-3.5 opacity-60" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Como sua meta foi calculada</DialogTitle>
          <DialogDescription>
            A meta é o patrimônio que, investido, gera sua renda passiva
            desejada — sem precisar consumir o principal.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <div className="rounded-xl border border-border/60 bg-secondary/30 p-4 font-mono text-[13px] leading-relaxed">
            <div className="text-muted-foreground text-[11px] uppercase tracking-wider mb-2">
              Fórmula
            </div>
            <div>meta = renda anual ÷ taxa de retirada</div>
            <div className="mt-2 text-muted-foreground">
              {fmtBRLFull(plan.rendaMensalDesejada)} × 12 ÷ {taxaPct}%
            </div>
            <div className="mt-2 font-semibold text-foreground tabular-nums">
              = {fmtBRLFull(meta)}
            </div>
          </div>

          <div className="space-y-2">
            <Linha label="Renda mensal desejada" value={fmtBRLFull(plan.rendaMensalDesejada)} />
            <Linha label="Renda anual (×12)" value={fmtBRLFull(anual)} />
            <Linha label="Taxa de retirada" value={`${taxaPct}% ao ano`} />
            <Linha
              label="Patrimônio necessário"
              value={fmtBRLFull(meta)}
              destaque
            />
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            A taxa de retirada de {taxaPct}% vem da{" "}
            <span className="font-medium text-foreground">regra de Bengen</span>{" "}
            (a clássica "regra dos 4%"): historicamente, retirar essa fração do
            patrimônio por ano sustenta a renda por décadas mesmo em mercados
            ruins. Pode ajustar isso nas configurações do plano.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Linha({ label, value, destaque }: { label: string; value: string; destaque?: boolean }) {
  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-3 rounded-lg px-3 py-2",
        destaque ? "bg-primary/10 border border-primary/30" : "bg-secondary/30",
      )}
    >
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={cn("tabular-nums text-sm", destaque && "font-bold text-primary")}>{value}</span>
    </div>
  );
}