# Deployment Guide for Figma Slides Portfolio

This guide will help you deploy your portfolio to Vercel so it can be publicly shared.

## Prerequisites

- A GitHub account
- A Vercel account (free tier is fine - sign up at [vercel.com](https://vercel.com))
- Your Supabase credentials (Project ID and Anon Key)

## Step 1: Push Your Code to GitHub

1. Create a new repository on GitHub
2. Push all your code to that repository

## Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure your project:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build` (should be detected automatically)
   - **Output Directory**: `dist` (should be detected automatically)

5. **Add Environment Variables** (IMPORTANT):
   Click on "Environment Variables" and add:
   
   ```
   VITE_SUPABASE_PROJECT_ID = jueibjudmiedgskobvvp
   VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1ZWlianVkbWllZGdza29idnZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzMjc3OTgsImV4cCI6MjA4ODkwMzc5OH0.pNa4pbYgFX_160POy1hicTKOOjFhdNVaFF7frz0bMU4
   ```

6. Click **"Deploy"**

## Step 3: Wait for Deployment

Vercel will build and deploy your app. This usually takes 2-3 minutes.

## Step 4: Test Your Deployment

1. Once deployed, Vercel will give you a URL (e.g., `your-project.vercel.app`)
2. Open this URL in your browser
3. Your portfolio should load!
4. Click "Publish & Share" to save your portfolio
5. The generated share link will now work publicly!

## Step 5: Share Your Portfolio

- Your main URL: `https://your-project.vercel.app`
- Shared portfolios: `https://your-project.vercel.app?id=portfolio-xxxxxxx`

Anyone with the link can view your portfolio!

## Updating Your Portfolio

Every time you make changes in Figma Make:

1. Click "Publish & Share" to save to Supabase
2. Your published portfolios will automatically work on the deployed site
3. If you make code changes, push to GitHub and Vercel will auto-deploy

## Custom Domain (Optional)

You can add a custom domain in Vercel's project settings:
1. Go to your project settings in Vercel
2. Click "Domains"
3. Add your custom domain and follow the DNS setup instructions

---

## Troubleshooting

**Problem**: Blank page after deployment
- **Solution**: Make sure you added the environment variables in Vercel

**Problem**: "Failed to load portfolio" error
- **Solution**: Check that your Supabase server is running and the credentials are correct

**Problem**: PDF images not showing
- **Solution**: This is expected - the PDF data is stored in Supabase and should load from there

## Alternative: Deploy to Netlify

If you prefer Netlify:

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repository
4. Set build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Add the same environment variables under "Site settings" → "Environment variables"
6. Deploy!

---

Need help? Check the Vercel documentation at https://vercel.com/docs
