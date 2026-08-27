import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { u as useForm, C as Controller } from "../_libs/react-hook-form.mjs";
import { a } from "../_libs/hookform__resolvers.mjs";
import { u as useMaratona, D as DEFAULT_TAXA_RETIRADA, c as cn, M as MARATHON_KM } from "./router-BVyf5xBN.mjs";
import { m as mesesAteMeta, i as idadeAtual, f as fmtBRL, a as mesesJaPercorridos } from "./math-5GrSvXuq.mjs";
import { I as Input, B as Button } from "./input-DA1lb6-r.mjs";
import { L as Label } from "./label-L9dZHOwh.mjs";
import { C as CurrencyInput } from "./CurrencyInput-BfmobuDU.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { A as Activity, b as Lightbulb, c as ArrowLeft, d as ArrowRight, e as Check, I as Info, f as TriangleAlert } from "../_libs/lucide-react.mjs";
import { o as objectType, b as booleanType, c as coerce, s as stringType } from "../_libs/zod.mjs";

import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/unenv.mjs";


import "../_libs/seroval-plugins.mjs";


import "../_libs/react-dom.mjs";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/tslib.mjs";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
const REFERENCIAS = [
  { label: "Poupança", taxa: 0.06, hint: "rendimento histórico aproximado" },
  { label: "CDI", taxa: 0.1, hint: "média ~10% a.a. nos últimos 20 anos" },
  { label: "IBOVESPA", taxa: 0.12, hint: "média ~12% a.a., com forte volatilidade" }
];
const PERFIS = [
  {
    id: "conservador",
    label: "Conservador",
    taxa: 0.09,
    desc: "Próximo ao CDI. Foco em renda fixa."
  },
  {
    id: "moderado",
    label: "Moderado",
    taxa: 0.11,
    desc: "Mix de renda fixa com renda variável."
  },
  {
    id: "agressivo",
    label: "Agressivo",
    taxa: 0.13,
    desc: "Próximo ao IBOV. Mais risco e oscilação."
  }
];
function TaxaRetornoSelector({ value, onChange }) {
  const perfilAtivo = reactExports.useMemo(() => {
    const v = Number(value);
    return PERFIS.find((p) => Math.abs(p.taxa * 100 - v) < 0.05)?.id ?? null;
  }, [value]);
  const taxaAlta = Number(value) > 13;
  const [text, setText] = reactExports.useState(
    Number.isFinite(Number(value)) ? String(value) : ""
  );
  reactExports.useEffect(() => {
    const parsed = Number(text);
    if (text === "" || !Number.isFinite(parsed) || parsed !== Number(value)) {
      setText(Number.isFinite(Number(value)) ? String(value) : "");
    }
  }, [value]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: PERFIS.map((p) => {
      const active = perfilAtivo === p.id;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => onChange(p.taxa * 100),
          className: cn(
            "rounded-lg border p-2.5 text-left transition-colors",
            active ? "border-primary bg-primary/10" : "border-border/60 bg-card hover:border-primary/40"
          ),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold", children: p.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] font-mono text-primary mt-0.5", children: [
              (p.taxa * 100).toFixed(1),
              "% a.a."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground mt-1 leading-tight", children: p.desc })
          ]
        },
        p.id
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] uppercase tracking-wider text-muted-foreground", children: "Personalizar (% ao ano)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          type: "number",
          inputMode: "decimal",
          step: "0.1",
          value: text,
          onChange: (e) => {
            const raw = e.target.value;
            setText(raw);
            if (raw === "") {
              onChange(0);
              return;
            }
            const n = Number(raw);
            if (Number.isFinite(n)) onChange(n);
          },
          onBlur: () => {
            if (text === "") setText("0");
          }
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border/60 bg-secondary/30 p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-3 w-3" }),
        " Referências dos últimos 20 anos"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: REFERENCIAS.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => onChange(r.taxa * 100),
          className: "w-full flex items-baseline justify-between gap-3 text-left hover:text-primary transition-colors",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold", children: r.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs", children: [
              (r.taxa * 100).toFixed(1),
              "% a.a."
            ] })
          ]
        },
        r.label
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-2 leading-relaxed", children: "Valores baseados no passado. O futuro pode ser diferente." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground leading-relaxed", children: "Essa taxa representa o crescimento esperado do seu patrimônio ao longo do tempo, antes de considerar a inflação. A inflação pode reduzir o poder de compra ao longo dos anos." }),
    taxaAlta && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 rounded-lg border border-pace-behind/40 bg-pace-behind/10 p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-pace-behind shrink-0 mt-0.5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-pace-behind leading-relaxed", children: "Retornos mais altos normalmente envolvem maior risco e podem não se repetir no futuro. Considere se você está confortável com oscilações fortes." })
    ] })
  ] });
}
const schema = objectType({
  dataNascimento: stringType().regex(/^\d{4}-\d{2}$/, "Informe mês e ano"),
  patrimonioInicial: coerce.number().min(0),
  rendaMensalDesejada: coerce.number().positive("Informe a renda mensal desejada"),
  taxaRetiradaPct: coerce.number().min(1).max(10),
  aporteMensal: coerce.number().min(0),
  taxaAnualPct: coerce.number().min(0).max(50),
  atualizaIpca: booleanType()
});
const STEPS = [{
  id: 1,
  title: "Sobre você",
  subtitle: "Quem está correndo a maratona"
}, {
  id: 2,
  title: "Seu objetivo",
  subtitle: "Onde está a linha de chegada"
}, {
  id: 3,
  title: "Sua estratégia",
  subtitle: "Como você vai chegar lá"
}, {
  id: 4,
  title: "Resumo",
  subtitle: "Confira seu plano"
}];
function Onboarding() {
  const {
    setPlan,
    hasPlan,
    ready,
    data
  } = useMaratona();
  const navigate = useNavigate();
  const [step, setStep] = reactExports.useState(1);
  const {
    register,
    handleSubmit,
    watch,
    control,
    trigger,
    setValue,
    formState: {
      errors
    }
  } = useForm({
    resolver: a(schema),
    mode: "onChange",
    defaultValues: data?.plan ? {
      dataNascimento: data.plan.dataNascimento,
      patrimonioInicial: data.plan.patrimonioInicial,
      rendaMensalDesejada: data.plan.rendaMensalDesejada,
      taxaRetiradaPct: (data.plan.taxaRetirada ?? DEFAULT_TAXA_RETIRADA) * 100,
      aporteMensal: data.plan.aporteMensal,
      taxaAnualPct: data.plan.taxaAnual * 100,
      atualizaIpca: data.plan.atualizaIpca ?? true
    } : {
      dataNascimento: defaultBirth(),
      patrimonioInicial: 2e4,
      rendaMensalDesejada: 8e3,
      taxaRetiradaPct: 4,
      aporteMensal: 1500,
      taxaAnualPct: 10,
      atualizaIpca: true
    }
  });
  const v = watch();
  const preview = reactExports.useMemo(() => {
    const patrimonio = Number(v.patrimonioInicial) || 0;
    const renda = Number(v.rendaMensalDesejada) || 0;
    const taxaRet = (Number(v.taxaRetiradaPct) || DEFAULT_TAXA_RETIRADA * 100) / 100;
    const meta = taxaRet > 0 ? renda * 12 / taxaRet : 0;
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
      dataInicio: (/* @__PURE__ */ new Date()).toISOString()
    };
    const mesesParaMeta = mesesAteMeta(planLike, taxaAnual);
    const mesesRestantes = mesesParaMeta ?? 0;
    const ritmoIdeal = mesesRestantes > 0 ? valorRestante / mesesRestantes : 0;
    const mesesAntes = mesesJaPercorridos(planLike);
    const totalAbs = mesesAntes + mesesRestantes;
    const pctInicial = totalAbs > 0 ? mesesAntes / totalAbs : 0;
    const kmInicial = pctInicial * MARATHON_KM;
    const idadeNow = idadeAtual(planLike);
    const idadeChegada = idadeNow + mesesRestantes / 12;
    const target = /* @__PURE__ */ new Date();
    target.setMonth(target.getMonth() + mesesRestantes);
    const refChegada = `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, "0")}`;
    return {
      ritmoIdeal,
      pctMeta,
      valorRestante,
      kmInicial,
      pctInicial,
      mesesAntes,
      meta,
      mesesRestantes,
      mesesParaMeta,
      idadeChegada,
      refChegada
    };
  }, [v.dataNascimento, v.patrimonioInicial, v.rendaMensalDesejada, v.taxaRetiradaPct, v.aporteMensal, v.taxaAnualPct]);
  reactExports.useEffect(() => {
    if (ready && hasPlan && !data?.plan) navigate({
      to: "/"
    });
  }, [ready, hasPlan, data, navigate]);
  function onSubmit(values) {
    setPlan({
      dataNascimento: values.dataNascimento,
      patrimonioInicial: values.patrimonioInicial,
      rendaMensalDesejada: values.rendaMensalDesejada,
      taxaRetirada: values.taxaRetiradaPct / 100,
      aporteMensal: values.aporteMensal,
      taxaAnual: values.taxaAnualPct / 100,
      dataInicio: data?.plan?.dataInicio ?? (/* @__PURE__ */ new Date()).toISOString(),
      atualizaIpca: values.atualizaIpca,
      ultimoAjusteIpcaAno: data?.plan?.ultimoAjusteIpcaAno ?? null
    });
    toast.success("Plano salvo! Hora de correr.");
    navigate({
      to: "/"
    });
  }
  async function next() {
    const fields = {
      1: ["dataNascimento", "patrimonioInicial"],
      2: ["rendaMensalDesejada", "taxaRetiradaPct"],
      3: ["aporteMensal", "taxaAnualPct"]
    };
    const ok = await trigger(fields[step] ?? []);
    if (!ok) return;
    setStep((s) => Math.min(4, s + 1));
  }
  function prev() {
    setStep((s) => Math.max(1, s - 1));
  }
  const current = STEPS[step - 1];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-xl px-4 py-8 sm:py-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-5 w-5 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold tracking-wide uppercase text-primary", children: "Maratona Financeira" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl sm:text-3xl font-bold tracking-tight", children: "Sua largada começa aqui" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-2 text-sm", children: "Vamos montar seu plano em 4 passos rápidos. Você pode editar tudo depois." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1.5", children: STEPS.map((s) => {
        const done = step > s.id;
        const active = step === s.id;
        return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("h-1.5 rounded-full transition-colors", done || active ? "bg-primary" : "bg-secondary") }) }, s.id);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-[10px] uppercase tracking-wider mt-2 text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Passo ",
          step,
          " de 4"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: current.title })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-5", children: [
      step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 animate-fade-in", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { title: "Sobre você", subtitle: "Pra calcular sua trajetória, precisamos saber sua idade e onde você está hoje." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Data de nascimento", hint: "Mês e ano. Usamos só pra mostrar com que idade você bate sua meta.", error: errors.dataNascimento?.message, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "month", ...register("dataNascimento") }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Field, { label: "Patrimônio atual", hint: "Soma do que você já tem investido hoje: poupança, CDB, ações, fundos, tesouro etc. Não conta imóvel de moradia, carro ou bens de uso pessoal. Não sabe o valor exato? Estime — você pode ajustar depois.", error: errors.patrimonioInicial?.message, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Controller, { name: "patrimonioInicial", control, render: ({
            field
          }) => /* @__PURE__ */ jsxRuntimeExports.jsx(CurrencyInput, { value: Number(field.value) || 0, onChange: field.onChange }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SuggestionRow, { label: "Sugestões:", options: [{
            label: "R$ 0",
            value: 0
          }, {
            label: "R$ 10 mil",
            value: 1e4
          }, {
            label: "R$ 50 mil",
            value: 5e4
          }, {
            label: "R$ 200 mil",
            value: 2e5
          }], current: Number(v.patrimonioInicial) || 0, onPick: (value) => setValue("patrimonioInicial", value, {
            shouldValidate: true
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(InfoBox, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Lightbulb, { className: "h-4 w-4 text-primary" }), title: "Por que isso importa?", children: "Começar com R$ 0 ou com R$ 50 mil já investidos muda completamente sua linha do tempo — cada real hoje vale muito mais lá na frente por causa dos juros compostos." })
      ] }),
      step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 animate-fade-in", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { title: "Seu objetivo", subtitle: "Quanto você quer receber por mês quando parar de trabalhar." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Field, { label: "Renda mensal desejada", hint: "Quanto você quer receber por mês, em dinheiro de hoje, sem precisar trabalhar. Pense no padrão de vida que quer manter — moradia, comida, lazer, saúde.", error: errors.rendaMensalDesejada?.message, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Controller, { name: "rendaMensalDesejada", control, render: ({
            field
          }) => /* @__PURE__ */ jsxRuntimeExports.jsx(CurrencyInput, { value: Number(field.value) || 0, onChange: field.onChange }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SuggestionRow, { label: "Faixas comuns:", options: [{
            label: "R$ 5 mil",
            value: 5e3
          }, {
            label: "R$ 8 mil",
            value: 8e3
          }, {
            label: "R$ 15 mil",
            value: 15e3
          }, {
            label: "R$ 30 mil",
            value: 3e4
          }], current: Number(v.rendaMensalDesejada) || 0, onPick: (value) => setValue("rendaMensalDesejada", value, {
            shouldValidate: true
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border/60 bg-card p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-start gap-3 cursor-pointer", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Controller, { name: "atualizaIpca", control, render: ({
            field
          }) => /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: !!field.value, onChange: (e) => field.onChange(e.target.checked), className: "mt-0.5 h-4 w-4 accent-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Atualizar renda anualmente pelo IPCA" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "block text-xs text-muted-foreground mt-1", children: [
              "A cada ano, sua renda desejada é reajustada pela inflação oficial, preservando seu poder de compra. ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Recomendado." })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Field, { label: "Taxa de retirada anual", hint: "Quanto do seu patrimônio você vai sacar por ano para viver. A regra clássica é 4% — estudos mostram que esse ritmo permite viver da renda sem esgotar o patrimônio. Use 3,5% pra ser mais conservador, 5% pra ser mais agressivo.", error: errors.taxaRetiradaPct?.message, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", inputMode: "decimal", step: "0.1", ...register("taxaRetiradaPct") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "%" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SuggestionRow, { label: "Padrões:", options: [{
            label: "3,5% conservador",
            value: 3.5
          }, {
            label: "4% (regra clássica)",
            value: 4
          }, {
            label: "5% agressivo",
            value: 5
          }], current: Number(v.taxaRetiradaPct) || 0, onPick: (value) => setValue("taxaRetiradaPct", value, {
            shouldValidate: true
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border-2 border-primary/30 bg-primary/5 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: "Sua linha de chegada" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold tabular-nums mt-1 text-primary", children: fmtBRL(preview.meta) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1.5", children: [
            "É o patrimônio que você precisa acumular para gerar ",
            fmtBRL(Number(v.rendaMensalDesejada) || 0),
            "/mês retirando ",
            (Number(v.taxaRetiradaPct) || 0).toFixed(1),
            "% ao ano."
          ] })
        ] })
      ] }),
      step === 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 animate-fade-in", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { title: "Sua estratégia", subtitle: "Quanto você vai investir todo mês e qual retorno espera." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Field, { label: "Aporte mensal", hint: "Quanto você consegue guardar e investir todo mês — mesmo que pouco. Comece com um valor realista que caiba no seu orçamento. É melhor R$ 300 todo mês do que R$ 3.000 esporádicos.", error: errors.aporteMensal?.message, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Controller, { name: "aporteMensal", control, render: ({
            field
          }) => /* @__PURE__ */ jsxRuntimeExports.jsx(CurrencyInput, { value: Number(field.value) || 0, onChange: field.onChange }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SuggestionRow, { label: "Sugestões:", options: [{
            label: "R$ 500",
            value: 500
          }, {
            label: "R$ 1,5 mil",
            value: 1500
          }, {
            label: "R$ 3 mil",
            value: 3e3
          }, {
            label: "R$ 5 mil",
            value: 5e3
          }], current: Number(v.aporteMensal) || 0, onPick: (value) => setValue("aporteMensal", value, {
            shouldValidate: true
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Taxa de retorno anual esperada", hint: "Quanto você espera que seus investimentos rendam por ano, em média. Renda fixa conservadora fica perto do CDI (~10%); investidores moderados miram 11–12%; carteiras mais arrojadas em renda variável buscam 12%+. Não sabe? 10% é uma escolha realista.", error: errors.taxaAnualPct?.message, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Controller, { name: "taxaAnualPct", control, render: ({
          field
        }) => /* @__PURE__ */ jsxRuntimeExports.jsx(TaxaRetornoSelector, { value: Number(field.value) || 0, onChange: field.onChange }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(InfoBox, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Lightbulb, { className: "h-4 w-4 text-primary" }), title: "Dica", children: "A diferença entre 8% e 12% ao ano parece pequena, mas em 30 anos triplica o patrimônio final. Mais retorno também significa mais risco — escolha o que dorme tranquilo." })
      ] }),
      step === 4 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 animate-fade-in", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { title: "Tudo pronto", subtitle: "Confira o resumo do seu plano antes de começar." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border-2 border-primary/30 bg-primary/5 p-5 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wider text-primary font-semibold", children: "Sua maratona em uma frase" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-base sm:text-lg font-semibold leading-snug", children: [
            "Investindo ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary tabular-nums", children: [
              fmtBRL(Number(v.aporteMensal) || 0),
              "/mês"
            ] }),
            " ",
            "a ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary tabular-nums", children: [
              (Number(v.taxaAnualPct) || 0).toFixed(1),
              "% a.a."
            ] }),
            ", você bate sua meta de ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary tabular-nums", children: fmtBRL(preview.meta) }),
            " ",
            preview.mesesParaMeta === null ? "— mas com esses parâmetros, ela não é alcançada. Ajuste o aporte ou a taxa." : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              "aos ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary tabular-nums", children: [
                preview.idadeChegada.toFixed(1),
                " anos"
              ] }),
              ", em ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary tabular-nums", children: formatRefShort(preview.refChegada) }),
              "."
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/60 bg-card p-4 space-y-1.5 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryRow, { label: "Tempo até a meta", value: preview.mesesParaMeta === null ? "—" : `${preview.mesesRestantes} meses (${(preview.mesesRestantes / 12).toFixed(1)} anos)` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryRow, { label: "Você já está em", value: `${preview.kmInicial.toFixed(2)} km (${(preview.pctInicial * 100).toFixed(0)}%)` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryRow, { label: "Falta acumular", value: fmtBRL(preview.valorRestante) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryRow, { label: "Ritmo ideal /mês", value: fmtBRL(preview.ritmoIdeal) }),
          preview.pctMeta >= 0.7 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-primary pt-1.5 border-t border-border/40 mt-2", children: [
            "Você já iniciou com vantagem significativa — ",
            (preview.pctMeta * 100).toFixed(0),
            "% da meta já acumulada."
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 pt-2", children: [
        step > 1 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "ghost", size: "lg", onClick: prev, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4 mr-1" }),
          " Voltar"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", {}),
        step < 4 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", size: "lg", onClick: next, className: "font-semibold ml-auto", children: [
          "Continuar ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 ml-1" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", size: "lg", className: "font-semibold ml-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 mr-1" }),
          " Começar minha maratona"
        ] })
      ] })
    ] })
  ] }) });
}
function SectionHeader({
  title,
  subtitle
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold tracking-tight", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: subtitle })
  ] });
}
function Field({
  label,
  hint,
  error,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs uppercase tracking-wider text-muted-foreground", children: label }),
    children,
    hint && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: hint }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: error })
  ] });
}
function SuggestionRow({
  label,
  options,
  current,
  onPick
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-1.5 pt-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-wider text-muted-foreground mr-1", children: label }),
    options.map((o) => {
      const active = Math.abs(current - o.value) < 1e-3;
      return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => onPick(o.value), className: cn("rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors", active ? "border-primary bg-primary text-primary-foreground" : "border-border/60 bg-secondary/40 hover:border-primary/40"), children: o.label }, o.label);
    })
  ] });
}
function InfoBox({
  icon,
  title,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-primary/20 bg-primary/5 p-3.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs font-semibold text-primary", children: [
      icon,
      " ",
      title
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1.5 leading-relaxed", children })
  ] });
}
function SummaryRow({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-semibold", children: value })
  ] });
}
function defaultBirth() {
  const d = /* @__PURE__ */ new Date();
  const y = d.getFullYear() - 30;
  return `${y}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function formatRefShort(ref) {
  const [y, m] = ref.split("-").map(Number);
  const meses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  return `${meses[m - 1]}/${y}`;
}
export {
  Onboarding as component
};
