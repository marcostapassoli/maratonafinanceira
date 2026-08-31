/*
# Recreate full database schema on new Supabase project

Creates all 3 tables the Maratona Financeira app needs: profiles, plans, entries.
Each table has RLS enabled with 4 owner-scoped policies (SELECT/INSERT/UPDATE/DELETE).
Includes updated_at triggers and auto-profile-creation on signup.

## Tables

1. **profiles** — user display info, auto-created on signup via trigger.
   - id (uuid PK, references auth.users, cascade delete)
   - display_name (text)
   - created_at, updated_at (timestamptz)

2. **plans** — one financial plan per user.
   - user_id (uuid PK, references auth.users, defaults to auth.uid())
   - data_nascimento, patrimonio_inicial, renda_mensal_desejada, taxa_retirada,
     aporte_mensal, taxa_anual, data_inicio, atualiza_ipca, ultimo_ajuste_ipca_ano,
     aporte_schedule (jsonb), eventos (jsonb)
   - created_at, updated_at

3. **entries** — monthly patrimony snapshots (many per user).
   - id (uuid PK), user_id (uuid, defaults to auth.uid()), ref, patrimonio, aportes
   - Unique (user_id, ref)
   - created_at, updated_at

## Security
- RLS enabled on all tables, scoped to authenticated users with auth.uid() ownership checks.
- 4 policies per table (SELECT/INSERT/UPDATE/DELETE).
- Trigger functions are SECURITY INVOKER / SECURITY DEFINER with revoked public access.
*/

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

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path = public
AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
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

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM public, anon, authenticated;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();