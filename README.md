# Events Platform

[![Deploy with
Vercel](https://vercel.com/button)](https://events-platform-ruddy.vercel.app/)

A scalable full-stack event discovery and management platform that
aggregates events from multiple sources, automates data collection, and
provides AI-powered recommendations through a modern web interface and
secure admin dashboard.

------------------------------------------------------------------------

## Overview

Events Platform is designed to centralize event discovery and
management. It combines automated scraping pipelines, a real-time
database, and an AI assistant to deliver relevant event recommendations
and streamlined administration.

Key goals of the platform:

-   Aggregate and normalize event data from external sources
-   Provide a responsive browsing and filtering experience
-   Enable secure administrative control
-   Deliver intelligent, conversational event recommendations

------------------------------------------------------------------------

## Features

### Core Platform

-   **Multi-source Event Discovery** --- Real-time browsing of
    aggregated events
-   **Admin Dashboard** --- Secure Google OAuth authentication with full
    event management
-   **Advanced Search & Filtering** --- Filter by city, keywords, date
    range, and status
-   **Automated Scraping Pipeline** --- Scheduled background updates
    every 6 hours via Vercel Cron
-   **Event Lifecycle Tracking** --- Detection of new, updated, and
    inactive events

### AI Assistant

-   **Natural Language Chat Interface** --- Conversational event
    discovery
-   **Preference-aware Recommendations** --- AI matching based on user
    interests
-   **Smart Notifications** --- Alerts for relevant events
-   **Phi-3 Integration** --- Open-source LLM via Hugging Face Inference
    API

------------------------------------------------------------------------

## Tech Stack

**Frontend**\
Next.js 16 · TypeScript · Tailwind CSS

**Backend**\
Next.js API Routes · Firebase Firestore

**AI Layer**\
Hugging Face Inference API (Phi-3)

**Authentication**\
Google OAuth (NextAuth)

**Infrastructure & Deployment**\
Vercel · Vercel Cron Jobs

------------------------------------------------------------------------

## Getting Started

### 1. Clone the repository

``` bash
git clone <your-repo-url>
cd events-platform
```

### 2. Install dependencies

``` bash
npm install
```

### 3. Configure environment variables

``` bash
cp .env.example .env.local
```

Fill in the required credentials (see Environment Variables below).

### 4. Start the development server

``` bash
npm run dev
```

Open:

    http://localhost:3000

------------------------------------------------------------------------

## Environment Variables

Create a `.env.local` file with the following configuration:

``` env
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

------------------------------------------------------------------------

## Project Structure

    events-platform/
    ├── app/                   # Next.js App Router
    │   ├── api/               # Backend API routes
    │   ├── admin/             # Admin dashboard
    │   └── chat/              # AI assistant interface
    ├── components/            # Reusable UI components
    ├── lib/                   # Core services and utilities
    │   ├── scrapers/          # Event scraping modules
    │   ├── db-service.ts      # Database layer
    │   └── ai-service.ts      # AI integration
    └── types/                 # TypeScript type definitions

------------------------------------------------------------------------

## Deployment

### One-click Vercel deployment

[![Deploy with
Vercel](https://vercel.com/button)](https://events-platform-ruddy.vercel.app/)

### Manual deployment

``` bash
npm run build
vercel --prod
```

Ensure all environment variables are configured in your Vercel dashboard
before deployment.

------------------------------------------------------------------------

## Documentation

Additional setup and troubleshooting guides:

-   **FIREBASE_SETUP.md** --- Firebase configuration
-   **DEPLOYMENT.md** --- Production deployment guide
-   **ESLINT_FIX_GUIDE.md** --- Dependency troubleshooting
-   **CRON_FIX_GUIDE.md** --- Automated scraping setup

------------------------------------------------------------------------

## Author

**Priyank Tyagi**

