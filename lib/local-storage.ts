// Simple local file-based storage for development (no Firebase needed)
import fs from 'fs';
import path from 'path';
import { Event } from '@/types';

const DATA_FILE = path.join(process.cwd(), 'local-events-db.json');

interface LocalDB {
  events: Event[];
}

function readDB(): LocalDB {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading local DB:', error);
  }
  return { events: [] };
}

function writeDB(db: LocalDB) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing local DB:', error);
  }
}

export function saveEventsLocal(events: Partial<Event>[]): { new: number; updated: number } {
  const db = readDB();
  let newCount = 0;
  let updatedCount = 0;

  events.forEach(event => {
    const existingIndex = db.events.findIndex(e => e.id === event.id);
    
    if (existingIndex === -1) {
      // New event
      db.events.push(event as Event);
      newCount++;
    } else {
      // Update existing
      db.events[existingIndex] = { ...db.events[existingIndex], ...event } as Event;
      updatedCount++;
    }
  });

  writeDB(db);
  return { new: newCount, updated: updatedCount };
}

export function getEventsLocal(filters?: {
  city?: string;
  status?: string[];
  keyword?: string;
  limit?: number;
}): Event[] {
  const db = readDB();
  let events = [...db.events];

  // Apply filters
  if (filters?.city) {
    events = events.filter(e => e.city === filters.city);
  }

  if (filters?.status && filters.status.length > 0) {
    events = events.filter(e => filters.status!.includes(e.status));
  }

  if (filters?.keyword) {
    const keyword = filters.keyword.toLowerCase();
    events = events.filter(e =>
      e.title?.toLowerCase().includes(keyword) ||
      e.description?.toLowerCase().includes(keyword) ||
      e.venueName?.toLowerCase().includes(keyword)
    );
  }

  // Sort by date
  events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Apply limit
  if (filters?.limit) {
    events = events.slice(0, filters.limit);
  }

  return events;
}

export function updateEventLocal(eventId: string, updates: Partial<Event>): boolean {
  const db = readDB();
  const index = db.events.findIndex(e => e.id === eventId);
  
  if (index !== -1) {
    db.events[index] = { ...db.events[index], ...updates };
    writeDB(db);
    return true;
  }
  
  return false;
}