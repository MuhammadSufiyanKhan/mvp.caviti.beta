# Admin Dashboard - Complete Setup Verification

## ✅ Code is Now Fixed

The TypeScript error has been resolved. Follow these steps to get the admin dashboard working.

## 🔧 Setup Checklist

### 1. Verify `.env.local` Has Both Variables

Open `.env.local` in your project root and verify it contains:

```env
ADMIN_EMAILS=your-admin-email@example.com
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important:**
- Replace `your-admin-email@example.com` with your actual login email
- Replace the service role key with the actual value from Supabase
- Make sure there are NO spaces around the `=` sign
- Make sure `.env.local` is in your project ROOT directory

### 2. Get Service Role Key from Supabase

If you don't have the service role key:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **Settings** (bottom left sidebar)
4. Click **API** tab
5. Look for **Service Role Key** section
6. Click the eye icon to reveal it
7. Click copy button to copy the full key
8. Paste it into `.env.local` as shown above

**⚠️ WARNING:** This is a SECRET key. Never commit it to git or share it.

### 3. Restart Dev Server

**Important:** You MUST restart the dev server after modifying `.env.local`

```bash
# In terminal, press Ctrl+C to stop
# Then run:
npm run dev
```

Wait for the server to fully start (look for "✓ Ready in X.XXs")

### 4. Verify Environment Variables Are Loaded

Open browser Console (F12) and check if you see these logs when clicking "View":

```
[Admin API] Current user email: your-admin-email@example.com
[Admin API] Admin emails configured: (your configured emails)
[Admin API] Is admin? true
[Admin API] Fetching details for user: (user-id)
[Admin API] Profile fetch - Error: null Data: (user-id)
```

If you see these, everything is working! ✅

## 🐛 Debugging Steps

### If You See "No admin users configured"
1. Check `.env.local` has `ADMIN_EMAILS` variable
2. Check there's no space before the variable name
3. Restart dev server
4. Clear browser cache (Ctrl+Shift+Delete)
5. Hard refresh (Ctrl+F5)

### If You See "Unauthorized - Not admin"
1. Check your login email matches the `ADMIN_EMAILS` value
2. Both should be lowercase
3. Restart dev server

### If You See "Unauthorized - No user"
1. Make sure you're logged in
2. Go to login page and sign in first
3. Then navigate to /admin/dashboard

### If Service Role Key is Wrong
1. Go back to Supabase Dashboard
2. Click the eye icon on Service Role Key
3. Copy the ENTIRE key (it's very long)
4. Replace entire value in `.env.local`
5. Restart dev server

### Still Getting Error?

Open browser console and look for these patterns:

**✅ Success pattern:**
```
[Admin API] Is admin? true
[Admin API] Profile fetch - Error: null
```

**❌ Failure patterns:**
```
[Admin API] Admin emails configured: (empty)  
→ ADMIN_EMAILS not set

[Admin API] Is admin? false
→ Email mismatch

[Admin API] Profile fetch - Error: not found
→ User doesn't exist in profiles table
```

## 📋 Complete `.env.local` Template

Copy this and replace with your actual values:

```env
# Supabase URLs and Keys
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Admin Configuration (NEW - REQUIRED FOR ADMIN DASHBOARD)
ADMIN_EMAILS=your-email@example.com
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Other variables (if you have any)
```

## ✨ Features Now Working

After setup, admin dashboard should have:

- ✅ View user details (profile, payments, reports)
- ✅ Ban/unban users instantly
- ✅ Search users by name or email
- ✅ See user payment history
- ✅ See total reports per user
- ✅ Direct WhatsApp contact links

## 🚀 Test It

1. Go to http://localhost:3000/admin/dashboard
2. Click "Users" in sidebar
3. Click "View" button on any user
4. Should see their full profile with no errors

## Need Help?

Check these files:
- [ADMIN_QUICK_FIX.md](./ADMIN_QUICK_FIX.md) - Quick troubleshooting
- [ADMIN_DASHBOARD_SETUP.md](./ADMIN_DASHBOARD_SETUP.md) - Full setup guide
- [.env.local.example-admin](./.env.local.example-admin) - Example environment file

## Security Checklist

- ✅ `.env.local` is in `.gitignore`
- ✅ Service role key is never exposed to client
- ✅ Admin check happens server-side
- ✅ Database RLS policies protect data
- ✅ Never commit `.env.local` to git
