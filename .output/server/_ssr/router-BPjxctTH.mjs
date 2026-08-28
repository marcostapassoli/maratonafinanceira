import process from "node:process";
import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { c as createRouter, u as useRouter, a as createRootRoute, b as createFileRoute, l as lazyRouteComponent, H as HeadContent, S as Scripts, d as useLocation, O as Outlet, L as Link } from "../_libs/tanstack__react-router.mjs";
import { c as createClient } from "../_libs/supabase__supabase-js.mjs";
import { T as Toaster, t as toast } from "../_libs/sonner.mjs";
import { c as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { A as Activity, L as LogOut, H as House, P as Plus, a as ListChecks, C as ChartLine, S as Settings, F as Flag, W as Wallet, T as Trophy } from "../_libs/lucide-react.mjs";
import { o as objectType, b as booleanType, c as coerce, s as stringType } from "../_libs/zod.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/unenv.mjs";


import "../_libs/seroval-plugins.mjs";


import "../_libs/react-dom.mjs";
import "../_libs/isbot.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/tslib.mjs";
import "../_libs/supabase__functions-js.mjs";
const appCss = "/assets/styles-DJ9LGxOQ.css";
const MARATHON_KM = 42.195;
const STORAGE_KEY = "maratona-financeira/v1";
const DEFAULT_TAXA_RETIRADA = 0.04;
function createSupabaseClient() {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    const missing = [
      ...!SUPABASE_URL ? ["SUPABASE_URL"] : [],
      ...!SUPABASE_PUBLISHABLE_KEY ? ["SUPABASE_PUBLISHABLE_KEY"] : []
    ];
    const message = `Missing Supabase environment variable(s): ${missing.join(", ")}. Connect Supabase in Lovable Cloud.`;
    console.error(`[Supabase] ${message}`);
    throw new Error(message);
  }
  return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: typeof window !== "undefined" ? localStorage : void 0,
      persistSession: true,
      autoRefreshToken: true
    }
  });
}
let _supabase;
const supabase = new Proxy({}, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  }
});
const Ctx = reactExports.createContext({ user: null, session: null, ready: false });
function AuthProvider({ children }) {
  const [session, setSession] = reactExports.useState(null);
  const [ready, setReady] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Ctx.Provider, { value: { user: session?.user ?? null, session, ready }, children });
}
function useAuth() {
  return reactExports.useContext(Ctx);
}
async function signOut() {
  await supabase.auth.signOut();
}
const SGS_URL = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados";
const CACHE_KEY = "maratona-financeira/ipca-anual/v1";
function loadCache() {
  if (typeof window === "undefined") return { fetchedAt: "", anos: {} };
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return { fetchedAt: "", anos: {} };
    return JSON.parse(raw);
  } catch {
    return { fetchedAt: "", anos: {} };
  }
}
function saveCache(p) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(p));
  } catch {
  }
}
async function fetchIpcaAnual(ano) {
  const cache = loadCache();
  const cachedToday = cache.fetchedAt.slice(0, 10) === (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  if (cachedToday && cache.anos[ano] !== void 0) return cache.anos[ano];
  const url = `${SGS_URL}?formato=json&dataInicial=01/01/${ano}&dataFinal=31/12/${ano}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return cache.anos[ano] ?? null;
    const rows = await res.json();
    if (!Array.isArray(rows) || rows.length < 12) {
      return cache.anos[ano] ?? null;
    }
    const acc = rows.reduce((p, r) => p * (1 + Number(r.valor) / 100), 1) - 1;
    const anos = { ...cache.anos, [ano]: acc };
    saveCache({ fetchedAt: (/* @__PURE__ */ new Date()).toISOString(), anos });
    return acc;
  } catch {
    return cache.anos[ano] ?? null;
  }
}
async function aplicarReajustesIpca(rendaAtual, ultimoAjusteAno, dataInicio) {
  const hoje = /* @__PURE__ */ new Date();
  const anoAtual = hoje.getFullYear();
  const ultimoAnoDisponivel = anoAtual - 1;
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
  return { renda: Math.round(renda), ano: aplicadoAte };
}
const MaratonaContext = reactExports.createContext(null);
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
      const y = now.getFullYear() - Math.round(p.idadeAtual);
      p.dataNascimento = `${y}-${String(now.getMonth() + 1).padStart(2, "0")}`;
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
  } catch {
  }
}
function sortEntries(entries) {
  return [...entries].sort((a, b) => a.ref.localeCompare(b.ref));
}
function planFromRow(row) {
  return {
    dataNascimento: row.data_nascimento,
    patrimonioInicial: Number(row.patrimonio_inicial) || 0,
    rendaMensalDesejada: Number(row.renda_mensal_desejada) || 0,
    taxaRetirada: Number(row.taxa_retirada) || DEFAULT_TAXA_RETIRADA,
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
  const [data, setData] = reactExports.useState(null);
  const [ready, setReady] = reactExports.useState(false);
  const migratedRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
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
          if (local.entries.length) {
            await supabase.from("entries").upsert(
              local.entries.map((e) => ({
                user_id: user.id,
                ref: e.ref,
                patrimonio: e.patrimonio,
                aportes: e.aportes
              })),
              { onConflict: "user_id,ref" }
            );
          }
        }
        saveLocal(null);
      }
      const [{ data: planRow }, { data: entryRows }] = await Promise.all([
        supabase.from("plans").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("entries").select("ref, patrimonio, aportes").eq("user_id", user.id)
      ]);
      if (!active) return;
      if (planRow) {
        const plan = planFromRow(planRow);
        const entries = sortEntries(
          (entryRows ?? []).map((e) => ({
            ref: e.ref,
            patrimonio: Number(e.patrimonio) || 0,
            aportes: Number(e.aportes) || 0
          }))
        );
        setData({
          version: 1,
          plan,
          entries,
          createdAt: planRow.created_at ?? (/* @__PURE__ */ new Date()).toISOString(),
          updatedAt: planRow.updated_at ?? (/* @__PURE__ */ new Date()).toISOString()
        });
      } else {
        setData(null);
      }
      setReady(true);
    })();
    return () => {
      active = false;
    };
  }, [user, authReady]);
  reactExports.useEffect(() => {
    if (!authReady) return;
    if (!user && data) saveLocal(data);
  }, [data, user, authReady]);
  reactExports.useEffect(() => {
    if (!ready || !data?.plan) return;
    const plan = data.plan;
    if (plan.atualizaIpca === false) return;
    let cancelled = false;
    (async () => {
      const r = await aplicarReajustesIpca(
        plan.rendaMensalDesejada,
        plan.ultimoAjusteIpcaAno ?? null,
        plan.dataInicio
      );
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
        if (user) {
          supabase.from("plans").upsert(planToRow(user.id, next.plan)).then(({ error }) => {
            if (error) console.error("plan ipca upsert", error);
          });
        }
        return next;
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [ready, data?.plan?.atualizaIpca, data?.plan?.ultimoAjusteIpcaAno, user]);
  const setPlan = reactExports.useCallback(
    (plan) => {
      const now = (/* @__PURE__ */ new Date()).toISOString();
      setData((prev) => ({
        version: 1,
        plan,
        entries: prev?.entries ?? [],
        createdAt: prev?.createdAt ?? now,
        updatedAt: now
      }));
      if (user) {
        supabase.from("plans").upsert(planToRow(user.id, plan)).then(({ error }) => {
          if (error) console.error("plan upsert", error);
        });
      }
    },
    [user]
  );
  const updatePlan = reactExports.useCallback(
    (patch) => {
      setData((prev) => {
        if (!prev) return prev;
        const next = { ...prev, plan: { ...prev.plan, ...patch }, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
        if (user) {
          supabase.from("plans").upsert(planToRow(user.id, next.plan)).then(({ error }) => {
            if (error) console.error("plan upsert", error);
          });
        }
        return next;
      });
    },
    [user]
  );
  const addEntry = reactExports.useCallback(
    (entry) => {
      setData((prev) => {
        if (!prev) return prev;
        const others = prev.entries.filter((e) => e.ref !== entry.ref);
        return { ...prev, entries: sortEntries([...others, entry]), updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
      });
      if (user) {
        supabase.from("entries").upsert(
          { user_id: user.id, ref: entry.ref, patrimonio: entry.patrimonio, aportes: entry.aportes },
          { onConflict: "user_id,ref" }
        ).then(({ error }) => {
          if (error) console.error("entry upsert", error);
        });
      }
    },
    [user]
  );
  const addEntries = reactExports.useCallback(
    (incoming) => {
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
      if (user) {
        supabase.from("entries").upsert(
          incoming.map((e) => ({
            user_id: user.id,
            ref: e.ref,
            patrimonio: e.patrimonio,
            aportes: e.aportes
          })),
          { onConflict: "user_id,ref" }
        ).then(({ error }) => {
          if (error) console.error("entries bulk upsert", error);
        });
      }
    },
    [user]
  );
  const updateEntry = reactExports.useCallback(
    (ref, patch) => {
      setData((prev) => {
        if (!prev) return prev;
        const entries = prev.entries.map((e) => e.ref === ref ? { ...e, ...patch } : e);
        const updated = entries.find((e) => e.ref === ref);
        if (user && updated) {
          supabase.from("entries").upsert(
            { user_id: user.id, ref, patrimonio: updated.patrimonio, aportes: updated.aportes },
            { onConflict: "user_id,ref" }
          ).then(({ error }) => {
            if (error) console.error("entry update", error);
          });
        }
        return { ...prev, entries: sortEntries(entries), updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
      });
    },
    [user]
  );
  const deleteEntry = reactExports.useCallback(
    (ref) => {
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          entries: prev.entries.filter((e) => e.ref !== ref),
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        };
      });
      if (user) {
        supabase.from("entries").delete().eq("user_id", user.id).eq("ref", ref).then(({ error }) => {
          if (error) console.error("entry delete", error);
        });
      }
    },
    [user]
  );
  const importJson = reactExports.useCallback(
    (json) => {
      try {
        const parsed = JSON.parse(json);
        if (!parsed || parsed.version !== 1 || !parsed.plan || !Array.isArray(parsed.entries)) {
          return false;
        }
        const next = { ...parsed, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
        setData(next);
        if (user) {
          supabase.from("plans").upsert(planToRow(user.id, next.plan));
          if (next.entries.length) {
            supabase.from("entries").upsert(
              next.entries.map((e) => ({
                user_id: user.id,
                ref: e.ref,
                patrimonio: e.patrimonio,
                aportes: e.aportes
              })),
              { onConflict: "user_id,ref" }
            );
          }
        }
        return true;
      } catch {
        return false;
      }
    },
    [user]
  );
  const reset = reactExports.useCallback(() => {
    setData(null);
    if (typeof window !== "undefined") localStorage.removeItem(STORAGE_KEY);
    if (user) {
      supabase.from("entries").delete().eq("user_id", user.id);
      supabase.from("plans").delete().eq("user_id", user.id);
    }
  }, [user]);
  const value = reactExports.useMemo(
    () => ({
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
    }),
    [data, ready, setPlan, updatePlan, addEntry, addEntries, updateEntry, deleteEntry, importJson, reset]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(MaratonaContext.Provider, { value, children });
}
function useMaratona() {
  const ctx = reactExports.useContext(MaratonaContext);
  if (!ctx) throw new Error("useMaratona must be used within MaratonaProvider");
  return ctx;
}
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const tabs = [
  { to: "/", label: "Pista", icon: House },
  { to: "/atualizar", label: "Atualizar", icon: Plus },
  { to: "/historico", label: "Histórico", icon: ListChecks },
  { to: "/cenarios", label: "Cenários", icon: ChartLine },
  { to: "/configuracoes", label: "Ajustes", icon: Settings }
];
function AppLayout() {
  const location = useLocation();
  const { user } = useAuth();
  async function handleLogout() {
    await signOut();
    toast.success("Até a próxima!");
    if (typeof window !== "undefined") window.location.replace("/auth");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-30 border-b border-border/50 bg-background/80 backdrop-blur", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl px-4 h-14 flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-5 w-5 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-base font-bold tracking-tight", children: [
        "Maratona ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "Financeira" })
      ] }),
      user && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: handleLogout,
          className: "ml-auto inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors",
          title: user.email ?? "Sair",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline max-w-[180px] truncate", children: user.email }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" })
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 mx-auto w-full max-w-3xl px-4 pb-28 pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "fixed bottom-0 inset-x-0 z-30 border-t border-border/50 bg-background/95 backdrop-blur", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-3xl grid grid-cols-5", children: tabs.map(({ to, label, icon: Icon }) => {
      const active = to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to,
          className: cn(
            "flex flex-col items-center gap-1 py-2.5 text-[11px] transition-colors",
            active ? "text-primary" : "text-muted-foreground hover:text-foreground"
          ),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: cn("h-5 w-5", active && "drop-shadow-[0_0_6px_var(--primary)]") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label })
          ]
        },
        to
      );
    }) }) })
  ] });
}
function Landing() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "border-b border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-5xl px-4 h-14 flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-5 w-5 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-base font-bold tracking-tight", children: [
        "Maratona ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "Financeira" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/auth",
          className: "ml-auto text-sm font-medium text-primary hover:underline",
          children: "Entrar"
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-3xl px-4 pt-16 pb-12 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary font-semibold mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Flag, { className: "h-3.5 w-3.5" }),
          " Sua jornada patrimonial em 42 km"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-4xl sm:text-5xl font-bold tracking-tight leading-tight", children: [
          "Acompanhe seu patrimônio como uma",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "maratona" }),
          "."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto", children: "O Maratona Financeira transforma sua jornada de acúmulo de patrimônio em uma corrida de 42,195 km. Atualize seu saldo mês a mês e visualize o progresso, o ritmo e a previsão da sua independência financeira." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex items-center justify-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: "/auth",
              className: "inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors",
              children: "Começar agora"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: "/auth",
              className: "inline-flex items-center justify-center rounded-md border border-border px-5 py-2.5 text-sm font-semibold hover:bg-secondary/40 transition-colors",
              children: "Já tenho conta"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-5xl px-4 py-12 grid sm:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Feature,
          {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-5 w-5" }),
            title: "Patrimônio mês a mês",
            text: "Registre o saldo do mês e veja seus aportes e rentabilidade separados automaticamente."
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Feature,
          {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartLine, { className: "h-5 w-5" }),
            title: "Ritmo e projeções",
            text: "Saiba se está adiantado, no ritmo ou atrasado em relação ao seu plano e quando vai chegar à meta."
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Feature,
          {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "h-5 w-5" }),
            title: "Marcos no caminho",
            text: "5K, 10K, 21K, 42K — celebre cada marco até a sua independência financeira."
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-3xl px-4 py-12 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-bold", children: "Para quem é?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-muted-foreground", children: "Para quem quer planejar a aposentadoria ou a independência financeira com clareza, sem planilhas complicadas. Você define sua meta de renda mensal e o app calcula o patrimônio necessário, o tempo restante e o ritmo ideal de aportes." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "border-t border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-5xl px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " Maratona Financeira"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/privacidade", className: "hover:text-foreground", children: "Política de Privacidade" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: "mailto:contato@maratonafinanceira.com.br",
            className: "hover:text-foreground",
            children: "Contato"
          }
        )
      ] })
    ] }) })
  ] });
}
function Feature({
  icon,
  title,
  text
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border/60 bg-card p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center", children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 font-semibold", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground leading-relaxed", children: text })
  ] });
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
const Route$8 = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Maratona Financeira -  sua jornada patrimonial em 42km" },
      {
        name: "description",
        content: "Acompanhe a evolução do seu patrimônio como uma maratona: progresso baseado em tempo, desempenho baseado em consistência."
      },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Maratona Financeira -  sua jornada patrimonial em 42km" },
      {
        property: "og:description",
        content: "Acompanhe sua jornada patrimonial mês a mês com motivação e clareza."
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "Maratona Financeira -  sua jornada patrimonial em 42km" },
      { name: "description", content: "Acompanhe a evolução do seu patrimônio como uma maratona de 42 km: progresso por tempo, desempenho por consistência e projeções até a sua meta." },
      { property: "og:description", content: "Acompanhe a evolução do seu patrimônio como uma maratona de 42 km: progresso por tempo, desempenho por consistência e projeções até a sua meta." },
      { name: "twitter:description", content: "Acompanhe a evolução do seu patrimônio como uma maratona de 42 km: progresso por tempo, desempenho por consistência e projeções até a sua meta." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c502de61-ee4f-4590-b064-2751c8cbb204/id-preview-23eae086--5efa16d2-f7d7-4a2e-884f-9f680b23e0be.lovable.app-1778464397421.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c502de61-ee4f-4590-b064-2751c8cbb204/id-preview-23eae086--5efa16d2-f7d7-4a2e-884f-9f680b23e0be.lovable.app-1778464397421.png" }
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss
      },
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "/favicon.svg"
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const location = useLocation();
  const isOnboarding = location.pathname.startsWith("/onboarding");
  const isAuth = location.pathname.startsWith("/auth");
  const isPrivacy = location.pathname.startsWith("/privacidade");
  const isHome = location.pathname === "/";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(MaratonaProvider, { children: [
    isAuth || isPrivacy ? /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(AuthGate, { publicHome: isHome, children: isOnboarding ? /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(AppLayout, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { position: "top-center", richColors: true, theme: "dark" })
  ] }) });
}
function AuthGate({
  children,
  publicHome
}) {
  const { ready, user } = useAuth();
  if (!ready) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center text-muted-foreground text-sm", children: "Carregando…" });
  }
  if (!user) {
    if (publicHome) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Landing, {});
    }
    if (typeof window !== "undefined") {
      window.location.replace("/auth");
    }
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children });
}
const $$splitComponentImporter$7 = () => import("./privacidade-JpxzOrIj.mjs");
const Route$7 = createFileRoute("/privacidade")({
  head: () => ({
    meta: [{
      title: "Política de Privacidade — Maratona Financeira"
    }, {
      name: "description",
      content: "Política de Privacidade do Maratona Financeira: como coletamos, usamos e protegemos seus dados."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./onboarding-u06aVuq8.mjs");
objectType({
  dataNascimento: stringType().regex(/^\d{4}-\d{2}$/, "Informe mês e ano"),
  patrimonioInicial: coerce.number().min(0),
  rendaMensalDesejada: coerce.number().positive("Informe a renda mensal desejada"),
  taxaRetiradaPct: coerce.number().min(1).max(10),
  aporteMensal: coerce.number().min(0),
  taxaAnualPct: coerce.number().min(0).max(50),
  atualizaIpca: booleanType()
});
const Route$6 = createFileRoute("/onboarding")({
  head: () => ({
    meta: [{
      title: "Sua largada — Maratona Financeira"
    }, {
      name: "description",
      content: "Configure seu plano para começar a maratona patrimonial."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./historico-2Q4XFUe3.mjs");
const Route$5 = createFileRoute("/historico")({
  head: () => ({
    meta: [{
      title: "Histórico — Maratona Financeira"
    }, {
      name: "description",
      content: "Veja seu progresso histórico na maratona financeira."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./configuracoes-D-sfla3J.mjs");
const Route$4 = createFileRoute("/configuracoes")({
  head: () => ({
    meta: [{
      title: "Configurações — Maratona Financeira"
    }, {
      name: "description",
      content: "Edite seu plano, exporte ou importe dados."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./cenarios-BlyyJtuF.mjs");
const Route$3 = createFileRoute("/cenarios")({
  head: () => ({
    meta: [{
      title: "Cenários — Maratona Financeira"
    }, {
      name: "description",
      content: "Projeções conservador, esperado e otimista."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./auth-CqoWRN1U.mjs");
const Route$2 = createFileRoute("/auth")({
  head: () => ({
    meta: [{
      title: "Entrar — Maratona Financeira"
    }, {
      name: "description",
      content: "Acesse sua maratona financeira de qualquer dispositivo."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./atualizar-CEDOG9vc.mjs");
objectType({
  ref: stringType().regex(/^\d{4}-\d{2}$/),
  patrimonio: coerce.number().min(0),
  aportes: coerce.number()
});
const Route$1 = createFileRoute("/atualizar")({
  head: () => ({
    meta: [{
      title: "Atualizar mês — Maratona Financeira"
    }, {
      name: "description",
      content: "Registre o patrimônio do mês e avance na pista."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./index-CtRkB8BK.mjs");
const Route = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "Pista — Maratona Financeira"
    }, {
      name: "description",
      content: "Visualize seu progresso na maratona patrimonial."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const PrivacidadeRoute = Route$7.update({
  id: "/privacidade",
  path: "/privacidade",
  getParentRoute: () => Route$8
});
const OnboardingRoute = Route$6.update({
  id: "/onboarding",
  path: "/onboarding",
  getParentRoute: () => Route$8
});
const HistoricoRoute = Route$5.update({
  id: "/historico",
  path: "/historico",
  getParentRoute: () => Route$8
});
const ConfiguracoesRoute = Route$4.update({
  id: "/configuracoes",
  path: "/configuracoes",
  getParentRoute: () => Route$8
});
const CenariosRoute = Route$3.update({
  id: "/cenarios",
  path: "/cenarios",
  getParentRoute: () => Route$8
});
const AuthRoute = Route$2.update({
  id: "/auth",
  path: "/auth",
  getParentRoute: () => Route$8
});
const AtualizarRoute = Route$1.update({
  id: "/atualizar",
  path: "/atualizar",
  getParentRoute: () => Route$8
});
const IndexRoute = Route.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$8
});
const rootRouteChildren = {
  IndexRoute,
  AtualizarRoute,
  AuthRoute,
  CenariosRoute,
  ConfiguracoesRoute,
  HistoricoRoute,
  OnboardingRoute,
  PrivacidadeRoute
};
const routeTree = Route$8._addFileChildren(rootRouteChildren)._addFileTypes();
function DefaultErrorComponent({ error, reset }) {
  const router2 = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        className: "h-8 w-8 text-destructive",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        strokeWidth: 2,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            d: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          }
        )
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold tracking-tight text-foreground", children: "Something went wrong" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "An unexpected error occurred. Please try again." }),
    false,
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex items-center justify-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const getRouter = () => {
  const router2 = createRouter({
    routeTree,
    context: {},
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: DefaultErrorComponent
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  DEFAULT_TAXA_RETIRADA as D,
  MARATHON_KM as M,
  useAuth as a,
  cn as c,
  router as r,
  supabase as s,
  useMaratona as u
};
