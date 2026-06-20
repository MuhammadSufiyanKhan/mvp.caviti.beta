-- ============================================================
-- Caviti.io — Admin RLS policies
-- Allows admin users to view and manage all users
-- Run in Supabase SQL Editor
-- ============================================================

-- ADMIN POLICIES FOR PROFILES
-- Admin users can view ALL profiles (identified by admin function)
drop policy if exists "Admin can view all profiles" on public.profiles;
create policy "Admin can view all profiles"
on public.profiles for select
to authenticated
using (
  auth.jwt() ->> 'email' IN (
    SELECT TRIM(admin_email) 
    FROM (
      SELECT UNNEST(STRING_TO_ARRAY(CURRENT_SETTING('app.admin_emails', true), ',')) as admin_email
    ) t
  )
);

-- Admin users can update user status (ban/unban)
drop policy if exists "Admin can update user status" on public.profiles;
create policy "Admin can update user status"
on public.profiles for update
to authenticated
using (
  auth.jwt() ->> 'email' IN (
    SELECT TRIM(admin_email) 
    FROM (
      SELECT UNNEST(STRING_TO_ARRAY(CURRENT_SETTING('app.admin_emails', true), ',')) as admin_email
    ) t
  )
)
with check (
  auth.jwt() ->> 'email' IN (
    SELECT TRIM(admin_email) 
    FROM (
      SELECT UNNEST(STRING_TO_ARRAY(CURRENT_SETTING('app.admin_emails', true), ',')) as admin_email
    ) t
  )
);

-- ADMIN POLICIES FOR PAYMENTS
-- Admin users can view ALL payments
drop policy if exists "Admin can view all payments" on public.payments;
create policy "Admin can view all payments"
on public.payments for select
to authenticated
using (
  auth.jwt() ->> 'email' IN (
    SELECT TRIM(admin_email) 
    FROM (
      SELECT UNNEST(STRING_TO_ARRAY(CURRENT_SETTING('app.admin_emails', true), ',')) as admin_email
    ) t
  )
);

-- ADMIN POLICIES FOR NOTIFICATIONS
-- Admin users can view ALL notifications
drop policy if exists "Admin can view all notifications" on public.notifications;
create policy "Admin can view all notifications"
on public.notifications for select
to authenticated
using (
  auth.jwt() ->> 'email' IN (
    SELECT TRIM(admin_email) 
    FROM (
      SELECT UNNEST(STRING_TO_ARRAY(CURRENT_SETTING('app.admin_emails', true), ',')) as admin_email
    ) t
  )
);
