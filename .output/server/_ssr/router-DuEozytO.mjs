import { i as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/@hookform/resolvers+[...].mjs";
import { c as lazyRouteComponent, d as Link, i as useLocation, l as createFileRoute, n as Scripts, o as createRouter, p as useRouter, r as HeadContent, s as Outlet, u as createRootRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { C as House, F as Activity, _ as LogOut, a as Trophy, b as ListChecks, d as Settings, j as ChartLine, m as Plus, n as Wallet, w as Flag } from "../_libs/lucide-react.mjs";
import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { i as stringType, n as coerce, r as objectType, t as booleanType } from "../_libs/zod.mjs";
import processModule from "node:process";
//#region node_modules/.nitro/vite/services/ssr/assets/router-DuEozytO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var styles_default = "/assets/styles-t1PU_5Tv.css";
var MARATHON_KM = 42.195;
var STORAGE_KEY = "maratona-financeira/v1";
var DEFAULT_TAXA_RETIRADA = .04;
function createSupabaseClient() {
	const SUPABASE_URL = processModule.env.SUPABASE_URL;
	const SUPABASE_PUBLISHABLE_KEY = processModule.env.SUPABASE_PUBLISHABLE_KEY;
	if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
		const message = `Missing Supabase environment variable(s): ${[...!SUPABASE_URL ? ["SUPABASE_URL"] : [], ...!SUPABASE_PUBLISHABLE_KEY ? ["SUPABASE_PUBLISHABLE_KEY"] : []].join(", ")}. Connect Supabase in Lovable Cloud.`;
		console.error(`[Supabase] ${message}`);
		throw new Error(message);
	}
	return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, { auth: {
		storage: typeof window !== "undefined" ? localStorage : void 0,
		persistSession: true,
		autoRefreshToken: true
	} });
}
var _supabase;
var supabase = new Proxy({}, { get(_, prop, receiver) {
	if (!_supabase) _supabase = createSupabaseClient();
	return Reflect.get(_supabase, prop, receiver);
} });
var Ctx = (0, import_react.createContext)({
	user: null,
	session: null,
	ready: false
});
function AuthProvider({ children }) {
	const [session, setSession] = (0, import_react.useState)(null);
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
			setSession(s);
		});
		supabase.auth.getSession().then(({ data }) => {
			setSession(data.session);
			setReady(true);
		});
		return () => sub.subscription.unsubscribe();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ctx.Provider, {
		value: {
			user: session?.user ?? null,
			session,
			ready
		},
		children
	});
}
function useAuth() {
	return (0, import_react.useContext)(Ctx);
}
async function signOut() {
	await supabase.auth.signOut();
}
/**
* IPCA oficial — Banco Central do Brasil (SGS série 433: IPCA mensal IBGE).
* Fonte: https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados
* O BCB republica os dados oficiais publicados pelo IBGE.
*/
var SGS_URL = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados";
var CACHE_KEY = "maratona-financeira/ipca-anual/v1";
function loadCache() {
	if (typeof window === "undefined") return {
		fetchedAt: "",
		anos: {}
	};
	try {
		const raw = localStorage.getItem(CACHE_KEY);
		if (!raw) return {
			fetchedAt: "",
			anos: {}
		};
		return JSON.parse(raw);
	} catch {
		return {
			fetchedAt: "",
			anos: {}
		};
	}
}
function saveCache(p) {
	try {
		localStorage.setItem(CACHE_KEY, JSON.stringify(p));
	} catch {}
}
/** Busca o IPCA acumulado de um ano civil específico (ex: 2024). null se ainda não publicado. */
async function fetchIpcaAnual(ano) {
	const cache = loadCache();
	if (cache.fetchedAt.slice(0, 10) === (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) && cache.anos[ano] !== void 0) return cache.anos[ano];
	const url = `${SGS_URL}?formato=json&dataInicial=01/01/${ano}&dataFinal=31/12/${ano}`;
	try {
		const res = await fetch(url);
		if (!res.ok) return cache.anos[ano] ?? null;
		const rows = await res.json();
		if (!Array.isArray(rows) || rows.length < 12) return cache.anos[ano] ?? null;
		const acc = rows.reduce((p, r) => p * (1 + Number(r.valor) / 100), 1) - 1;
		const anos = {
			...cache.anos,
			[ano]: acc
		};
		saveCache({
			fetchedAt: (/* @__PURE__ */ new Date()).toISOString(),
			anos
		});
		return acc;
	} catch {
		return cache.anos[ano] ?? null;
	}
}
/**
* Aplica reajustes anuais retroativos pelo IPCA. Para cada ano civil já encerrado
* (e ainda não aplicado), multiplica a renda pelo (1 + IPCA do ano).
* Retorna nova renda + último ano aplicado, ou null se nada a aplicar.
*/
async function aplicarReajustesIpca(rendaAtual, ultimoAjusteAno, dataInicio) {
	const ultimoAnoDisponivel = (/* @__PURE__ */ new Date()).getFullYear() - 1;
	const inicioAno = new Date(dataInicio).getFullYear();
	const desde = (ultimoAjusteAno ?? inicioAno - 1) + 1;
	if (desde > ultimoAnoDisponivel) return null;
	let renda = rendaAtual;
	let aplicadoAte = ultimoAjusteAno ?? inicioAno - 1;
	for (let ano = desde; ano <= ultimoAnoDisponivel; ano++) {
		const ipca = await fetchIpcaAnual(ano);
		if (ipca === null) break;
		renda = renda * (1 + ipca);
		aplicadoAte = ano;
	}
	if (aplicadoAte === (ultimoAjusteAno ?? inicioAno - 1)) return null;
	return {
		renda: Math.round(renda),
		ano: aplicadoAte
	};
}
var MaratonaContext = (0, import_react.createContext)(null);
function loadLocal() {
	if (typeof window === "undefined") return null;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (!parsed || parsed.version !== 1) return null;
		const p = parsed.plan;
		if (p && !p.dataNascimento && typeof p.idadeAtual === "number") {
			const now = /* @__PURE__ */ new Date();
			p.dataNascimento = `${now.getFullYear() - Math.round(p.idadeAtual)}-${String(now.getMonth() + 1).padStart(2, "0")}`;
			delete p.idadeAtual;
			delete p.idadeMeta;
		}
		if (p && typeof p.rendaMensalDesejada !== "number") {
			const taxa = typeof p.taxaRetirada === "number" ? p.taxaRetirada : DEFAULT_TAXA_RETIRADA;
			const meta = typeof p.metaPatrimonio === "number" ? p.metaPatrimonio : 0;
			p.taxaRetirada = taxa;
			p.rendaMensalDesejada = meta > 0 ? Math.round(meta * taxa / 12) : 5e3;
			delete p.metaPatrimonio;
		}
		return parsed;
	} catch {
		return null;
	}
}
function saveLocal(d) {
	try {
		if (d) localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
		else localStorage.removeItem(STORAGE_KEY);
	} catch {}
}
function sortEntries(entries) {
	return [...entries].sort((a, b) => a.ref.localeCompare(b.ref));
}
function planFromRow(row) {
	return {
		dataNascimento: row.data_nascimento,
		patrimonioInicial: Number(row.patrimonio_inicial) || 0,
		rendaMensalDesejada: Number(row.renda_mensal_desejada) || 0,
		taxaRetirada: Number(row.taxa_retirada) || .04,
		aporteMensal: Number(row.aporte_mensal) || 0,
		taxaAnual: Number(row.taxa_anual) || 0,
		dataInicio: row.data_inicio,
		atualizaIpca: row.atualiza_ipca ?? true,
		ultimoAjusteIpcaAno: row.ultimo_ajuste_ipca_ano ?? null,
		aporteSchedule: Array.isArray(row.aporte_schedule) ? row.aporte_schedule : [],
		eventos: Array.isArray(row.eventos) ? row.eventos : []
	};
}
function planToRow(userId, plan) {
	return {
		user_id: userId,
		data_nascimento: plan.dataNascimento,
		patrimonio_inicial: plan.patrimonioInicial,
		renda_mensal_desejada: plan.rendaMensalDesejada,
		taxa_retirada: plan.taxaRetirada,
		aporte_mensal: plan.aporteMensal,
		taxa_anual: plan.taxaAnual,
		data_inicio: plan.dataInicio,
		atualiza_ipca: plan.atualizaIpca ?? true,
		ultimo_ajuste_ipca_ano: plan.ultimoAjusteIpcaAno ?? null,
		aporte_schedule: plan.aporteSchedule ?? [],
		eventos: plan.eventos ?? []
	};
}
function MaratonaProvider({ children }) {
	const { user, ready: authReady } = useAuth();
	const [data, setData] = (0, import_react.useState)(null);
	const [ready, setReady] = (0, import_react.useState)(false);
	const migratedRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!authReady) return;
		if (!user) {
			setData(loadLocal());
			setReady(true);
			return;
		}
		let active = true;
		setReady(false);
		(async () => {
			const local = loadLocal();
			if (local && migratedRef.current !== user.id) {
				migratedRef.current = user.id;
				const { data: existing } = await supabase.from("plans").select("user_id").eq("user_id", user.id).maybeSingle();
				if (!existing) {
					await supabase.from("plans").upsert(planToRow(user.id, local.plan));
					if (local.entries.length) await supabase.from("entries").upsert(local.entries.map((e) => ({
						user_id: user.id,
						ref: e.ref,
						patrimonio: e.patrimonio,
						aportes: e.aportes
					})), { onConflict: "user_id,ref" });
				}
				saveLocal(null);
			}
			const [{ data: planRow }, { data: entryRows }] = await Promise.all([supabase.from("plans").select("*").eq("user_id", user.id).maybeSingle(), supabase.from("entries").select("ref, patrimonio, aportes").eq("user_id", user.id)]);
			if (!active) return;
			if (planRow) {
				const plan = planFromRow(planRow);
				const entries = sortEntries((entryRows ?? []).map((e) => ({
					ref: e.ref,
					patrimonio: Number(e.patrimonio) || 0,
					aportes: Number(e.aportes) || 0
				})));
				setData({
					version: 1,
					plan,
					entries,
					createdAt: planRow.created_at ?? (/* @__PURE__ */ new Date()).toISOString(),
					updatedAt: planRow.updated_at ?? (/* @__PURE__ */ new Date()).toISOString()
				});
			} else setData(null);
			setReady(true);
		})();
		return () => {
			active = false;
		};
	}, [user, authReady]);
	(0, import_react.useEffect)(() => {
		if (!authReady) return;
		if (!user && data) saveLocal(data);
	}, [
		data,
		user,
		authReady
	]);
	(0, import_react.useEffect)(() => {
		if (!ready || !data?.plan) return;
		const plan = data.plan;
		if (plan.atualizaIpca === false) return;
		let cancelled = false;
		(async () => {
			const r = await aplicarReajustesIpca(plan.rendaMensalDesejada, plan.ultimoAjusteIpcaAno ?? null, plan.dataInicio);
			if (cancelled || !r) return;
			setData((prev) => {
				if (!prev) return prev;
				const next = {
					...prev,
					plan: {
						...prev.plan,
						rendaMensalDesejada: r.renda,
						ultimoAjusteIpcaAno: r.ano
					},
					updatedAt: (/* @__PURE__ */ new Date()).toISOString()
				};
				if (user) supabase.from("plans").upsert(planToRow(user.id, next.plan)).then(({ error }) => {
					if (error) console.error("plan ipca upsert", error);
				});
				return next;
			});
		})();
		return () => {
			cancelled = true;
		};
	}, [
		ready,
		data?.plan?.atualizaIpca,
		data?.plan?.ultimoAjusteIpcaAno,
		user
	]);
	const setPlan = (0, import_react.useCallback)((plan) => {
		const now = (/* @__PURE__ */ new Date()).toISOString();
		setData((prev) => ({
			version: 1,
			plan,
			entries: prev?.entries ?? [],
			createdAt: prev?.createdAt ?? now,
			updatedAt: now
		}));
		if (user) supabase.from("plans").upsert(planToRow(user.id, plan)).then(({ error }) => {
			if (error) console.error("plan upsert", error);
		});
	}, [user]);
	const updatePlan = (0, import_react.useCallback)((patch) => {
		setData((prev) => {
			if (!prev) return prev;
			const next = {
				...prev,
				plan: {
					...prev.plan,
					...patch
				},
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			};
			if (user) supabase.from("plans").upsert(planToRow(user.id, next.plan)).then(({ error }) => {
				if (error) console.error("plan upsert", error);
			});
			return next;
		});
	}, [user]);
	const addEntry = (0, import_react.useCallback)((entry) => {
		setData((prev) => {
			if (!prev) return prev;
			const others = prev.entries.filter((e) => e.ref !== entry.ref);
			return {
				...prev,
				entries: sortEntries([...others, entry]),
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			};
		});
		if (user) supabase.from("entries").upsert({
			user_id: user.id,
			ref: entry.ref,
			patrimonio: entry.patrimonio,
			aportes: entry.aportes
		}, { onConflict: "user_id,ref" }).then(({ error }) => {
			if (error) console.error("entry upsert", error);
		});
	}, [user]);
	const addEntries = (0, import_react.useCallback)((incoming) => {
		if (!incoming.length) return;
		setData((prev) => {
			if (!prev) return prev;
			const map = new Map(prev.entries.map((e) => [e.ref, e]));
			for (const e of incoming) map.set(e.ref, e);
			return {
				...prev,
				entries: sortEntries(Array.from(map.values())),
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			};
		});
		if (user) supabase.from("entries").upsert(incoming.map((e) => ({
			user_id: user.id,
			ref: e.ref,
			patrimonio: e.patrimonio,
			aportes: e.aportes
		})), { onConflict: "user_id,ref" }).then(({ error }) => {
			if (error) console.error("entries bulk upsert", error);
		});
	}, [user]);
	const updateEntry = (0, import_react.useCallback)((ref, patch) => {
		setData((prev) => {
			if (!prev) return prev;
			const entries = prev.entries.map((e) => e.ref === ref ? {
				...e,
				...patch
			} : e);
			const updated = entries.find((e) => e.ref === ref);
			if (user && updated) supabase.from("entries").upsert({
				user_id: user.id,
				ref,
				patrimonio: updated.patrimonio,
				aportes: updated.aportes
			}, { onConflict: "user_id,ref" }).then(({ error }) => {
				if (error) console.error("entry update", error);
			});
			return {
				...prev,
				entries: sortEntries(entries),
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			};
		});
	}, [user]);
	const deleteEntry = (0, import_react.useCallback)((ref) => {
		setData((prev) => {
			if (!prev) return prev;
			return {
				...prev,
				entries: prev.entries.filter((e) => e.ref !== ref),
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			};
		});
		if (user) supabase.from("entries").delete().eq("user_id", user.id).eq("ref", ref).then(({ error }) => {
			if (error) console.error("entry delete", error);
		});
	}, [user]);
	const importJson = (0, import_react.useCallback)((json) => {
		try {
			const parsed = JSON.parse(json);
			if (!parsed || parsed.version !== 1 || !parsed.plan || !Array.isArray(parsed.entries)) return false;
			const next = {
				...parsed,
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			};
			setData(next);
			if (user) {
				supabase.from("plans").upsert(planToRow(user.id, next.plan));
				if (next.entries.length) supabase.from("entries").upsert(next.entries.map((e) => ({
					user_id: user.id,
					ref: e.ref,
					patrimonio: e.patrimonio,
					aportes: e.aportes
				})), { onConflict: "user_id,ref" });
			}
			return true;
		} catch {
			return false;
		}
	}, [user]);
	const reset = (0, import_react.useCallback)(() => {
		setData(null);
		if (typeof window !== "undefined") localStorage.removeItem(STORAGE_KEY);
		if (user) {
			supabase.from("entries").delete().eq("user_id", user.id);
			supabase.from("plans").delete().eq("user_id", user.id);
		}
	}, [user]);
	const value = (0, import_react.useMemo)(() => ({
		data,
		ready,
		hasPlan: !!data?.plan,
		setPlan,
		updatePlan,
		addEntry,
		addEntries,
		updateEntry,
		deleteEntry,
		importJson,
		reset
	}), [
		data,
		ready,
		setPlan,
		updatePlan,
		addEntry,
		addEntries,
		updateEntry,
		deleteEntry,
		importJson,
		reset
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MaratonaContext.Provider, {
		value,
		children
	});
}
function useMaratona() {
	const ctx = (0, import_react.useContext)(MaratonaContext);
	if (!ctx) throw new Error("useMaratona must be used within MaratonaProvider");
	return ctx;
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var tabs = [
	{
		to: "/",
		label: "Pista",
		icon: House
	},
	{
		to: "/atualizar",
		label: "Atualizar",
		icon: Plus
	},
	{
		to: "/historico",
		label: "Histórico",
		icon: ListChecks
	},
	{
		to: "/cenarios",
		label: "Cenários",
		icon: ChartLine
	},
	{
		to: "/configuracoes",
		label: "Ajustes",
		icon: Settings
	}
];
function AppLayout() {
	const location = useLocation();
	const { user } = useAuth();
	async function handleLogout() {
		await signOut();
		toast.success("Até a próxima!");
		if (typeof window !== "undefined") window.location.replace("/auth");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen flex flex-col bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-30 border-b border-border/50 bg-background/80 backdrop-blur",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-3xl px-4 h-14 flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-5 w-5 text-primary" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "text-base font-bold tracking-tight",
							children: ["Maratona ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-primary",
								children: "Financeira"
							})]
						}),
						user && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: handleLogout,
							className: "ml-auto inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors",
							title: user.email ?? "Sair",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline max-w-[180px] truncate",
								children: user.email
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" })]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1 mx-auto w-full max-w-3xl px-4 pb-28 pt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed bottom-0 inset-x-0 z-30 border-t border-border/50 bg-background/95 backdrop-blur",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto max-w-3xl grid grid-cols-5",
					children: tabs.map(({ to, label, icon: Icon }) => {
						const active = to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to,
							className: cn("flex flex-col items-center gap-1 py-2.5 text-[11px] transition-colors", active ? "text-primary" : "text-muted-foreground hover:text-foreground"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: cn("h-5 w-5", active && "drop-shadow-[0_0_6px_var(--primary)]") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label })]
						}, to);
					})
				})
			})
		]
	});
}
function Landing() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen flex flex-col bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "border-b border-border/50",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-5xl px-4 h-14 flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-5 w-5 text-primary" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "text-base font-bold tracking-tight",
							children: ["Maratona ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-primary",
								children: "Financeira"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "/auth",
							className: "ml-auto text-sm font-medium text-primary hover:underline",
							children: "Entrar"
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mx-auto max-w-3xl px-4 pt-16 pb-12 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary font-semibold mb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, { className: "h-3.5 w-3.5" }), " Sua jornada patrimonial em 42 km"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "text-4xl sm:text-5xl font-bold tracking-tight leading-tight",
								children: [
									"Acompanhe seu patrimônio como uma",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-primary",
										children: "maratona"
									}),
									"."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto",
								children: "O Maratona Financeira transforma sua jornada de acúmulo de patrimônio em uma corrida de 42,195 km. Atualize seu saldo mês a mês e visualize o progresso, o ritmo e a previsão da sua independência financeira."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8 flex items-center justify-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "/auth",
									className: "inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors",
									children: "Começar agora"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "/auth",
									className: "inline-flex items-center justify-center rounded-md border border-border px-5 py-2.5 text-sm font-semibold hover:bg-secondary/40 transition-colors",
									children: "Já tenho conta"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mx-auto max-w-5xl px-4 py-12 grid sm:grid-cols-3 gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Feature, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-5 w-5" }),
								title: "Patrimônio mês a mês",
								text: "Registre o saldo do mês e veja seus aportes e rentabilidade separados automaticamente."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Feature, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartLine, { className: "h-5 w-5" }),
								title: "Ritmo e projeções",
								text: "Saiba se está adiantado, no ritmo ou atrasado em relação ao seu plano e quando vai chegar à meta."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Feature, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "h-5 w-5" }),
								title: "Marcos no caminho",
								text: "5K, 10K, 21K, 42K — celebre cada marco até a sua independência financeira."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mx-auto max-w-3xl px-4 py-12 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-2xl font-bold",
							children: "Para quem é?"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-muted-foreground",
							children: "Para quem quer planejar a aposentadoria ou a independência financeira com clareza, sem planilhas complicadas. Você define sua meta de renda mensal e o app calcula o patrimônio necessário, o tempo restante e o ritmo ideal de aportes."
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "border-t border-border/50",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-5xl px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						"© ",
						(/* @__PURE__ */ new Date()).getFullYear(),
						" Maratona Financeira"
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "/privacidade",
							className: "hover:text-foreground",
							children: "Política de Privacidade"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "mailto:contato@maratonafinanceira.com.br",
							className: "hover:text-foreground",
							children: "Contato"
						})]
					})]
				})
			})
		]
	});
}
function Feature({ icon, title, text }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border/60 bg-card p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-10 w-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center",
				children: icon
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 font-semibold",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground leading-relaxed",
				children: text
			})
		]
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
var Route$8 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Maratona Financeira -  sua jornada patrimonial em 42km" },
			{
				name: "description",
				content: "Acompanhe a evolução do seu patrimônio como uma maratona: progresso baseado em tempo, desempenho baseado em consistência."
			},
			{
				name: "author",
				content: "Lovable"
			},
			{
				property: "og:title",
				content: "Maratona Financeira -  sua jornada patrimonial em 42km"
			},
			{
				property: "og:description",
				content: "Acompanhe sua jornada patrimonial mês a mês com motivação e clareza."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary"
			},
			{
				name: "twitter:site",
				content: "@Lovable"
			},
			{
				name: "twitter:title",
				content: "Maratona Financeira -  sua jornada patrimonial em 42km"
			},
			{
				name: "description",
				content: "Acompanhe a evolução do seu patrimônio como uma maratona de 42 km: progresso por tempo, desempenho por consistência e projeções até a sua meta."
			},
			{
				property: "og:description",
				content: "Acompanhe a evolução do seu patrimônio como uma maratona de 42 km: progresso por tempo, desempenho por consistência e projeções até a sua meta."
			},
			{
				name: "twitter:description",
				content: "Acompanhe a evolução do seu patrimônio como uma maratona de 42 km: progresso por tempo, desempenho por consistência e projeções até a sua meta."
			},
			{
				property: "og:image",
				content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c502de61-ee4f-4590-b064-2751c8cbb204/id-preview-23eae086--5efa16d2-f7d7-4a2e-884f-9f680b23e0be.lovable.app-1778464397421.png"
			},
			{
				name: "twitter:image",
				content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c502de61-ee4f-4590-b064-2751c8cbb204/id-preview-23eae086--5efa16d2-f7d7-4a2e-884f-9f680b23e0be.lovable.app-1778464397421.png"
			}
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}, {
			rel: "icon",
			type: "image/svg+xml",
			href: "/favicon.svg"
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const location = useLocation();
	const isOnboarding = location.pathname.startsWith("/onboarding");
	const isAuth = location.pathname.startsWith("/auth");
	const isPrivacy = location.pathname.startsWith("/privacidade");
	const isHome = location.pathname === "/";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MaratonaProvider, { children: [isAuth || isPrivacy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthGate, {
		publicHome: isHome,
		children: isOnboarding ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppLayout, {})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		position: "top-center",
		richColors: true,
		theme: "dark"
	})] }) });
}
function AuthGate({ children, publicHome }) {
	const { ready, user } = useAuth();
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center text-muted-foreground text-sm",
		children: "Carregando…"
	});
	if (!user) {
		if (publicHome) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Landing, {});
		if (typeof window !== "undefined") window.location.replace("/auth");
		return null;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var $$splitComponentImporter$7 = () => import("./privacidade-DZahp8cz.mjs");
var Route$7 = createFileRoute("/privacidade")({
	head: () => ({ meta: [{ title: "Política de Privacidade — Maratona Financeira" }, {
		name: "description",
		content: "Política de Privacidade do Maratona Financeira: como coletamos, usamos e protegemos seus dados."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./onboarding-PIVr7mEF.mjs");
objectType({
	dataNascimento: stringType().regex(/^\d{4}-\d{2}$/, "Informe mês e ano"),
	patrimonioInicial: coerce.number().min(0),
	rendaMensalDesejada: coerce.number().positive("Informe a renda mensal desejada"),
	taxaRetiradaPct: coerce.number().min(1).max(10),
	aporteMensal: coerce.number().min(0),
	taxaAnualPct: coerce.number().min(0).max(50),
	atualizaIpca: booleanType()
});
var Route$6 = createFileRoute("/onboarding")({
	head: () => ({ meta: [{ title: "Sua largada — Maratona Financeira" }, {
		name: "description",
		content: "Configure seu plano para começar a maratona patrimonial."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./historico-BQvpTA6Y.mjs");
var Route$5 = createFileRoute("/historico")({
	head: () => ({ meta: [{ title: "Histórico — Maratona Financeira" }, {
		name: "description",
		content: "Veja seu progresso histórico na maratona financeira."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./configuracoes-BQjKJnPY.mjs");
var Route$4 = createFileRoute("/configuracoes")({
	head: () => ({ meta: [{ title: "Configurações — Maratona Financeira" }, {
		name: "description",
		content: "Edite seu plano, exporte ou importe dados."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./cenarios-C1Jjlb_9.mjs");
var Route$3 = createFileRoute("/cenarios")({
	head: () => ({ meta: [{ title: "Cenários — Maratona Financeira" }, {
		name: "description",
		content: "Projeções conservador, esperado e otimista."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./auth-ChOWCrUP.mjs");
var Route$2 = createFileRoute("/auth")({
	head: () => ({ meta: [{ title: "Entrar — Maratona Financeira" }, {
		name: "description",
		content: "Acesse sua maratona financeira de qualquer dispositivo."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./atualizar-CQiDP-IX.mjs");
objectType({
	ref: stringType().regex(/^\d{4}-\d{2}$/),
	patrimonio: coerce.number().min(0),
	aportes: coerce.number()
});
var Route$1 = createFileRoute("/atualizar")({
	head: () => ({ meta: [{ title: "Atualizar mês — Maratona Financeira" }, {
		name: "description",
		content: "Registre o patrimônio do mês e avance na pista."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./routes-BVD6viR4.mjs");
var Route = createFileRoute("/")({
	head: () => ({ meta: [{ title: "Pista — Maratona Financeira" }, {
		name: "description",
		content: "Visualize seu progresso na maratona patrimonial."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var PrivacidadeRoute = Route$7.update({
	id: "/privacidade",
	path: "/privacidade",
	getParentRoute: () => Route$8
});
var OnboardingRoute = Route$6.update({
	id: "/onboarding",
	path: "/onboarding",
	getParentRoute: () => Route$8
});
var HistoricoRoute = Route$5.update({
	id: "/historico",
	path: "/historico",
	getParentRoute: () => Route$8
});
var ConfiguracoesRoute = Route$4.update({
	id: "/configuracoes",
	path: "/configuracoes",
	getParentRoute: () => Route$8
});
var CenariosRoute = Route$3.update({
	id: "/cenarios",
	path: "/cenarios",
	getParentRoute: () => Route$8
});
var AuthRoute = Route$2.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$8
});
var AtualizarRoute = Route$1.update({
	id: "/atualizar",
	path: "/atualizar",
	getParentRoute: () => Route$8
});
var rootRouteChildren = {
	IndexRoute: Route.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$8
	}),
	AtualizarRoute,
	AuthRoute,
	CenariosRoute,
	ConfiguracoesRoute,
	HistoricoRoute,
	OnboardingRoute,
	PrivacidadeRoute
};
var routeTree = Route$8._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function DefaultErrorComponent({ error, reset }) {
	const router = useRouter();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
						xmlns: "http://www.w3.org/2000/svg",
						className: "h-8 w-8 text-destructive",
						fill: "none",
						viewBox: "0 0 24 24",
						stroke: "currentColor",
						strokeWidth: 2,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							strokeLinecap: "round",
							strokeLinejoin: "round",
							d: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold tracking-tight text-foreground",
					children: "Something went wrong"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "An unexpected error occurred. Please try again."
				}),
				false,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex items-center justify-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var getRouter = () => {
	return createRouter({
		routeTree,
		context: {},
		scrollRestoration: true,
		defaultPreloadStaleTime: 0,
		defaultErrorComponent: DefaultErrorComponent
	});
};
//#endregion
export { supabase as a, useAuth as i, cn as n, useMaratona as r, MARATHON_KM as s, router_exports as t };
