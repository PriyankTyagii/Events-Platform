import * as cheerio from 'cheerio';
import { Event } from '@/types';
import { fetchHTML, cleanText, parseDate, generateEventId, ScraperResult } from './utils';

const HUMANITIX_SYDNEY_URL = 'https://events.humanitix.com/au/sydney';

export async function scrapeHumanitix(): Promise<ScraperResult> {
  const scrapedAt = new Date().toISOString();
  const events: Partial<Event>[] = [];

  try {
    const html = await fetchHTML(HUMANITIX_SYDNEY_URL);
    const $ = cheerio.load(html);

    // Humanitix event cards
    $('[class*="EventCard"], [data-testid*="event"], .event-card').each((_, element) => {
      try {
        const $card = $(element);
        
        const title = cleanText(
          $card.find('h2, h3, h4, [class*="title"], [class*="name"]').first().text()
        );

        if (!title || title.length < 3) return;

        const link = $card.find('a').first().attr('href') || '';
        const fullUrl = link.startsWith('http') ? link : `https://events.humanitix.com${link}`;

        const image = $card.find('img').first().attr('src') || 
                     $card.find('img').first().attr('data-src') || '';

        const dateText = cleanText(
          $card.find('[class*="date"], [class*="time"]').first().text()
        );

        const venue = cleanText(
          $card.find('[class*="venue"], [class*="location"]').first().text()
        );

        const description = cleanText(
          $card.find('p, [class*="description"]').first().text()
        );

        const priceText = cleanText(
          $card.find('[class*="price"]').first().text()
        );

        const dateStr = new Date().toISOString();

        if (title && !events.find(e => e.title === title)) {
          events.push({
            id: generateEventId(title, dateStr, venue),
            title,
            date: dateStr,
            venueName: venue || 'Sydney',
            city: 'Sydney',
            description: description || `${title}. ${priceText}`,
            imageUrl: image,
            sourceWebsite: 'Humanitix',
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
    console.error('Humanitix scraping error:', error);
  }

  return {
    events,
    source: 'Humanitix',
    scrapedAt,
  };
}
