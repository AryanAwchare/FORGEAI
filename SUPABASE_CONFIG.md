# Supabase Redirect Configuration Guide

The "access token" or "redirect" issues typically occur because Supabase blocks redirects that aren't explicitly allowed.

## 1. Go to Supabase Dashboard
1. Open your project on [supabase.com](https://supabase.com).
2. Navigate to **Authentication** (in the left sidebar).
3. Click on **URL Configuration**.

## 2. Add Redirect URLs
You need to add **BOTH** your local and production URLs here. Use the exact protocol (`http` vs `https`) and port.

### Add these URLs:
- `http://localhost:3000` (For local development)
- `http://localhost:3000/**` (Wildcard for local)
- `https://YOUR_VERCEL_APP_NAME.vercel.app` (For Production)
- `https://YOUR_VERCEL_APP_NAME.vercel.app/**` (Wildcard for Production)

## 3. "Site URL"
- Set "Site URL" to your production URL: `https://YOUR_VERCEL_APP_NAME.vercel.app` (or whatever your main URL is).

## 4. Save
- Click **Save**.

## 5. Test
- **Local**: Run `npm run dev`, sign up. The email link should redirect to `localhost:3000` and log you in.
- **Production**: Sign up on the deployed site. The email link should redirect to Vercel and log you in.
