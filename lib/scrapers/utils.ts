import axios from 'axios';
import * as cheerio from 'cheerio';
import { Event } from '@/types';

export interface ScraperResult {
  events: Partial<Event>[];
  source: string;
  scrapedAt: string;
}

export async function fetchHTML(url: string): Promise<string> {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 15000,
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
}

export function cleanText(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

export function parseDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toISOString();
  } catch {
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
