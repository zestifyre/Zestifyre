# DNS Setup Guide for Zestifyre Email

## 📧 Setting Up Resend DNS Records

### Step 1: Create .env.local File
Create a file called `.env.local` in your project root with this content:

```env
# Zestifyre Environment Variables
# Add your actual API keys here

# Email Configuration (Resend) - REQUIRED
RESEND_API_KEY=re_your-actual-api-key-here
RESEND_FROM_EMAIL=admin@zestifyre.com

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=sb_secret_IFXTQmu77TU2EY3f2AXlpw_mTrFKSU_

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key

# Stripe Configuration
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# Discord Configuration
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/1412523374445596752/oL41bfjmy73q-ZSDZ7RBjd3N1BPTJIEh6hceW6cCMB9rQ1j4hGy3H14CoDM46DTXiAlC

# AWS S3 Configuration (for image storage)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-s3-bucket-name

# Apify Configuration (for UberEats scraping)
APIFY_TOKEN=your-apify-token
```

### Step 2: Get Resend API Key
1. Go to [resend.com](https://resend.com)
2. Sign up with `admin@zestifyre.com`
3. Go to [API Keys](https://resend.com/api-keys)
4. Click "Create API Key"
5. Name it "Zestifyre Production"
6. Copy the key (starts with `re_`)
7. Replace `re_your-actual-api-key-here` in your `.env.local` file

### Step 3: Add Domain to Resend
1. Go to [Domains](https://resend.com/domains) in Resend dashboard
2. Click "Add Domain"
3. Enter: `zestifyre.com`
4. Click "Add Domain"

### Step 4: Configure DNS Records

Resend will show you DNS records to add. Here's what you'll typically need:

#### A. SPF Record (Required)
**Type**: TXT
**Name**: `@` (or leave blank)
**Value**: `v=spf1 include:_spf.resend.com ~all`
**TTL**: 3600 (or default)

#### B. DKIM Record (Required)
**Type**: TXT
**Name**: `resend._domainkey` (or similar)
**Value**: `v=DKIM1; k=rsa; p=YOUR_DKIM_PUBLIC_KEY`
**TTL**: 3600 (or default)

#### C. DMARC Record (Recommended)
**Type**: TXT
**Name**: `_dmarc`
**Value**: `v=DMARC1; p=quarantine; rua=mailto:admin@zestifyre.com`
**TTL**: 3600 (or default)

### Step 5: Where to Add DNS Records

The location depends on where you bought your domain:

#### If domain is with:
- **GoDaddy**: Go to DNS Management
- **Namecheap**: Go to Advanced DNS
- **Cloudflare**: Go to DNS tab
- **Google Domains**: Go to DNS settings
- **Route 53**: Go to Hosted Zones

### Step 6: Verify Domain
1. After adding DNS records, wait 5-10 minutes
2. Go back to Resend dashboard
3. Click "Verify Domain" next to `zestifyre.com`
4. Status should change to "Verified" ✅

### Step 7: Test Email
1. Start your dev server: `npm run dev`
2. Submit the form on your website
3. Check `admin@zestifyre.com` inbox
4. Email should come from `admin@zestifyre.com` (no "via resend.com")

## 🚨 Important Notes

1. **DNS Propagation**: Changes can take up to 24 hours, but usually work within 1 hour
2. **TTL Values**: Lower TTL (300-600) speeds up testing, higher TTL (3600+) is better for production
3. **Multiple Records**: You can have multiple SPF records, but they should be combined into one
4. **Case Sensitive**: DNS record names are case-sensitive
5. **No Trailing Dots**: Don't add trailing dots to domain names

## 🔧 Troubleshooting

### Domain Not Verifying?
1. Check DNS records are exactly as Resend shows
2. Wait longer for DNS propagation
3. Use online DNS checker tools
4. Contact your domain registrar if needed

### Emails Going to Spam?
1. Ensure SPF record is correct
2. Add DMARC record
3. Use consistent "From" address
4. Avoid spam trigger words

### Still Having Issues?
1. Check Resend dashboard for error messages
2. Verify API key is correct
3. Ensure `.env.local` file is in project root
4. Restart your development server after adding environment variables

## 📊 DNS Record Examples

### Example SPF Record:
```
Type: TXT
Name: @
Value: v=spf1 include:_spf.resend.com ~all
TTL: 3600
```

### Example DKIM Record:
```
Type: TXT
Name: resend._domainkey
Value: v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...
TTL: 3600
```

### Example DMARC Record:
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:admin@zestifyre.com
TTL: 3600
```

## 🎯 Quick Checklist

- [ ] Create `.env.local` file
- [ ] Get Resend API key
- [ ] Add `zestifyre.com` to Resend
- [ ] Add SPF record to DNS
- [ ] Add DKIM record to DNS
- [ ] Add DMARC record to DNS (optional)
- [ ] Verify domain in Resend
- [ ] Test email sending
- [ ] Check inbox for emails

Once all steps are complete, your emails will be sent from `admin@zestifyre.com` with full domain verification! 🎉
