'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button } from './ui/Button';

export function Header() {
  const { user, signInWithGoogle, signOut } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xl font-bold text-gray-900">Sydney Events</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    📊 Dashboard
                  </Button>
                </Link>
                
                <div className="h-8 w-px bg-gray-300"></div>
                
                <div className="flex items-center gap-3">
                  {user.photoURL && (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-8 h-8 rounded-full border-2 border-gray-200"
                    />
                  )}
                  <span className="text-sm text-gray-700 hidden sm:block">
                    {user.displayName || user.email}
                  </span>
                  <Button variant="outline" size="sm" onClick={signOut}>
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
              <Button variant="primary" size="sm" onClick={signInWithGoogle}>
                🔐 Admin Login
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}