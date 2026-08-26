import { MARATHON_KM, type Plan } from "./types";
import {
  aporteAtMonth,
  eventoAtMonth,
  metaPatrimonio,
  taxaMensal,
  type EntryDerived,
} from "./math";

/**
 * Trajetória simulada 0 → meta com aporte/taxa do plano (sem cronograma/eventos).
 * Coincide com a régua usada para calcular km na home, então o pace conversa com a pista.
 */
function trajetoriaBase(plan: Plan): { traj: number[]; totalAbs: number } {
  const i = taxaMensal(plan.taxaAnual);
  const meta = metaPatrimonio(plan);
  const traj: number[] = [0];
  if (plan.aporteMensal <= 0 && i <= 0) {
    return { traj, totalAbs: 12 * 80 };
  }
  let s = 0;
  for (let m = 1; m <= 12 * 80; m++) {
    s = s * (1 + i) + plan.aporteMensal;
    traj.push(s);
    if (s >= meta) return { traj, totalAbs: m };
  }
  return { traj, totalAbs: 12 * 80 };
}

/** Posição (em meses, fracionária) na trajetória base correspondente a um patrimônio. */
function mesParaPatrim(traj: number[], patrim: number): number {
  if (patrim <= 0) return 0;
  for (let m = 1; m < traj.length; m++) {
    if (traj[m] >= patrim) {
      const prev = traj[m - 1];
      const cur = traj[m];
      if (cur === prev) return m;
      return m - 1 + (patrim - prev) / (cur - prev);
    }
  }
  return traj.length - 1;
}

function kmDeMes(mesAbs: number, totalAbs: number): number {
  return Math.min(MARATHON_KM, Math.max(0, (mesAbs / Math.max(1, totalAbs)) * MARATHON_KM));
}

/** Patrimônio correspondente a um km na trajetória base. */
function patrimParaKm(plan: Plan, km: number): number {
  const { traj, totalAbs } = trajetoriaBase(plan);
  const mes = (km / MARATHON_KM) * totalAbs;
  const lo = Math.max(0, Math.floor(mes));
  const hi = Math.min(traj.length - 1, lo + 1);
  const frac = mes - lo;
  return traj[lo] + (traj[hi] - traj[lo]) * frac;
}

export type Pace = {
  /** Meses gastos para percorrer exatamente o último km completo. null se a série não cobre. */
  mesesUltimoKm: number | null;
  /** Previsão (meses) para o próximo km usando taxa+aporte do plano. null se já na meta. */
  mesesProxKm: number | null;
  /** km atual do usuário (derivado pela mesma régua da home). */
  kmAtual: number;
  /** km do próximo marco (kmAtual+1, limitado em 42.195). */
  kmProx: number;
};

/**
 * Calcula pace recente (últimos 3 meses) e previsão do próximo km com base no plano.
 * O ritmo recente é robusto a meses sem variação — usa km ganhos vs. meses corridos.
 */
export function calcularPace(plan: Plan, derived: EntryDerived[]): Pace {
  const { traj, totalAbs } = trajetoriaBase(plan);
  const last = derived[derived.length - 1];
  const patrimAtual = last?.patrimonio ?? plan.patrimonioInicial;
  const kmAtual = kmDeMes(mesParaPatrim(traj, patrimAtual), totalAbs);
  const kmAtualVisivel = Math.min(MARATHON_KM, Number(kmAtual.toFixed(1)));
  const kmProx = kmAtualVisivel >= MARATHON_KM
    ? MARATHON_KM
    : Math.min(MARATHON_KM, Math.floor(kmAtualVisivel) + 1);
  const kmUltimo = Math.max(0, kmProx - 1);

  // Série de km por mês: index 0 = patrimônio inicial (antes do 1º mês registrado),
  // index i (>=1) = fim do mês derived[i-1]. Diferença entre índices = 1 mês.
  const serieKm: number[] = [
    kmDeMes(mesParaPatrim(traj, plan.patrimonioInicial), totalAbs),
    ...derived.map((e) => kmDeMes(mesParaPatrim(traj, e.patrimonio), totalAbs)),
  ];
  const serieKmVisivel = serieKm.map((km) => Math.min(MARATHON_KM, Number(km.toFixed(1))));
  const cruzamento = (alvo: number): number | null => {
    if (alvo <= serieKmVisivel[0]) return 0;
    for (let i = 1; i < serieKmVisivel.length; i++) {
      if (serieKmVisivel[i] >= alvo && serieKmVisivel[i - 1] < alvo) {
        const denom = serieKmVisivel[i] - serieKmVisivel[i - 1];
        const frac = denom > 0 ? (alvo - serieKmVisivel[i - 1]) / denom : 0;
        return i - 1 + frac;
      }
    }
    return null;
  };
  const mesesNoKmHistorico = (km: number): number | null => {
    let meses = 0;
    for (let i = serieKmVisivel.length - 1; i >= 1; i--) {
      const kmDoMes = Math.floor(serieKmVisivel[i]);
      if (kmDoMes > km) continue;
      if (kmDoMes === km) {
        meses += 1;
        continue;
      }
      if (meses > 0) break;
    }
    return meses > 0 ? meses : null;
  };

  let mesesUltimoKm: number | null = null;
  if (kmUltimo >= 1) {
    const kmTrecho = kmUltimo - 1;
    mesesUltimoKm = mesesNoKmHistorico(kmTrecho);
    const tFim = mesesUltimoKm === null ? cruzamento(kmUltimo) : null;
    const tIni = mesesUltimoKm === null ? cruzamento(kmTrecho) : null;
    if (tFim !== null && tIni !== null && tFim > tIni) {
      mesesUltimoKm = tFim - tIni;
    }
  }

  let mesesProxKm: number | null = null;
  if (kmProx > kmAtual && patrimAtual < metaPatrimonio(plan)) {
    const patrimAlvo = patrimParaKm(plan, kmProx);
    const i = taxaMensal(plan.taxaAnual);
    const offset = derived.length;
    let s = patrimAtual;
    for (let m = 1; m <= 12 * 80; m++) {
      s = s * (1 + i) + aporteAtMonth(plan, offset + m) + eventoAtMonth(plan, offset + m);
      if (s < 0) s = 0;
      if (s >= patrimAlvo) {
        mesesProxKm = m;
        break;
      }
    }
  }

  return { mesesUltimoKm, mesesProxKm, kmAtual, kmProx };
}

export function fmtMeses(meses: number): string {
  if (meses <= 0) return "—";
  if (meses < 1) {
    const dias = Math.max(1, Math.round(meses * 30));
    return `${dias} dia${dias === 1 ? "" : "s"}`;
  }
  if (meses < 1.5) return "~1 mês";
  if (meses < 12) {
    const v = meses.toFixed(1).replace(/\.0$/, "");
    return `${v} meses`;
  }
  const anos = meses / 12;
  if (anos < 1.5) return "~1 ano";
  const v = anos.toFixed(1).replace(/\.0$/, "");
  return `${v} anos`;
}