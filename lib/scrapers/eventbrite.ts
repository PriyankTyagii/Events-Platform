import * as cheerio from 'cheerio';
import { Event } from '@/types';
import { fetchDynamicHTML, cleanText, parseDate, generateEventId, ScraperResult } from './utils';

const EVENTBRITE_SYDNEY_URL = 'https://www.eventbrite.com.au/d/australia--sydney/all-events/';

export async function scrapeEventbrite(): Promise<ScraperResult> {
  const scrapedAt = new Date().toISOString();
  const events: Partial<Event>[] = [];

  try {
    console.log('🎟️ Scraping Eventbrite...');
    
    const html = await fetchDynamicHTML(EVENTBRITE_SYDNEY_URL);
    const $ = cheerio.load(html);

    // The debug shows 88 event links with class "event-card-link"
    // and 52 h3 elements with event titles
    console.log('Found event cards...');

    // Use the event-card class structure
    $('div.event-card, article.discover-search-desktop-card, article.discover-vertical-event-card').each((_, element) => {
      try {
        const $card = $(element);
        
        // Extract title from h3
        const title = cleanText(
          $card.find('h3').first().text()
        );

        if (!title || title.length < 3) return;

        // Extract link - look for the event-card-link
        const link = $card.find('a.event-card-link, a[data-event-id]').first().attr('href') || '';
        const fullUrl = link.startsWith('http') ? link : `https://www.eventbrite.com.au${link}`;

        // Extract image
        const image = $card.find('img').first().attr('src') || '';

        // Extract date from event-card-details
        const dateText = cleanText(
          $card.find('.event-card-details').first().text()
        );

        // Extract location
        const location = cleanText(
          $card.find('.event-card__clamp-line--one').last().text()
        );

        // Extract price
        const price = cleanText(
          $card.find('[class*="price"]').first().text()
        );

        const dateStr = dateText ? parseDate(dateText) : new Date().toISOString();
        
        if (title && !events.find(e => e.title === title)) {
          events.push({
            id: generateEventId(title, dateStr, location),
            title,
            date: dateStr,
            venueName: location || 'Sydney',
            city: 'Sydney',
            description: price ? `${title}. ${price}` : title,
            imageUrl: image,
            sourceWebsite: 'Eventbrite',
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

    // If above didn't work, try direct approach with links
    if (events.length === 0) {
      console.log('Trying alternative selector...');
      
      $('a[data-event-id]').each((_, element) => {
        try {
          const $link = $(element);
          const $parent = $link.closest('div, article');
          
          const title = cleanText($parent.find('h3').first().text());
          if (!title || title.length < 3) return;
          
          const href = $link.attr('href') || '';
          const fullUrl = href.startsWith('http') ? href : `https://www.eventbrite.com.au${href}`;
          const image = $parent.find('img').first().attr('src') || '';
          
          if (title && !events.find(e => e.title === title)) {
            events.push({
              id: generateEventId(title, new Date().toISOString(), 'Sydney'),
              title,
              date: new Date().toISOString(),
              venueName: 'Sydney',
              city: 'Sydney',
              description: title,
              imageUrl: image,
              sourceWebsite: 'Eventbrite',
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

    console.log(`✅ Eventbrite: Found ${events.length} events`);

  } catch (error) {
    console.error('❌ Eventbrite scraping error:', error);
  }

  return {
    events,
    source: 'Eventbrite',
    scrapedAt,
  };
}