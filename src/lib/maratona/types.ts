export const MARATHON_KM = 42.195;
export const STORAGE_KEY = "maratona-financeira/v1";

export const DEFAULT_TAXA_RETIRADA = 0.04;

export type Plan = {
  /** Data de nascimento no formato "YYYY-MM". */
  dataNascimento: string;
  patrimonioInicial: number;
  /** Renda passiva mensal desejada (R$). */
  rendaMensalDesejada: number;
  /** Taxa de retirada anual segura (ex: 0.04 = regra dos 4%). */
  taxaRetirada: number;
  aporteMensal: number;
  taxaAnual: number; // ex.: 0.10 = 10% a.a.
  dataInicio: string; // ISO
  /** Atualizar a renda mensal desejada anualmente pelo IPCA do ano anterior. */
  atualizaIpca?: boolean;
  /** Último ano civil cujo IPCA já foi aplicado à renda (ex: 2026 = aplicado o IPCA de 2026). */
  ultimoAjusteIpcaAno?: number | null;
  /** Cronograma de mudanças no aporte (vazio = aporte fixo de aporteMensal). */
  aporteSchedule?: AporteScheduleItem[];
  /** Eventos pontuais (bônus, saques, compras). */
  eventos?: Evento[];
};

export type MonthEntry = {
  /** Mês de referência no formato "YYYY-MM" */
  ref: string;
  patrimonio: number;
  aportes: number;
};

/** Mudança no aporte mensal a partir de um mês "YYYY-MM" (inclusive). */
export type AporteScheduleItem = {
  fromRef: string;
  valor: number;
};

/** Evento pontual (positivo = aporte extra/herança/PLR; negativo = saque/compra). */
export type Evento = {
  /** Mês "YYYY-MM" em que o evento ocorre. */
  ref: string;
  /** Valor em R$ (positivo soma ao patrimônio, negativo subtrai). */
  valor: number;
  descricao: string;
};

export type AppData = {
  version: 1;
  plan: Plan;
  entries: MonthEntry[];
  createdAt: string;
  updatedAt: string;
};

export type PaceStatus = "ahead" | "on" | "behind";
