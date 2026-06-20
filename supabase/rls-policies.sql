-- ============================================================
-- Caviti.io — Supabase RLS policies for reports & profiles
-- Run in Supabase SQL Editor to verify / apply
-- ============================================================

-- PROFILES
alter table public.profiles enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
on public.profiles for select
to authenticated
using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- REPORTS
alter table public.reports enable row level security;

drop policy if exists "Users can view own reports" on public.reports;
create policy "Users can view own reports"
on public.reports for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own reports" on public.reports;
create policy "Users can insert own reports"
on public.reports for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own reports" on public.reports;
create policy "Users can update own reports"
on public.reports for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own reports" on public.reports;
create policy "Users can delete own reports"
on public.reports for delete
to authenticated
using (auth.uid() = user_id);

-- Note: /api/analyze uses the service role key for inserts and trial
-- decrements. Client-side reads/deletes use the authenticated user session.
