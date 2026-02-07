# Sydney Events Platform - Complete Full-Stack Application

A comprehensive event discovery and management platform for Sydney, Australia, with AI-powered recommendations.

## 🎯 Overview

Full-stack web application that automatically scrapes events from multiple sources, displays them in a beautiful interface, and includes an admin dashboard with AI-powered event recommendations.

## ✨ Features

### Public Features
- 🎭 **Event Discovery**: Browse events from multiple Sydney sources
- 🎨 **Beautiful UI**: Clean, modern, minimalist design
- 📧 **Email Capture**: Get tickets with email opt-in
- 🤖 **AI Assistant**: Chat-based event recommendations (BONUS)
- 📱 **Responsive**: Works on all devices

### Admin Features
- 🔐 **Google OAuth**: Secure authentication
- 📊 **Dashboard**: Complete event management
- 🔍 **Advanced Filters**: City, keyword, date, status
- 📋 **Table View**: Sortable event list
- 👁️ **Preview Panel**: Detailed event information
- ✅ **Import Events**: Manage event lifecycle
- 🏷️ **Status Tags**: Track event states
- 🕷️ **Manual Scraper**: Trigger on-demand

### Automation
- ⏰ **Auto-Scraping**: Every 6 hours via Vercel Cron
- 🔄 **Status Detection**: Automatic new/updated/inactive tagging
- 💾 **Cloud Database**: Firebase Firestore
- 🚀 **Auto-Deploy**: Push to deploy on Vercel

### AI Recommendations (BONUS)
- 🤖 **Free Open-Source LLM**: Microsoft Phi-3 via Hugging Face
- 💬 **Chat Interface**: Natural language interaction
- 🎯 **Smart Matching**: AI-powered event recommendations
- 🔔 **Notifications**: When matching events appear

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes, Firebase
- **AI**: Hugging Face (Phi-3, Free)
- **Deployment**: Vercel

## 🚀 Quick Start

```bash
# Install
npm install

# Configure (see FIREBASE_SETUP.md)
cp .env.example .env.local
# Add your Firebase credentials

# Run
npm run dev
```

## 📖 Documentation

- **[FIREBASE_SETUP.md](FIREBASE_SETUP.md)** - Firebase configuration
- **[PHASE2_README.md](PHASE2_README.md)** - Scraper testing
- **[PHASE3_4_README.md](PHASE3_4_README.md)** - UI & Dashboard
- **[ASSIGNMENT2_BONUS.md](ASSIGNMENT2_BONUS.md)** - AI system
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Vercel deployment

## 🎯 Assignment Compliance

### Assignment 1 ✅
- [x] Multi-source scraping
- [x] Auto-update detection
- [x] Minimalist UI
- [x] Email capture
- [x] Google OAuth
- [x] Admin dashboard
- [x] All filters & features

### Assignment 2 (Bonus) ✅
- [x] AI chat interface
- [x] Preference collection
- [x] Event recommendations
- [x] Notification system
- [x] Open-source LLM (Free)

## 🌟 Highlights

- ✅ **100% Functional** - All features working
- ✅ **Production Ready** - Deployed on Vercel
- ✅ **AI Powered** - Free LLM integration
- ✅ **Modern Stack** - Latest technologies
- ✅ **Clean Code** - TypeScript throughout
- ✅ **Complete Docs** - Comprehensive guides

---

Made with ❤️ for Sydney
