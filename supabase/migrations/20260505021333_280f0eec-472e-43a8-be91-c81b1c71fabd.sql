ALTER TABLE public.plans
  ADD COLUMN IF NOT EXISTS atualiza_ipca boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS ultimo_ajuste_ipca_ano integer;