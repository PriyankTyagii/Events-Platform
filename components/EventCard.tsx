'use client';

import { Event } from '@/types';
import { format } from 'date-fns';
import { Button } from './ui/Button';

interface EventCardProps {
  event: Event;
  onGetTickets: (event: Event) => void;
}

export function EventCard({ event, onGetTickets }: EventCardProps) {
  const formattedDate = event.date 
    ? format(new Date(event.date), 'EEE, MMM d, yyyy')
    : 'Date TBA';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Image */}
      {event.imageUrl && (
        <div className="relative h-48 w-full bg-gray-100">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {/* Category/Source */}
        <div className="flex items-center justify-between mb-2">
          {event.category && (
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {event.category}
            </span>
          )}
          <span className="text-xs text-gray-400">
            {event.sourceWebsite}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {event.title}
        </h3>

        {/* Date & Time */}
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{formattedDate}</span>
          {event.time && (
            <span className="ml-2">• {event.time}</span>
          )}
        </div>

        {/* Venue */}
        {event.venueName && (
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="line-clamp-1">{event.venueName}</span>
          </div>
        )}

        {/* Description */}
        {event.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {event.description}
          </p>
        )}

        {/* CTA Button */}
        <Button
          onClick={() => onGetTickets(event)}
          className="w-full"
        >
          GET TICKETS
        </Button>
      </div>
    </div>
  );
}
