import { i as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/@hookform/resolvers+[...].mjs";
import { f as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { D as ClipboardPaste, E as FileBraces, M as CalendarClock, T as FileSpreadsheet, c as Trash2, d as Settings, i as Upload, k as CircleCheck, m as Plus, o as TriangleAlert, p as RefreshCw, u as Sparkles } from "../_libs/lucide-react.mjs";
import { n as cn, r as useMaratona } from "./router-DuEozytO.mjs";
import { _ as metaPatrimonio, c as fmtBRL, f as formatRef, n as chegadaPrevista, p as idadeAtual } from "./math-DPowjGZA.mjs";
import { n as Input, t as Button } from "./input-wdZzgl11.mjs";
import { t as Label } from "./label-Dq8AUn-l.mjs";
import { t as Textarea } from "./textarea-B029t8j_.mjs";
import { t as CurrencyInput } from "./CurrencyInput-rfsvKRyA.mjs";
import { t as MetaExplain } from "./MetaExplain-Ba_RCvnd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/configuracoes-BQjKJnPY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MESES_PT = {
	jan: 1,
	janeiro: 1,
	fev: 2,
	fevereiro: 2,
	mar: 3,
	marco: 3,
	março: 3,
	abr: 4,
	abril: 4,
	mai: 5,
	maio: 5,
	jun: 6,
	junho: 6,
	jul: 7,
	julho: 7,
	ago: 8,
	agosto: 8,
	set: 9,
	setembro: 9,
	out: 10,
	outubro: 10,
	nov: 11,
	novembro: 11,
	dez: 12,
	dezembro: 12
};
/** Aceita "2024-03", "03/2024", "3/24", "mar/2024", "março 2024", "2024-03-15", etc. */
function parseRef(input) {
	const s = input.trim().toLowerCase();
	if (!s) return null;
	const iso = s.match(/^(\d{4})-(\d{1,2})(?:-\d{1,2})?$/);
	if (iso) {
		const y = Number(iso[1]);
		const m = Number(iso[2]);
		if (m >= 1 && m <= 12) return `${y}-${String(m).padStart(2, "0")}`;
	}
	const slash = s.match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?$/);
	if (slash) {
		if (slash[3]) {
			const m = Number(slash[2]);
			let y = Number(slash[3]);
			if (y < 100) y += 2e3;
			if (m >= 1 && m <= 12) return `${y}-${String(m).padStart(2, "0")}`;
		} else {
			const m = Number(slash[1]);
			let y = Number(slash[2]);
			if (y < 100) y += 2e3;
			if (m >= 1 && m <= 12) return `${y}-${String(m).padStart(2, "0")}`;
		}
	}
	const named = s.match(/^([a-zçãéíóú]+)[\s/\-]+(\d{2,4})$/);
	if (named) {
		const m = MESES_PT[named[1].normalize("NFD").replace(/[\u0300-\u036f]/g, "")];
		let y = Number(named[2]);
		if (y < 100) y += 2e3;
		if (m) return `${y}-${String(m).padStart(2, "0")}`;
	}
	return null;
}
/** Aceita "1.234,56" (BR), "1,234.56" (US), "1234.56", "R$ 1.234". */
function parseNumber(input) {
	const raw = input.trim().replace(/^r\$\s*/i, "").replace(/\s/g, "");
	if (!raw) return null;
	let s = raw;
	const lastComma = s.lastIndexOf(",");
	const lastDot = s.lastIndexOf(".");
	if (lastComma >= 0 && lastDot >= 0) {
		if (lastComma > lastDot) s = s.replace(/\./g, "").replace(",", ".");
		else s = s.replace(/,/g, "");
	} else if (lastComma >= 0) s = s.replace(/\./g, "").replace(",", ".");
	const n = Number(s);
	return Number.isFinite(n) ? n : null;
}
/**
* Parseia conteúdo colado de planilha (TSV/CSV/;).
* Espera 2 ou 3 colunas: mês, patrimônio, [aportes].
* Detecta e ignora cabeçalho.
*/
function parseBulkPaste(text) {
	const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
	if (lines.length === 0) return [];
	const sample = lines[0];
	const sep = sample.includes("	") ? "	" : sample.includes(";") ? ";" : ",";
	const split = (l) => l.split(sep).map((c) => c.trim());
	const first = split(lines[0]);
	const startIdx = first.length >= 2 && parseRef(first[0]) === null && parseNumber(first[1]) === null ? 1 : 0;
	const out = [];
	for (let i = startIdx; i < lines.length; i++) {
		const raw = lines[i];
		const cols = split(raw);
		const lineNum = i + 1;
		if (cols.length < 2) {
			out.push({
				ok: false,
				line: lineNum,
				error: "Esperado pelo menos 2 colunas (mês e patrimônio)",
				raw
			});
			continue;
		}
		const ref = parseRef(cols[0]);
		if (!ref) {
			out.push({
				ok: false,
				line: lineNum,
				error: `Mês inválido: "${cols[0]}"`,
				raw
			});
			continue;
		}
		const patrim = parseNumber(cols[1]);
		if (patrim === null) {
			out.push({
				ok: false,
				line: lineNum,
				error: `Patrimônio inválido: "${cols[1]}"`,
				raw
			});
			continue;
		}
		let aportes = 0;
		if (cols.length >= 3 && cols[2] !== "") {
			const a = parseNumber(cols[2]);
			if (a === null) {
				out.push({
					ok: false,
					line: lineNum,
					error: `Aporte inválido: "${cols[2]}"`,
					raw
				});
				continue;
			}
			aportes = a;
		}
		out.push({
			ok: true,
			line: lineNum,
			raw,
			entry: {
				ref,
				patrimonio: patrim,
				aportes
			}
		});
	}
	return out;
}
/**
* Cola série histórica vinda de planilha (Excel/Google Sheets/Numbers).
* Aceita 2 ou 3 colunas: mês, patrimônio, [aportes].
*/
function BulkImport() {
	const { addEntries, data } = useMaratona();
	const [text, setText] = (0, import_react.useState)("");
	const parsed = (0, import_react.useMemo)(() => text.trim() ? parseBulkPaste(text) : [], [text]);
	const valid = parsed.filter((r) => r.ok);
	const errors = parsed.filter((r) => !r.ok);
	const existing = new Set((data?.entries ?? []).map((e) => e.ref));
	const sobrescreve = valid.filter((r) => r.ok && existing.has(r.entry.ref)).length;
	const novos = valid.length - sobrescreve;
	function aplicar() {
		const entries = valid.filter((r) => r.ok).map((r) => r.entry);
		if (!entries.length) return;
		addEntries(entries);
		toast.success(`${entries.length} mês${entries.length === 1 ? "" : "es"} importado${entries.length === 1 ? "" : "s"}` + (sobrescreve > 0 ? ` (${sobrescreve} sobrescrito${sobrescreve === 1 ? "" : "s"})` : ""));
		setText("");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-2xl border border-border/60 bg-card p-5 space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardPaste, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-semibold",
					children: "Importar série histórica"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted-foreground leading-relaxed",
				children: [
					"Cola direto da sua planilha (Excel, Google Sheets, Numbers). Esperamos 2 ou 3 colunas:",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-foreground",
						children: "mês"
					}),
					",",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-foreground",
						children: "patrimônio"
					}),
					",",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-muted-foreground",
						children: "aportes (opcional)"
					}),
					". Mês aceita formatos como",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono",
						children: "2024-03"
					}),
					",",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono",
						children: "03/2024"
					}),
					" ou",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono",
						children: "mar/2024"
					}),
					"."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "text-[11px] uppercase tracking-wider text-muted-foreground",
					children: "Cole aqui"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					value: text,
					onChange: (e) => setText(e.target.value),
					placeholder: `mês\tpatrimônio\taportes\n2024-01\t125.000,00\t2.000\n2024-02\t128.500,00\t2.000\n2024-03\t130.200,00\t2.000`,
					className: "min-h-[140px] font-mono text-xs",
					spellCheck: false
				})]
			}),
			parsed.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border/60 bg-secondary/20 p-3 space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-3 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1 text-pace-ahead",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "tabular-nums",
										children: valid.length
									}),
									" ok"
								]
							}),
							novos > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted-foreground tabular-nums",
								children: [
									novos,
									" novo",
									novos === 1 ? "" : "s"
								]
							}),
							sobrescreve > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted-foreground tabular-nums",
								children: [
									sobrescreve,
									" sobrescrev",
									sobrescreve === 1 ? "e" : "em"
								]
							}),
							errors.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1 text-pace-behind",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3.5 w-3.5" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "tabular-nums",
										children: errors.length
									}),
									" com erro"
								]
							})
						]
					}),
					valid.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "max-h-40 overflow-auto rounded-md border border-border/40 bg-background/40",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-[11px] tabular-nums",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "sticky top-0 bg-secondary/60 text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-left px-2 py-1 font-medium",
										children: "Mês"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-right px-2 py-1 font-medium",
										children: "Patrimônio"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-right px-2 py-1 font-medium",
										children: "Aporte"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: valid.map((r) => r.ok && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: cn("border-t border-border/30", existing.has(r.entry.ref) && "bg-primary/5"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-2 py-1",
										children: formatRef(r.entry.ref)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-2 py-1 text-right",
										children: fmtBRL(r.entry.patrimonio)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-2 py-1 text-right text-muted-foreground",
										children: fmtBRL(r.entry.aportes)
									})
								]
							}, r.line)) })]
						})
					}),
					errors.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "space-y-1 text-[11px] text-pace-behind/90",
						children: [errors.slice(0, 5).map((r) => !r.ok && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "leading-snug",
							children: [
								"Linha ",
								r.line,
								": ",
								r.error
							]
						}, r.line)), errors.length > 5 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "text-muted-foreground",
							children: [
								"…e mais ",
								errors.length - 5,
								" linha",
								errors.length - 5 === 1 ? "" : "s",
								" com erro."
							]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: aplicar,
					disabled: valid.length === 0,
					className: "flex-1",
					children: ["Importar ", valid.length > 0 ? `${valid.length} mês${valid.length === 1 ? "" : "es"}` : ""]
				}), text && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					onClick: () => setText(""),
					children: "Limpar"
				})]
			})
		]
	});
}
function Configuracoes() {
	const { ready, hasPlan, data, importJson, reset, updatePlan } = useMaratona();
	const navigate = useNavigate();
	const fileRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (ready && !hasPlan) navigate({ to: "/onboarding" });
	}, [
		ready,
		hasPlan,
		navigate
	]);
	if (!ready || !data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "py-20 text-center text-muted-foreground",
		children: "Carregando…"
	});
	function exportJSON() {
		downloadBlob(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }), `maratona-financeira-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`);
		toast.success("Backup JSON exportado");
	}
	function exportCSV() {
		if (!data) return;
		const csv = [[
			"Mes",
			"Patrimonio",
			"Aportes"
		], ...data.entries.map((e) => [
			formatRef(e.ref),
			e.patrimonio,
			e.aportes
		])].map((r) => r.join(",")).join("\n");
		downloadBlob(new Blob([csv], { type: "text/csv" }), `maratona-financeira-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`);
		toast.success("CSV exportado");
	}
	function onImport(e) {
		const file = e.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => {
			if (importJson(String(reader.result))) toast.success("Dados importados com sucesso");
			else toast.error("Arquivo inválido");
		};
		reader.readAsText(file);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 animate-fade-in",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "text-2xl font-bold tracking-tight flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "h-5 w-5" }), " Configurações"]
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-2xl border border-border/60 bg-card p-5 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold",
						children: "Plano"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Nascimento",
								value: formatRef(data.plan.dataNascimento)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Idade atual",
								value: `${idadeAtual(data.plan).toFixed(1)} anos`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Patrimônio inicial",
								value: brl(data.plan.patrimonioInicial)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Renda mensal desejada",
								value: brl(data.plan.rendaMensalDesejada)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Taxa de retirada",
								value: `${(data.plan.taxaRetirada * 100).toFixed(1)}%`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Reajuste anual IPCA",
								value: data.plan.atualizaIpca ?? true ? data.plan.ultimoAjusteIpcaAno ? `Ativo (último: ${data.plan.ultimoAjusteIpcaAno})` : "Ativo" : "Desativado"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-lg bg-secondary/50 p-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetaExplain, {
									plan: data.plan,
									className: "w-full",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-left w-full",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] uppercase tracking-wider text-muted-foreground",
											children: "Patrimônio necessário"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-semibold tabular-nums mt-0.5",
											children: brl(metaPatrimonio(data.plan))
										})]
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Aporte mensal",
								value: brl(data.plan.aporteMensal)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Taxa anual",
								value: `${(data.plan.taxaAnual * 100).toFixed(1)}%`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Chegada provável",
								value: (() => {
									const c = chegadaPrevista(data.plan);
									return c ? `${formatRef(c.ref)} • ${c.idade.toFixed(1)} anos` : "—";
								})()
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						className: "w-full",
						onClick: () => navigate({ to: "/onboarding" }),
						children: "Editar plano"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScheduleEditor, {
				items: data.plan.aporteSchedule ?? [],
				defaultValor: data.plan.aporteMensal,
				onChange: (aporteSchedule) => updatePlan({ aporteSchedule })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventosEditor, {
				items: data.plan.eventos ?? [],
				onChange: (eventos) => updatePlan({ eventos })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-2xl border border-border/60 bg-card p-5 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold",
						children: "Backup e exportação"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "secondary",
							onClick: exportJSON,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileBraces, { className: "h-4 w-4 mr-1" }), " JSON"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "secondary",
							onClick: exportCSV,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "h-4 w-4 mr-1" }), " CSV"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: fileRef,
						type: "file",
						accept: "application/json",
						hidden: true,
						onChange: onImport
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						className: "w-full",
						onClick: () => fileRef.current?.click(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4 mr-1" }), " Importar JSON"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BulkImport, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-2xl border border-destructive/40 bg-destructive/5 p-5 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold text-destructive",
						children: "Zona de risco"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Apaga seu plano e todo o histórico. Não tem como desfazer."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "destructive",
						className: "w-full",
						onClick: () => {
							if (confirm("Tem certeza? Isso apaga tudo.")) {
								reset();
								toast.success("Tudo limpo. Boa nova largada!");
								navigate({ to: "/onboarding" });
							}
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4 mr-1" }), " Resetar tudo"]
					})
				]
			})
		]
	});
}
function Field({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg bg-secondary/50 p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[10px] uppercase tracking-wider text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "font-semibold tabular-nums mt-0.5",
			children: value
		})]
	});
}
var brl = (v) => new Intl.NumberFormat("pt-BR", {
	style: "currency",
	currency: "BRL",
	maximumFractionDigits: 0
}).format(v);
function downloadBlob(blob, filename) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}
function refToInput(ref) {
	return ref;
}
function currentRef() {
	const d = /* @__PURE__ */ new Date();
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function ScheduleEditor({ items, defaultValor, onChange }) {
	const [draftRef, setDraftRef] = (0, import_react.useState)(currentRef());
	const [draftValor, setDraftValor] = (0, import_react.useState)(defaultValor);
	const sorted = [...items].sort((a, b) => a.fromRef.localeCompare(b.fromRef));
	function add() {
		if (!/^\d{4}-\d{2}$/.test(draftRef)) {
			toast.error("Mês inválido");
			return;
		}
		onChange([...sorted.filter((s) => s.fromRef !== draftRef), {
			fromRef: draftRef,
			valor: draftValor
		}].sort((a, b) => a.fromRef.localeCompare(b.fromRef)));
		toast.success(`A partir de ${formatRef(draftRef)}: ${brl(draftValor)}/mês`);
	}
	function remove(ref) {
		onChange(sorted.filter((s) => s.fromRef !== ref));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-2xl border border-border/60 bg-card p-5 space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarClock, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-semibold",
					children: "Cronograma de aportes"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted-foreground",
				children: [
					"Reflete mudanças de carreira: ex. ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-foreground",
						children: "\"R$ 2.000 até 2028, depois R$ 4.000\""
					}),
					". Por padrão usa o aporte do plano (",
					brl(defaultValor),
					"/mês)."
				]
			}),
			sorted.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-1.5",
				children: sorted.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between gap-2 rounded-lg border border-border/40 bg-secondary/20 px-3 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm font-medium",
							children: ["A partir de ", formatRef(s.fromRef)]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-[11px] text-muted-foreground tabular-nums",
							children: [brl(s.valor), "/mês"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => remove(s.fromRef),
						className: "p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10",
						"aria-label": "Remover",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
					})]
				}, s.fromRef))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-[1fr_1fr_auto] gap-2 items-end pt-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-[10px] uppercase tracking-wider text-muted-foreground",
							children: "A partir de"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "month",
							value: refToInput(draftRef),
							onChange: (e) => setDraftRef(e.target.value),
							className: "h-9"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-[10px] uppercase tracking-wider text-muted-foreground",
							children: "Novo aporte"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CurrencyInput, {
							value: draftValor,
							onChange: setDraftValor,
							className: "h-9"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: add,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Adicionar"]
					})
				]
			})
		]
	});
}
function EventosEditor({ items, onChange }) {
	const [draftRef, setDraftRef] = (0, import_react.useState)(currentRef());
	const [draftValor, setDraftValor] = (0, import_react.useState)(0);
	const [draftDesc, setDraftDesc] = (0, import_react.useState)("");
	const sorted = [...items].sort((a, b) => a.ref.localeCompare(b.ref));
	function add() {
		if (!/^\d{4}-\d{2}$/.test(draftRef)) {
			toast.error("Mês inválido");
			return;
		}
		if (!draftValor) {
			toast.error("Informe um valor (positivo ou negativo)");
			return;
		}
		const desc = draftDesc.trim() || (draftValor > 0 ? "Receita extra" : "Saque");
		onChange([...sorted, {
			ref: draftRef,
			valor: draftValor,
			descricao: desc
		}].sort((a, b) => a.ref.localeCompare(b.ref)));
		toast.success(`${desc} em ${formatRef(draftRef)}: ${brl(draftValor)}`);
		setDraftDesc("");
		setDraftValor(0);
	}
	function remove(idx) {
		onChange(sorted.filter((_, i) => i !== idx));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-2xl border border-border/60 bg-card p-5 space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-semibold",
					children: "Eventos pontuais"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Bônus, herança ou PLR (valor positivo) e compras ou saques únicos (valor negativo). Entram na projeção do plano."
			}),
			sorted.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-1.5",
				children: sorted.map((e, idx) => {
					const positivo = e.valor >= 0;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between gap-2 rounded-lg border border-border/40 bg-secondary/20 px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-medium truncate",
								children: e.descricao
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[11px] text-muted-foreground tabular-nums",
								children: [
									formatRef(e.ref),
									" ·",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: positivo ? "text-pace-ahead" : "text-pace-behind",
										children: [positivo ? "+" : "−", brl(Math.abs(e.valor))]
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => remove(idx),
							className: "p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10",
							"aria-label": "Remover",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
						})]
					}, `${e.ref}-${idx}`);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2 pt-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-[1fr_1fr] gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-[10px] uppercase tracking-wider text-muted-foreground",
								children: "Mês"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "month",
								value: refToInput(draftRef),
								onChange: (e) => setDraftRef(e.target.value),
								className: "h-9"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-[10px] uppercase tracking-wider text-muted-foreground",
								children: "Valor (± para entrada/saída)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CurrencyInput, {
								value: draftValor,
								onChange: setDraftValor,
								className: "h-9",
								allowNegative: true
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-[10px] uppercase tracking-wider text-muted-foreground",
							children: "Descrição"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: draftDesc,
							onChange: (e) => setDraftDesc(e.target.value),
							placeholder: "Ex.: PLR, herança, compra do carro",
							className: "h-9"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: add,
						className: "w-full",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Adicionar evento"]
					})
				]
			})
		]
	});
}
//#endregion
export { Configuracoes as component };
