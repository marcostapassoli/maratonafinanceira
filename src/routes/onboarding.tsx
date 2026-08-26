import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useMemo, useState } from "react";
import { Activity, ArrowRight, ArrowLeft, Check, Lightbulb } from "lucide-react";
import { useMaratona } from "@/lib/maratona/store";
import { DEFAULT_TAXA_RETIRADA, MARATHON_KM } from "@/lib/maratona/types";
import { fmtBRL, mesesJaPercorridos, mesesAteMeta, idadeAtual as idadeFromPlan } from "@/lib/maratona/math";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CurrencyInput } from "@/components/maratona/CurrencyInput";
import { TaxaRetornoSelector } from "@/components/maratona/TaxaRetornoSelector";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const schema = z.object({
  dataNascimento: z.string().regex(/^\d{4}-\d{2}$/, "Informe mês e ano"),
  patrimonioInicial: z.coerce.number().min(0),
  rendaMensalDesejada: z.coerce.number().positive("Informe a renda mensal desejada"),
  taxaRetiradaPct: z.coerce.number().min(1).max(10),
  aporteMensal: z.coerce.number().min(0),
  taxaAnualPct: z.coerce.number().min(0).max(50),
  atualizaIpca: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

const STEPS = [
  { id: 1, title: "Sobre você", subtitle: "Quem está correndo a maratona" },
  { id: 2, title: "Seu objetivo", subtitle: "Onde está a linha de chegada" },
  { id: 3, title: "Sua estratégia", subtitle: "Como você vai chegar lá" },
  { id: 4, title: "Resumo", subtitle: "Confira seu plano" },
] as const;

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Sua largada — Maratona Financeira" },
      { name: "description", content: "Configure seu plano para começar a maratona patrimonial." },
    ],
  }),
  component: Onboarding,
});

function Onboarding() {
  const { setPlan, hasPlan, ready, data } = useMaratona();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const { register, handleSubmit, watch, control, trigger, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: data?.plan
      ? {
          dataNascimento: data.plan.dataNascimento,
          patrimonioInicial: data.plan.patrimonioInicial,
          rendaMensalDesejada: data.plan.rendaMensalDesejada,
          taxaRetiradaPct: (data.plan.taxaRetirada ?? DEFAULT_TAXA_RETIRADA) * 100,
          aporteMensal: data.plan.aporteMensal,
          taxaAnualPct: data.plan.taxaAnual * 100,
          atualizaIpca: data.plan.atualizaIpca ?? true,
        }
      : {
          dataNascimento: defaultBirth(),
          patrimonioInicial: 20000,
          rendaMensalDesejada: 8000,
          taxaRetiradaPct: 4,
          aporteMensal: 1500,
          taxaAnualPct: 10,
          atualizaIpca: true,
        },
  });

  const v = watch();
  const preview = useMemo(() => {
    const patrimonio = Number(v.patrimonioInicial) || 0;
    const renda = Number(v.rendaMensalDesejada) || 0;
    const taxaRet = (Number(v.taxaRetiradaPct) || DEFAULT_TAXA_RETIRADA * 100) / 100;
    const meta = taxaRet > 0 ? (renda * 12) / taxaRet : 0;
    const aporte = Number(v.aporteMensal) || 0;
    const taxaAnual = (Number(v.taxaAnualPct) || 0) / 100;
    const valorRestante = Math.max(0, meta - patrimonio);
    const pctMeta = meta > 0 ? patrimonio / meta : 0;
    const planLike = {
      dataNascimento: v.dataNascimento || defaultBirth(),
      patrimonioInicial: patrimonio,
      rendaMensalDesejada: renda,
      taxaRetirada: taxaRet,
      aporteMensal: aporte,
      taxaAnual,
      dataInicio: new Date().toISOString(),
    };
    const mesesParaMeta = mesesAteMeta(planLike, taxaAnual);
    const mesesRestantes = mesesParaMeta ?? 0;
    const ritmoIdeal = mesesRestantes > 0 ? valorRestante / mesesRestantes : 0;
    const mesesAntes = mesesJaPercorridos(planLike);
    const totalAbs = mesesAntes + mesesRestantes;
    const pctInicial = totalAbs > 0 ? mesesAntes / totalAbs : 0;
    const kmInicial = pctInicial * MARATHON_KM;
    const idadeNow = idadeFromPlan(planLike);
    const idadeChegada = idadeNow + mesesRestantes / 12;
    const target = new Date();
    target.setMonth(target.getMonth() + mesesRestantes);
    const refChegada = `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, "0")}`;
    return {
      ritmoIdeal, pctMeta, valorRestante, kmInicial, pctInicial, mesesAntes, meta,
      mesesRestantes, mesesParaMeta, idadeChegada, refChegada,
    };
  }, [v.dataNascimento, v.patrimonioInicial, v.rendaMensalDesejada, v.taxaRetiradaPct, v.aporteMensal, v.taxaAnualPct]);

  useEffect(() => {
    if (ready && hasPlan && !data?.plan) navigate({ to: "/" });
  }, [ready, hasPlan, data, navigate]);

  function onSubmit(values: FormValues) {
    setPlan({
      dataNascimento: values.dataNascimento,
      patrimonioInicial: values.patrimonioInicial,
      rendaMensalDesejada: values.rendaMensalDesejada,
      taxaRetirada: values.taxaRetiradaPct / 100,
      aporteMensal: values.aporteMensal,
      taxaAnual: values.taxaAnualPct / 100,
      dataInicio: data?.plan?.dataInicio ?? new Date().toISOString(),
      atualizaIpca: values.atualizaIpca,
      ultimoAjusteIpcaAno: data?.plan?.ultimoAjusteIpcaAno ?? null,
    });
    toast.success("Plano salvo! Hora de correr.");
    navigate({ to: "/" });
  }

  async function next() {
    const fields: Record<number, (keyof FormValues)[]> = {
      1: ["dataNascimento", "patrimonioInicial"],
      2: ["rendaMensalDesejada", "taxaRetiradaPct"],
      3: ["aporteMensal", "taxaAnualPct"],
    };
    const ok = await trigger(fields[step] ?? []);
    if (!ok) return;
    setStep((s) => Math.min(4, s + 1) as 1 | 2 | 3 | 4);
  }

  function prev() {
    setStep((s) => Math.max(1, s - 1) as 1 | 2 | 3 | 4);
  }

  const current = STEPS[step - 1];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-xl px-4 py-8 sm:py-10">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="h-5 w-5 text-primary" />
          <span className="text-sm font-semibold tracking-wide uppercase text-primary">
            Maratona Financeira
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Sua largada começa aqui</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Vamos montar seu plano em 4 passos rápidos. Você pode editar tudo depois.
        </p>

        {/* Stepper */}
        <div className="mt-6 mb-6">
          <div className="flex items-center gap-1.5">
            {STEPS.map((s) => {
              const done = step > s.id;
              const active = step === s.id;
              return (
                <div key={s.id} className="flex-1">
                  <div
                    className={cn(
                      "h-1.5 rounded-full transition-colors",
                      done || active ? "bg-primary" : "bg-secondary",
                    )}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-[10px] uppercase tracking-wider mt-2 text-muted-foreground">
            <span>Passo {step} de 4</span>
            <span className="font-semibold text-foreground">{current.title}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <SectionHeader title="Sobre você" subtitle="Pra calcular sua trajetória, precisamos saber sua idade e onde você está hoje." />

              <Field
                label="Data de nascimento"
                hint="Mês e ano. Usamos só pra mostrar com que idade você bate sua meta."
                error={errors.dataNascimento?.message}
              >
                <Input type="month" {...register("dataNascimento")} />
              </Field>

              <Field
                label="Patrimônio atual"
                hint="Soma do que você já tem investido hoje: poupança, CDB, ações, fundos, tesouro etc. Não conta imóvel de moradia, carro ou bens de uso pessoal. Não sabe o valor exato? Estime — você pode ajustar depois."
                error={errors.patrimonioInicial?.message}
              >
                <Controller
                  name="patrimonioInicial"
                  control={control}
                  render={({ field }) => (
                    <CurrencyInput value={Number(field.value) || 0} onChange={field.onChange} />
                  )}
                />
                <SuggestionRow
                  label="Sugestões:"
                  options={[
                    { label: "R$ 0", value: 0 },
                    { label: "R$ 10 mil", value: 10000 },
                    { label: "R$ 50 mil", value: 50000 },
                    { label: "R$ 200 mil", value: 200000 },
                  ]}
                  current={Number(v.patrimonioInicial) || 0}
                  onPick={(value) => setValue("patrimonioInicial", value, { shouldValidate: true })}
                />
              </Field>

              <InfoBox icon={<Lightbulb className="h-4 w-4 text-primary" />} title="Por que isso importa?">
                Começar com R$ 0 ou com R$ 50 mil já investidos muda completamente sua linha do tempo —
                cada real hoje vale muito mais lá na frente por causa dos juros compostos.
              </InfoBox>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <SectionHeader title="Seu objetivo" subtitle="Quanto você quer receber por mês quando parar de trabalhar." />

              <Field
                label="Renda mensal desejada"
                hint="Quanto você quer receber por mês, em dinheiro de hoje, sem precisar trabalhar. Pense no padrão de vida que quer manter — moradia, comida, lazer, saúde."
                error={errors.rendaMensalDesejada?.message}
              >
                <Controller
                  name="rendaMensalDesejada"
                  control={control}
                  render={({ field }) => (
                    <CurrencyInput value={Number(field.value) || 0} onChange={field.onChange} />
                  )}
                />
                <SuggestionRow
                  label="Faixas comuns:"
                  options={[
                    { label: "R$ 5 mil", value: 5000 },
                    { label: "R$ 8 mil", value: 8000 },
                    { label: "R$ 15 mil", value: 15000 },
                    { label: "R$ 30 mil", value: 30000 },
                  ]}
                  current={Number(v.rendaMensalDesejada) || 0}
                  onPick={(value) => setValue("rendaMensalDesejada", value, { shouldValidate: true })}
                />
              </Field>

              <div className="rounded-xl border border-border/60 bg-card p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <Controller
                    name="atualizaIpca"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="checkbox"
                        checked={!!field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="mt-0.5 h-4 w-4 accent-primary"
                      />
                    )}
                  />
                  <span className="text-sm">
                    <strong>Atualizar renda anualmente pelo IPCA</strong>
                    <span className="block text-xs text-muted-foreground mt-1">
                      A cada ano, sua renda desejada é reajustada pela inflação oficial,
                      preservando seu poder de compra. <strong>Recomendado.</strong>
                    </span>
                  </span>
                </label>
              </div>

              <Field
                label="Taxa de retirada anual"
                hint="Quanto do seu patrimônio você vai sacar por ano para viver. A regra clássica é 4% — estudos mostram que esse ritmo permite viver da renda sem esgotar o patrimônio. Use 3,5% pra ser mais conservador, 5% pra ser mais agressivo."
                error={errors.taxaRetiradaPct?.message}
              >
                <div className="flex items-center gap-2">
                  <Input type="number" inputMode="decimal" step="0.1" {...register("taxaRetiradaPct")} />
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
                <SuggestionRow
                  label="Padrões:"
                  options={[
                    { label: "3,5% conservador", value: 3.5 },
                    { label: "4% (regra clássica)", value: 4 },
                    { label: "5% agressivo", value: 5 },
                  ]}
                  current={Number(v.taxaRetiradaPct) || 0}
                  onPick={(value) => setValue("taxaRetiradaPct", value, { shouldValidate: true })}
                />
              </Field>

              <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-4">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  Sua linha de chegada
                </div>
                <div className="text-2xl font-bold tabular-nums mt-1 text-primary">
                  {fmtBRL(preview.meta)}
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  É o patrimônio que você precisa acumular para gerar {fmtBRL(Number(v.rendaMensalDesejada) || 0)}/mês
                  retirando {(Number(v.taxaRetiradaPct) || 0).toFixed(1)}% ao ano.
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <SectionHeader title="Sua estratégia" subtitle="Quanto você vai investir todo mês e qual retorno espera." />

              <Field
                label="Aporte mensal"
                hint="Quanto você consegue guardar e investir todo mês — mesmo que pouco. Comece com um valor realista que caiba no seu orçamento. É melhor R$ 300 todo mês do que R$ 3.000 esporádicos."
                error={errors.aporteMensal?.message}
              >
                <Controller
                  name="aporteMensal"
                  control={control}
                  render={({ field }) => (
                    <CurrencyInput value={Number(field.value) || 0} onChange={field.onChange} />
                  )}
                />
                <SuggestionRow
                  label="Sugestões:"
                  options={[
                    { label: "R$ 500", value: 500 },
                    { label: "R$ 1,5 mil", value: 1500 },
                    { label: "R$ 3 mil", value: 3000 },
                    { label: "R$ 5 mil", value: 5000 },
                  ]}
                  current={Number(v.aporteMensal) || 0}
                  onPick={(value) => setValue("aporteMensal", value, { shouldValidate: true })}
                />
              </Field>

              <Field
                label="Taxa de retorno anual esperada"
                hint="Quanto você espera que seus investimentos rendam por ano, em média. Renda fixa conservadora fica perto do CDI (~10%); investidores moderados miram 11–12%; carteiras mais arrojadas em renda variável buscam 12%+. Não sabe? 10% é uma escolha realista."
                error={errors.taxaAnualPct?.message}
              >
                <Controller
                  name="taxaAnualPct"
                  control={control}
                  render={({ field }) => (
                    <TaxaRetornoSelector
                      value={Number(field.value) || 0}
                      onChange={field.onChange}
                    />
                  )}
                />
              </Field>

              <InfoBox icon={<Lightbulb className="h-4 w-4 text-primary" />} title="Dica">
                A diferença entre 8% e 12% ao ano parece pequena, mas em 30 anos triplica o patrimônio final.
                Mais retorno também significa mais risco — escolha o que dorme tranquilo.
              </InfoBox>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <SectionHeader title="Tudo pronto" subtitle="Confira o resumo do seu plano antes de começar." />

              <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-5 space-y-3">
                <div className="text-xs uppercase tracking-wider text-primary font-semibold">
                  Sua maratona em uma frase
                </div>
                <p className="text-base sm:text-lg font-semibold leading-snug">
                  Investindo <span className="text-primary tabular-nums">{fmtBRL(Number(v.aporteMensal) || 0)}/mês</span>{" "}
                  a <span className="text-primary tabular-nums">{(Number(v.taxaAnualPct) || 0).toFixed(1)}% a.a.</span>,
                  você bate sua meta de <span className="text-primary tabular-nums">{fmtBRL(preview.meta)}</span>{" "}
                  {preview.mesesParaMeta === null
                    ? "— mas com esses parâmetros, ela não é alcançada. Ajuste o aporte ou a taxa."
                    : <>aos <span className="text-primary tabular-nums">{preview.idadeChegada.toFixed(1)} anos</span>, em <span className="text-primary tabular-nums">{formatRefShort(preview.refChegada)}</span>.</>}
                </p>
              </div>

              <div className="rounded-xl border border-border/60 bg-card p-4 space-y-1.5 text-sm">
                <SummaryRow label="Tempo até a meta" value={preview.mesesParaMeta === null ? "—" : `${preview.mesesRestantes} meses (${(preview.mesesRestantes / 12).toFixed(1)} anos)`} />
                <SummaryRow label="Você já está em" value={`${preview.kmInicial.toFixed(2)} km (${(preview.pctInicial * 100).toFixed(0)}%)`} />
                <SummaryRow label="Falta acumular" value={fmtBRL(preview.valorRestante)} />
                <SummaryRow label="Ritmo ideal /mês" value={fmtBRL(preview.ritmoIdeal)} />
                {preview.pctMeta >= 0.7 && (
                  <p className="text-xs text-primary pt-1.5 border-t border-border/40 mt-2">
                    Você já iniciou com vantagem significativa — {(preview.pctMeta * 100).toFixed(0)}% da meta já acumulada.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Navegação */}
          <div className="flex items-center justify-between gap-3 pt-2">
            {step > 1 ? (
              <Button type="button" variant="ghost" size="lg" onClick={prev}>
                <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
              </Button>
            ) : <div />}

            {step < 4 ? (
              <Button type="button" size="lg" onClick={next} className="font-semibold ml-auto">
                Continuar <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button type="submit" size="lg" className="font-semibold ml-auto">
                <Check className="h-4 w-4 mr-1" /> Começar minha maratona
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h2 className="text-xl font-bold tracking-tight">{title}</h2>
      <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
    </div>
  );
}

function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground leading-relaxed">{hint}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function SuggestionRow({
  label,
  options,
  current,
  onPick,
}: {
  label: string;
  options: { label: string; value: number }[];
  current: number;
  onPick: (value: number) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 pt-1">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground mr-1">{label}</span>
      {options.map((o) => {
        const active = Math.abs(current - o.value) < 0.001;
        return (
          <button
            key={o.label}
            type="button"
            onClick={() => onPick(o.value)}
            className={cn(
              "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border/60 bg-secondary/40 hover:border-primary/40",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function InfoBox({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5">
      <div className="flex items-center gap-2 text-xs font-semibold text-primary">
        {icon} {title}
      </div>
      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{children}</p>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono font-semibold">{value}</span>
    </div>
  );
}

function defaultBirth(): string {
  const d = new Date();
  const y = d.getFullYear() - 30;
  return `${y}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function formatRefShort(ref: string): string {
  const [y, m] = ref.split("-").map(Number);
  const meses = ["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];
  return `${meses[m - 1]}/${y}`;
}
