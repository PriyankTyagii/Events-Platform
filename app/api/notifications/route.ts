import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/firebase-admin';
import { getUserPreferences, matchNewEvent } from '@/lib/ai/recommendation-service';
import { Event } from '@/types';

export const dynamic = 'force-dynamic';

// This would be called after scraping new events
export async function POST(request: NextRequest) {
  try {
    const { events, userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    // Get user preferences
    const prefs = getUserPreferences(userId);
    if (!prefs) {
      return NextResponse.json({
        success: true,
        matches: [],
        message: 'No preferences set',
      });
    }

    // Find matching events
    const matches: Event[] = events.filter((event: Event) => 
      matchNewEvent(event, prefs)
    );

    if (matches.length > 0) {
      // Store notification in database
      const db = getFirebaseAdmin();
      await db.collection('notifications').add({
        userId,
        events: matches.map(e => e.id),
        preferences: prefs,
        createdAt: new Date().toISOString(),
        read: false,
      });
    }

    return NextResponse.json({
      success: true,
      matches: matches.map(e => ({
        id: e.id,
        title: e.title,
        date: e.date,
      })),
      message: matches.length > 0 
        ? `Found ${matches.length} new event${matches.length > 1 ? 's' : ''} matching your preferences!`
        : 'No new matching events',
    });
  } catch (error) {
    console.error('Notification error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to check notifications' 
      },
      { status: 500 }
    );
  }
}

// Get notifications for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    const db = getFirebaseAdmin();
    const snapshot = await db
      .collection('notifications')
      .where('userId', '==', userId)
      .where('read', '==', false)
      .orderBy('createdAt', 'desc')
      .limit(10)
      .get();

    const notifications: any[] = [];
    snapshot.forEach(doc => {
      notifications.push({ id: doc.id, ...doc.data() });
    });

    return NextResponse.json({
      success: true,
      notifications,
      count: notifications.length,
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get notifications' },
      { status: 500 }
    );
  }
}
