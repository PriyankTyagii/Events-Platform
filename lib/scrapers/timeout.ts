import * as cheerio from 'cheerio';
import { Event } from '@/types';
import { fetchHTML, cleanText, parseDate, generateEventId, ScraperResult } from './utils';

const TIMEOUT_SYDNEY_URL = 'https://www.timeout.com/sydney/things-to-do/whats-on-in-sydney-today';

export async function scrapeTimeOut(): Promise<ScraperResult> {
  const scrapedAt = new Date().toISOString();
  const events: Partial<Event>[] = [];

  try {
    const html = await fetchHTML(TIMEOUT_SYDNEY_URL);
    const $ = cheerio.load(html);

    // Time Out uses article cards
    $('article, .card, [class*="event"]').each((_, element) => {
      try {
        const $card = $(element);
        
        // Try multiple selectors for title
        const title = cleanText(
          $card.find('h2, h3, [class*="title"], [class*="heading"]').first().text() ||
          $card.find('a').first().attr('title') || ''
        );

        if (!title || title.length < 3) return;

        // Get link
        const link = $card.find('a').first().attr('href') || '';
        const fullUrl = link.startsWith('http') ? link : `https://www.timeout.com${link}`;

        // Get image
        const image = $card.find('img').first().attr('src') || 
                     $card.find('img').first().attr('data-src') || '';

        // Get description
        const description = cleanText(
          $card.find('p, [class*="description"], [class*="excerpt"]').first().text()
        );

        // Get category/tags
        const category = cleanText(
          $card.find('[class*="category"], [class*="tag"]').first().text()
        );

        // Get venue
        const venue = cleanText(
          $card.find('[class*="venue"], [class*="location"]').first().text()
        );

        const dateStr = new Date().toISOString();

        if (title && !events.find(e => e.title === title)) {
          events.push({
            id: generateEventId(title, dateStr, venue),
            title,
            date: dateStr,
            venueName: venue || 'Sydney',
            city: 'Sydney',
            description: description || title,
            category: category || 'Entertainment',
            imageUrl: image,
            sourceWebsite: 'Time Out Sydney',
            originalUrl: fullUrl,
            lastScraped: scrapedAt,
            status: 'new',
            createdAt: scrapedAt,
          });
        }
      } catch (e) {
        // Skip invalid cards
      }
    });

  } catch (error) {
    console.error('Time Out scraping error:', error);
  }

  return {
    events,
    source: 'Time Out Sydney',
    scrapedAt,
  };
}
