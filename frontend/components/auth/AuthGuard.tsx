'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { Loader2 } from 'lucide-react';

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      const isPublicPath = pathname === '/' || pathname === '/login';
      if (!user && !isPublicPath) {
        router.push('/login');
      }
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-bg-surface text-text-primary gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-accent-purple" />
        <span className="font-display font-medium text-sm text-text-muted">Loading ContribQuest...</span>
      </div>
    );
  }

  const isPublicPath = pathname === '/' || pathname === '/login';
  if (!user && !isPublicPath) {
    return null; // Preventing flash of protected content
  }

  return <>{children}</>;
};
