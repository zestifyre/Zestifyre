# Vercel Deployment Guide for Zestifyre

## Step 1: Connect GitHub to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click **"New Project"**
4. Import your GitHub repository: `tossww/Zestifyre`
5. Select the repository and click **"Import"**

## Step 2: Configure Project Settings

### Project Configuration:
- **Project Name**: `zeptifier` (or `zeptifier-production`)
- **Framework Preset**: Next.js
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

## Step 3: Configure Environment Variables

In the Vercel dashboard, go to **Settings** → **Environment Variables** and add:

### Production Environment Variables:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://tmjardahljyaakkrkosr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtamFyZGFobGp5YWFra3Jrb3NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMjE0MzcsImV4cCI6MjA3MTg5NzQzN30.mk6HDlGnHcfKvg07Lt8V0p-uKXdPC9OdYUCqVZM2RGg
SUPABASE_SERVICE_ROLE_KEY=sb_secret_IFXTQmu77TU2EY3f2AXlpw_mTrFKSU_

# OpenAI Configuration (add later)
OPENAI_API_KEY=your-openai-api-key

# Stripe Configuration (add later)
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# Email Configuration (add later)
GMAIL_USER=your-gmail@gmail.com
GMAIL_PASS=your-gmail-app-password

# Discord Configuration (add later)
DISCORD_WEBHOOK_URL=your-discord-webhook-url

# AWS S3 Configuration (add later)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-s3-bucket-name
```

### Preview Environment Variables:
Add the same variables for the preview environment.

## Step 4: Deploy

1. Click **"Deploy"**
2. Wait for the build to complete
3. Your project will be deployed to: `https://zestifyre.vercel.app/`

## Step 5: Configure Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain: `zeptifier.com`
3. Update DNS settings as instructed by Vercel

## Step 6: Test Deployment

### Test the deployed application:
1. Visit your Vercel URL
2. Test the landing page functionality
3. Test the database connection: `https://your-domain.vercel.app/api/test-db`

### Expected Results:
- ✅ Landing page loads correctly
- ✅ Form validation works
- ✅ Database connection successful
- ✅ Responsive design works on mobile/desktop

## Step 7: Set Up Automatic Deployments

### Configure GitHub Integration:
- **Production Branch**: `main`
- **Preview Branches**: `develop`, `feature/*`
- **Auto-deploy**: Enabled

### Branch Protection (Recommended):
1. Go to GitHub repository settings
2. Enable branch protection for `main`
3. Require pull request reviews
4. Require status checks to pass

## Troubleshooting

### Build Failures:
1. Check build logs in Vercel dashboard
2. Verify all environment variables are set
3. Ensure all dependencies are in `package.json`

### Environment Variable Issues:
1. Verify variable names match exactly
2. Check for typos in values
3. Ensure variables are set for correct environments

### Database Connection Issues:
1. Verify Supabase credentials are correct
2. Check if Supabase project is active
3. Ensure RLS policies are configured

## Next Steps After Deployment

1. ✅ Update PRD to mark Task 1.3 as completed
2. 🔄 Proceed to Task 1.5 (UberEats scraping)
3. 🔄 Set up monitoring and analytics
4. 🔄 Configure error tracking

## Deployment Checklist

- [ ] GitHub repository connected to Vercel
- [ ] Environment variables configured
- [ ] Build successful
- [ ] Landing page loads correctly
- [ ] Database connection working
- [ ] Form validation functional
- [ ] Responsive design verified
- [ ] Custom domain configured (optional)
- [ ] Automatic deployments enabled
