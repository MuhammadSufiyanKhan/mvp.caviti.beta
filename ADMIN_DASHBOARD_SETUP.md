# Admin Dashboard Setup Guide

## Overview
The admin dashboard has been enhanced with full user management capabilities. Here's what's been added and what you need to do to activate it.

## Changes Made

### 1. **API Endpoints Created**
- `POST /api/admin/ban-user` - Ban or unban users
- `GET /api/admin/users/[userId]` - View user details and payment history

### 2. **UI Improvements**
- View button now shows full user details including:
  - Profile information
  - Payment history
  - Number of reports generated
  - Contact information
- Ban/Unban button now fully functional with real backend integration
- Loading states and error handling

### 3. **Database Policies Created** (in `/supabase/admin-policies.sql`)
- Admin RLS policies for profiles, payments, and notifications tables
- Allows admin users (defined via ADMIN_EMAILS env var) to view and manage all users

## Setup Steps

### Step 1: Set Admin Email in Environment Variables
Add your admin email to `.env.local`:
```
ADMIN_EMAILS=admin@example.com,another-admin@example.com
```

### Step 2: Apply Database Policies (IMPORTANT!)
You MUST run the admin policies SQL in your Supabase database:
1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste the contents of `/supabase/admin-policies.sql`
3. Click "Run" to apply the policies

**Note**: The policies use `app.admin_emails` setting which requires SET in code, so they're simplified. A simpler approach:

### Step 3: Alternative - Simpler Admin Check via Custom Claim
If you want a more robust admin system, consider:
1. Creating an admin table in Supabase
2. Using JWT custom claims for admin status
3. Updating RLS policies to check the custom claim

For now, the email-based approach works.

## Features

### Admin Dashboard - Users Page
- **Search**: Filter users by name or email
- **View Details**: Click "View" to see:
  - Full user profile
  - Subscription status
  - Account status (Active/Banned)
  - Payment history
  - Total reports generated
  - WhatsApp contact link
- **Ban/Unban**: Toggle user account status instantly
- **Real-time Updates**: Changes appear immediately

### Access Control
- Only users with email in `ADMIN_EMAILS` can access
- Admin email validation happens server-side in middleware
- Database RLS policies enforce data access rules

## Testing

### Test Ban/Unban Feature
1. Log in as admin (email in ADMIN_EMAILS)
2. Go to Admin Dashboard → Users
3. Click "View" on any user
4. Click "Ban User" button
5. User status should change to "Banned"
6. Click "Unban User" to restore access

### Test User Details
1. Click "View" button on any user
2. Verify you can see:
   - All profile fields (name, email, phone, plan)
   - Recent payments with amounts and dates
   - Account creation date
   - Current account status

## Troubleshooting

### "Unauthorized" when viewing users
- **Issue**: ADMIN_EMAILS not set or incorrect
- **Fix**: Double-check email in `.env.local` and restart dev server

### Users page shows no data
- **Issue**: RLS policies not applied to database
- **Fix**: Run `/supabase/admin-policies.sql` in Supabase dashboard

### Ban button doesn't work
- **Issue**: API endpoint or database access issue
- **Fix**: Check browser console for errors, verify admin email is set

### Payment history shows empty
- **Issue**: No payments recorded yet or RLS policies blocking access
- **Fix**: Create a test payment first, ensure policies are applied

## Next Steps (Optional Enhancements)

1. **User Statistics Dashboard**
   - Total revenue per user
   - Reports trend
   - Subscription retention

2. **Bulk Operations**
   - Ban multiple users at once
   - Export user list as CSV
   - Send bulk notifications

3. **Admin Activity Log**
   - Track when admins ban/unban users
   - Log all admin actions
   - Create audit trail

4. **Advanced Filtering**
   - Filter by subscription status
   - Filter by date range
   - Filter by payment status

## Database Schema Notes

### Profiles Table
```sql
- id: uuid (primary key)
- email: text
- full_name: text
- whatsapp_number: text
- subscription_status: text
- status: text ('active' or 'banned')
- created_at: timestamp
```

### Payments Table
```sql
- id: uuid
- user_id: uuid (foreign key to auth.users)
- amount_cents: integer
- currency: text
- status: text ('paid', 'pending', 'failed')
- payment_date: timestamp
```

## Security Notes

- ✅ Admin check happens on both client and server
- ✅ Database RLS policies enforce access control
- ✅ No sensitive data exposed to non-admins
- ✅ All admin actions are logged in browser console
- ⚠️ Consider adding audit logging for compliance
