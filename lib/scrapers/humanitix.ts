import * as cheerio from 'cheerio';
import { Event } from '@/types';
import { fetchDynamicHTML, cleanText, parseDate, generateEventId, ScraperResult } from './utils';

const HUMANITIX_SYDNEY_URL = 'https://humanitix.com/au/sydney/events';

export async function scrapeHumanitix(): Promise<ScraperResult> {
  const scrapedAt = new Date().toISOString();
  const events: Partial<Event>[] = [];

  try {
    console.log('🎭 Scraping Humanitix...');
    
    const html = await fetchDynamicHTML(HUMANITIX_SYDNEY_URL);
    const $ = cheerio.load(html);

    // Debug showed only 6 links with href containing "/event"
    // This suggests the page uses heavy React/JS rendering
    console.log('Searching for Humanitix events...');

    // Try the links that were found
    $('a[href*="/event"]').each((_, element) => {
      try {
        const $link = $(element);
        
        // Get title from link text or nearby headings
        const title = cleanText(
          $link.text() || 
          $link.find('h1, h2, h3, h4').first().text() ||
          $link.closest('div, article').find('h1, h2, h3, h4').first().text()
        );

        if (!title || title.length < 5 || title.toLowerCase().includes('sydney events')) return;

        const href = $link.attr('href') || '';
        const fullUrl = href.startsWith('http') ? href : `https://humanitix.com${href}`;

        // Try to find image in parent container
        const $container = $link.closest('div, article, section');
        const image = $container.find('img').first().attr('src') || '';

        // Try to find date
        const dateText = cleanText(
          $container.find('time, [class*="date"]').first().text()
        );

        const dateStr = dateText ? parseDate(dateText) : new Date().toISOString();
        
        if (title && !events.find(e => e.title === title)) {
          events.push({
            id: generateEventId(title, dateStr, 'Sydney'),
            title,
            date: dateStr,
            venueName: 'Sydney',
            city: 'Sydney',
            description: title,
            imageUrl: image,
            sourceWebsite: 'Humanitix',
            originalUrl: fullUrl,
            lastScraped: scrapedAt,
            status: 'new',
            createdAt: scrapedAt,
          });
        }
      } catch (e) {
        // Skip
      }
    });

    // If still nothing, try to find any cards/containers with event-like content
    if (events.length === 0) {
      console.log('Trying to find event containers...');
      
      $('div[class*="card"], article, section').each((_, element) => {
        try {
          const $el = $(element);
          const link = $el.find('a[href*="/event"]').first();
          
          if (link.length === 0) return;
          
          const title = cleanText(
            $el.find('h1, h2, h3, h4, h5').first().text()
          );
          
          if (!title || title.length < 5) return;
          
          const href = link.attr('href') || '';
          const fullUrl = href.startsWith('http') ? href : `https://humanitix.com${href}`;
          const image = $el.find('img').first().attr('src') || '';
          
          if (title && !events.find(e => e.title === title)) {
            events.push({
              id: generateEventId(title, new Date().toISOString(), 'Sydney'),
              title,
              date: new Date().toISOString(),
              venueName: 'Sydney',
              city: 'Sydney',
              description: title,
              imageUrl: image,
              sourceWebsite: 'Humanitix',
              originalUrl: fullUrl,
              lastScraped: scrapedAt,
              status: 'new',
              createdAt: scrapedAt,
            });
          }
        } catch (e) {
          // Skip
        }
      });
    }

    console.log(`✅ Humanitix: Found ${events.length} events`);

  } catch (error) {
    console.error('❌ Humanitix scraping error:', error);
  }

  return {
    events,
    source: 'Humanitix',
    scrapedAt,
  };
}