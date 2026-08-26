//#region node_modules/.nitro/vite/services/ssr/assets/math-DPowjGZA.js
/** Patrimônio necessário para gerar a renda passiva desejada (regra da taxa de retirada). */
function metaPatrimonio(plan) {
	const taxa = plan.taxaRetirada > 0 ? plan.taxaRetirada : .04;
	return plan.rendaMensalDesejada * 12 / taxa;
}
var taxaMensal = (taxaAnual) => Math.pow(1 + taxaAnual, 1 / 12) - 1;
/** Converte um índice de mês (1 = primeiro mês após dataInicio) em ref "YYYY-MM". */
function refDoMesIdx(dataInicio, mesIdx) {
	const d = new Date(dataInicio);
	const t = new Date(d.getFullYear(), d.getMonth() + mesIdx, 1);
	return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}`;
}
/** Aporte mensal aplicável no mês `mesIdx` considerando o cronograma. */
function aporteAtMonth(plan, mesIdx) {
	const sched = plan.aporteSchedule;
	if (!sched || sched.length === 0) return plan.aporteMensal;
	const ref = refDoMesIdx(plan.dataInicio, mesIdx);
	const sorted = [...sched].sort((a, b) => a.fromRef.localeCompare(b.fromRef));
	let valor = plan.aporteMensal;
	for (const s of sorted) if (s.fromRef <= ref) valor = s.valor;
	else break;
	return valor;
}
/** Soma dos eventos pontuais ocorrendo no mês `mesIdx`. */
function eventoAtMonth(plan, mesIdx) {
	const evs = plan.eventos;
	if (!evs || evs.length === 0) return 0;
	const ref = refDoMesIdx(plan.dataInicio, mesIdx);
	let total = 0;
	for (const e of evs) if (e.ref === ref) total += Number(e.valor) || 0;
	return total;
}
/** Idade atual em anos (com meses como fração) calculada a partir de dataNascimento. */
function idadeAtual(plan) {
	const [y, m] = plan.dataNascimento.split("-").map(Number);
	const now = /* @__PURE__ */ new Date();
	return ((now.getFullYear() - y) * 12 + (now.getMonth() + 1 - m)) / 12;
}
/**
* Meses até atingir a meta no plano (projeção com aportes + taxa esperada).
* Esse é o prazo da maratona — definido pelo desempenho projetado, não por idade-meta.
*/
var prazoMeses = (plan) => {
	const m = mesesAteMeta(plan, plan.taxaAnual);
	return m === null ? 960 : Math.max(1, m);
};
/** Data prevista de chegada à meta (mês YYYY-MM) e idade na chegada. */
function chegadaPrevista(plan) {
	return chegadaPrevistaDe(plan, plan.patrimonioInicial);
}
/**
* Como chegadaPrevista, mas partindo de um patrimônio arbitrário (ex.: valor
* mais recente do histórico) em vez do patrimonioInicial do plano.
*/
function chegadaPrevistaDe(plan, patrimonioAtual) {
	const meses = mesesAteMetaDe(plan, plan.taxaAnual, patrimonioAtual);
	if (meses === null) return null;
	const now = /* @__PURE__ */ new Date();
	const target = new Date(now.getFullYear(), now.getMonth() + meses, 1);
	const ref = `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, "0")}`;
	const [by, bm] = plan.dataNascimento.split("-").map(Number);
	return {
		ref,
		idade: ((target.getFullYear() - by) * 12 + (target.getMonth() + 1 - bm)) / 12,
		meses
	};
}
/**
* Data/idade prevista para atingir um patrimônio-alvo qualquer, a partir
* de hoje (patrimonioInicial do plano), com aportes e taxa do plano.
* Retorna null se não atingir em 80 anos.
*/
function chegadaPrevistaAlvo(plan, alvo, patrimonioAtual) {
	const inicial = patrimonioAtual ?? plan.patrimonioInicial;
	if (inicial >= alvo) {
		const now = /* @__PURE__ */ new Date();
		const ref = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
		const [by, bm] = plan.dataNascimento.split("-").map(Number);
		return {
			ref,
			idade: ((now.getFullYear() - by) * 12 + (now.getMonth() + 1 - bm)) / 12,
			meses: 0,
			jaAtingido: true
		};
	}
	const i = taxaMensal(plan.taxaAnual);
	let s = inicial;
	let mesesAchados = null;
	for (let m = 1; m <= 960; m++) {
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
	return {
		ref,
		idade: ((target.getFullYear() - by) * 12 + (target.getMonth() + 1 - bm)) / 12,
		meses: mesesAchados,
		jaAtingido: false
	};
}
/**
* Quantos meses, partindo de 0 com aporte+juros do plano, seriam necessários
* para chegar ao patrimônio atual. Representa o trecho da maratona já
* percorrido antes do app começar.
*/
function mesesJaPercorridos(plan) {
	const alvo = plan.patrimonioInicial;
	if (alvo <= 0) return 0;
	const i = taxaMensal(plan.taxaAnual);
	if (plan.aporteMensal <= 0 && i <= 0) return 0;
	let s = 0;
	for (let m = 1; m <= 960; m++) {
		s = s * (1 + i) + plan.aporteMensal;
		if (s >= alvo) return m;
	}
	return 960;
}
/**
* Linha ideal de patrimônio para os próximos `meses` registros, partindo
* de `patrimonioInicial` com o aporte e taxa do plano. Índice 0 = início,
* índice n = após n meses.
*/
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
/** Resolve quantos meses até cruzar a meta dada uma taxa anual. Retorna null se não atinge em 80 anos. */
function mesesAteMeta(plan, taxaAnual, aporteMensal) {
	return mesesAteMetaDe(plan, taxaAnual, plan.patrimonioInicial, aporteMensal);
}
/** Como mesesAteMeta, mas partindo de um patrimônio arbitrário. */
function mesesAteMetaDe(plan, taxaAnual, patrimonioAtual, aporteMensal) {
	const i = Math.pow(1 + taxaAnual, 1 / 12) - 1;
	let s = patrimonioAtual;
	const meta = metaPatrimonio(plan);
	if (s >= meta) return 0;
	for (let m = 1; m <= 960; m++) {
		const ap = aporteMensal !== void 0 ? aporteMensal : aporteAtMonth(plan, m);
		const ev = aporteMensal !== void 0 ? 0 : eventoAtMonth(plan, m);
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
	if (r < .97) return "behind";
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
/** Próximo "YYYY-MM" a partir do último registro (ou do mês atual se vazio). */
function proximoRefMes(entries) {
	if (entries.length === 0) {
		const d = /* @__PURE__ */ new Date();
		return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
	}
	const [y, m] = entries[entries.length - 1].ref.split("-").map(Number);
	const d = new Date(y, m - 1 + 1, 1);
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function formatRef(ref) {
	const [y, m] = ref.split("-").map(Number);
	return `${[
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
	][m - 1]}/${y}`;
}
var fmtBRL = (v) => new Intl.NumberFormat("pt-BR", {
	style: "currency",
	currency: "BRL",
	maximumFractionDigits: 0
}).format(v);
var fmtBRLFull = (v) => new Intl.NumberFormat("pt-BR", {
	style: "currency",
	currency: "BRL"
}).format(v);
var fmtPct = (v, digits = 1) => `${(v * 100).toFixed(digits)}%`;
var fmtKm = (v) => `${v.toFixed(1)} km`;
//#endregion
export { metaPatrimonio as _, classificarRitmo as a, taxaMensal as b, fmtBRL as c, fmtPct as d, formatRef as f, mesesJaPercorridos as g, mesesAteMeta as h, chegadaPrevistaDe as i, fmtBRLFull as l, linhaIdeal as m, chegadaPrevista as n, derivarEntries as o, idadeAtual as p, chegadaPrevistaAlvo as r, eventoAtMonth as s, aporteAtMonth as t, fmtKm as u, prazoMeses as v, proximoRefMes as y };
