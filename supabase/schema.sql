-- VivaClub: esquema inicial para Supabase/PostgreSQL.
-- Revise políticas e regras com um profissional antes de colocar dinheiro real em produção.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Membro VivaClub',
  birth_date date,
  age_verified_at timestamptz,
  referral_code text unique,
  referred_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  constraint adults_only check (birth_date is null or birth_date <= current_date - interval '18 years')
);

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  budget_cents bigint not null default 0 check (budget_cents >= 0),
  status text not null default 'draft' check (status in ('draft','active','paused','closed')),
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references public.campaigns(id) on delete set null,
  title text not null,
  description text,
  reward_cents bigint not null default 0 check (reward_cents >= 0),
  status text not null default 'draft' check (status in ('draft','active','paused','closed')),
  created_at timestamptz not null default now()
);

create table if not exists public.task_submissions (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id),
  user_id uuid not null references public.profiles(id),
  proof_url text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  unique(task_id, user_id)
);

-- Ledger imutável: créditos e débitos devem ser lançados pelo backend confiável.
create table if not exists public.wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id),
  amount_cents bigint not null check (amount_cents <> 0),
  kind text not null check (kind in ('task_reward','campaign_reward','live_gift','referral_reward','withdrawal','adjustment')),
  status text not null default 'pending' check (status in ('pending','available','reversed')),
  description text,
  reference_id uuid,
  created_at timestamptz not null default now()
);

create table if not exists public.withdrawal_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id),
  amount_cents bigint not null check (amount_cents > 0),
  status text not null default 'requested' check (status in ('requested','under_review','approved','paid','rejected','cancelled')),
  provider_reference text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  inviter_id uuid not null references public.profiles(id),
  invited_id uuid not null unique references public.profiles(id),
  qualifying_action text,
  status text not null default 'registered' check (status in ('registered','qualified','rewarded','rejected')),
  created_at timestamptz not null default now()
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id),
  target_user_id uuid references public.profiles(id),
  category text not null,
  details text,
  status text not null default 'open' check (status in ('open','reviewing','resolved','dismissed')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.campaigns enable row level security;
alter table public.tasks enable row level security;
alter table public.task_submissions enable row level security;
alter table public.wallet_transactions enable row level security;
alter table public.withdrawal_requests enable row level security;
alter table public.referrals enable row level security;
alter table public.reports enable row level security;

-- Políticas iniciais de leitura. Escritas financeiras devem passar por Edge Function/API segura.
create policy "profiles read own" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "profiles update own" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
create policy "active campaigns readable" on public.campaigns for select to authenticated using (status = 'active');
create policy "active tasks readable" on public.tasks for select to authenticated using (status = 'active');
create policy "submissions read own" on public.task_submissions for select to authenticated using (auth.uid() = user_id);
create policy "submissions create own" on public.task_submissions for insert to authenticated with check (auth.uid() = user_id);
create policy "wallet read own" on public.wallet_transactions for select to authenticated using (auth.uid() = user_id);
create policy "withdrawals read own" on public.withdrawal_requests for select to authenticated using (auth.uid() = user_id);
create policy "withdrawals request own" on public.withdrawal_requests for insert to authenticated with check (auth.uid() = user_id);
create policy "referrals read own" on public.referrals for select to authenticated using (auth.uid() = inviter_id or auth.uid() = invited_id);
create policy "reports create own" on public.reports for insert to authenticated with check (auth.uid() = reporter_id);

-- Importante:
-- 1) Não conceda ao navegador a chave service_role.
-- 2) Não permita que o usuário altere diretamente seu saldo.
-- 3) Criar RPC/Edge Functions com validação de orçamento, antifraude e idempotência.
-- 4) Definir retenção, consentimento, política de privacidade e termos antes do lançamento.
