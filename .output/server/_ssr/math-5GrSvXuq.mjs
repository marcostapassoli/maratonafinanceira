function metaPatrimonio(plan) {
  const taxa = plan.taxaRetirada > 0 ? plan.taxaRetirada : 0.04;
  return plan.rendaMensalDesejada * 12 / taxa;
}
const taxaMensal = (taxaAnual) => Math.pow(1 + taxaAnual, 1 / 12) - 1;
function refDoMesIdx(dataInicio, mesIdx) {
  const d = new Date(dataInicio);
  const t = new Date(d.getFullYear(), d.getMonth() + mesIdx, 1);
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}`;
}
function aporteAtMonth(plan, mesIdx) {
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
function eventoAtMonth(plan, mesIdx) {
  const evs = plan.eventos;
  if (!evs || evs.length === 0) return 0;
  const ref = refDoMesIdx(plan.dataInicio, mesIdx);
  let total = 0;
  for (const e of evs) {
    if (e.ref === ref) total += Number(e.valor) || 0;
  }
  return total;
}
function idadeAtual(plan) {
  const [y, m] = plan.dataNascimento.split("-").map(Number);
  const now = /* @__PURE__ */ new Date();
  const months = (now.getFullYear() - y) * 12 + (now.getMonth() + 1 - m);
  return months / 12;
}
const prazoMeses = (plan) => {
  const m = mesesAteMeta(plan, plan.taxaAnual);
  return m === null ? 12 * 80 : Math.max(1, m);
};
function chegadaPrevista(plan) {
  return chegadaPrevistaDe(plan, plan.patrimonioInicial);
}
function chegadaPrevistaDe(plan, patrimonioAtual) {
  const meses = mesesAteMetaDe(plan, plan.taxaAnual, patrimonioAtual);
  if (meses === null) return null;
  const now = /* @__PURE__ */ new Date();
  const target = new Date(now.getFullYear(), now.getMonth() + meses, 1);
  const ref = `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, "0")}`;
  const [by, bm] = plan.dataNascimento.split("-").map(Number);
  const idadeMeses = (target.getFullYear() - by) * 12 + (target.getMonth() + 1 - bm);
  return { ref, idade: idadeMeses / 12, meses };
}
function chegadaPrevistaAlvo(plan, alvo, patrimonioAtual) {
  const inicial = patrimonioAtual ?? plan.patrimonioInicial;
  if (inicial >= alvo) {
    const now2 = /* @__PURE__ */ new Date();
    const ref2 = `${now2.getFullYear()}-${String(now2.getMonth() + 1).padStart(2, "0")}`;
    const [by2, bm2] = plan.dataNascimento.split("-").map(Number);
    const idadeMeses2 = (now2.getFullYear() - by2) * 12 + (now2.getMonth() + 1 - bm2);
    return { ref: ref2, idade: idadeMeses2 / 12, meses: 0, jaAtingido: true };
  }
  const i = taxaMensal(plan.taxaAnual);
  let s = inicial;
  let mesesAchados = null;
  for (let m = 1; m <= 12 * 80; m++) {
    s = s * (1 + i) + aporteAtMonth(plan, m) + eventoAtMonth(plan, m);
    if (s < 0) s = 0;
    if (s >= alvo) {
      mesesAchados = m;
      break;
    }
  }
  if (mesesAchados === null) return null;
  const now = /* @__PURE__ */ new Date();
  const target = new Date(now.getFullYear(), now.getMonth() + mesesAchados, 1);
  const ref = `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, "0")}`;
  const [by, bm] = plan.dataNascimento.split("-").map(Number);
  const idadeMeses = (target.getFullYear() - by) * 12 + (target.getMonth() + 1 - bm);
  return { ref, idade: idadeMeses / 12, meses: mesesAchados, jaAtingido: false };
}
function mesesJaPercorridos(plan) {
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
function linhaIdeal(plan, meses) {
  const i = taxaMensal(plan.taxaAnual);
  const out = [plan.patrimonioInicial];
  let s = plan.patrimonioInicial;
  for (let m = 1; m <= meses; m++) {
    s = s * (1 + i) + aporteAtMonth(plan, m) + eventoAtMonth(plan, m);
    if (s < 0) s = 0;
    out.push(s);
  }
  return out;
}
function mesesAteMeta(plan, taxaAnual, aporteMensal) {
  return mesesAteMetaDe(plan, taxaAnual, plan.patrimonioInicial);
}
function mesesAteMetaDe(plan, taxaAnual, patrimonioAtual, aporteMensal) {
  const i = Math.pow(1 + taxaAnual, 1 / 12) - 1;
  let s = patrimonioAtual;
  const meta = metaPatrimonio(plan);
  if (s >= meta) return 0;
  for (let m = 1; m <= 12 * 80; m++) {
    const ap = aporteAtMonth(plan, m);
    const ev = eventoAtMonth(plan, m);
    s = s * (1 + i) + ap + ev;
    if (s < 0) s = 0;
    if (s >= meta) return m;
  }
  return null;
}
function classificarRitmo(real, ideal) {
  if (ideal <= 0) return "on";
  const r = real / ideal;
  if (r > 1.03) return "ahead";
  if (r < 0.97) return "behind";
  return "on";
}
function derivarEntries(plan, entries) {
  const i = taxaMensal(plan.taxaAnual);
  const idealLinha = [plan.patrimonioInicial];
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
      dentroPlano: true
    };
  });
}
function proximoRefMes(entries) {
  if (entries.length === 0) {
    const d2 = /* @__PURE__ */ new Date();
    return `${d2.getFullYear()}-${String(d2.getMonth() + 1).padStart(2, "0")}`;
  }
  const last = entries[entries.length - 1].ref;
  const [y, m] = last.split("-").map(Number);
  const d = new Date(y, m - 1 + 1, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function formatRef(ref) {
  const [y, m] = ref.split("-").map(Number);
  const meses = [
    "jan",
    "fev",
    "mar",
    "abr",
    "mai",
    "jun",
    "jul",
    "ago",
    "set",
    "out",
    "nov",
    "dez"
  ];
  return `${meses[m - 1]}/${y}`;
}
const fmtBRL = (v) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(v);
const fmtBRLFull = (v) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
const fmtPct = (v, digits = 1) => `${(v * 100).toFixed(digits)}%`;
const fmtKm = (v) => `${v.toFixed(1)} km`;
export {
  mesesJaPercorridos as a,
  fmtPct as b,
  formatRef as c,
  derivarEntries as d,
  fmtKm as e,
  fmtBRL as f,
  metaPatrimonio as g,
  aporteAtMonth as h,
  idadeAtual as i,
  eventoAtMonth as j,
  chegadaPrevista as k,
  fmtBRLFull as l,
  mesesAteMeta as m,
  prazoMeses as n,
  linhaIdeal as o,
  proximoRefMes as p,
  classificarRitmo as q,
  chegadaPrevistaDe as r,
  chegadaPrevistaAlvo as s,
  taxaMensal as t
};
