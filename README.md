# Events Platform

A full-stack event discovery and management platform with automated scraping, admin dashboard, and AI-powered recommendations.

## Features

### Core Platform
- **Event Discovery** - Browse events from multiple sources with real-time updates
- **Admin Dashboard** - Secure Google OAuth authentication with comprehensive event management
- **Advanced Filtering** - Search by city, keyword, date range, and status
- **Automated Scraping** - Scheduled updates every 6 hours via Vercel Cron
- **Status Tracking** - Automatic detection of new, updated, and inactive events

### AI Assistant (Bonus)
- **Natural Language Chat** - Interactive event recommendations
- **Smart Matching** - AI-powered suggestions based on user preferences
- **Notification System** - Alerts for relevant events
- **Powered by Phi-3** - Free, open-source LLM via Hugging Face

## Tech Stack

**Frontend:** Next.js 16, TypeScript, TailwindCSS  
**Backend:** Next.js API Routes, Firebase Firestore  
**AI:** Hugging Face Inference API (Phi-3)  
**Deployment:** Vercel  
**Authentication:** Google OAuth

## Quick Start

```bash
# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Visit `http://localhost:3000`

## Environment Variables

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
FIREBASE_ADMIN_PRIVATE_KEY=
FIREBASE_ADMIN_CLIENT_EMAIL=

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Hugging Face
HUGGINGFACE_API_KEY=

# Cron Security
CRON_SECRET=
```

## Documentation

- **[FIREBASE_SETUP.md](FIREBASE_SETUP.md)** - Database configuration
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Vercel deployment guide
- **[ESLINT_FIX_GUIDE.md](ESLINT_FIX_GUIDE.md)** - Dependency troubleshooting
- **[CRON_FIX_GUIDE.md](CRON_FIX_GUIDE.md)** - Automated scraping setup

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── admin/             # Admin dashboard
│   └── chat/              # AI chat interface
├── components/            # React components
├── lib/                   # Utilities and services
│   ├── scrapers/         # Event scrapers
│   ├── db-service.ts     # Database operations
│   └── ai-service.ts     # AI recommendations
└── types/                # TypeScript definitions
```

## Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)(https://events-platform-ruddy.vercel.app/)

Or manually:

```bash
# Build
npm run build

# Deploy
vercel --prod
```
---

Built By Priyank Tyagi
