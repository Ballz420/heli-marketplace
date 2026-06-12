# Supabase Backend Setup Guide

## Step 1: Log into Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Log in with your account (the one associated with project `eycuwtmcewjuywvifxyy`)
3. Select your project from the dashboard

## Step 2: Run the Database Migration

1. In the Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Copy the entire contents of `supabase/migrations/001_initial_schema.sql` from this project
4. Paste it into the SQL Editor
5. Click **Run** (or press Ctrl+Enter)
6. Wait for the query to complete successfully

### What This Creates:
- ✅ `profiles` table - User profile information
- ✅ `listings` table - Marketplace listings
- ✅ `orders` table - Purchase orders
- ✅ Row Level Security (RLS) policies - Data protection
- ✅ Storage bucket - For listing images
- ✅ Indexes - For search performance

## Step 3: Enable Email Authentication

1. Go to **Authentication** in the left sidebar
2. Click **Providers**
3. Find **Email** and make sure it's **Enabled**
4. (Optional) Enable **Google** for social login

## Step 4: Verify Your Environment Variables

Your `.env.local` file should have:
```
NEXT_PUBLIC_SUPABASE_URL=https://eycuwtmcewjuywvifxyy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_6NhRP79DJnN0L9oYuK_kwQ_0DuOE7Fi
```

These are already set up! ✅

## Step 5: Test the Connection

1. Start your development server: `npm run dev`
2. Go to http://localhost:3000/signup
3. Create a test account
4. Check Supabase dashboard → **Authentication** → **Users** to see your new user
5. Check **SQL Editor** → Run this query to see your profile:
   ```sql
   SELECT * FROM profiles;
   ```

## Troubleshooting

### Issue: "Missing Supabase environment variables"
- Make sure `.env.local` exists in the project root
- Verify the URL and API key are correct
- Restart your dev server after updating `.env.local`

### Issue: "RLS policy violation"
- This means the database is working but permissions are restricted
- Make sure you're logged in when accessing protected pages
- Check the RLS policies in Supabase dashboard

### Issue: "Table does not exist"
- The migration didn't run successfully
- Go back to SQL Editor and run the migration again
- Check for any error messages

## Next Steps

Once Supabase is set up:
1. Test user registration at `/signup`
2. Test user login at `/login`
3. View your profile at `/profile`
4. Create listings at `/sell`
5. View all listings at `/search`

Then we'll deploy to Vercel!
