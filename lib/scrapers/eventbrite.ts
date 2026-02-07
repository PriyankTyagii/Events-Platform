import * as cheerio from 'cheerio';
import { Event } from '@/types';
import { fetchHTML, cleanText, parseDate, generateEventId, ScraperResult } from './utils';

const EVENTBRITE_SYDNEY_URL = 'https://www.eventbrite.com.au/d/australia--sydney/events/';

export async function scrapeEventbrite(): Promise<ScraperResult> {
  const scrapedAt = new Date().toISOString();
  const events: Partial<Event>[] = [];

  try {
    const html = await fetchHTML(EVENTBRITE_SYDNEY_URL);
    const $ = cheerio.load(html);

    // Eventbrite uses JSON-LD structured data
    $('script[type="application/ld+json"]').each((_, element) => {
      try {
        const jsonData = JSON.parse($(element).html() || '{}');
        
        if (jsonData['@type'] === 'Event' || (Array.isArray(jsonData) && jsonData[0]?.['@type'] === 'Event')) {
          const eventData = Array.isArray(jsonData) ? jsonData[0] : jsonData;
          
          const title = cleanText(eventData.name || '');
          const dateStr = eventData.startDate || new Date().toISOString();
          const venue = eventData.location?.name || '';
          
          if (title) {
            events.push({
              id: generateEventId(title, dateStr, venue),
              title,
              date: parseDate(dateStr),
              time: new Date(dateStr).toLocaleTimeString('en-AU', { 
                hour: '2-digit', 
                minute: '2-digit' 
              }),
              venueName: venue,
              venueAddress: eventData.location?.address?.streetAddress || '',
              city: 'Sydney',
              description: cleanText(eventData.description || ''),
              imageUrl: eventData.image || '',
              sourceWebsite: 'Eventbrite',
              originalUrl: eventData.url || EVENTBRITE_SYDNEY_URL,
              lastScraped: scrapedAt,
              status: 'new',
              createdAt: scrapedAt,
            });
          }
        }
      } catch (e) {
        // Skip invalid JSON
      }
    });

    // Fallback: Parse HTML structure
    $('.discover-search-desktop-card').each((_, element) => {
      try {
        const $card = $(element);
        const title = cleanText($card.find('[data-testid="event-card-title"]').text());
        const dateText = cleanText($card.find('[data-testid="event-card-date"]').text());
        const location = cleanText($card.find('[data-testid="event-card-location"]').text());
        const link = $card.find('a').first().attr('href') || '';
        const image = $card.find('img').first().attr('src') || '';

        if (title && !events.find(e => e.title === title)) {
          const dateStr = new Date().toISOString(); // Fallback date
          
          events.push({
            id: generateEventId(title, dateStr, location),
            title,
            date: dateStr,
            venueName: location,
            city: 'Sydney',
            description: '',
            imageUrl: image,
            sourceWebsite: 'Eventbrite',
            originalUrl: link.startsWith('http') ? link : `https://www.eventbrite.com.au${link}`,
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
    console.error('Eventbrite scraping error:', error);
  }

  return {
    events,
    source: 'Eventbrite',
    scrapedAt,
  };
}
