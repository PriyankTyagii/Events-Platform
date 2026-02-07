import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, consent, eventId, eventTitle } = body;

    if (!email || consent === undefined || !eventId) {
      return NextResponse.json(
        { error: 'Missing required fields: email, consent, eventId' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Save to database
    const db = getFirebaseAdmin();
    await db.collection('emails').add({
      email,
      consent,
      eventId,
      eventTitle: eventTitle || 'Unknown Event',
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Email saved successfully',
    });
  } catch (error) {
    console.error('Error saving email:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to save email',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
