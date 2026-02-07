import { scrapeEventbrite } from './eventbrite';
import { scrapeTimeOut } from './timeout';
import { scrapeHumanitix } from './humanitix';
import { Event } from '@/types';
import { ScraperResult } from './utils';

export interface ScrapeResults {
  totalEvents: number;
  newEvents: number;
  updatedEvents: number;
  sources: string[];
  events: Partial<Event>[];
  timestamp: string;
}

export async function runAllScrapers(): Promise<ScrapeResults> {
  console.log('🕷️ Starting scraping process...');
  
  const timestamp = new Date().toISOString();
  const allEvents: Partial<Event>[] = [];
  const sources: string[] = [];

  // Run all scrapers in parallel
  const scrapers = [
    scrapeEventbrite(),
    scrapeTimeOut(),
    scrapeHumanitix(),
  ];

  const results = await Promise.allSettled(scrapers);

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      const scraperResult: ScraperResult = result.value;
      console.log(`✅ ${scraperResult.source}: ${scraperResult.events.length} events`);
      
      allEvents.push(...scraperResult.events);
      sources.push(scraperResult.source);
    } else {
      console.error(`❌ Scraper ${index} failed:`, result.reason);
    }
  });

  // Remove duplicates based on title similarity
  const uniqueEvents = deduplicateEvents(allEvents);

  console.log(`📊 Total unique events: ${uniqueEvents.length}`);

  return {
    totalEvents: uniqueEvents.length,
    newEvents: 0, // Will be calculated when comparing with DB
    updatedEvents: 0,
    sources,
    events: uniqueEvents,
    timestamp,
  };
}

function deduplicateEvents(events: Partial<Event>[]): Partial<Event>[] {
  const seen = new Map<string, Partial<Event>>();

  events.forEach(event => {
    if (!event.title) return;

    // Create a normalized key for deduplication
    const key = event.title.toLowerCase().replace(/[^a-z0-9]/g, '');

    if (!seen.has(key)) {
      seen.set(key, event);
    } else {
      // Keep the one with more information
      const existing = seen.get(key)!;
      if ((event.description?.length || 0) > (existing.description?.length || 0)) {
        seen.set(key, event);
      }
    }
  });

  return Array.from(seen.values());
}
