import { i as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/@hookform/resolvers+[...].mjs";
import { f as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { c as Trash2, f as Save, o as TriangleAlert, r as Users } from "../_libs/lucide-react.mjs";
import { n as cn, r as useMaratona } from "./router-DuEozytO.mjs";
import { _ as metaPatrimonio, c as fmtBRL, p as idadeAtual } from "./math-DPowjGZA.mjs";
import { n as Input, t as Button } from "./input-wdZzgl11.mjs";
import { t as CurrencyInput } from "./CurrencyInput-rfsvKRyA.mjs";
import { a as CartesianGrid, c as ResponsiveContainer, i as Line, l as Tooltip, n as YAxis, o as ReferenceLine, r as XAxis, s as Brush, t as LineChart } from "../_libs/recharts+[...].mjs";
import { n as Thumb, t as Root } from "../_libs/@radix-ui/react-switch+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cenarios-C1Jjlb_9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Switch = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	className: cn("peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input", className),
	...props,
	ref,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Thumb, { className: cn("pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0") })
}));
Switch.displayName = Root.displayName;
/** Mesmas referências usadas na onboarding (TaxaRetornoSelector). */
var TAXA_OPCOES = [
	{
		id: "poupanca",
		label: "Poupança",
		taxa: .06,
		desc: "rendimento histórico"
	},
	{
		id: "conservador",
		label: "Conservador",
		taxa: .09,
		desc: "próximo ao CDI"
	},
	{
		id: "cdi",
		label: "CDI",
		taxa: .1,
		desc: "média ~10% a.a."
	},
	{
		id: "moderado",
		label: "Moderado",
		taxa: .11,
		desc: "RF + RV"
	},
	{
		id: "ibov",
		label: "IBOVESPA",
		taxa: .12,
		desc: "média ~12% a.a."
	},
	{
		id: "agressivo",
		label: "Agressivo",
		taxa: .13,
		desc: "próximo ao IBOV"
	}
];
var APORTE_MULTIPLIERS = [
	{
		id: "metade",
		label: "0,5×",
		mult: .5
	},
	{
		id: "padrao",
		label: "1× (plano)",
		mult: 1
	},
	{
		id: "mais25",
		label: "1,25×",
		mult: 1.25
	},
	{
		id: "mais50",
		label: "1,5×",
		mult: 1.5
	},
	{
		id: "dobro",
		label: "2×",
		mult: 2
	}
];
var SAVED_KEY = "maratona/cenarios-salvos/v1";
function loadSaved() {
	if (typeof window === "undefined") return [];
	try {
		const raw = localStorage.getItem(SAVED_KEY);
		if (!raw) return [];
		const arr = JSON.parse(raw);
		return Array.isArray(arr) ? arr : [];
	} catch {
		return [];
	}
}
function persistSaved(list) {
	try {
		localStorage.setItem(SAVED_KEY, JSON.stringify(list));
	} catch {}
}
function Cenarios() {
	const { ready, hasPlan, data } = useMaratona();
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		if (ready && !hasPlan) navigate({ to: "/onboarding" });
	}, [
		ready,
		hasPlan,
		navigate
	]);
	const plan = data?.plan;
	const patrimAtual = data?.entries[data.entries.length - 1]?.patrimonio ?? plan?.patrimonioInicial ?? 0;
	const [taxa, setTaxa] = (0, import_react.useState)(plan?.taxaAnual ?? .1);
	const [aporte, setAporte] = (0, import_react.useState)(plan?.aporteMensal ?? 0);
	const [aporteMode, setAporteMode] = (0, import_react.useState)("preset");
	const [aportePresetId, setAportePresetId] = (0, import_react.useState)("padrao");
	const [comparePerson, setComparePerson] = (0, import_react.useState)(false);
	const [otherIdade, setOtherIdade] = (0, import_react.useState)(30);
	const [otherPatrimonio, setOtherPatrimonio] = (0, import_react.useState)(0);
	const [visible, setVisible] = (0, import_react.useState)({
		voce: true,
		impacto: true,
		outro: true
	});
	const toggleSeries = (k) => setVisible((v) => ({
		...v,
		[k]: !v[k]
	}));
	const [pauseMonths, setPauseMonths] = (0, import_react.useState)(0);
	const [withdrawNow, setWithdrawNow] = (0, import_react.useState)(0);
	const [saved, setSaved] = (0, import_react.useState)([]);
	const [newName, setNewName] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		setSaved(loadSaved());
	}, []);
	(0, import_react.useEffect)(() => {
		if (plan) {
			setTaxa((t) => t === .1 && plan.taxaAnual !== .1 ? plan.taxaAnual : t);
			setAporte((a) => a === 0 ? plan.aporteMensal : a);
			setOtherIdade((v) => v === 30 ? Math.round(idadeAtual(plan)) : v);
			setOtherPatrimonio((v) => v === 0 ? patrimAtual : v);
		}
	}, [
		plan?.taxaAnual,
		plan?.aporteMensal,
		patrimAtual
	]);
	const view = (0, import_react.useMemo)(() => {
		if (!plan) return null;
		const meta = metaPatrimonio(plan);
		const idadeNow = idadeAtual(plan);
		const i = Math.pow(1 + taxa, 1 / 12) - 1;
		function simular(idadeStart, patrimInicial, opts = {}) {
			const mesesAte80 = Math.max(0, Math.round((80 - idadeStart) * 12));
			const valores = new Array(mesesAte80 + 1);
			const startVal = Math.max(0, patrimInicial - (opts.withdrawNow ?? 0));
			valores[0] = startVal;
			let s = startVal;
			const pause = Math.max(0, opts.pauseMonths ?? 0);
			let mesesMeta = patrimInicial >= meta ? 0 : null;
			for (let m = 1; m <= mesesAte80; m++) {
				const ap = m <= pause ? 0 : aporte;
				s = s * (1 + i) + ap;
				valores[m] = s;
				if (mesesMeta === null && s >= meta) mesesMeta = m;
			}
			return {
				idadeStart,
				valores,
				idadeMeta: mesesMeta !== null ? idadeStart + mesesMeta / 12 : null
			};
		}
		const hasImpact = pauseMonths > 0 || withdrawNow > 0;
		const usr = simular(idadeNow, patrimAtual);
		const usrImpact = hasImpact ? simular(idadeNow, patrimAtual, {
			pauseMonths,
			withdrawNow
		}) : null;
		const oth = comparePerson ? simular(otherIdade, otherPatrimonio) : null;
		const idadeMin = Math.min(idadeNow, comparePerson ? otherIdade : idadeNow);
		const idadeMax = 80;
		function valorEm(curva, idade) {
			if (idade < curva.idadeStart - 1e-9) return void 0;
			const m = Math.round((idade - curva.idadeStart) * 12);
			if (m < 0 || m >= curva.valores.length) return void 0;
			return Math.round(curva.valores[m]);
		}
		const data_chart = [];
		const startGrid = Math.floor(idadeMin * 4) / 4;
		for (let idade = startGrid; idade <= 80.000000001; idade += .25) {
			const idadeR = Math.round(idade * 100) / 100;
			data_chart.push({
				idade: idadeR,
				voce: valorEm(usr, idadeR),
				impacto: usrImpact ? valorEm(usrImpact, idadeR) : void 0,
				outro: oth ? valorEm(oth, idadeR) : void 0
			});
		}
		return {
			meta,
			idadeNow,
			data_chart,
			hasImpact,
			idadeMetaUser: usr.idadeMeta,
			idadeMetaImpact: usrImpact?.idadeMeta ?? null,
			idadeMetaOther: oth?.idadeMeta ?? null,
			idadeMin,
			idadeMax
		};
	}, [
		plan,
		patrimAtual,
		taxa,
		aporte,
		comparePerson,
		otherIdade,
		otherPatrimonio,
		pauseMonths,
		withdrawNow
	]);
	if (!ready || !plan || !view) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "py-20 text-center text-muted-foreground",
		children: "Carregando…"
	});
	const { meta, data_chart, idadeNow, idadeMetaUser, idadeMetaImpact, idadeMetaOther, hasImpact, idadeMin, idadeMax } = view;
	function setAportePreset(p) {
		setAporteMode("preset");
		setAportePresetId(p.id);
		setAporte(Math.round(plan.aporteMensal * p.mult));
	}
	function applySnapshot(s) {
		setTaxa(s.taxa);
		setAporte(s.aporte);
		setAporteMode("custom");
		setComparePerson(s.comparePerson);
		setOtherIdade(s.otherIdade);
		setOtherPatrimonio(s.otherPatrimonio);
		setPauseMonths(s.pauseMonths ?? 0);
		setWithdrawNow(s.withdrawNow ?? 0);
	}
	function saveScenario() {
		const name = newName.trim();
		if (!name) return;
		const snap = {
			id: Math.random().toString(36).slice(2, 9),
			name,
			taxa,
			aporte,
			comparePerson,
			otherIdade,
			otherPatrimonio,
			pauseMonths,
			withdrawNow
		};
		const next = [...saved.filter((s) => s.name !== name), snap];
		setSaved(next);
		persistSaved(next);
		setNewName("");
	}
	function deleteScenario(id) {
		const next = saved.filter((s) => s.id !== id);
		setSaved(next);
		persistSaved(next);
	}
	const taxaAtivaId = TAXA_OPCOES.find((o) => Math.abs(o.taxa - taxa) < 5e-4)?.id;
	const SERIES_META = {
		voce: {
			label: "Você",
			color: "var(--primary)"
		},
		impacto: {
			label: "Com pausa/saque",
			color: "var(--pace-behind, var(--accent))"
		},
		outro: {
			label: "Outro corredor",
			color: "var(--pace-behind, var(--accent))"
		}
	};
	const metaValor = view.meta;
	function ChartTooltip({ active, payload, label }) {
		if (!active || !payload?.length) return null;
		const ordered = [
			"voce",
			"impacto",
			"outro"
		];
		const byKey = /* @__PURE__ */ new Map();
		payload.forEach((p) => {
			if (typeof p.value === "number") byKey.set(p.dataKey, p.value);
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-lg border border-border/60 bg-popover/95 backdrop-blur px-3 py-2 shadow-lg text-xs",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "font-semibold tabular-nums mb-1.5",
					children: [label.toFixed(1), " anos"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-1",
					children: ordered.map((k) => {
						if (!visible[k]) return null;
						const v = byKey.get(k);
						if (v === void 0) return null;
						const meta = SERIES_META[k];
						const pct = Math.min(999, Math.round(v / metaValor * 100));
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "inline-block h-2 w-2 rounded-full shrink-0",
									style: { background: meta.color }
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground w-24",
									children: meta.label
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono tabular-nums font-semibold ml-auto",
									children: fmtBRL(v)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted-foreground tabular-nums w-10 text-right",
									children: [pct, "%"]
								})
							]
						}, k);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-1.5 pt-1.5 border-t border-border/40 text-[10px] text-muted-foreground",
					children: ["Meta: ", fmtBRL(metaValor)]
				})
			]
		});
	}
	const legendItems = [
		{
			key: "voce",
			label: "Você",
			color: "var(--primary)",
			show: true
		},
		{
			key: "impacto",
			label: "Com pausa/saque",
			color: "var(--pace-behind, var(--accent))",
			show: hasImpact
		},
		{
			key: "outro",
			label: "Outro corredor",
			color: "var(--pace-behind, var(--accent))",
			show: comparePerson
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 animate-fade-in",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-2xl font-bold tracking-tight",
				children: "Simule seus cenários"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground text-sm mt-1",
				children: "Veja onde você está na curva de quem começou do zero com esses parâmetros."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: cn("grid gap-3", comparePerson || hasImpact ? "grid-cols-2" : "grid-cols-1"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border-2 border-primary/40 bg-primary/5 p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] uppercase tracking-wider text-primary font-semibold",
								children: "Você"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-lg font-bold tabular-nums mt-1 text-primary",
								children: idadeMetaUser === null ? "—" : `${idadeMetaUser.toFixed(1)} anos`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[10px] text-muted-foreground mt-0.5 leading-snug",
								children: [
									"Bate a meta",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									"Hoje ",
									idadeNow.toFixed(0),
									"a • ",
									fmtBRL(patrimAtual)
								]
							})
						]
					}),
					hasImpact && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-pace-behind/40 bg-pace-behind/5 p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] uppercase tracking-wider text-pace-behind font-semibold",
								children: "Com pausa/saque"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-lg font-bold tabular-nums mt-1 text-pace-behind",
								children: idadeMetaImpact === null ? "—" : `${idadeMetaImpact.toFixed(1)} anos`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[10px] text-muted-foreground mt-0.5 leading-snug",
								children: [
									idadeMetaUser !== null && idadeMetaImpact !== null ? `Atrasa ${(idadeMetaImpact - idadeMetaUser).toFixed(1)} ano${idadeMetaImpact - idadeMetaUser >= 1 ? "s" : ""}` : "Custo do desvio",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									pauseMonths > 0 && (pauseMonths >= 9999 ? "Pausa permanente" : `Pausa ${pauseMonths}m`),
									pauseMonths > 0 && withdrawNow > 0 && " • ",
									withdrawNow > 0 && `Saque ${fmtBRL(withdrawNow)}`
								]
							})
						]
					}),
					comparePerson && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border/60 bg-card p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] uppercase tracking-wider text-muted-foreground",
								children: "Outro corredor"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-lg font-bold tabular-nums mt-1",
								children: idadeMetaOther === null ? "—" : `${idadeMetaOther.toFixed(1)} anos`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[10px] text-muted-foreground mt-0.5 leading-snug",
								children: [
									"Bate a meta",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									"Hoje ",
									otherIdade,
									"a • ",
									fmtBRL(otherPatrimonio)
								]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-2xl border border-border/60 bg-card p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between mb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
							children: "Trajetórias"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] text-muted-foreground",
							children: "Arraste a faixa abaixo para focar num intervalo"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-1.5 mb-2",
						children: legendItems.filter((l) => l.show).map((l) => {
							const on = visible[l.key];
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => toggleSeries(l.key),
								className: cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors", on ? "border-border/60 bg-secondary/40" : "border-border/40 bg-transparent text-muted-foreground/60 line-through"),
								"aria-pressed": on,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "inline-block h-2 w-2 rounded-full shrink-0",
									style: { background: on ? l.color : "var(--muted-foreground)" }
								}), l.label]
							}, l.key);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-80",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
								data: data_chart,
								margin: {
									top: 8,
									right: 12,
									left: 0,
									bottom: 0
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										stroke: "var(--border)",
										strokeDasharray: "3 3"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "idade",
										type: "number",
										domain: [Math.floor(idadeMin), Math.ceil(idadeMax)],
										tick: {
											fontSize: 10,
											fill: "var(--muted-foreground)"
										},
										tickFormatter: (v) => `${Math.round(v)}a`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										tick: {
											fontSize: 10,
											fill: "var(--muted-foreground)"
										},
										tickFormatter: (v) => fmtBRL(v),
										width: 70
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltip, {}),
										cursor: {
											stroke: "var(--primary)",
											strokeWidth: 1,
											strokeDasharray: "3 3"
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferenceLine, {
										y: meta,
										stroke: "var(--primary)",
										strokeDasharray: "6 4",
										label: {
											value: "Meta",
											position: "right",
											fill: "var(--primary)",
											fontSize: 11
										}
									}),
									visible.voce && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
										dataKey: "voce",
										stroke: "var(--primary)",
										strokeWidth: 2.5,
										dot: false,
										name: "Você",
										connectNulls: true,
										isAnimationActive: false
									}),
									hasImpact && visible.impacto && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
										dataKey: "impacto",
										stroke: "var(--pace-behind, var(--accent))",
										strokeWidth: 2,
										strokeDasharray: "5 4",
										dot: false,
										name: "Com pausa/saque",
										connectNulls: true,
										isAnimationActive: false
									}),
									comparePerson && visible.outro && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
										dataKey: "outro",
										stroke: "var(--pace-behind, var(--accent))",
										strokeWidth: 2,
										strokeDasharray: "2 3",
										dot: false,
										name: "Outro corredor",
										connectNulls: true,
										isAnimationActive: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brush, {
										dataKey: "idade",
										height: 24,
										travellerWidth: 10,
										stroke: "var(--primary)",
										fill: "var(--secondary)",
										tickFormatter: (v) => `${Math.round(v)}a`
									})
								]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[10px] text-muted-foreground leading-relaxed mt-2",
						children: [
							"Cada curva é independente — todas usam ",
							(taxa * 100).toFixed(1),
							"% a.a. e",
							" ",
							fmtBRL(aporte),
							"/mês, mas partem de idades e patrimônios diferentes."
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-2xl border border-border/60 bg-card p-3 space-y-2.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-baseline justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
							children: "Aporte mensal"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-base text-primary font-bold tabular-nums",
							children: fmtBRL(aporte)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-1.5",
						children: APORTE_MULTIPLIERS.map((p) => {
							const active = aporteMode === "preset" && aportePresetId === p.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setAportePreset(p),
								className: cn("rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors", active ? "border-primary bg-primary text-primary-foreground" : "border-border/60 bg-secondary/40 hover:border-primary/40"),
								children: p.label
							}, p.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pt-1",
						children: (() => {
							const aporteMax = Math.max(Math.round(plan.aporteMensal * 2), 5e3);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "range",
								min: 0,
								max: aporteMax,
								step: aporteMax >= 2e4 ? 500 : aporteMax >= 5e3 ? 100 : 50,
								value: Math.min(aporte, aporteMax),
								onChange: (e) => {
									setAporteMode("custom");
									setAporte(Number(e.target.value));
								},
								className: "w-full accent-primary"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between text-[9px] text-muted-foreground font-mono mt-0.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: fmtBRL(0) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: fmtBRL(Math.round(aporteMax / 2)) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: fmtBRL(aporteMax) })
								]
							})] });
						})()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[10px] text-muted-foreground",
						children: ["Plano: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-semibold",
							children: [fmtBRL(plan.aporteMensal), "/mês"]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-2xl border border-border/60 bg-card p-3 space-y-2.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-baseline justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
							children: "Rentabilidade"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono text-base text-primary font-bold tabular-nums",
							children: [
								(taxa * 100).toFixed(1),
								"%",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-normal text-muted-foreground ml-0.5",
									children: "a.a."
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-1.5",
						children: TAXA_OPCOES.map((o) => {
							const active = taxaAtivaId === o.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setTaxa(o.taxa),
								title: o.desc,
								className: cn("rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors", active ? "border-primary bg-primary text-primary-foreground" : "border-border/60 bg-secondary/40 hover:border-primary/40"),
								children: [o.label, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: cn("ml-1 font-mono", active ? "opacity-90" : "text-muted-foreground"),
									children: [(o.taxa * 100).toFixed(0), "%"]
								})]
							}, o.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "range",
							min: 0,
							max: 20,
							step: .5,
							value: taxa * 100,
							onChange: (e) => setTaxa(Number(e.target.value) / 100),
							className: "w-full accent-primary"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between text-[9px] text-muted-foreground font-mono mt-0.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "0%" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "10%" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "20%" })
							]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-2xl border border-border/60 bg-card p-3 space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
						children: "Comparações"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border/40 bg-secondary/20 p-2.5 space-y-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] font-semibold",
							children: "Outro corredor"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: comparePerson,
							onCheckedChange: setComparePerson
						})]
					}), comparePerson && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-[10px] uppercase tracking-wider text-muted-foreground",
								children: "Idade hoje"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								inputMode: "numeric",
								min: 0,
								max: 100,
								value: otherIdade,
								onChange: (e) => setOtherIdade(Math.max(0, Math.min(100, Number(e.target.value) || 0))),
								className: "h-9"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-[10px] uppercase tracking-wider text-muted-foreground",
								children: "Patrimônio atual"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CurrencyInput, {
								value: otherPatrimonio,
								onChange: setOtherPatrimonio,
								className: "h-9"
							})]
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-2xl border border-border/60 bg-card p-3 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 text-pace-behind" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
							children: "E se eu atrasar ou parar?"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[11px] text-muted-foreground -mt-1",
						children: [
							"Aplica-se à ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold",
								children: "sua"
							}),
							" curva. Útil para ver o custo real de uma pausa ou um saque."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border/40 bg-secondary/20 p-2.5 space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-baseline justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] font-semibold",
									children: "Pausar aportes por"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-sm tabular-nums",
									children: pauseMonths >= 9999 ? "para sempre" : `${pauseMonths} ${pauseMonths === 1 ? "mês" : "meses"}`
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "range",
								min: 0,
								max: 60,
								step: 1,
								value: Math.min(pauseMonths, 60),
								onChange: (e) => setPauseMonths(Number(e.target.value)),
								className: "w-full accent-primary disabled:opacity-50",
								disabled: pauseMonths >= 9999
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-1.5",
								children: [[
									0,
									3,
									6,
									12,
									24
								].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setPauseMonths(n),
									className: cn("rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors", pauseMonths === n ? "border-primary bg-primary text-primary-foreground" : "border-border/60 bg-secondary/40 hover:border-primary/40"),
									children: n === 0 ? "sem pausa" : `${n}m`
								}, n)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setPauseMonths(9999),
									className: cn("rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors", pauseMonths >= 9999 ? "border-primary bg-primary text-primary-foreground" : "border-border/60 bg-secondary/40 hover:border-primary/40"),
									children: "permanente"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border/40 bg-secondary/20 p-2.5 space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] font-semibold",
								children: "Sacar agora"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CurrencyInput, {
								value: withdrawNow,
								onChange: setWithdrawNow,
								className: "h-9 w-36"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1.5",
							children: [
								0,
								1e4,
								5e4,
								1e5
							].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setWithdrawNow(n),
								className: cn("rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors", withdrawNow === n ? "border-primary bg-primary text-primary-foreground" : "border-border/60 bg-secondary/40 hover:border-primary/40"),
								children: n === 0 ? "nenhum" : fmtBRL(n)
							}, n))
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-2xl border border-border/60 bg-card p-3 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
							children: "Cenários salvos"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-muted-foreground -mt-1",
						children: "Salve combinações (\"Plano A: agressivo\", \"Plano B: realista\") para alternar com 1 toque."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Nome do cenário",
							value: newName,
							onChange: (e) => setNewName(e.target.value),
							className: "h-9"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							onClick: saveScenario,
							disabled: !newName.trim(),
							children: "Salvar atual"
						})]
					}),
					saved.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-1.5",
						children: saved.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center justify-between gap-2 rounded-lg border border-border/40 bg-secondary/20 px-2.5 py-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => applySnapshot(s),
								className: "flex-1 min-w-0 text-left",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-medium truncate",
									children: s.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[10px] text-muted-foreground tabular-nums",
									children: [
										(s.taxa * 100).toFixed(1),
										"% • ",
										fmtBRL(s.aporte),
										"/mês",
										s.pauseMonths > 0 ? s.pauseMonths >= 9999 ? " • pausa permanente" : ` • pausa ${s.pauseMonths}m` : "",
										s.withdrawNow > 0 ? ` • saque ${fmtBRL(s.withdrawNow)}` : ""
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => deleteScenario(s.id),
								className: "p-1.5 rounded-md text-muted-foreground hover:text-pace-behind hover:bg-secondary/40",
								"aria-label": `Excluir ${s.name}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
							})]
						}, s.id))
					})
				]
			})
		]
	});
}
//#endregion
export { Cenarios as component };
