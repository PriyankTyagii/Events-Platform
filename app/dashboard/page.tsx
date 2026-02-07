'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Event } from '@/types';
import { Header } from '@/components/Header';
import { EventTable } from '@/components/dashboard/EventTable';
import { EventPreview } from '@/components/dashboard/EventPreview';
import { Button } from '@/components/ui/Button';

export default function DashboardPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [scrapeLoading, setScrapeLoading] = useState(false);
  const [scrapeMessage, setScrapeMessage] = useState('');

  // Simplified filters
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState<string[]>(['new', 'updated']);

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user, keyword, status]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('city', 'Sydney');
      if (keyword) params.append('keyword', keyword);
      if (status.length > 0) params.append('status', status.join(','));

      const response = await fetch(`/api/events?${params.toString()}`);
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

  const handleRunScraper = async () => {
    setScrapeLoading(true);
    setScrapeMessage('');

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        setScrapeMessage(
          `✅ Scraped ${data.data.totalScraped} events. ` +
          `${data.data.database.new} new, ${data.data.database.updated} updated, ${data.data.database.inactive} inactive.`
        );
        fetchEvents();
      } else {
        setScrapeMessage('❌ Scraping failed');
      }
    } catch (error) {
      setScrapeMessage('❌ Error running scraper');
      console.error(error);
    } finally {
      setScrapeLoading(false);
    }
  };

  const toggleStatus = (s: string) => {
    if (status.includes(s)) {
      setStatus(status.filter(st => st !== s));
    } else {
      setStatus([...status, s]);
    }
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600 mt-1">
                  Manage and curate events for Sydney Events
                </p>
              </div>

              <Button
                onClick={handleRunScraper}
                disabled={scrapeLoading}
                variant="primary"
              >
                {scrapeLoading ? '⏳ Scraping...' : '🕷️ Run Scraper'}
              </Button>
            </div>

            {/* Scraper Message */}
            {scrapeMessage && (
              <div className={`p-4 rounded-lg ${
                scrapeMessage.includes('✅') 
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                {scrapeMessage}
              </div>
            )}
          </div>

          {/* Simplified Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Events
                </label>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Search by title, venue..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {['new', 'updated', 'imported', 'inactive'].map((s) => (
                    <button
                      key={s}
                      onClick={() => toggleStatus(s)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        status.includes(s)
                          ? 'bg-black text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <p className="text-sm text-gray-600 mb-1">Total</p>
              <p className="text-2xl font-bold text-gray-900">{events.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <p className="text-sm text-gray-600 mb-1">New</p>
              <p className="text-2xl font-bold text-green-600">
                {events.filter(e => e.status === 'new').length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <p className="text-sm text-gray-600 mb-1">Updated</p>
              <p className="text-2xl font-bold text-blue-600">
                {events.filter(e => e.status === 'updated').length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <p className="text-sm text-gray-600 mb-1">Imported</p>
              <p className="text-2xl font-bold text-purple-600">
                {events.filter(e => e.status === 'imported').length}
              </p>
            </div>
          </div>

          {/* Main Content */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-black mb-4"></div>
                <p className="text-gray-600">Loading events...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <EventTable
                  events={events}
                  selectedEvent={selectedEvent}
                  onSelectEvent={setSelectedEvent}
                />
              </div>

              <div className="lg:col-span-1">
                <EventPreview
                  event={selectedEvent}
                  onEventUpdated={fetchEvents}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}