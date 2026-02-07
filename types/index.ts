export interface Event {
  id: string;
  title: string;
  date: string; // ISO date string
  time?: string;
  venueName?: string;
  venueAddress?: string;
  city: string;
  description: string;
  category?: string;
  tags?: string[];
  imageUrl?: string;
  sourceWebsite: string;
  originalUrl: string;
  lastScraped: string; // ISO date string
  status: 'new' | 'updated' | 'inactive' | 'imported';
  createdAt: string;
  updatedAt?: string;
  importedAt?: string;
  importedBy?: string;
  importNotes?: string;
}

export interface EmailCapture {
  id: string;
  email: string;
  consent: boolean;
  eventId: string;
  eventTitle: string;
  createdAt: string;
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}
