/*
# Recreate full database schema (profiles, plans, entries)

This migration recreates all tables the Maratona Financeira app uses,
in a single idempotent script. Designed for a fresh/empty Supabase database.

## Tables

1. **profiles** — user display info, auto-created on signup via trigger.
   - `id` (uuid PK, references auth.users, cascade delete)
   - `display_name` (text, optional)
   - `created_at`, `updated_at` (timestamptz, auto-maintained)

2. **plans** — one financial plan per user (1:1 with auth.users).
   - `user_id` (uuid PK, references auth.users, cascade delete, defaults to auth.uid())
   - `data_nascimento` (text, "YYYY-MM")
   - `patrimonio_inicial` (numeric)
   - `renda_mensal_desejada` (numeric, monthly passive income target)
   - `taxa_retirada` (numeric, safe withdrawal rate, e.g. 0.04)
   - `aporte_mensal` (numeric, monthly contribution)
   - `taxa_anual` (numeric, expected annual return, e.g. 0.10)
   - `data_inicio` (timestamptz, plan start date)
   - `atualiza_ipca` (boolean, auto-adjust target by IPCA)
   - `ultimo_ajuste_ipca_ano` (integer, last year IPCA was applied)
   - `aporte_schedule` (jsonb, schedule of contribution changes)
   - `eventos` (jsonb, one-off events like bonuses/withdrawals)
   - `created_at`, `updated_at`

3. **entries** — monthly patrimony snapshots (many per user).
   - `id` (uuid PK)
   - `user_id` (uuid, references auth.users, cascade delete, defaults to auth.uid())
   - `ref` (text, "YYYY-MM")
   - `patrimonio` (numeric, total assets at month-end)
   - `aportes` (numeric, amount contributed that month)
   - `created_at`, `updated_at`
   - Unique constraint on (user_id, ref)

## Security (RLS)

All tables have RLS enabled with 4 policies each (SELECT/INSERT/UPDATE/DELETE),
scoped to `TO authenticated` with `auth.uid()` ownership checks.
This is a multi-user app with a sign-in screen.

## Triggers

- `set_updated_at()` — auto-updates `updated_at` on row modification (SECURITY INVOKER, revoked from public/anon/authenticated).
- `handle_new_user()` — auto-creates a profile row when a new auth user signs up (SECURITY DEFINER, revoked from public/anon/authenticated).
*/

-- ============================================================
-- profiles
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles select own" ON public.profiles;
CREATE POLICY "profiles select own" ON public.profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles insert own" ON public.profiles;
CREATE POLICY "profiles insert own" ON public.profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles update own" ON public.profiles;
CREATE POLICY "profiles update own" ON public.profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles delete own" ON public.profiles;
CREATE POLICY "profiles delete own" ON public.profiles FOR DELETE
  TO authenticated USING (auth.uid() = id);

-- ============================================================
-- plans (1 per user)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.plans (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  data_nascimento text NOT NULL,
  patrimonio_inicial numeric NOT NULL DEFAULT 0,
  renda_mensal_desejada numeric NOT NULL DEFAULT 5000,
  taxa_retirada numeric NOT NULL DEFAULT 0.04,
  aporte_mensal numeric NOT NULL DEFAULT 0,
  taxa_anual numeric NOT NULL DEFAULT 0.1,
  data_inicio timestamptz NOT NULL DEFAULT now(),
  atualiza_ipca boolean NOT NULL DEFAULT true,
  ultimo_ajuste_ipca_ano integer,
  aporte_schedule jsonb NOT NULL DEFAULT '[]'::jsonb,
  eventos jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "plans select own" ON public.plans;
CREATE POLICY "plans select own" ON public.plans FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "plans insert own" ON public.plans;
CREATE POLICY "plans insert own" ON public.plans FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "plans update own" ON public.plans;
CREATE POLICY "plans update own" ON public.plans FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "plans delete own" ON public.plans;
CREATE POLICY "plans delete own" ON public.plans FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- entries (monthly patrimony snapshots)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  ref text NOT NULL,
  patrimonio numeric NOT NULL DEFAULT 0,
  aportes numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, ref)
);
ALTER TABLE public.entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "entries select own" ON public.entries;
CREATE POLICY "entries select own" ON public.entries FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "entries insert own" ON public.entries;
CREATE POLICY "entries insert own" ON public.entries FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "entries update own" ON public.entries;
CREATE POLICY "entries update own" ON public.entries FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "entries delete own" ON public.entries;
CREATE POLICY "entries delete own" ON public.entries FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- updated_at trigger function (SECURITY INVOKER)
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.set_updated_at() FROM public, anon, authenticated;

DROP TRIGGER IF EXISTS trg_profiles_updated ON public.profiles;
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_plans_updated ON public.plans;
CREATE TRIGGER trg_plans_updated BEFORE UPDATE ON public.plans
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_entries_updated ON public.entries;
CREATE TRIGGER trg_entries_updated BEFORE UPDATE ON public.entries
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- Auto-create profile on signup (SECURITY DEFINER)
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM public, anon, authenticated;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();