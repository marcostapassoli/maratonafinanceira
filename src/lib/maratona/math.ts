import { MARATHON_KM, type MonthEntry, type Plan, type PaceStatus } from "./types";

/** Patrimônio necessário para gerar a renda passiva desejada (regra da taxa de retirada). */
export function metaPatrimonio(plan: Plan): number {
  const taxa = plan.taxaRetirada > 0 ? plan.taxaRetirada : 0.04;
  return (plan.rendaMensalDesejada * 12) / taxa;
}

export const taxaMensal = (taxaAnual: number) =>
  Math.pow(1 + taxaAnual, 1 / 12) - 1;

/** Converte um índice de mês (1 = primeiro mês após dataInicio) em ref "YYYY-MM". */
export function refDoMesIdx(dataInicio: string, mesIdx: number): string {
  const d = new Date(dataInicio);
  const t = new Date(d.getFullYear(), d.getMonth() + mesIdx, 1);
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}`;
}

/** Aporte mensal aplicável no mês `mesIdx` considerando o cronograma. */
export function aporteAtMonth(plan: Plan, mesIdx: number): number {
  const sched = plan.aporteSchedule;
  if (!sched || sched.length === 0) return plan.aporteMensal;
  const ref = refDoMesIdx(plan.dataInicio, mesIdx);
  const sorted = [...sched].sort((a, b) => a.fromRef.localeCompare(b.fromRef));
  let valor = plan.aporteMensal;
  for (const s of sorted) {
    if (s.fromRef <= ref) valor = s.valor;
    else break;
  }
  return valor;
}

/** Soma dos eventos pontuais ocorrendo no mês `mesIdx`. */
export function eventoAtMonth(plan: Plan, mesIdx: number): number {
  const evs = plan.eventos;
  if (!evs || evs.length === 0) return 0;
  const ref = refDoMesIdx(plan.dataInicio, mesIdx);
  let total = 0;
  for (const e of evs) {
    if (e.ref === ref) total += Number(e.valor) || 0;
  }
  return total;
}

/** Idade atual em anos (com meses como fração) calculada a partir de dataNascimento. */
export function idadeAtual(plan: Plan): number {
  const [y, m] = plan.dataNascimento.split("-").map(Number);
  const now = new Date();
  const months =
    (now.getFullYear() - y) * 12 + (now.getMonth() + 1 - m);
  return months / 12;
}

/**
 * Meses até atingir a meta no plano (projeção com aportes + taxa esperada).
 * Esse é o prazo da maratona — definido pelo desempenho projetado, não por idade-meta.
 */
export const prazoMeses = (plan: Plan) => {
  const m = mesesAteMeta(plan, plan.taxaAnual);
  return m === null ? 12 * 80 : Math.max(1, m);
};

/** Data prevista de chegada à meta (mês YYYY-MM) e idade na chegada. */
export function chegadaPrevista(plan: Plan): { ref: string; idade: number; meses: number } | null {
  return chegadaPrevistaDe(plan, plan.patrimonioInicial);
}

/**
 * Como chegadaPrevista, mas partindo de um patrimônio arbitrário (ex.: valor
 * mais recente do histórico) em vez do patrimonioInicial do plano.
 */
export function chegadaPrevistaDe(
  plan: Plan,
  patrimonioAtual: number,
): { ref: string; idade: number; meses: number } | null {
  const meses = mesesAteMetaDe(plan, plan.taxaAnual, patrimonioAtual);
  if (meses === null) return null;
  const inicio = new Date(plan.dataInicio);
  const target = new Date(inicio.getFullYear(), inicio.getMonth() + meses, 1);
  const ref = `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, "0")}`;
  const [by, bm] = plan.dataNascimento.split("-").map(Number);
  const idadeMeses =
    (target.getFullYear() - by) * 12 + (target.getMonth() + 1 - bm);
  return { ref, idade: idadeMeses / 12, meses };
}

/**
 * Data/idade prevista para atingir um patrimônio-alvo qualquer, a partir
 * de hoje (patrimonioInicial do plano), com aportes e taxa do plano.
 * Retorna null se não atingir em 80 anos.
 */
export function chegadaPrevistaAlvo(
  plan: Plan,
  alvo: number,
  patrimonioAtual?: number,
): { ref: string; idade: number; meses: number; jaAtingido: boolean } | null {
  const inicial = patrimonioAtual ?? plan.patrimonioInicial;
  if (inicial >= alvo) {
    const now = new Date();
    const ref = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const [by, bm] = plan.dataNascimento.split("-").map(Number);
    const idadeMeses = (now.getFullYear() - by) * 12 + (now.getMonth() + 1 - bm);
    return { ref, idade: idadeMeses / 12, meses: 0, jaAtingido: true };
  }
  const i = taxaMensal(plan.taxaAnual);
  let s = inicial;
  let mesesAchados: number | null = null;
  for (let m = 1; m <= 12 * 80; m++) {
    s = s * (1 + i) + aporteAtMonth(plan, m) + eventoAtMonth(plan, m);
    if (s < 0) s = 0;
    if (s >= alvo) { mesesAchados = m; break; }
  }
  if (mesesAchados === null) return null;
  const inicio = new Date(plan.dataInicio);
  const target = new Date(inicio.getFullYear(), inicio.getMonth() + mesesAchados, 1);
  const ref = `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, "0")}`;
  const [by, bm] = plan.dataNascimento.split("-").map(Number);
  const idadeMeses =
    (target.getFullYear() - by) * 12 + (target.getMonth() + 1 - bm);
  return { ref, idade: idadeMeses / 12, meses: mesesAchados, jaAtingido: false };
}

/**
 * Quantos meses, partindo de 0 com aporte+juros do plano, seriam necessários
 * para chegar ao patrimônio atual. Representa o trecho da maratona já
 * percorrido antes do app começar.
 */
export function mesesJaPercorridos(plan: Plan): number {
  const alvo = plan.patrimonioInicial;
  if (alvo <= 0) return 0;
  const i = taxaMensal(plan.taxaAnual);
  if (plan.aporteMensal <= 0 && i <= 0) return 0;
  let s = 0;
  for (let m = 1; m <= 12 * 80; m++) {
    s = s * (1 + i) + plan.aporteMensal;
    if (s >= alvo) return m;
  }
  return 12 * 80;
}

/** Prazo total: trecho já percorrido + trecho restante. */
export const prazoTotalMaratona = (plan: Plan) =>
  mesesJaPercorridos(plan) + prazoMeses(plan);

/**
 * Linha ideal de patrimônio para os próximos `meses` registros, partindo
 * de `patrimonioInicial` com o aporte e taxa do plano. Índice 0 = início,
 * índice n = após n meses.
 */
export function linhaIdeal(plan: Plan, meses: number): number[] {
  const i = taxaMensal(plan.taxaAnual);
  const out: number[] = [plan.patrimonioInicial];
  let s = plan.patrimonioInicial;
  for (let m = 1; m <= meses; m++) {
    s = s * (1 + i) + aporteAtMonth(plan, m) + eventoAtMonth(plan, m);
    if (s < 0) s = 0;
    out.push(s);
  }
  return out;
}

export function projetarComTaxa(
  plan: Plan,
  taxaAnual: number,
  meses: number,
  aporteMensal?: number,
): number[] {
  const i = Math.pow(1 + taxaAnual, 1 / 12) - 1;
  const out: number[] = [plan.patrimonioInicial];
  let s = plan.patrimonioInicial;
  for (let m = 1; m <= meses; m++) {
    const ap = aporteMensal !== undefined ? aporteMensal : aporteAtMonth(plan, m);
    const ev = aporteMensal !== undefined ? 0 : eventoAtMonth(plan, m);
    s = s * (1 + i) + ap + ev;
    if (s < 0) s = 0;
    out.push(s);
  }
  return out;
}

/** Resolve quantos meses até cruzar a meta dada uma taxa anual. Retorna null se não atinge em 80 anos. */
export function mesesAteMeta(
  plan: Plan,
  taxaAnual: number,
  aporteMensal?: number,
): number | null {
  return mesesAteMetaDe(plan, taxaAnual, plan.patrimonioInicial, aporteMensal);
}

/** Como mesesAteMeta, mas partindo de um patrimônio arbitrário. */
export function mesesAteMetaDe(
  plan: Plan,
  taxaAnual: number,
  patrimonioAtual: number,
  aporteMensal?: number,
): number | null {
  const i = Math.pow(1 + taxaAnual, 1 / 12) - 1;
  let s = patrimonioAtual;
  const meta = metaPatrimonio(plan);
  if (s >= meta) return 0;
  for (let m = 1; m <= 12 * 80; m++) {
    const ap = aporteMensal !== undefined ? aporteMensal : aporteAtMonth(plan, m);
    const ev = aporteMensal !== undefined ? 0 : eventoAtMonth(plan, m);
    s = s * (1 + i) + ap + ev;
    if (s < 0) s = 0;
    if (s >= meta) return m;
  }
  return null;
}

export function mesesDecorridos(entries: MonthEntry[]): number {
  return entries.length;
}

/**
 * Converte um mês (relativo ao início virtual da maratona) em km.
 * `mesAbsoluto` deve já incluir os meses pré-percorridos.
 */
export function posicaoKm(mesAbsoluto: number, prazoTotalAbs: number): number {
  const ratio = Math.min(1, Math.max(0, mesAbsoluto / Math.max(1, prazoTotalAbs)));
  return ratio * MARATHON_KM;
}

export function classificarRitmo(real: number, ideal: number): PaceStatus {
  if (ideal <= 0) return "on";
  const r = real / ideal;
  if (r > 1.03) return "ahead";
  if (r < 0.97) return "behind";
  return "on";
}

export type EntryDerived = MonthEntry & {
  index: number;
  rentabilidade: number;
  rentabilidadePct: number;
  patrimonioAnterior: number;
  ideal: number | null;
  delta: number | null;
  status: PaceStatus | null;
  dentroPlano: boolean;
};

/** "YYYY-MM" do mês de início do plano. */
export function planStartRef(plan: Plan): string {
  const d = new Date(plan.dataInicio);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/** Mantido por compatibilidade — agora todas as entries são consideradas parte do plano. */
export function entriesDentroPlano(_plan: Plan, entries: MonthEntry[]): MonthEntry[] {
  return entries;
}

export function derivarEntries(plan: Plan, entries: MonthEntry[]): EntryDerived[] {
  // Linha ideal cobre todas as entries, partindo do patrimonioInicial do plano.
  // Importações de série histórica passam a ser consideradas dentro do plano.
  const i = taxaMensal(plan.taxaAnual);
  const idealLinha: number[] = [plan.patrimonioInicial];
  let s = plan.patrimonioInicial;
  for (let m = 1; m <= entries.length; m++) {
    s = s * (1 + i) + aporteAtMonth(plan, m) + eventoAtMonth(plan, m);
    if (s < 0) s = 0;
    idealLinha.push(s);
  }

  return entries.map((e, idx) => {
    const anterior = idx === 0 ? plan.patrimonioInicial : entries[idx - 1].patrimonio;
    const rent = e.patrimonio - anterior - e.aportes;
    const base = anterior + e.aportes;
    const rentPct = base > 0 ? rent / base : 0;
    const idealMes = idealLinha[idx + 1];
    return {
      ...e,
      index: idx,
      rentabilidade: rent,
      rentabilidadePct: rentPct,
      patrimonioAnterior: anterior,
      ideal: idealMes,
      delta: e.patrimonio - idealMes,
      status: classificarRitmo(e.patrimonio, idealMes),
      dentroPlano: true,
    };
  });
}

/** Próximo "YYYY-MM" a partir do último registro (ou do mês atual se vazio). */
export function proximoRefMes(entries: MonthEntry[]): string {
  if (entries.length === 0) {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  }
  const last = entries[entries.length - 1].ref;
  const [y, m] = last.split("-").map(Number);
  const d = new Date(y, m - 1 + 1, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function formatRef(ref: string): string {
  const [y, m] = ref.split("-").map(Number);
  const meses = [
    "jan", "fev", "mar", "abr", "mai", "jun",
    "jul", "ago", "set", "out", "nov", "dez",
  ];
  return `${meses[m - 1]}/${y}`;
}

export const fmtBRL = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(v);

export const fmtBRLFull = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

export const fmtPct = (v: number, digits = 1) =>
  `${(v * 100).toFixed(digits)}%`;

export const fmtKm = (v: number) => `${v.toFixed(1)} km`;
