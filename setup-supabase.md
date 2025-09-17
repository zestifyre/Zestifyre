# Supabase Setup Guide for Zestifyre

## Step 1: Get Your Supabase Project URL and Anon Key

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your "Zestifyre" project
3. Go to **Settings** → **API**
4. Copy the following values:
   - **Project URL** (looks like: `https://abcdefghijklmnop.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

## Step 2: Create Environment File

Create a `.env.local` file in your project root with:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=sb_secret_IFXTQmu77TU2EY3f2AXlpw_mTrFKSU_

# Other configurations (fill these later)
OPENAI_API_KEY=your-openai-api-key
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
GMAIL_USER=your-gmail@gmail.com
GMAIL_PASS=your-gmail-app-password
DISCORD_WEBHOOK_URL=your-discord-webhook-url
```

## Step 3: Set Up Database Schema

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the entire contents of `supabase-schema.sql`
4. Click **Run** to execute the schema

## Step 4: Test Database Connection

1. Start your development server: `npm run dev`
2. Test the database connection:
   - GET: `http://localhost:3000/api/test-db`
   - POST: `http://localhost:3000/api/test-db` (with JSON body: `{"email": "test@example.com", "restaurantName": "Test Restaurant"}`)

## Step 5: Verify Tables Created

In your Supabase dashboard, go to **Table Editor** and verify these tables exist:
- `users`
- `restaurants`
- `menu_items`
- `generated_images`

## Troubleshooting

### If you get connection errors:
1. Check that your environment variables are correct
2. Verify the Supabase project is active
3. Make sure the schema was executed successfully

### If tables don't appear:
1. Refresh the Table Editor page
2. Check the SQL Editor for any error messages
3. Verify the schema execution was successful

## Next Steps

Once the database is set up and tested:
1. Update the PRD to mark Task 1.2 as completed
2. Proceed to Task 1.3 (Vercel deployment)
3. Continue with Task 1.5 (UberEats scraping)
