-- ============================================================
-- Caviti.io — Admin dashboard schema upgrade (copy/paste)
-- Creates: plans, subscriptions, payments, notifications
-- Updates: public.profiles (adds missing admin fields)
-- Note: Uses only existing tables: public.profiles, public.report
-- ============================================================

begin;

-- -----------------------------
-- 1) Update profiles table
-- -----------------------------
alter table public.profiles
  add column if not exists full_name text;

alter table public.profiles
  add column if not exists status text not null default 'active';

alter table public.profiles
  add column if not exists last_active_at timestamp with time zone;

alter table public.profiles
  add column if not exists total_analyses_done integer not null default 0;

-- Keep subscription fields that already exist:
-- subscription_status, remaining_trials, whatsapp_number, plan_type, trial_expiry

-- -----------------------------
-- 2) Create plans
-- -----------------------------
create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  plan_key text not null unique, -- free/basic/pro
  name text not null,
  monthly_price_cents integer not null default 0,
  is_active boolean not null default true,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create index if not exists plans_plan_key_idx on public.plans(plan_key);

-- -----------------------------
-- 3) Create subscriptions
-- -----------------------------
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id uuid not null references public.plans(id) on delete restrict,
  status text not null default 'active', -- active/canceled/past_due
  started_at timestamp with time zone not null default now(),
  current_period_end timestamp with time zone,
  canceled_at timestamp with time zone,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  unique (user_id, plan_id)
);

create index if not exists subscriptions_user_id_idx on public.subscriptions(user_id);
create index if not exists subscriptions_status_idx on public.subscriptions(status);

-- -----------------------------
-- 4) Create payments
-- -----------------------------
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id uuid references public.plans(id) on delete set null,
  amount_cents integer not null default 0,
  currency text not null default 'USD',
  status text not null default 'pending', -- paid/pending/failed
  payment_date timestamp with time zone not null default now(),
  provider text, -- stripe, etc.
  provider_payment_id text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create index if not exists payments_user_id_idx on public.payments(user_id);
create index if not exists payments_status_idx on public.payments(status);
create index if not exists payments_payment_date_idx on public.payments(payment_date);

-- -----------------------------
-- 5) Create notifications
-- -----------------------------
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  message text not null,
  level text not null default 'info', -- info/success/error
  is_read boolean not null default false,
  created_at timestamp with time zone not null default now(),
  read_at timestamp with time zone
);

create index if not exists notifications_user_id_idx on public.notifications(user_id);
create index if not exists notifications_is_read_idx on public.notifications(is_read);
create index if not exists notifications_created_at_idx on public.notifications(created_at);

-- -----------------------------
-- 6) Enable RLS
-- -----------------------------
alter table public.plans enable row level security;
alter table public.subscriptions enable row level security;
alter table public.payments enable row level security;
alter table public.notifications enable row level security;

-- -----------------------------
-- 7) RLS policies (basic user access)
-- -----------------------------
-- Users can read their own subscription/payment/notifications.
-- Admin access can be added separately in your admin policies file.

-- SUBSCRIPTIONS
drop policy if exists "Users read own subscriptions" on public.subscriptions;
create policy "Users read own subscriptions"
on public.subscriptions for select
to authenticated
using (auth.uid() = user_id);

-- PAYMENTS
drop policy if exists "Users read own payments" on public.payments;
create policy "Users read own payments"
on public.payments for select
to authenticated
using (auth.uid() = user_id);

-- NOTIFICATIONS
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

-- PLANS (public read)
-- If you want only authenticated to see plans, change to `to authenticated`.
drop policy if exists "Public read plans" on public.plans;
create policy "Public read plans"
on public.plans for select
to authenticated
using (true);

commit;

-- -----------------------------
-- 8) Seed default plans (idempotent)
-- -----------------------------
insert into public.plans (plan_key, name, monthly_price_cents, is_active)
values
  ('free', 'Free', 0, false),
  ('basic', 'Basic', 9900, true),
  ('pro', 'Pro', 19900, true)
on conflict (plan_key) do nothing;

