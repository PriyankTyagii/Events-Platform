import { NextResponse } from 'next/server';
import { fetchDynamicHTML } from '@/lib/scrapers/utils';
import * as cheerio from 'cheerio';

export async function GET() {
  const results: any = {
    eventbrite: {},
    humanitix: {},
  };

  try {
    // Debug Eventbrite
    console.log('🔍 Debugging Eventbrite...');
    const eventbriteHtml = await fetchDynamicHTML('https://www.eventbrite.com.au/d/australia--sydney/all-events/');
    const $eb = cheerio.load(eventbriteHtml);

    results.eventbrite.htmlLength = eventbriteHtml.length;
    results.eventbrite.selectors = {};

    const eventbriteSelectors = [
      'a[href*="/e/"]',
      'article',
      'li',
      'div[class*="event"]',
      'div[class*="card"]',
      'div[class*="Card"]',
      'h2',
      'h3',
      '[data-event-id]',
      '[data-testid]',
    ];

    eventbriteSelectors.forEach(selector => {
      const count = $eb(selector).length;
      if (count > 0) {
        const firstClasses = $eb(selector).first().attr('class') || 'no-class';
        const firstText = $eb(selector).first().text().trim().substring(0, 100);
        
        results.eventbrite.selectors[selector] = {
          count,
          firstClasses,
          firstText,
        };
      }
    });

    // Find all unique class names that contain 'event' or 'card'
    const allClasses = new Set<string>();
    $eb('*').each((_, el) => {
      const classes = $eb(el).attr('class');
      if (classes) {
        classes.split(' ').forEach(cls => {
          if (cls.toLowerCase().includes('event') || cls.toLowerCase().includes('card')) {
            allClasses.add(cls);
          }
        });
      }
    });
    results.eventbrite.relevantClasses = Array.from(allClasses).slice(0, 50);

    // Debug Humanitix
    console.log('🔍 Debugging Humanitix...');
    const humanitixHtml = await fetchDynamicHTML('https://humanitix.com/au/sydney/events');
    const $hx = cheerio.load(humanitixHtml);

    results.humanitix.htmlLength = humanitixHtml.length;
    results.humanitix.selectors = {};

    const humanitixSelectors = [
      'a[href*="/event"]',
      'article',
      'li',
      'div[class*="event"]',
      'div[class*="Event"]',
      'div[class*="card"]',
      'div[class*="Card"]',
      'h2',
      'h3',
    ];

    humanitixSelectors.forEach(selector => {
      const count = $hx(selector).length;
      if (count > 0) {
        const firstClasses = $hx(selector).first().attr('class') || 'no-class';
        const firstText = $hx(selector).first().text().trim().substring(0, 100);
        
        results.humanitix.selectors[selector] = {
          count,
          firstClasses,
          firstText,
        };
      }
    });

    // Find all unique class names
    const allClassesHx = new Set<string>();
    $hx('*').each((_, el) => {
      const classes = $hx(el).attr('class');
      if (classes) {
        classes.split(' ').forEach(cls => {
          if (cls.toLowerCase().includes('event') || cls.toLowerCase().includes('card')) {
            allClassesHx.add(cls);
          }
        });
      }
    });
    results.humanitix.relevantClasses = Array.from(allClassesHx).slice(0, 50);

    // Sample HTML snippets
    results.eventbrite.sampleHtml = eventbriteHtml.substring(0, 2000);
    results.humanitix.sampleHtml = humanitixHtml.substring(0, 2000);

  } catch (error: any) {
    results.error = error.message;
  }

  return NextResponse.json(results, { status: 200 });
}