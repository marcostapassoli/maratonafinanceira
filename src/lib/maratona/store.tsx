import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { DEFAULT_TAXA_RETIRADA, STORAGE_KEY, type AppData, type MonthEntry, type Plan } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./auth";
import { aplicarReajustesIpca } from "./ipca";

type Ctx = {
  data: AppData | null;
  ready: boolean;
  hasPlan: boolean;
  setPlan: (plan: Plan) => void;
  updatePlan: (patch: Partial<Plan>) => void;
  addEntry: (entry: MonthEntry) => void;
  addEntries: (entries: MonthEntry[]) => void;
  updateEntry: (ref: string, patch: Partial<MonthEntry>) => void;
  deleteEntry: (ref: string) => void;
  importJson: (json: string) => boolean;
  reset: () => void;
};

const MaratonaContext = createContext<Ctx | null>(null);

function loadLocal(): AppData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== 1) return null;
    const p = parsed.plan;
    if (p && !p.dataNascimento && typeof p.idadeAtual === "number") {
      const now = new Date();
      const y = now.getFullYear() - Math.round(p.idadeAtual);
      p.dataNascimento = `${y}-${String(now.getMonth() + 1).padStart(2, "0")}`;
      delete p.idadeAtual;
      delete p.idadeMeta;
    }
    if (p && typeof p.rendaMensalDesejada !== "number") {
      const taxa = typeof p.taxaRetirada === "number" ? p.taxaRetirada : DEFAULT_TAXA_RETIRADA;
      const meta = typeof p.metaPatrimonio === "number" ? p.metaPatrimonio : 0;
      p.taxaRetirada = taxa;
      p.rendaMensalDesejada = meta > 0 ? Math.round((meta * taxa) / 12) : 5000;
      delete p.metaPatrimonio;
    }
    return parsed as AppData;
  } catch {
    return null;
  }
}

function saveLocal(d: AppData | null) {
  try {
    if (d) localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* noop */
  }
}

function sortEntries(entries: MonthEntry[]): MonthEntry[] {
  return [...entries].sort((a, b) => a.ref.localeCompare(b.ref));
}

function planFromRow(row: any): Plan {
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
    eventos: Array.isArray(row.eventos) ? row.eventos : [],
  };
}

function planToRow(userId: string, plan: Plan) {
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
    eventos: plan.eventos ?? [],
  };
}

export function MaratonaProvider({ children }: { children: ReactNode }) {
  const { user, ready: authReady } = useAuth();
  const [data, setData] = useState<AppData | null>(null);
  const [ready, setReady] = useState(false);
  const migratedRef = useRef<string | null>(null);

  // Carrega dados quando o estado de auth muda.
  useEffect(() => {
    if (!authReady) return;

    if (!user) {
      // Sem login: usa localStorage.
      setData(loadLocal());
      setReady(true);
      return;
    }

    let active = true;
    setReady(false);

    (async () => {
      // Se houver dados locais e ainda não migramos para esse usuário, faz upload.
      const local = loadLocal();
      if (local && migratedRef.current !== user.id) {
        migratedRef.current = user.id;
        const { data: existing } = await supabase
          .from("plans")
          .select("user_id")
          .eq("user_id", user.id)
          .maybeSingle();
        if (!existing) {
          await supabase.from("plans").upsert(planToRow(user.id, local.plan));
          if (local.entries.length) {
            await supabase.from("entries").upsert(
              local.entries.map((e) => ({
                user_id: user.id,
                ref: e.ref,
                patrimonio: e.patrimonio,
                aportes: e.aportes,
              })),
              { onConflict: "user_id,ref" },
            );
          }
        }
        // Limpa localStorage após migrar para evitar re-migração em outro login.
        saveLocal(null);
      }

      const [{ data: planRow }, { data: entryRows }] = await Promise.all([
        supabase.from("plans").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("entries").select("ref, patrimonio, aportes").eq("user_id", user.id),
      ]);

      if (!active) return;

      if (planRow) {
        const plan = planFromRow(planRow);
        const entries = sortEntries(
          (entryRows ?? []).map((e: any) => ({
            ref: e.ref,
            patrimonio: Number(e.patrimonio) || 0,
            aportes: Number(e.aportes) || 0,
          })),
        );
        setData({
          version: 1,
          plan,
          entries,
          createdAt: planRow.created_at ?? new Date().toISOString(),
          updatedAt: planRow.updated_at ?? new Date().toISOString(),
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

  // Persiste localmente apenas quando deslogado.
  useEffect(() => {
    if (!authReady) return;
    if (!user && data) saveLocal(data);
  }, [data, user, authReady]);

  // Reajuste automático da renda mensal desejada pelo IPCA do(s) ano(s) anterior(es).
  // Roda sempre que o plano é carregado/alterado. Usa a série oficial 433 do BCB (IPCA IBGE).
  useEffect(() => {
    if (!ready || !data?.plan) return;
    const plan = data.plan;
    if (plan.atualizaIpca === false) return;
    let cancelled = false;
    (async () => {
      const r = await aplicarReajustesIpca(
        plan.rendaMensalDesejada,
        plan.ultimoAjusteIpcaAno ?? null,
        plan.dataInicio,
      );
      if (cancelled || !r) return;
      setData((prev) => {
        if (!prev) return prev;
        const next: AppData = {
          ...prev,
          plan: {
            ...prev.plan,
            rendaMensalDesejada: r.renda,
            ultimoAjusteIpcaAno: r.ano,
          },
          updatedAt: new Date().toISOString(),
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

  const setPlan = useCallback(
    (plan: Plan) => {
      const now = new Date().toISOString();
      setData((prev) => ({
        version: 1,
        plan,
        entries: prev?.entries ?? [],
        createdAt: prev?.createdAt ?? now,
        updatedAt: now,
      }));
      if (user) {
        supabase.from("plans").upsert(planToRow(user.id, plan)).then(({ error }) => {
          if (error) console.error("plan upsert", error);
        });
      }
    },
    [user],
  );

  const updatePlan = useCallback(
    (patch: Partial<Plan>) => {
      setData((prev) => {
        if (!prev) return prev;
        const next = { ...prev, plan: { ...prev.plan, ...patch }, updatedAt: new Date().toISOString() };
        if (user) {
          supabase.from("plans").upsert(planToRow(user.id, next.plan)).then(({ error }) => {
            if (error) console.error("plan upsert", error);
          });
        }
        return next;
      });
    },
    [user],
  );

  const addEntry = useCallback(
    (entry: MonthEntry) => {
      setData((prev) => {
        if (!prev) return prev;
        const others = prev.entries.filter((e) => e.ref !== entry.ref);
        return { ...prev, entries: sortEntries([...others, entry]), updatedAt: new Date().toISOString() };
      });
      if (user) {
        supabase
          .from("entries")
          .upsert(
            { user_id: user.id, ref: entry.ref, patrimonio: entry.patrimonio, aportes: entry.aportes },
            { onConflict: "user_id,ref" },
          )
          .then(({ error }) => {
            if (error) console.error("entry upsert", error);
          });
      }
    },
    [user],
  );

  const addEntries = useCallback(
    (incoming: MonthEntry[]) => {
      if (!incoming.length) return;
      setData((prev) => {
        if (!prev) return prev;
        const map = new Map(prev.entries.map((e) => [e.ref, e] as const));
        for (const e of incoming) map.set(e.ref, e);
        return {
          ...prev,
          entries: sortEntries(Array.from(map.values())),
          updatedAt: new Date().toISOString(),
        };
      });
      if (user) {
        supabase
          .from("entries")
          .upsert(
            incoming.map((e) => ({
              user_id: user.id,
              ref: e.ref,
              patrimonio: e.patrimonio,
              aportes: e.aportes,
            })),
            { onConflict: "user_id,ref" },
          )
          .then(({ error }) => {
            if (error) console.error("entries bulk upsert", error);
          });
      }
    },
    [user],
  );

  const updateEntry = useCallback(
    (ref: string, patch: Partial<MonthEntry>) => {
      setData((prev) => {
        if (!prev) return prev;
        const entries = prev.entries.map((e) => (e.ref === ref ? { ...e, ...patch } : e));
        const updated = entries.find((e) => e.ref === ref);
        if (user && updated) {
          supabase
            .from("entries")
            .upsert(
              { user_id: user.id, ref, patrimonio: updated.patrimonio, aportes: updated.aportes },
              { onConflict: "user_id,ref" },
            )
            .then(({ error }) => {
              if (error) console.error("entry update", error);
            });
        }
        return { ...prev, entries: sortEntries(entries), updatedAt: new Date().toISOString() };
      });
    },
    [user],
  );

  const deleteEntry = useCallback(
    (ref: string) => {
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          entries: prev.entries.filter((e) => e.ref !== ref),
          updatedAt: new Date().toISOString(),
        };
      });
      if (user) {
        supabase.from("entries").delete().eq("user_id", user.id).eq("ref", ref).then(({ error }) => {
          if (error) console.error("entry delete", error);
        });
      }
    },
    [user],
  );

  const importJson = useCallback(
    (json: string) => {
      try {
        const parsed = JSON.parse(json);
        if (!parsed || parsed.version !== 1 || !parsed.plan || !Array.isArray(parsed.entries)) {
          return false;
        }
        const next: AppData = { ...parsed, updatedAt: new Date().toISOString() };
        setData(next);
        if (user) {
          supabase.from("plans").upsert(planToRow(user.id, next.plan));
          if (next.entries.length) {
            supabase.from("entries").upsert(
              next.entries.map((e) => ({
                user_id: user.id,
                ref: e.ref,
                patrimonio: e.patrimonio,
                aportes: e.aportes,
              })),
              { onConflict: "user_id,ref" },
            );
          }
        }
        return true;
      } catch {
        return false;
      }
    },
    [user],
  );

  const reset = useCallback(() => {
    setData(null);
    if (typeof window !== "undefined") localStorage.removeItem(STORAGE_KEY);
    if (user) {
      supabase.from("entries").delete().eq("user_id", user.id);
      supabase.from("plans").delete().eq("user_id", user.id);
    }
  }, [user]);

  const value = useMemo<Ctx>(
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
      reset,
    }),
    [data, ready, setPlan, updatePlan, addEntry, addEntries, updateEntry, deleteEntry, importJson, reset],
  );

  return <MaratonaContext.Provider value={value}>{children}</MaratonaContext.Provider>;
}

export function useMaratona() {
  const ctx = useContext(MaratonaContext);
  if (!ctx) throw new Error("useMaratona must be used within MaratonaProvider");
  return ctx;
}
