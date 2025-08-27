#!/bin/bash

# Zeptifier Deployment Script
echo "🚀 Deploying Zeptifier to Vercel..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the project root."
    exit 1
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ Error: .env.local not found. Please create it with your environment variables."
    exit 1
fi

# Build the project locally first
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors before deploying."
    exit 1
fi

echo "✅ Build successful!"

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
npx vercel --prod --yes

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🎉 Your app is now live!"
else
    echo "❌ Deployment failed. Please check the error messages above."
    exit 1
fi
