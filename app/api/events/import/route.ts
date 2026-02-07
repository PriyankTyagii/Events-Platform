import { NextRequest, NextResponse } from 'next/server';
import { importEvent } from '@/lib/db-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventId, userId, notes } = body;

    if (!eventId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: eventId, userId' },
        { status: 400 }
      );
    }

    await importEvent(eventId, userId, notes);

    return NextResponse.json({
      success: true,
      message: 'Event imported successfully',
    });
  } catch (error) {
    console.error('Error importing event:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to import event',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
