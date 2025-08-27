# Zeptifier 🍕

**AI-Generated Menu Images that BOOST your UberEats Sales**

## Overview

Zeptifier is a web application that generates high-quality AI menu images for UberEats restaurants to boost their sales. Our platform provides both free sample images and paid premium image generation services.

## Features

### Phase 1 MVP (Current)
- ✅ **Free Image Generation**: Get a free AI-generated menu image
- ✅ **UberEats Integration**: Scrape restaurant data and menu items
- ✅ **AI Image Generation**: DALL-E 3 powered food photography
- ✅ **Payment Processing**: Stripe integration for $30/image purchases
- ✅ **User Dashboard**: Order history and download management
- ✅ **Email Delivery**: Secure download links with 30-day expiration

### Future Enhancements
- 📊 **Advanced Analytics**: Comprehensive funnel tracking and A/B testing
- 🤖 **Automated Optimization**: ML-powered conversion optimization
- 📈 **Performance Insights**: User behavior analytics and heatmaps

## Tech Stack

- **Frontend**: Next.js 14 with React & TypeScript
- **Backend**: Next.js API routes
- **Database**: Airtable
- **AI**: DALL-E 3 API
- **Payments**: Stripe
- **Email**: Gmail SMTP with Nodemailer
- **Hosting**: Vercel
- **Monitoring**: Discord webhooks

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Airtable account
- OpenAI API key
- Stripe account
- Gmail account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/zeptifier.git
   cd zeptifier
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Database
   AIRTABLE_API_KEY=your_airtable_api_key
   AIRTABLE_BASE_ID=your_airtable_base_id
   
   # AI
   OPENAI_API_KEY=your_openai_api_key
   
   # Payments
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   
   # Email
   GMAIL_USER=your_gmail@gmail.com
   GMAIL_PASS=your_gmail_app_password
   
   # Discord
   DISCORD_WEBHOOK_URL=your_discord_webhook_url
   
   # Storage
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=us-east-1
   AWS_S3_BUCKET=your_s3_bucket_name
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Development

### Project Structure
```
zeptifier/
├── app/                    # Next.js 14 app directory
│   ├── api/               # API routes
│   ├── components/        # React components
│   ├── lib/              # Utility functions
│   ├── styles/           # CSS and styling
│   └── types/            # TypeScript type definitions
├── docs/                 # Documentation
├── prisma/              # Database schema (if using Prisma)
├── public/              # Static assets
└── tests/               # Test files
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run test` - Run tests

### Development Guidelines

1. **Follow the PRD**: All development should follow the [Product Requirements Document](Zestifyre_PRD_Phase1_MVP.md)
2. **Testing Protocol**: Each task must be completed and tested before moving to the next
3. **Code Quality**: Use TypeScript, ESLint, and Prettier
4. **Git Workflow**: Use feature branches and pull requests
5. **Documentation**: Update documentation as you develop

## Deployment

### Vercel (Recommended)

1. **Connect to Vercel**
   - Push your code to GitHub
   - Connect your repository to Vercel
   - Configure environment variables in Vercel dashboard

2. **Custom Domain**
   - Configure `zeptifier.com` in Vercel
   - Update DNS settings

3. **Environment Variables**
   - Add all environment variables to Vercel dashboard
   - Ensure production values are set correctly

## API Documentation

### Endpoints

#### POST `/api/submit-form`
Submit restaurant information for free image generation
```json
{
  "restaurantName": "Pizza Palace",
  "email": "user@example.com"
}
```

#### GET `/api/generate?token={token}&email={email}`
Generate AI image for user
- Requires valid token and email
- Returns generation status

#### POST `/api/create-payment-intent`
Create Stripe payment intent for image purchase
```json
{
  "itemIds": ["item1", "item2"],
  "email": "user@example.com"
}
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@zeptifier.com or join our Discord server.

## Roadmap

- [x] Phase 1 MVP (Free + Paid Image Generation)
- [ ] Phase 2 (Analytics & Optimization)
- [ ] Mobile App
- [ ] API for Third-party Integrations
- [ ] White-label Solutions

---

**Built with ❤️ for restaurant owners who want to boost their UberEats sales**
