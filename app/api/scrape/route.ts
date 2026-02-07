import { NextRequest, NextResponse } from 'next/server';
import { runAllScrapers } from '@/lib/scrapers';
import { saveScrapedEvents } from '@/lib/db-service';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 60 seconds for scraping

export async function POST(request: NextRequest) {
  try {
    // Optional: Add authentication check here
    const authHeader = request.headers.get('authorization');
    
    console.log('🚀 Manual scrape triggered');

    // Run all scrapers
    const scrapeResults = await runAllScrapers();

    // Save to database
    const dbResults = await saveScrapedEvents(scrapeResults.events);

    return NextResponse.json({
      success: true,
      message: 'Scraping completed successfully',
      data: {
        totalScraped: scrapeResults.totalEvents,
        sources: scrapeResults.sources,
        database: dbResults,
        timestamp: scrapeResults.timestamp,
      },
    });
  } catch (error) {
    console.error('Scraping error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Scraping failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET endpoint for testing
export async function GET() {
  return NextResponse.json({
    message: 'Scraper endpoint ready. Use POST to trigger scraping.',
    endpoints: {
      manual: 'POST /api/scrape',
      cron: 'GET /api/scrape/cron',
    },
  });
}
