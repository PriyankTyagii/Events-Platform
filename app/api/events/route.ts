import { NextRequest, NextResponse } from 'next/server';
import { getEvents } from '@/lib/db-service';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse filters from query params
    const city = searchParams.get('city') || undefined;
    const keyword = searchParams.get('keyword') || undefined;
    const dateFrom = searchParams.get('dateFrom') || undefined;
    const dateTo = searchParams.get('dateTo') || undefined;
    const statusParam = searchParams.get('status');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

    const status = statusParam 
      ? statusParam.split(',').filter(Boolean)
      : undefined;

    // Fetch events from database
    const events = await getEvents({
      city,
      status,
      keyword,
      dateFrom,
      dateTo,
      limit,
    });

    return NextResponse.json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch events',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
