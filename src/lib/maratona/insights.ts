import type { EntryDerived } from "./math";
import { fmtBRL, fmtPct, prazoMeses } from "./math";
import { MARATHON_KM, type Plan } from "./types";

export type Insight = {
  id: string;
  tone: "positive" | "info" | "warning";
  title: string;
  message: string;
};

export function gerarInsights(plan: Plan, derived: EntryDerived[]): Insight[] {
  const insights: Insight[] = [];
  if (derived.length === 0) return insights;

  const last = derived[derived.length - 1];
  const avgRentPct =
    derived.reduce((acc, e) => acc + e.rentabilidadePct, 0) / derived.length;

  // Rentabilidade do mês acima da média
  if (derived.length >= 2 && last.rentabilidadePct > avgRentPct + 0.005) {
    insights.push({
      id: "rent-acima",
      tone: "positive",
      title: "Mês acima da média",
      message: `Sua rentabilidade foi ${fmtPct(last.rentabilidadePct, 2)}, acima da sua média histórica de ${fmtPct(avgRentPct, 2)}.`,
    });
  }

  // Aporte abaixo do planejado
  if (last.aportes + 1 < plan.aporteMensal) {
    const falta = plan.aporteMensal - last.aportes;
    insights.push({
      id: "aporte-baixo",
      tone: "warning",
      title: "Aporte menor que o planejado",
      message: `Faltaram ${fmtBRL(falta)} para bater o aporte do mês. Consistência vence velocidade.`,
    });
  } else if (last.aportes >= plan.aporteMensal) {
    insights.push({
      id: "aporte-ok",
      tone: "positive",
      title: "Aporte em dia",
      message: `Você manteve o aporte planejado este mês. Continue assim!`,
    });
  }

  // Atrás do ideal por 2+ meses
  const ult = derived.slice(-2);
  if (ult.length === 2 && ult.every((e) => e.status === "behind")) {
    insights.push({
      id: "atraso",
      tone: "warning",
      title: "Abaixo do ritmo há 2 meses",
      message: `Que tal um aporte extra ou revisar a estratégia? Pequenos ajustes recolocam você na pista.`,
    });
  }

  if (last.status === "ahead") {
    insights.push({
      id: "frente",
      tone: "positive",
      title: "Você está à frente do plano",
      message: `Seu patrimônio está ${fmtBRL(last.delta ?? 0)} acima da linha ideal. Excelente!`,
    });
  }

  // Marco de km cruzado
  const prazo = prazoMeses(plan);
  const kmAgora = (derived.length / prazo) * MARATHON_KM;
  const kmAntes = ((derived.length - 1) / prazo) * MARATHON_KM;
  const marcos = [5, 10, 21.1, 30, 42.195];
  for (const m of marcos) {
    if (kmAntes < m && kmAgora >= m) {
      insights.push({
        id: `marco-${m}`,
        tone: "positive",
        title: `Marco de ${m} km cruzado!`,
        message: m === 42.195
          ? "Você completou a maratona do tempo. Parabéns pela disciplina!"
          : `Mais um marco conquistado. Siga firme até a chegada.`,
      });
    }
  }

  return insights.slice(0, 4);
}

export function mensagemPrincipal(status: "ahead" | "on" | "behind", consistencia: number): string {
  if (consistencia === 0) return "Sua largada começa aqui";
  if (status === "ahead") return "Você está à frente do plano";
  if (status === "behind") return "Hora de acelerar";
  if (consistencia >= 6) return "Disciplina é mais importante que velocidade";
  return "Você está mantendo o ritmo";
}
