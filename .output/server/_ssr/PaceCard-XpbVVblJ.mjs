import { E as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { l as Timer, s as TrendingUp } from "../_libs/lucide-react.mjs";
import { s as MARATHON_KM } from "./router-DuEozytO.mjs";
import { _ as metaPatrimonio, b as taxaMensal, s as eventoAtMonth, t as aporteAtMonth } from "./math-DPowjGZA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PaceCard-XpbVVblJ.js
var import_jsx_runtime = require_jsx_runtime();
/**
* Trajetória simulada 0 → meta com aporte/taxa do plano (sem cronograma/eventos).
* Coincide com a régua usada para calcular km na home, então o pace conversa com a pista.
*/
function trajetoriaBase(plan) {
	const i = taxaMensal(plan.taxaAnual);
	const meta = metaPatrimonio(plan);
	const traj = [0];
	if (plan.aporteMensal <= 0 && i <= 0) return {
		traj,
		totalAbs: 960
	};
	let s = 0;
	for (let m = 1; m <= 960; m++) {
		s = s * (1 + i) + plan.aporteMensal;
		traj.push(s);
		if (s >= meta) return {
			traj,
			totalAbs: m
		};
	}
	return {
		traj,
		totalAbs: 960
	};
}
/** Posição (em meses, fracionária) na trajetória base correspondente a um patrimônio. */
function mesParaPatrim(traj, patrim) {
	if (patrim <= 0) return 0;
	for (let m = 1; m < traj.length; m++) if (traj[m] >= patrim) {
		const prev = traj[m - 1];
		const cur = traj[m];
		if (cur === prev) return m;
		return m - 1 + (patrim - prev) / (cur - prev);
	}
	return traj.length - 1;
}
function kmDeMes(mesAbs, totalAbs) {
	return Math.min(MARATHON_KM, Math.max(0, mesAbs / Math.max(1, totalAbs) * MARATHON_KM));
}
/** Patrimônio correspondente a um km na trajetória base. */
function patrimParaKm(plan, km) {
	const { traj, totalAbs } = trajetoriaBase(plan);
	const mes = km / MARATHON_KM * totalAbs;
	const lo = Math.max(0, Math.floor(mes));
	const hi = Math.min(traj.length - 1, lo + 1);
	const frac = mes - lo;
	return traj[lo] + (traj[hi] - traj[lo]) * frac;
}
/**
* Calcula pace recente (últimos 3 meses) e previsão do próximo km com base no plano.
* O ritmo recente é robusto a meses sem variação — usa km ganhos vs. meses corridos.
*/
function calcularPace(plan, derived) {
	const { traj, totalAbs } = trajetoriaBase(plan);
	const patrimAtual = derived[derived.length - 1]?.patrimonio ?? plan.patrimonioInicial;
	const kmAtual = kmDeMes(mesParaPatrim(traj, patrimAtual), totalAbs);
	const kmAtualVisivel = Math.min(MARATHON_KM, Number(kmAtual.toFixed(1)));
	const kmProx = kmAtualVisivel >= 42.195 ? MARATHON_KM : Math.min(MARATHON_KM, Math.floor(kmAtualVisivel) + 1);
	const kmUltimo = Math.max(0, kmProx - 1);
	const serieKmVisivel = [kmDeMes(mesParaPatrim(traj, plan.patrimonioInicial), totalAbs), ...derived.map((e) => kmDeMes(mesParaPatrim(traj, e.patrimonio), totalAbs))].map((km) => Math.min(MARATHON_KM, Number(km.toFixed(1))));
	const cruzamento = (alvo) => {
		if (alvo <= serieKmVisivel[0]) return 0;
		for (let i = 1; i < serieKmVisivel.length; i++) if (serieKmVisivel[i] >= alvo && serieKmVisivel[i - 1] < alvo) {
			const denom = serieKmVisivel[i] - serieKmVisivel[i - 1];
			const frac = denom > 0 ? (alvo - serieKmVisivel[i - 1]) / denom : 0;
			return i - 1 + frac;
		}
		return null;
	};
	const mesesNoKmHistorico = (km) => {
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
	let mesesUltimoKm = null;
	if (kmUltimo >= 1) {
		const kmTrecho = kmUltimo - 1;
		mesesUltimoKm = mesesNoKmHistorico(kmTrecho);
		const tFim = mesesUltimoKm === null ? cruzamento(kmUltimo) : null;
		const tIni = mesesUltimoKm === null ? cruzamento(kmTrecho) : null;
		if (tFim !== null && tIni !== null && tFim > tIni) mesesUltimoKm = tFim - tIni;
	}
	let mesesProxKm = null;
	if (kmProx > kmAtual && patrimAtual < metaPatrimonio(plan)) {
		const patrimAlvo = patrimParaKm(plan, kmProx);
		const i = taxaMensal(plan.taxaAnual);
		const offset = derived.length;
		let s = patrimAtual;
		for (let m = 1; m <= 960; m++) {
			s = s * (1 + i) + aporteAtMonth(plan, offset + m) + eventoAtMonth(plan, offset + m);
			if (s < 0) s = 0;
			if (s >= patrimAlvo) {
				mesesProxKm = m;
				break;
			}
		}
	}
	return {
		mesesUltimoKm,
		mesesProxKm,
		kmAtual,
		kmProx
	};
}
function fmtMeses(meses) {
	if (meses <= 0) return "—";
	if (meses < 1) {
		const dias = Math.max(1, Math.round(meses * 30));
		return `${dias} dia${dias === 1 ? "" : "s"}`;
	}
	if (meses < 1.5) return "~1 mês";
	if (meses < 12) return `${meses.toFixed(1).replace(/\.0$/, "")} meses`;
	const anos = meses / 12;
	if (anos < 1.5) return "~1 ano";
	return `${anos.toFixed(1).replace(/\.0$/, "")} anos`;
}
function PaceCard({ pace, bare }) {
	if (pace.mesesUltimoKm === null && pace.mesesProxKm === null) return null;
	const formatKmMarker = (km) => Number.isInteger(km) ? String(km) : km.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
	const kmUltimo = Math.max(0, pace.kmProx - 2);
	const kmUltimoFim = Math.max(0, pace.kmProx - 1);
	const kmProxInicio = Math.max(0, pace.kmProx - 1);
	const kmProxFim = pace.kmProx;
	const content = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[11px] text-muted-foreground leading-snug",
			children: "Quanto tempo você levou para fazer o último km e quanto deve levar para o próximo, mantendo aporte e taxa do plano."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl bg-secondary/40 p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] uppercase tracking-wider text-muted-foreground",
						children: "Último km"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 flex items-baseline gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] uppercase tracking-wider text-muted-foreground",
							children: "km"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-3xl font-bold tabular-nums leading-none",
							children: formatKmMarker(kmUltimo)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-semibold tabular-nums mt-2",
						children: pace.mesesUltimoKm !== null ? fmtMeses(pace.mesesUltimoKm) : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] text-muted-foreground mt-0.5",
						children: pace.mesesUltimoKm !== null ? `tempo no km ${formatKmMarker(kmUltimo)} antes de chegar ao ${formatKmMarker(kmUltimoFim)}` : "série insuficiente p/ medir esse km"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl bg-secondary/40 p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-3 w-3" }), " Próximo km"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 flex items-baseline gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] uppercase tracking-wider text-muted-foreground",
							children: "km"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-3xl font-bold tabular-nums leading-none text-pace-on",
							children: formatKmMarker(kmProxFim)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-semibold tabular-nums mt-2 text-pace-on",
						children: pace.mesesProxKm !== null ? `≈ ${fmtMeses(pace.mesesProxKm)}` : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-[10px] text-muted-foreground mt-0.5",
						children: [
							"previsão do km ",
							formatKmMarker(kmProxInicio),
							" ao ",
							formatKmMarker(kmProxFim),
							" · estimativa"
						]
					})
				]
			})]
		})]
	});
	if (bare) return content;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-2xl border border-border/60 bg-card p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timer, { className: "h-3.5 w-3.5" }), " Seu pace"]
		}), content]
	});
}
//#endregion
export { calcularPace as n, fmtMeses as r, PaceCard as t };
