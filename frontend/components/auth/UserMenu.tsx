'use client';

import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LogOut, User, Zap, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export const UserMenu: React.FC = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-bg-surface hover:bg-bg-elevated text-text-primary transition-all duration-200"
      >
        <img
          src={user.photoURL || 'https://via.placeholder.com/150'}
          alt={user.displayName}
          className="w-8 h-8 rounded-lg border border-accent-purple shrink-0"
        />
        <div className="text-left hidden md:block">
          <p className="text-xs font-bold leading-none">{user.displayName}</p>
          <span className="text-2xs font-mono text-text-muted">LVL {user.level}</span>
        </div>
        <ChevronDown className="w-4 h-4 text-text-muted" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-bg-overlay p-1 shadow-lg z-20 animate-in fade-in slide-in-from-top-2 duration-100">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg hover:bg-bg-elevated text-text-secondary hover:text-text-primary transition-colors"
            >
              <User className="w-4 h-4 text-accent-purple" />
              My Profile
            </Link>
            <div className="flex items-center gap-2 w-full px-3 py-2 text-xs text-text-muted font-mono border-b border-border">
              <Zap className="w-3.5 h-3.5 text-accent-amber" />
              {user.xp.toLocaleString()} XP
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 rounded-lg hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
};
