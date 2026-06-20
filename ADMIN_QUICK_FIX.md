# Admin Dashboard - Quick Fix Guide

## The Issue
You're seeing "Failed to fetch user details" error. This is a **configuration issue**, not a code issue.

## The Solution (3 Easy Steps)

### Step 1: Get Your Supabase Service Role Key
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings → API**
4. Copy the **Service Role Key** (marked with "SECRET - DO NOT EXPOSE")

### Step 2: Add to `.env.local`
Open `.env.local` in your project root and add:
```
ADMIN_EMAILS=your-email@example.com
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Replace:**
- `your-email@example.com` with your admin email
- `your-service-role-key-here` with the key from Step 1

### Step 3: Restart Dev Server
Stop your dev server (Ctrl+C) and restart it:
```
npm run dev
```

## Testing

1. Open browser console (F12) and check for logs starting with `[Admin API]` or `[Ban User API]`
2. Click "View" on a user
3. Check for one of these in the console:
   - ✅ Success: You'll see `[Admin API] Profile fetch - Error: null`
   - ❌ Error: You'll see `[Admin API] Error`, look at the details

## Common Errors & Fixes

### Error: "No admin users configured"
**Problem:** ADMIN_EMAILS env var not set
**Fix:** Set ADMIN_EMAILS in `.env.local` and restart server

### Error: "Unauthorized - Not admin"
**Problem:** Your email doesn't match ADMIN_EMAILS
**Fix:** Make sure email in ADMIN_EMAILS exactly matches your auth email

### Error: "User not found"
**Problem:** Service role key not working or profile doesn't exist
**Fix:** Verify SUPABASE_SERVICE_ROLE_KEY is set correctly

### Error in console: "SUPABASE_SERVICE_ROLE_KEY is required"
**Problem:** Service role key missing
**Fix:** Add SUPABASE_SERVICE_ROLE_KEY to `.env.local` and restart

## Debug Mode

To see detailed logs:
1. Open browser Console (F12)
2. Look for messages starting with `[Admin API]` or `[Ban User API]`
3. These will show:
   - Current user email
   - Whether user is admin
   - Query results with error details

## Security Notes

- ✅ Service role key is kept in `.env.local` (never exposed to client)
- ✅ Admin email check happens server-side
- ✅ Never commit `.env.local` to git
- ✅ Add `.env.local` to `.gitignore` (should already be there)

## Still Having Issues?

1. Check `.env.local` has both variables
2. Check dev server console logs for `[Admin API]` messages
3. Verify service role key isn't truncated
4. Make sure email in ADMIN_EMAILS is lowercase
5. Restart dev server after changing `.env.local`

## What's New

The admin panel now:
- ✅ Shows all user details (profile, payments, reports count)
- ✅ Allows banning/unbanning users
- ✅ Uses service role for secure admin access
- ✅ Includes detailed error logging for debugging
