'use client';

import { useState } from 'react';
import { Event } from '@/types';
import { format } from 'date-fns';
import { Button } from '../ui/Button';
import { useAuth } from '@/lib/auth-context';

interface EventPreviewProps {
  event: Event | null;
  onEventUpdated: () => void;
}

export function EventPreview({ event, onEventUpdated }: EventPreviewProps) {
  const { user } = useAuth();
  const [importNotes, setImportNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  if (!event) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center h-full flex items-center justify-center">
        <div>
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <p className="text-gray-600 text-sm">
            Select an event to view details
          </p>
        </div>
      </div>
    );
  }

  const handleImport = async () => {
    if (!user) return;

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/events/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event.id,
          userId: user.uid,
          notes: importNotes,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to import event');
      }

      setMessage('Event imported successfully!');
      setImportNotes('');
      onEventUpdated();
    } catch (error) {
      setMessage('Failed to import event');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full overflow-y-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        {event.title}
      </h2>

      {/* Status Badge */}
      <div className="mb-4">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          event.status === 'new' ? 'bg-green-100 text-green-800' :
          event.status === 'updated' ? 'bg-blue-100 text-blue-800' :
          event.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
          'bg-purple-100 text-purple-800'
        }`}>
          {event.status.toUpperCase()}
        </span>
      </div>

      {/* Image */}
      {event.imageUrl && (
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-48 object-cover rounded-lg mb-4"
          onError={(e) => e.currentTarget.style.display = 'none'}
        />
      )}

      {/* Details */}
      <div className="space-y-3 mb-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Date & Time</h3>
          <p className="text-gray-900">
            {event.date ? format(new Date(event.date), 'EEEE, MMMM d, yyyy') : 'TBA'}
            {event.time && ` at ${event.time}`}
          </p>
        </div>

        {event.venueName && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Venue</h3>
            <p className="text-gray-900">{event.venueName}</p>
            {event.venueAddress && (
              <p className="text-sm text-gray-600">{event.venueAddress}</p>
            )}
          </div>
        )}

        {event.description && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
            <p className="text-gray-900 text-sm">{event.description}</p>
          </div>
        )}

        {event.category && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Category</h3>
            <p className="text-gray-900">{event.category}</p>
          </div>
        )}

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Source</h3>
          <p className="text-gray-900">{event.sourceWebsite}</p>
          <a
            href={event.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline"
          >
            View original →
          </a>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Last Scraped</h3>
          <p className="text-gray-900 text-sm">
            {event.lastScraped ? format(new Date(event.lastScraped), 'MMM d, yyyy HH:mm') : 'N/A'}
          </p>
        </div>

        {event.importedAt && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Imported</h3>
            <p className="text-gray-900 text-sm">
              {format(new Date(event.importedAt), 'MMM d, yyyy HH:mm')}
            </p>
            {event.importedBy && (
              <p className="text-sm text-gray-600">By: {event.importedBy}</p>
            )}
            {event.importNotes && (
              <p className="text-sm text-gray-600 mt-1">Notes: {event.importNotes}</p>
            )}
          </div>
        )}
      </div>

      {/* Import Section */}
      {event.status !== 'imported' && (
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Import to Platform
          </h3>
          
          <textarea
            value={importNotes}
            onChange={(e) => setImportNotes(e.target.value)}
            placeholder="Add notes (optional)..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm mb-3"
            rows={3}
          />

          <Button
            onClick={handleImport}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Importing...' : 'Import Event'}
          </Button>

          {message && (
            <p className={`mt-2 text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
