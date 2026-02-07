'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Event } from '@/types';
import { Header } from '@/components/Header';
import { Filters } from '@/components/dashboard/Filters';
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

  // Filters
  const [city, setCity] = useState('Sydney');
  const [keyword, setKeyword] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [status, setStatus] = useState<string[]>(['new', 'updated']);

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (city) params.append('city', city);
      if (keyword) params.append('keyword', keyword);
      if (dateFrom) params.append('dateFrom', new Date(dateFrom).toISOString());
      if (dateTo) params.append('dateTo', new Date(dateTo).toISOString());
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
        fetchEvents(); // Refresh the list
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

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Welcome, {user?.displayName || user?.email}
              </p>
            </div>

            <div>
              <Button
                onClick={handleRunScraper}
                disabled={scrapeLoading}
                variant="primary"
              >
                {scrapeLoading ? '⏳ Scraping...' : '🕷️ Run Scraper'}
              </Button>
            </div>
          </div>

          {/* Scraper Message */}
          {scrapeMessage && (
            <div className={`mb-6 p-4 rounded-lg ${
              scrapeMessage.includes('✅') 
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {scrapeMessage}
            </div>
          )}

          {/* Filters */}
          <Filters
            city={city}
            setCity={setCity}
            keyword={keyword}
            setKeyword={setKeyword}
            dateFrom={dateFrom}
            setDateFrom={setDateFrom}
            dateTo={dateTo}
            setDateTo={setDateTo}
            status={status}
            setStatus={setStatus}
            onRefresh={fetchEvents}
          />

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <p className="text-sm text-gray-600">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">{events.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <p className="text-sm text-gray-600">New</p>
              <p className="text-2xl font-bold text-green-600">
                {events.filter(e => e.status === 'new').length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <p className="text-sm text-gray-600">Updated</p>
              <p className="text-2xl font-bold text-blue-600">
                {events.filter(e => e.status === 'updated').length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <p className="text-sm text-gray-600">Imported</p>
              <p className="text-2xl font-bold text-purple-600">
                {events.filter(e => e.status === 'imported').length}
              </p>
            </div>
          </div>

          {/* Main Content - Table + Preview */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-black mb-4"></div>
                <p className="text-gray-600">Loading events...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Table - 2/3 width */}
              <div className="lg:col-span-2">
                <EventTable
                  events={events}
                  selectedEvent={selectedEvent}
                  onSelectEvent={setSelectedEvent}
                />
              </div>

              {/* Preview Panel - 1/3 width */}
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
