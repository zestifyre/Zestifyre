# Email Setup Guide for Zestifyre

## 📧 Your Current Setup
- **Domain**: `zestifyre.com` ✅
- **Email**: `admin@zestifyre.com` ✅
- **Service**: Resend (to be configured)

## 🚀 Quick Setup with Resend (Recommended)

### Step 1: Create Resend Account
1. Go to [resend.com](https://resend.com)
2. Sign up with your email
3. Verify your email address

### Step 2: Get API Key
1. Go to [API Keys](https://resend.com/api-keys) in your Resend dashboard
2. Click "Create API Key"
3. Name it "Zestifyre Production"
4. Copy the API key (starts with `re_`)

### Step 3: Set Up Your Custom Domain (Required)
1. Go to [Domains](https://resend.com/domains) in your dashboard
2. Add your domain: `zestifyre.com`
3. Follow DNS setup instructions to add SPF/DKIM records
4. This improves deliverability and removes "via resend.com" from emails
5. **Important**: You must verify `zestifyre.com` before emails will work

### Step 4: Configure Environment Variables
Create a `.env.local` file in your project root:

```env
# Email Configuration
RESEND_API_KEY=re_your-actual-api-key-here
RESEND_FROM_EMAIL=admin@zestifyre.com
```

### Step 5: Test Email Sending
1. Start your development server: `npm run dev`
2. Submit the form on your website
3. Check the console logs for email status
4. Check your email inbox for the welcome email

## 📧 Email Templates Included

### 1. Welcome Email
- Sent immediately when someone submits the form
- Professional HTML design with your branding
- Explains next steps and your value proposition

### 2. Sample Image Email (Ready to Use)
- For when you send the actual sample images
- Includes image preview
- Call-to-action for purchasing

## 🔧 Alternative Email Services

### SendGrid
```bash
npm install @sendgrid/mail
```
- More features but more complex setup
- Good for high volume
- Free tier: 100 emails/day

### Nodemailer with Gmail
```bash
npm install nodemailer
```
- Use your existing Gmail account
- Requires app password setup
- Good for testing/development

## 🚨 Important Notes

1. **Never commit API keys** to version control
2. **Use environment variables** for all sensitive data
3. **Test thoroughly** before going to production
4. **Monitor email delivery** rates in your dashboard
5. **Set up SPF/DKIM records** for better deliverability

## 🐛 Troubleshooting

### Email not sending?
1. Check API key is correct
2. Verify environment variables are loaded
3. Check console logs for errors
4. Ensure domain is verified (if using custom domain)

### Emails going to spam?
1. Set up SPF/DKIM records
2. Use a custom domain
3. Avoid spam trigger words
4. Include unsubscribe link

## 📊 Monitoring

- Check Resend dashboard for delivery stats
- Monitor bounce rates
- Track open rates
- Set up webhooks for delivery events

## 🎯 Next Steps

1. ✅ Set up Resend account
2. ✅ Add API key to environment variables
3. ✅ Test email sending
4. 🔄 Set up custom domain (optional)
5. 🔄 Implement image generation workflow
6. 🔄 Add email templates for different scenarios
