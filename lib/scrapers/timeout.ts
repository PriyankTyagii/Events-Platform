import * as cheerio from 'cheerio';
import { Event } from '@/types';
import { fetchHTML, cleanText, parseDate, generateEventId, ScraperResult } from './utils';

const TIMEOUT_SYDNEY_URL = 'https://www.timeout.com/sydney/things-to-do/things-to-do-in-sydney-this-week';

export async function scrapeTimeOut(): Promise<ScraperResult> {
  const scrapedAt = new Date().toISOString();
  const events: Partial<Event>[] = [];

  try {
    const html = await fetchHTML(TIMEOUT_SYDNEY_URL);
    const $ = cheerio.load(html);

    // Time Out article cards
    $('article, div[class*="card"], div._h1, div[class*="CardWrapper"]').each((_, element) => {
      try {
        const $card = $(element);
        
        // Extract title - try multiple selectors
        const title = cleanText(
          $card.find('h2, h3, h4, a[class*="title"]').first().text() ||
          $card.find('a').first().text()
        );

        if (!title || title.length < 5) return;

        // Get link
        const link = $card.find('a').first().attr('href') || '';
        const fullUrl = link.startsWith('http') ? link : `https://www.timeout.com${link}`;

        // Get image
        const image = $card.find('img').first().attr('src') || 
                     $card.find('img').first().attr('data-src') || 
                     $card.find('img').first().attr('data-lazy-src') || '';

        // Get description
        const description = cleanText(
          $card.find('p, div[class*="description"], div[class*="excerpt"]').first().text()
        );

        // Get category
        const category = cleanText(
          $card.find('span[class*="category"], a[class*="category"], div[class*="tag"]').first().text()
        );

        const dateStr = new Date().toISOString();

        if (title && !events.find(e => e.title === title)) {
          events.push({
            id: generateEventId(title, dateStr, 'Sydney'),
            title,
            date: dateStr,
            venueName: 'Sydney',
            city: 'Sydney',
            description: description || title,
            category: category || 'Events',
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