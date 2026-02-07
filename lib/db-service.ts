import { getFirebaseAdmin } from './firebase-admin';
import { Event } from '@/types';

const EVENTS_COLLECTION = 'events';

export async function saveScrapedEvents(
  scrapedEvents: Partial<Event>[]
): Promise<{ new: number; updated: number; inactive: number }> {
  const db = getFirebaseAdmin();
  const eventsRef = db.collection(EVENTS_COLLECTION);

  let newCount = 0;
  let updatedCount = 0;
  let inactiveCount = 0;

  const scrapedIds = new Set(scrapedEvents.map(e => e.id).filter(Boolean));
  const timestamp = new Date().toISOString();

  // Get all existing events
  const existingSnapshot = await eventsRef.get();
  const existingEvents = new Map<string, any>();
  
  existingSnapshot.forEach(doc => {
    existingEvents.set(doc.id, doc.data());
  });

  // Process scraped events
  for (const event of scrapedEvents) {
    if (!event.id) continue;

    const existingEvent = existingEvents.get(event.id);

    if (!existingEvent) {
      // New event
      await eventsRef.doc(event.id).set({
        ...event,
        status: 'new',
        createdAt: timestamp,
        lastScraped: timestamp,
      });
      newCount++;
    } else {
      // Check if event was updated
      const hasChanges = 
        existingEvent.title !== event.title ||
        existingEvent.date !== event.date ||
        existingEvent.venueName !== event.venueName ||
        existingEvent.description !== event.description;

      if (hasChanges) {
        await eventsRef.doc(event.id).update({
          ...event,
          status: existingEvent.status === 'imported' ? 'imported' : 'updated',
          updatedAt: timestamp,
          lastScraped: timestamp,
        });
        updatedCount++;
      } else {
        // Just update lastScraped
        await eventsRef.doc(event.id).update({
          lastScraped: timestamp,
        });
      }
    }
  }

  // Mark events as inactive if not in current scrape
  const cutoffDate = new Date();
  cutoffDate.setHours(cutoffDate.getHours() - 48); // 48 hours old

  for (const [id, event] of Array.from(existingEvents.entries())) {
    if (!scrapedIds.has(id) && event.status !== 'inactive') {
      const lastScraped = new Date(event.lastScraped);
      
      // Mark as inactive if not scraped in 48 hours OR event date has passed
      if (lastScraped < cutoffDate || new Date(event.date) < new Date()) {
        await eventsRef.doc(id).update({
          status: 'inactive',
          updatedAt: timestamp,
        });
        inactiveCount++;
      }
    }
  }

  console.log(`📝 Database updated: ${newCount} new, ${updatedCount} updated, ${inactiveCount} inactive`);

  return { new: newCount, updated: updatedCount, inactive: inactiveCount };
}

export async function getEvents(filters?: {
  city?: string;
  status?: string[];
  keyword?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
}): Promise<Event[]> {
  const db = getFirebaseAdmin();
  let query: any = db.collection(EVENTS_COLLECTION);

  // Apply filters
  if (filters?.city) {
    query = query.where('city', '==', filters.city);
  }

  if (filters?.status && filters.status.length > 0) {
    query = query.where('status', 'in', filters.status);
  }

  // Get results
  const snapshot = await query.get();
  let events: Event[] = [];

  snapshot.forEach((doc: any) => {
    events.push({ id: doc.id, ...doc.data() } as Event);
  });

  // Apply client-side filters (Firestore limitations)
  if (filters?.keyword) {
    const keyword = filters.keyword.toLowerCase();
    events = events.filter(e => 
      e.title?.toLowerCase().includes(keyword) ||
      e.description?.toLowerCase().includes(keyword) ||
      e.venueName?.toLowerCase().includes(keyword)
    );
  }

  if (filters?.dateFrom) {
    events = events.filter(e => e.date >= filters.dateFrom!);
  }

  if (filters?.dateTo) {
    events = events.filter(e => e.date <= filters.dateTo!);
  }

  // Sort by date
  events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Apply limit
  if (filters?.limit) {
    events = events.slice(0, filters.limit);
  }

  return events;
}

export async function importEvent(
  eventId: string,
  userId: string,
  notes?: string
): Promise<void> {
  const db = getFirebaseAdmin();
  await db.collection(EVENTS_COLLECTION).doc(eventId).update({
    status: 'imported',
    importedAt: new Date().toISOString(),
    importedBy: userId,
    importNotes: notes || '',
  });
}