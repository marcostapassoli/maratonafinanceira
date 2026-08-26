import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  CalendarClock,
  FileJson,
  FileSpreadsheet,
  Plus,
  RefreshCw,
  Settings as SettingsIcon,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";
import { useMaratona } from "@/lib/maratona/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CurrencyInput } from "@/components/maratona/CurrencyInput";
import { MetaExplain } from "@/components/maratona/MetaExplain";
import { BulkImport } from "@/components/maratona/BulkImport";
import { toast } from "sonner";
import { formatRef, idadeAtual, chegadaPrevista, metaPatrimonio } from "@/lib/maratona/math";
import type { AporteScheduleItem, Evento } from "@/lib/maratona/types";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações — Maratona Financeira" },
      { name: "description", content: "Edite seu plano, exporte ou importe dados." },
    ],
  }),
  component: Configuracoes,
});

function Configuracoes() {
  const { ready, hasPlan, data, importJson, reset, updatePlan } = useMaratona();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ready && !hasPlan) navigate({ to: "/onboarding" });
  }, [ready, hasPlan, navigate]);

  if (!ready || !data) return <div className="py-20 text-center text-muted-foreground">Carregando…</div>;

  function exportJSON() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    downloadBlob(blob, `maratona-financeira-${new Date().toISOString().slice(0, 10)}.json`);
    toast.success("Backup JSON exportado");
  }

  function exportCSV() {
    if (!data) return;
    const header = ["Mes", "Patrimonio", "Aportes"];
    const rows = data.entries.map((e) => [formatRef(e.ref), e.patrimonio, e.aportes]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    downloadBlob(blob, `maratona-financeira-${new Date().toISOString().slice(0, 10)}.csv`);
    toast.success("CSV exportado");
  }

  function onImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const ok = importJson(String(reader.result));
      if (ok) toast.success("Dados importados com sucesso");
      else toast.error("Arquivo inválido");
    };
    reader.readAsText(file);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <SettingsIcon className="h-5 w-5" /> Configurações
        </h2>
      </div>

      <section className="rounded-2xl border border-border/60 bg-card p-5 space-y-3">
        <h3 className="text-sm font-semibold">Plano</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Field label="Nascimento" value={formatRef(data.plan.dataNascimento)} />
          <Field label="Idade atual" value={`${idadeAtual(data.plan).toFixed(1)} anos`} />
          <Field label="Patrimônio inicial" value={brl(data.plan.patrimonioInicial)} />
          <Field label="Renda mensal desejada" value={brl(data.plan.rendaMensalDesejada)} />
          <Field label="Taxa de retirada" value={`${(data.plan.taxaRetirada * 100).toFixed(1)}%`} />
          <Field
            label="Reajuste anual IPCA"
            value={
              (data.plan.atualizaIpca ?? true)
                ? data.plan.ultimoAjusteIpcaAno
                  ? `Ativo (último: ${data.plan.ultimoAjusteIpcaAno})`
                  : "Ativo"
                : "Desativado"
            }
          />
          <div className="rounded-lg bg-secondary/50 p-3">
            <MetaExplain plan={data.plan} className="w-full">
              <div className="text-left w-full">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Patrimônio necessário
                </div>
                <div className="font-semibold tabular-nums mt-0.5">
                  {brl(metaPatrimonio(data.plan))}
                </div>
              </div>
            </MetaExplain>
          </div>
          <Field label="Aporte mensal" value={brl(data.plan.aporteMensal)} />
          <Field label="Taxa anual" value={`${(data.plan.taxaAnual * 100).toFixed(1)}%`} />
          <Field
            label="Chegada provável"
            value={(() => {
              const c = chegadaPrevista(data.plan);
              return c ? `${formatRef(c.ref)} • ${c.idade.toFixed(1)} anos` : "—";
            })()}
          />
        </div>
        <Button variant="secondary" className="w-full" onClick={() => navigate({ to: "/onboarding" })}>
          Editar plano
        </Button>
      </section>

      <ScheduleEditor
        items={data.plan.aporteSchedule ?? []}
        defaultValor={data.plan.aporteMensal}
        onChange={(aporteSchedule) => updatePlan({ aporteSchedule })}
      />

      <EventosEditor
        items={data.plan.eventos ?? []}
        onChange={(eventos) => updatePlan({ eventos })}
      />

      <section className="rounded-2xl border border-border/60 bg-card p-5 space-y-3">
        <h3 className="text-sm font-semibold">Backup e exportação</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="secondary" onClick={exportJSON}>
            <FileJson className="h-4 w-4 mr-1" /> JSON
          </Button>
          <Button variant="secondary" onClick={exportCSV}>
            <FileSpreadsheet className="h-4 w-4 mr-1" /> CSV
          </Button>
        </div>
        <input ref={fileRef} type="file" accept="application/json" hidden onChange={onImport} />
        <Button variant="secondary" className="w-full" onClick={() => fileRef.current?.click()}>
          <Upload className="h-4 w-4 mr-1" /> Importar JSON
        </Button>
      </section>

      <BulkImport />

      <section className="rounded-2xl border border-destructive/40 bg-destructive/5 p-5 space-y-3">
        <h3 className="text-sm font-semibold text-destructive">Zona de risco</h3>
        <p className="text-xs text-muted-foreground">
          Apaga seu plano e todo o histórico. Não tem como desfazer.
        </p>
        <Button
          variant="destructive"
          className="w-full"
          onClick={() => {
            if (confirm("Tem certeza? Isso apaga tudo.")) {
              reset();
              toast.success("Tudo limpo. Boa nova largada!");
              navigate({ to: "/onboarding" });
            }
          }}
        >
          <RefreshCw className="h-4 w-4 mr-1" /> Resetar tudo
        </Button>
      </section>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-secondary/50 p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-semibold tabular-nums mt-0.5">{value}</div>
    </div>
  );
}

const brl = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(v);

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function refToInput(ref: string): string {
  return ref; // YYYY-MM já é o formato de <input type="month">
}

function currentRef(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function ScheduleEditor({
  items,
  defaultValor,
  onChange,
}: {
  items: AporteScheduleItem[];
  defaultValor: number;
  onChange: (next: AporteScheduleItem[]) => void;
}) {
  const [draftRef, setDraftRef] = useState<string>(currentRef());
  const [draftValor, setDraftValor] = useState<number>(defaultValor);

  const sorted = [...items].sort((a, b) => a.fromRef.localeCompare(b.fromRef));

  function add() {
    if (!/^\d{4}-\d{2}$/.test(draftRef)) {
      toast.error("Mês inválido");
      return;
    }
    const filtered = sorted.filter((s) => s.fromRef !== draftRef);
    onChange([...filtered, { fromRef: draftRef, valor: draftValor }].sort((a, b) => a.fromRef.localeCompare(b.fromRef)));
    toast.success(`A partir de ${formatRef(draftRef)}: ${brl(draftValor)}/mês`);
  }
  function remove(ref: string) {
    onChange(sorted.filter((s) => s.fromRef !== ref));
  }

  return (
    <section className="rounded-2xl border border-border/60 bg-card p-5 space-y-3">
      <div className="flex items-center gap-2">
        <CalendarClock className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">Cronograma de aportes</h3>
      </div>
      <p className="text-xs text-muted-foreground">
        Reflete mudanças de carreira: ex. <span className="text-foreground">"R$ 2.000 até 2028, depois R$ 4.000"</span>.
        Por padrão usa o aporte do plano ({brl(defaultValor)}/mês).
      </p>

      {sorted.length > 0 && (
        <ul className="space-y-1.5">
          {sorted.map((s) => (
            <li
              key={s.fromRef}
              className="flex items-center justify-between gap-2 rounded-lg border border-border/40 bg-secondary/20 px-3 py-2"
            >
              <div className="min-w-0">
                <div className="text-sm font-medium">A partir de {formatRef(s.fromRef)}</div>
                <div className="text-[11px] text-muted-foreground tabular-nums">{brl(s.valor)}/mês</div>
              </div>
              <button
                type="button"
                onClick={() => remove(s.fromRef)}
                className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                aria-label="Remover"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="grid grid-cols-[1fr_1fr_auto] gap-2 items-end pt-1">
        <div className="space-y-1">
          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">A partir de</Label>
          <Input
            type="month"
            value={refToInput(draftRef)}
            onChange={(e) => setDraftRef(e.target.value)}
            className="h-9"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Novo aporte</Label>
          <CurrencyInput value={draftValor} onChange={setDraftValor} className="h-9" />
        </div>
        <Button size="sm" onClick={add}>
          <Plus className="h-4 w-4" /> Adicionar
        </Button>
      </div>
    </section>
  );
}

function EventosEditor({
  items,
  onChange,
}: {
  items: Evento[];
  onChange: (next: Evento[]) => void;
}) {
  const [draftRef, setDraftRef] = useState<string>(currentRef());
  const [draftValor, setDraftValor] = useState<number>(0);
  const [draftDesc, setDraftDesc] = useState<string>("");

  const sorted = [...items].sort((a, b) => a.ref.localeCompare(b.ref));

  function add() {
    if (!/^\d{4}-\d{2}$/.test(draftRef)) {
      toast.error("Mês inválido");
      return;
    }
    if (!draftValor) {
      toast.error("Informe um valor (positivo ou negativo)");
      return;
    }
    const desc = draftDesc.trim() || (draftValor > 0 ? "Receita extra" : "Saque");
    onChange([...sorted, { ref: draftRef, valor: draftValor, descricao: desc }]
      .sort((a, b) => a.ref.localeCompare(b.ref)));
    toast.success(`${desc} em ${formatRef(draftRef)}: ${brl(draftValor)}`);
    setDraftDesc("");
    setDraftValor(0);
  }
  function remove(idx: number) {
    onChange(sorted.filter((_, i) => i !== idx));
  }

  return (
    <section className="rounded-2xl border border-border/60 bg-card p-5 space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">Eventos pontuais</h3>
      </div>
      <p className="text-xs text-muted-foreground">
        Bônus, herança ou PLR (valor positivo) e compras ou saques únicos (valor negativo). Entram na projeção do plano.
      </p>

      {sorted.length > 0 && (
        <ul className="space-y-1.5">
          {sorted.map((e, idx) => {
            const positivo = e.valor >= 0;
            return (
              <li
                key={`${e.ref}-${idx}`}
                className="flex items-center justify-between gap-2 rounded-lg border border-border/40 bg-secondary/20 px-3 py-2"
              >
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{e.descricao}</div>
                  <div className="text-[11px] text-muted-foreground tabular-nums">
                    {formatRef(e.ref)} ·{" "}
                    <span className={positivo ? "text-pace-ahead" : "text-pace-behind"}>
                      {positivo ? "+" : "−"}{brl(Math.abs(e.valor))}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  aria-label="Remover"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <div className="space-y-2 pt-1">
        <div className="grid grid-cols-[1fr_1fr] gap-2">
          <div className="space-y-1">
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Mês</Label>
            <Input
              type="month"
              value={refToInput(draftRef)}
              onChange={(e) => setDraftRef(e.target.value)}
              className="h-9"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Valor (± para entrada/saída)</Label>
            <CurrencyInput value={draftValor} onChange={setDraftValor} className="h-9" allowNegative />
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Descrição</Label>
          <Input
            value={draftDesc}
            onChange={(e) => setDraftDesc(e.target.value)}
            placeholder="Ex.: PLR, herança, compra do carro"
            className="h-9"
          />
        </div>
        <Button size="sm" onClick={add} className="w-full">
          <Plus className="h-4 w-4" /> Adicionar evento
        </Button>
      </div>
    </section>
  );
}
