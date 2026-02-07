# Phase 2: Event Scraping & Auto Updates ✅

## What's Been Built

### Scrapers
- ✅ **Eventbrite Sydney** scraper
- ✅ **Time Out Sydney** scraper  
- ✅ **Humanitix** scraper
- ✅ Deduplication logic
- ✅ Parallel scraping

### Database Service
- ✅ Save scraped events to Firestore
- ✅ **New event detection** (first time seen)
- ✅ **Updated event detection** (title/date/venue/description changed)
- ✅ **Inactive event detection** (not scraped in 48h OR date passed)
- ✅ Event filtering (city, status, keyword, date range)
- ✅ Import event functionality

### API Routes
- ✅ `POST /api/scrape` - Manual scraping trigger
- ✅ `GET /api/scrape/cron` - Vercel cron endpoint (runs every 6 hours)
- ✅ `GET /api/events` - Fetch events with filters
- ✅ `POST /api/events/import` - Import event
- ✅ `POST /api/emails` - Capture email for tickets

## Testing the Scrapers

### 1. Start Dev Server
```bash
npm run dev
```

### 2. Test Manual Scraping

**Option A: Using curl**
```bash
curl -X POST http://localhost:3000/api/scrape
```

**Option B: Using npm script**
```bash
npm run scrape
```

**Option C: Using browser/Postman**
- Go to `http://localhost:3000/api/scrape`
- Send POST request

### 3. Expected Response
```json
{
  "success": true,
  "message": "Scraping completed successfully",
  "data": {
    "totalScraped": 25,
    "sources": ["Eventbrite", "Time Out Sydney", "Humanitix"],
    "database": {
      "new": 20,
      "updated": 3,
      "inactive": 2
    },
    "timestamp": "2026-02-07T12:00:00.000Z"
  }
}
```

### 4. Verify in Firestore
Go to Firebase Console → Firestore Database → `events` collection

You should see events with:
- All required fields (title, date, venue, description, etc.)
- Status tags: `new`, `updated`, `inactive`, or `imported`
- Timestamps: `createdAt`, `lastScraped`, `updatedAt`

### 5. Test Event Fetching
```bash
# Get all events
curl http://localhost:3000/api/events

# Filter by status
curl "http://localhost:3000/api/events?status=new,updated"

# Search by keyword
curl "http://localhost:3000/api/events?keyword=music"

# Filter by city
curl "http://localhost:3000/api/events?city=Sydney"
```

## How Auto-Updates Work

### New Events
- Event scraped for first time → Status: `new`

### Updated Events  
- Existing event has changes in:
  - Title
  - Date/time
  - Venue
  - Description
- Status changes to `updated` (unless already `imported`)

### Inactive Events
Event marked `inactive` when:
- Not found in scrape for 48+ hours, OR
- Event date has passed

### Imported Events
- Manually imported via dashboard
- Status: `imported`
- Preserves imported status even if updated

## Cron Schedule (Vercel)

Configured in `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/scrape/cron",
      "schedule": "0 */6 * * *"  // Every 6 hours
    }
  ]
}
```

After deploying to Vercel, scraping runs automatically every 6 hours.

## Environment Variables Required

Add to `.env.local`:
```env
CRON_SECRET=your_random_secret_string_here
```

Generate random secret:
```bash
openssl rand -base64 32
```

## File Structure

```
/lib
  /scrapers
    utils.ts           # Scraper utilities
    eventbrite.ts      # Eventbrite scraper
    timeout.ts         # Time Out scraper
    humanitix.ts       # Humanitix scraper
    index.ts           # Main orchestrator
  db-service.ts        # Database operations
/app/api
  /scrape
    route.ts           # Manual trigger
    /cron
      route.ts         # Vercel cron
  /events
    route.ts           # Get events
    /import
      route.ts         # Import event
  /emails
    route.ts           # Email capture
```

## Next Steps

Phase 2 Complete! Ready for:
- ✅ Phase 3: Public event listing UI
- ✅ Phase 4: Auth + Dashboard

## Troubleshooting

**No events scraped?**
- Check network connectivity
- Websites might have changed structure
- Check console logs for errors

**Events not updating?**
- Verify Firestore rules allow write
- Check Firebase Admin credentials

**Cron not working on Vercel?**
- Verify `CRON_SECRET` env var is set
- Check Vercel deployment logs
