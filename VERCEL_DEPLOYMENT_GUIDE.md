# Vercel Deployment Guide

## Prerequisites

Before deploying, make sure:
1. ✅ Supabase backend is set up (see `SUPABASE_SETUP_GUIDE.md`)
2. ✅ All changes are pushed to GitHub
3. ✅ You have a Vercel account (free tier is fine)

## Step 1: Create a Vercel Account

1. Go to https://vercel.com
2. Click **Sign Up**
3. Choose **Continue with GitHub**
4. Authorize Vercel to access your GitHub account

## Step 2: Import Your Project

1. Go to https://vercel.com/dashboard
2. Click **Add New** → **Project**
3. Find your repository: `heli-marketplace`
4. Click **Import**

## Step 3: Configure Environment Variables

1. In the import dialog, scroll down to **Environment Variables**
2. Add the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://eycuwtmcewjuywvifxyy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_6NhRP79DJnN0L9oYuK_kwQ_0DuOE7Fi
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Note:** You can find the Service Role Key in Supabase:
- Go to Supabase Dashboard → Settings → API
- Copy the "Service Role" key (keep this secret!)

## Step 4: Deploy

1. Click **Deploy**
2. Wait for the deployment to complete (usually 2-3 minutes)
3. You'll get a live URL like: `https://heli-marketplace.vercel.app`

## Step 5: Test Your Live App

1. Visit your Vercel URL
2. Test the following:
   - ✅ Sign up at `/signup`
   - ✅ Log in at `/login`
   - ✅ View profile at `/profile`
   - ✅ Create listings at `/sell`
   - ✅ Search listings at `/search`

## Step 6: Set Up Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click **Settings** → **Domains**
3. Add your custom domain
4. Follow the DNS configuration instructions

## Automatic Deployments

From now on:
- Every time you push to `main` branch on GitHub
- Vercel will automatically deploy your changes
- You'll see the deployment status in Vercel dashboard

## Troubleshooting

### Issue: "Build failed"
- Check the build logs in Vercel dashboard
- Make sure all dependencies are installed: `npm install`
- Verify environment variables are set correctly

### Issue: "Environment variables not found"
- Go to Vercel dashboard → Project Settings → Environment Variables
- Make sure all variables are added
- Redeploy the project

### Issue: "Database connection error"
- Verify Supabase URL and API key are correct
- Check that Supabase project is running
- Make sure RLS policies allow the operations

### Issue: "Images not loading"
- Check that Supabase storage bucket "listings" exists
- Verify storage policies are configured
- Check browser console for specific errors

## Monitoring Your App

In Vercel dashboard you can:
- View deployment history
- Check build logs
- Monitor performance
- View analytics
- Manage environment variables
- Set up custom domains

## Next Steps

1. Share your live URL with others
2. Monitor the app for any issues
3. Make improvements based on feedback
4. Push updates to GitHub (they'll auto-deploy)

## Support

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
