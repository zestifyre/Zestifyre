# Zeptifier 🍽️

AI-generated menu images that BOOST your UberEats sales.

## 🌐 Live Demo

**Visit:** [https://zestifyre.vercel.app/](https://zestifyre.vercel.app/)

## 🚀 Features

- **Free AI-generated menu images** for UberEats restaurants
- **Smart restaurant matching** with fuzzy search
- **Professional food photography** using DALL-E 3
- **Email delivery** with secure download links
- **Paid image generation** for additional menu items

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI DALL-E 3
- **Email**: Gmail SMTP with Nodemailer
- **Payments**: Stripe
- **Deployment**: Vercel
- **Storage**: AWS S3 (planned)

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tossww/Zestifyre.git
   cd Zestifyre
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your credentials
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## 📋 Development Status

### ✅ Completed
- [x] Next.js project setup
- [x] Supabase database configuration
- [x] Vercel deployment
- [x] Landing page with form validation

### 🚧 In Progress
- [ ] UberEats scraping functionality
- [ ] DALL-E 3 image generation
- [ ] Email system integration

### 📅 Planned
- [ ] Stripe payment integration
- [ ] User dashboard
- [ ] Analytics and optimization

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

## 📚 Documentation

- [Product Requirements Document](./Zestifyre_PRD_Phase1_MVP.md)
- [Vercel Deployment Guide](./VERCEL_DEPLOYMENT.md)
- [Supabase Schema](./supabase-schema.sql)

## 🤝 Contributing

This is a private repository. Please contact the maintainers for access.

## 📄 License

Private project - All rights reserved.

---

**Built with ❤️ using Next.js and Supabase**
