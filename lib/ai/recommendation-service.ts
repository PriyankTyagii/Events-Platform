// Using Hugging Face's free Inference API with Llama model
// No API key required for public models

import { Event } from '@/types';

const HF_API_URL = 'https://api-inference.huggingface.co/models/microsoft/Phi-3-mini-4k-instruct';

interface UserPreferences {
  interests?: string[];
  budget?: string;
  datePreference?: string;
  location?: string;
  crowdType?: string;
}

export async function generateRecommendations(
  events: Event[],
  preferences: UserPreferences
): Promise<{ recommendations: Event[]; explanation: string }> {
  try {
    // Create a prompt for the LLM
    const prompt = createPrompt(events, preferences);

    // Call Hugging Face API
    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 500,
          temperature: 0.7,
          top_p: 0.9,
          return_full_text: false,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('AI service unavailable');
    }

    const data = await response.json();
    const aiResponse = data[0]?.generated_text || '';

    // Parse AI response to get event IDs
    const recommendedIds = parseRecommendations(aiResponse, events);
    const recommendations = events.filter(e => recommendedIds.includes(e.id));

    return {
      recommendations: recommendations.slice(0, 5), // Top 5
      explanation: aiResponse,
    };
  } catch (error) {
    console.error('AI recommendation error:', error);
    // Fallback to simple filtering
    return fallbackRecommendations(events, preferences);
  }
}

function createPrompt(events: Event[], preferences: UserPreferences): string {
  const eventsList = events.slice(0, 20).map((e, i) => 
    `${i + 1}. ${e.title} - ${e.category || 'General'} at ${e.venueName || 'TBA'}`
  ).join('\n');

  const prefsText = [
    preferences.interests?.length ? `Interests: ${preferences.interests.join(', ')}` : '',
    preferences.budget ? `Budget: ${preferences.budget}` : '',
    preferences.datePreference ? `Date preference: ${preferences.datePreference}` : '',
    preferences.location ? `Location: ${preferences.location}` : '',
    preferences.crowdType ? `Crowd type: ${preferences.crowdType}` : '',
  ].filter(Boolean).join('. ');

  return `You are an event recommendation assistant for Sydney, Australia.

User Preferences: ${prefsText || 'No specific preferences'}

Available Events:
${eventsList}

Based on the user's preferences, recommend the top 3-5 events from the list above. Respond with:
1. The event numbers you recommend (e.g., "1, 5, 8")
2. A brief explanation why these events match the user's preferences

Your recommendation:`;
}

function parseRecommendations(aiResponse: string, events: Event[]): string[] {
  // Extract numbers from AI response
  const numbers = aiResponse.match(/\d+/g);
  if (!numbers) return [];

  // Convert to event IDs
  const eventIds: string[] = [];
  numbers.forEach(num => {
    const index = parseInt(num) - 1;
    if (index >= 0 && index < events.length) {
      eventIds.push(events[index].id);
    }
  });

  return eventIds;
}

function fallbackRecommendations(
  events: Event[],
  preferences: UserPreferences
): { recommendations: Event[]; explanation: string } {
  let filtered = [...events];

  // Simple keyword matching
  if (preferences.interests && preferences.interests.length > 0) {
    const keywords = preferences.interests.map(i => i.toLowerCase());
    filtered = filtered.filter(event => {
      const text = `${event.title} ${event.description} ${event.category}`.toLowerCase();
      return keywords.some(keyword => text.includes(keyword));
    });
  }

  // Filter by location preference
  if (preferences.location) {
    filtered = filtered.filter(event => 
      event.venueName?.toLowerCase().includes(preferences.location!.toLowerCase()) ||
      event.city.toLowerCase().includes(preferences.location!.toLowerCase())
    );
  }

  const recommendations = filtered.slice(0, 5);
  const explanation = preferences.interests?.length
    ? `Found ${recommendations.length} events matching your interests: ${preferences.interests.join(', ')}`
    : `Here are ${recommendations.length} upcoming events in Sydney`;

  return { recommendations, explanation };
}

// Simple in-memory storage for user preferences (would be DB in production)
const userPreferences = new Map<string, UserPreferences>();

export function saveUserPreferences(userId: string, prefs: UserPreferences) {
  userPreferences.set(userId, prefs);
}

export function getUserPreferences(userId: string): UserPreferences | null {
  return userPreferences.get(userId) || null;
}

export function matchNewEvent(event: Event, prefs: UserPreferences): boolean {
  if (!prefs.interests || prefs.interests.length === 0) return false;

  const text = `${event.title} ${event.description} ${event.category}`.toLowerCase();
  return prefs.interests.some(interest => 
    text.includes(interest.toLowerCase())
  );
}
