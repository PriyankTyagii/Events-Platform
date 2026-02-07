'use client';

import { useState } from 'react';
import { Event } from '@/types';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';

interface GetTicketsModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

export function GetTicketsModal({ event, isOpen, onClose }: GetTicketsModalProps) {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!event) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !consent) {
      setError('Please provide your email and consent to continue');
      return;
    }

    setLoading(true);

    try {
      // Save email to database
      const response = await fetch('/api/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          consent,
          eventId: event.id,
          eventTitle: event.title,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save email');
      }

      // Redirect to original event URL
      window.open(event.originalUrl, '_blank');
      
      // Close modal and reset
      setEmail('');
      setConsent(false);
      onClose();
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Get Tickets">
      <form onSubmit={handleSubmit}>
        <p className="text-gray-600 mb-4">
          Enter your email to continue to tickets for <strong>{event.title}</strong>
        </p>

        {/* Email Input */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="your@email.com"
            required
          />
        </div>

        {/* Consent Checkbox */}
        <div className="mb-4">
          <label className="flex items-start">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 mr-2 h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
              required
            />
            <span className="text-sm text-gray-600">
              I agree to receive emails about events and updates. You can unsubscribe at any time.
            </span>
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading || !email || !consent}
          className="w-full"
        >
          {loading ? 'Processing...' : 'Continue to Tickets'}
        </Button>
      </form>
    </Modal>
  );
}
