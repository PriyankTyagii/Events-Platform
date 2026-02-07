'use client';

import { useEffect, useState } from 'react';
import { Event } from '@/types';
import { EventCard } from '@/components/EventCard';
import { GetTicketsModal } from '@/components/GetTicketsModal';
import { Header } from '@/components/Header';
import { AIChat } from '@/components/AIChat';

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events?status=new,updated,imported&limit=50');
      const data = await response.json();
      
      if (data.success) {
        setEvents(data.events);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetTickets = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-4">
                Discover Sydney Events
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Your curated guide to the best events happening in Sydney
              </p>
              <div className="flex gap-4 justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold">{events.length}+</div>
                  <div className="text-sm text-gray-400">Events</div>
                </div>
                <div className="border-l border-gray-700"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold">3</div>
                  <div className="text-sm text-gray-400">Sources</div>
                </div>
                <div className="border-l border-gray-700"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold">24/7</div>
                  <div className="text-sm text-gray-400">Updated</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-black mb-4"></div>
                <p className="text-gray-600">Loading events...</p>
              </div>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-20">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-600">Check back soon for upcoming events in Sydney!</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  Upcoming Events
                </h2>
                <p className="text-sm text-gray-600">
                  {events.length} event{events.length !== 1 ? 's' : ''} available
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onGetTickets={handleGetTickets}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <GetTicketsModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <AIChat />
    </>
  );
}