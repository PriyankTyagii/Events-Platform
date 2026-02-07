'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button } from './ui/Button';

export function Header() {
  const { user, signInWithGoogle, signOut } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-gray-900">
            Sydney Events
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    Dashboard
                  </Button>
                </Link>
                
                <div className="flex items-center gap-3">
                  {user.photoURL && (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <Button variant="outline" size="sm" onClick={signOut}>
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
              <Button variant="primary" size="sm" onClick={signInWithGoogle}>
                Sign In
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
