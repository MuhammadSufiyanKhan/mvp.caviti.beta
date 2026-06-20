# Admin Dashboard Debugging Guide

## Latest Improvements

I've completely rewritten the admin API endpoints and UI to provide detailed error messages. When you try to view a user and it fails, you'll now see exactly what went wrong.

## How to Debug

### Step 1: Check `.env.local` File

Make sure your `.env.local` file in the project root has BOTH variables:

```env
ADMIN_EMAILS=your-email@example.com
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Verify:**
- ✅ File is named exactly `.env.local` (in project root)
- ✅ ADMIN_EMAILS has your actual email
- ✅ SUPABASE_SERVICE_ROLE_KEY is the full key (very long, starts with `eyJ...`)
- ✅ No extra spaces or quotes

### Step 2: Restart Dev Server

After updating `.env.local`, you MUST restart the dev server:

```bash
# In terminal where dev server is running:
# Press Ctrl+C to stop

# Then start again:
npm run dev
```

Wait for "✓ Ready in Xs" message.

### Step 3: Test and Check Error Messages

1. Go to http://localhost:3000/admin/dashboard
2. Click on **Users** in sidebar
3. Click **View** on any user
4. Now you'll see one of these:

#### ✅ Success
- User details load with their profile, payments, and reports

#### ❌ Error - You'll See Exact Message
Error messages will now tell you exactly what's wrong:

| Error Message | What It Means | Fix |
|---|---|---|
| "You must be logged in" | Not authenticated | Log in first to admin |
| "Your email is not in the admin list" | Email doesn't match ADMIN_EMAILS | Update ADMIN_EMAILS in .env.local |
| "ADMIN_EMAILS environment variable not set" | No ADMIN_EMAILS in env | Add to .env.local and restart |
| "User not found" | Profile doesn't exist in DB | User may not be properly registered |
| "Could not parse error response" | API returned invalid data | Check server logs |

### Step 4: Check Browser Console

Open browser DevTools (F12) and go to **Console** tab:

1. Try viewing a user again
2. Look for any error messages
3. Copy any errors and check them against the table above

### Step 5: Check Server Terminal

Look at your terminal where `npm run dev` is running:

It may show logs like:
```
[Admin API] Current user email: your-email@example.com
[Admin API] Admin emails configured: (your emails)
[Admin API] Is admin? true
[Admin API] Fetching details for user: (user-id)
```

## Common Issues & Solutions

### Problem: Can't view users at all

**Step 1:** Make sure `.env.local` exists in project root
```bash
# From project root, should show .env.local
ls -la | grep env.local

# On Windows PowerShell:
dir | findstr env.local
```

**Step 2:** Check file contents are correct
```bash
# Read the file (but don't commit it!)
cat .env.local
```

**Step 3:** Verify values aren't placeholders
```
ADMIN_EMAILS should NOT be: your-admin-email@example.com
SUPABASE_SERVICE_ROLE_KEY should NOT be: your_service_role_key_here
```

**Step 4:** Restart server and try again

### Problem: "Your email is not in the admin list"

This means ADMIN_EMAILS doesn't match your login email.

**Fix:**
1. Check what email you logged in with
2. Update `.env.local` to match:
   ```env
   ADMIN_EMAILS=your-actual-login-email@example.com
   ```
3. Restart server
4. Try again

**Case matters:** Make sure email is exactly the same (both lowercase typically)

### Problem: "No admin emails configured"

The ADMIN_EMAILS environment variable isn't being read.

**Fix:**
1. Add to `.env.local`:
   ```env
   ADMIN_EMAILS=your-email@example.com
   ```
2. Stop dev server (Ctrl+C)
3. Start dev server again: `npm run dev`
4. This reloads environment variables

### Problem: "Failed to create admin client"

The service role key might be wrong or missing.

**Fix:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **Settings** → **API**
4. Find **Service Role Key** section
5. Click eye icon to show it
6. Click copy to copy entire key
7. In `.env.local`, replace the SUPABASE_SERVICE_ROLE_KEY value with the copied key
8. Restart server

**Make sure you copied the ENTIRE key**, it's very long and starts with `eyJ`

### Problem: "User not found"

The user exists in the users list but not in the profiles table.

**Fix:**
This shouldn't happen normally. Check:
1. Is the user ID valid?
2. Has the user completed signup?
3. Try a different user

## New Error Display

The admin UI now shows:
- ✅ Detailed error message when something fails
- ✅ Troubleshooting tips
- ✅ "Try Again" button to retry
- ✅ Loading state while fetching
- ✅ Back button to return to user list

## Testing Checklist

Before reporting an issue, verify:

- [ ] `.env.local` file exists in project root
- [ ] ADMIN_EMAILS is set to your login email
- [ ] SUPABASE_SERVICE_ROLE_KEY is set to full service role key
- [ ] Dev server has been restarted after .env.local changes
- [ ] You're logged in as the admin user
- [ ] Browser shows the admin dashboard (not redirected to login)
- [ ] Users list loads (you can see other users)
- [ ] Error message is shown in the UI (not just alert)

## Getting Service Role Key

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **Settings** (left sidebar, bottom)
4. Click **API** tab
5. Scroll to **Service Role Key** section
6. Click the eye icon (Show)
7. Click copy icon to copy
8. Paste into `.env.local`

**Important:** Never share or commit this key! It's a secret.

## Still Having Issues?

1. Check all steps above
2. Verify .env.local file with exact values
3. Restart server
4. Clear browser cache (Ctrl+Shift+Delete)
5. Hard refresh (Ctrl+F5)
6. Try in a fresh incognito/private window
7. Check error message in UI for specific guidance

The new error messages should tell you exactly what's wrong now!
