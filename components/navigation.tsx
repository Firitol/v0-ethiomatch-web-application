'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, MessageCircle, User } from 'lucide-react';
import { useAuth } from '@/app/auth-context';
import { Button } from '@/components/ui/button';

export function Navigation() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Heart className="w-8 h-8 text-primary fill-primary" />
          <span className="text-xl font-bold text-foreground hidden sm:inline">
            Ethiomatch
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/">
            <Button
              variant={isActive('/') ? 'default' : 'ghost'}
              size="sm"
              className="gap-2"
            >
              <Heart size={18} />
              <span className="hidden sm:inline">Discover</span>
            </Button>
          </Link>

          <Link href="/matches">
            <Button
              variant={isActive('/matches') ? 'default' : 'ghost'}
              size="sm"
              className="gap-2"
            >
              <MessageCircle size={18} />
              <span className="hidden sm:inline">Matches</span>
            </Button>
          </Link>

          <Link href="/profile">
            <Button
              variant={isActive('/profile') ? 'default' : 'ghost'}
              size="sm"
              className="gap-2"
            >
              <User size={18} />
              <span className="hidden sm:inline">Profile</span>
            </Button>
          </Link>

          <Button
            variant="outline"
            size="sm"
            onClick={logout}
          >
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}
