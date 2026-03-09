'use client';

import { AuthProvider } from '@/app/auth-context';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
