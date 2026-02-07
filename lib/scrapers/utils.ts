import axios from 'axios';
import * as cheerio from 'cheerio';
import { Event } from '@/types';
import puppeteer from 'puppeteer';

export interface ScraperResult {
  events: Partial<Event>[];
  source: string;
  scrapedAt: string;
}

// Basic fetch for static sites (TimeOut)
export async function fetchHTML(url: string): Promise<string> {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      timeout: 15000,
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
}

// Puppeteer fetch for dynamic sites (Eventbrite, Humanitix)
export async function fetchDynamicHTML(url: string, waitForSelector?: string, waitTime: number = 3000): Promise<string> {
  let browser;
  
  try {
    console.log(`🌐 Fetching dynamic content from: ${url}`);
    
    // Check if running on Vercel
    const isVercel = process.env.VERCEL === '1';
    
    if (isVercel) {
      // Use chromium for Vercel deployment
      const chromium = require('@sparticuz/chromium');
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      });
    } else {
      // Local development - use new headless mode
      browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
    }

    const page = await browser.newPage();
    
    // Set a realistic user agent
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    // Set viewport
    await page.setViewport({ width: 1920, height: 1080 });

    // Navigate to the page
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    // Wait for specific selector if provided
    if (waitForSelector) {
      try {
        await page.waitForSelector(waitForSelector, { timeout: 10000 });
        console.log(`✅ Found selector: ${waitForSelector}`);
      } catch (e) {
        console.warn(`⚠️ Selector ${waitForSelector} not found, continuing anyway...`);
      }
    }

    // Default wait for content to load
    await page.waitForTimeout(waitTime);

    // Special handling for Humanitix - scroll to trigger lazy loading
    if (url.includes('humanitix')) {
      console.log('📜 Scrolling to load lazy content...');
      
      // Scroll down in steps to trigger lazy loading
      await page.evaluate(async () => {
        await new Promise<void>((resolve) => {
          let totalHeight = 0;
          const distance = 100;
          const timer = setInterval(() => {
            const scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;

            if (totalHeight >= scrollHeight) {
              clearInterval(timer);
              resolve();
            }
          }, 100);
        });
      });
      
      // Wait for content to load after scroll
      await page.waitForTimeout(2000);
      
      // Scroll back to top
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(1000);
    }

    // Get the HTML
    const html = await page.content();
    console.log(`✅ Fetched ${html.length} characters from ${url}`);
    
    return html;
  } catch (error) {
    console.error(`❌ Error fetching dynamic content from ${url}:`, error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

export function cleanText(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

export function parseDate(dateStr: string): string {
  try {
    // Handle various date formats
    const cleaned = dateStr
      .replace(/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s*/i, '') // Remove day name
      .replace(/\s+at\s+/i, ' ') // Remove "at"
      .trim();
    
    const date = new Date(cleaned);
    
    // Check if valid date
    if (isNaN(date.getTime())) {
      console.warn(`Invalid date: ${dateStr}`);
      return new Date().toISOString();
    }
    
    return date.toISOString();
  } catch (error) {
    console.warn(`Error parsing date "${dateStr}":`, error);
    return new Date().toISOString();
  }
}

export function generateEventId(title: string, date: string, venue?: string): string {
  const baseStr = `${title}-${date}-${venue || 'online'}`;
  return baseStr
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
}