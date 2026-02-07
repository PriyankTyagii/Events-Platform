'use client';

import { Event } from '@/types';
import { format } from 'date-fns';

interface EventTableProps {
  events: Event[];
  selectedEvent: Event | null;
  onSelectEvent: (event: Event) => void;
}

export function EventTable({ events, selectedEvent, onSelectEvent }: EventTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-green-100 text-green-800';
      case 'updated':
        return 'bg-blue-100 text-blue-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'imported':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (events.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-600">No events found matching your filters</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Venue
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Source
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((event) => (
              <tr
                key={event.id}
                onClick={() => onSelectEvent(event)}
                className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedEvent?.id === event.id ? 'bg-blue-50' : ''
                }`}
              >
                <td className="px-4 py-3 text-sm text-gray-900">
                  <div className="max-w-xs truncate font-medium">
                    {event.title}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                  {event.date ? format(new Date(event.date), 'MMM d, yyyy') : 'TBA'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  <div className="max-w-xs truncate">
                    {event.venueName || 'N/A'}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {event.sourceWebsite}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                    {event.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
