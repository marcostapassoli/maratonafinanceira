ALTER TABLE public.plans
  ADD COLUMN IF NOT EXISTS aporte_schedule jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS eventos jsonb NOT NULL DEFAULT '[]'::jsonb;