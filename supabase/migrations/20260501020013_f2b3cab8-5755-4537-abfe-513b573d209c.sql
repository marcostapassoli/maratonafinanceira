
-- profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create policy "profiles select own" on public.profiles for select using (auth.uid() = id);
create policy "profiles insert own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles update own" on public.profiles for update using (auth.uid() = id);

-- plans (1 por usuário)
create table public.plans (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data_nascimento text not null,
  patrimonio_inicial numeric not null default 0,
  renda_mensal_desejada numeric not null default 5000,
  taxa_retirada numeric not null default 0.04,
  aporte_mensal numeric not null default 0,
  taxa_anual numeric not null default 0.1,
  data_inicio timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.plans enable row level security;

create policy "plans select own" on public.plans for select using (auth.uid() = user_id);
create policy "plans insert own" on public.plans for insert with check (auth.uid() = user_id);
create policy "plans update own" on public.plans for update using (auth.uid() = user_id);
create policy "plans delete own" on public.plans for delete using (auth.uid() = user_id);

-- entries (aportes/patrimônio mensal)
create table public.entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  ref text not null,
  patrimonio numeric not null default 0,
  aportes numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, ref)
);
alter table public.entries enable row level security;

create policy "entries select own" on public.entries for select using (auth.uid() = user_id);
create policy "entries insert own" on public.entries for insert with check (auth.uid() = user_id);
create policy "entries update own" on public.entries for update using (auth.uid() = user_id);
create policy "entries delete own" on public.entries for delete using (auth.uid() = user_id);

-- updated_at trigger function
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger trg_plans_updated before update on public.plans
  for each row execute function public.set_updated_at();
create trigger trg_entries_updated before update on public.entries
  for each row execute function public.set_updated_at();

-- auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
