'use client'

import { Bell, Search, Zap } from 'lucide-react'
import { useAppStore } from '@/lib/store'

interface TopNavProps {
  title?: string
}

export function TopNav({ title }: TopNavProps) {
  const user = useAppStore((s) => s.user)

  return (
    <header
      className="fixed top-0 right-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-[rgba(16,20,26,0.8)] px-6 backdrop-blur-nav"
      style={{ left: 260 }}
    >
      {/* Search */}
      <div className="relative flex-1 max-w-xs">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="search"
          placeholder="Search repos, quests…"
          className="w-full rounded-md border border-border bg-bg-nested py-1.5 pl-8 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-purple transition-colors"
          aria-label="Search"
        />
      </div>

      {title && (
        <h1 className="font-display text-md font-bold text-text-primary hidden md:block">{title}</h1>
      )}

      <div className="ml-auto flex items-center gap-4">
        {/* XP balance */}
        {user && (
          <span className="hidden sm:inline-flex items-center gap-1.5 font-mono text-sm font-bold text-text-code">
            <Zap size={13} className="text-accent-purple" aria-hidden="true" />
            {user.total_xp.toLocaleString()} XP
          </span>
        )}

        {/* Notifications */}
        <button
          className="relative text-text-muted hover:text-text-primary transition-colors"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-accent-red" aria-hidden="true" />
        </button>

        {/* Avatar */}
        {user && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.avatar_url}
            alt={user.display_name}
            className="h-8 w-8 rounded-full border border-border"
          />
        )}
      </div>
    </header>
  )
}
