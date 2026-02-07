import { NextRequest, NextResponse } from 'next/server';
import { runAllScrapers } from '@/lib/scrapers';
import { saveScrapedEvents } from '@/lib/db-service';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// NOTE: Vercel Hobby plan only allows daily cron jobs
// This runs once per day at midnight UTC (0 0 * * *)
// For more frequent runs, upgrade to Pro plan or use external cron service

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret (Vercel automatically adds this header)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('⏰ Cron job triggered - Starting scrape');

    // Run all scrapers
    const scrapeResults = await runAllScrapers();

    // Save to database
    const dbResults = await saveScrapedEvents(scrapeResults.events);

    console.log('✅ Cron job completed successfully');

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results: {
        scraped: scrapeResults.totalEvents,
        new: dbResults.new,
        updated: dbResults.updated,
        inactive: dbResults.inactive,
        sources: scrapeResults.sources,
      },
    });
  } catch (error) {
    console.error('❌ Cron job failed:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}