import { NextRequest, NextResponse } from 'next/server';
import { getEvents } from '@/lib/db-service';
import { generateRecommendations, saveUserPreferences } from '@/lib/ai/recommendation-service';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

interface ChatRequest {
  message: string;
  userId?: string;
  preferences?: {
    interests?: string[];
    budget?: string;
    datePreference?: string;
    location?: string;
    crowdType?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, userId, preferences } = body;

    // Parse user message to extract preferences
    const extractedPrefs = preferences || extractPreferencesFromMessage(message);

    // Save preferences if userId provided
    if (userId && extractedPrefs) {
      saveUserPreferences(userId, extractedPrefs);
    }

    // Get available events
    const events = await getEvents({
      city: 'Sydney',
      status: ['new', 'updated'],
      limit: 50,
    });

    if (events.length === 0) {
      return NextResponse.json({
        success: true,
        message: "I don't see any events available right now. Please check back later!",
        recommendations: [],
      });
    }

    // Generate recommendations using AI
    const { recommendations, explanation } = await generateRecommendations(
      events,
      extractedPrefs
    );

    return NextResponse.json({
      success: true,
      message: explanation,
      recommendations: recommendations.map(e => ({
        id: e.id,
        title: e.title,
        date: e.date,
        venueName: e.venueName,
        category: e.category,
        description: e.description?.substring(0, 150) + '...',
        imageUrl: e.imageUrl,
        originalUrl: e.originalUrl,
      })),
      preferences: extractedPrefs,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate recommendations',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

function extractPreferencesFromMessage(message: string): any {
  const lowerMsg = message.toLowerCase();
  const preferences: any = {
    interests: [],
  };

  // Extract interests/categories
  const categories = ['music', 'food', 'art', 'sports', 'comedy', 'theater', 'festival', 'workshop', 'concert', 'exhibition'];
  categories.forEach(cat => {
    if (lowerMsg.includes(cat)) {
      preferences.interests.push(cat);
    }
  });

  // Extract budget
  if (lowerMsg.includes('free') || lowerMsg.includes('no cost')) {
    preferences.budget = 'free';
  } else if (lowerMsg.includes('cheap') || lowerMsg.includes('budget')) {
    preferences.budget = 'low';
  } else if (lowerMsg.includes('expensive') || lowerMsg.includes('premium')) {
    preferences.budget = 'high';
  }

  // Extract date preferences
  if (lowerMsg.includes('today') || lowerMsg.includes('tonight')) {
    preferences.datePreference = 'today';
  } else if (lowerMsg.includes('weekend') || lowerMsg.includes('saturday') || lowerMsg.includes('sunday')) {
    preferences.datePreference = 'weekend';
  } else if (lowerMsg.includes('this week')) {
    preferences.datePreference = 'this-week';
  }

  // Extract crowd type
  if (lowerMsg.includes('family') || lowerMsg.includes('kids')) {
    preferences.crowdType = 'family-friendly';
  } else if (lowerMsg.includes('date') || lowerMsg.includes('romantic')) {
    preferences.crowdType = 'romantic';
  } else if (lowerMsg.includes('party') || lowerMsg.includes('nightlife')) {
    preferences.crowdType = 'party';
  }

  return preferences;
}
