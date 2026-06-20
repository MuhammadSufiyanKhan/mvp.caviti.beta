-- ============================================================
-- Caviti.io — Admin dashboard schema additions (copy/paste)
-- Creates: public.plans, public.payments, public.notifications
-- Updates: public.profiles (email, full_name, status)
--
-- Assumptions based on your DB:
-- - public.profiles already exists with columns: id, subscription_status,
--   remaining_trials, created_at, updated_at, whatsapp_number
-- - public.reports (plural) exists
--
-- Run ONE script in Supabase SQL Editor.
-- ============================================================

begin;

-- -----------------------------
-- 1) Update profiles
-- -----------------------------
-- Email (from auth.users) is often copied into profiles for easier admin.
alter table public.profiles
  add column if not exists email text;

alter table public.profiles
  add column if not exists full_name text;

-- status: Active/Banned
alter table public.profiles
  add column if not exists status text not null default 'active';

-- Optional indexes
create index if not exists profiles_status_idx on public.profiles(status);

-- -----------------------------
-- 2) Create plans
-- -----------------------------
create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  plan_key text not null unique,
  name text not null,
  monthly_price_cents integer not null default 0,
  is_active boolean not null default true,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create index if not exists plans_plan_key_idx on public.plans(plan_key);

-- -----------------------------
-- 3) Create payments
-- -----------------------------
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id uuid references public.plans(id) on delete set null,
  amount_cents integer not null default 0,
  currency text not null default 'USD',
  status text not null default 'pending', -- paid/pending/failed
  payment_date timestamp with time zone not null default now(),
  provider text,
  provider_payment_id text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create index if not exists payments_user_id_idx on public.payments(user_id);
create index if not exists payments_status_idx on public.payments(status);
create index if not exists payments_payment_date_idx on public.payments(payment_date);

-- -----------------------------
-- 4) Create notifications
-- -----------------------------
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  message text not null,
  level text not null default 'info',
  is_read boolean not null default false,
  created_at timestamp with time zone not null default now(),
  read_at timestamp with time zone
);

create index if not exists notifications_user_id_idx on public.notifications(user_id);
create index if not exists notifications_is_read_idx on public.notifications(is_read);
create index if not exists notifications_created_at_idx on public.notifications(created_at);

-- -----------------------------
-- 5) Enable RLS
-- -----------------------------
alter table public.plans enable row level security;
alter table public.payments enable row level security;
alter table public.notifications enable row level security;

-- -----------------------------
-- 6) RLS policies (baseline user access)
-- -----------------------------
-- Users can read their own payments
alter table public.payments force row level security;

drop policy if exists "Users read own payments" on public.payments;
create policy "Users read own payments"
on public.payments for select
to authenticated
using (auth.uid() = user_id);

-- Users can update notifications read status for themselves
alter table public.notifications force row level security;

drop policy if exists "Users read own notifications" on public.notifications;
create policy "Users read own notifications"
on public.notifications for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users update own notifications" on public.notifications;
create policy "Users update own notifications"
on public.notifications for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Plans are readable by authenticated users (admin can still restrict via additional policies)
drop policy if exists "Plans readable by authenticated" on public.plans;
create policy "Plans readable by authenticated"
on public.plans for select
to authenticated
using (true);

-- -----------------------------
-- 7) Seed default plans (idempotent)
-- -----------------------------
insert into public.plans (plan_key, name, monthly_price_cents, is_active)
values
  ('free', 'Free', 0, false),
  ('basic', 'Basic', 9900, true),
  ('pro', 'Pro', 19900, true)
on conflict (plan_key) do nothing;

commit;

