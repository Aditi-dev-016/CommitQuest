'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Map, Bookmark, GitBranch, GraduationCap, Users, Trophy, User,
  Settings, LifeBuoy, Plus,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/lib/store'
import type { Contributor } from '@/lib/types'

const NAV_ITEMS = [
  { href: '/dashboard',    label: 'Dashboard',           Icon: Map },
  { href: '/quests',       label: 'Quest Board',          Icon: Bookmark },
  { href: '/explore',      label: 'Repo Explorer',        Icon: GitBranch },
  { href: '/academy',      label: 'Learning Academy',     Icon: GraduationCap },
  { href: '/guilds',       label: 'Guild Hall',           Icon: Users },
  { href: '/achievements', label: 'Achievements',         Icon: Trophy },
  { href: '/profile',      label: 'Profile',              Icon: User },
] as const

const FOOTER_ITEMS = [
  { href: '/settings', label: 'Settings',  Icon: Settings },
  { href: '/support',  label: 'Support',   Icon: LifeBuoy },
] as const

interface SideNavProps {
  user?: Contributor | null
}

export function SideNav({ user }: SideNavProps) {
  const pathname = usePathname()

  return (
    <aside
      className="fixed left-0 top-0 z-40 flex h-screen w-[260px] flex-col border-r border-border bg-bg-surface shadow-nav"
      aria-label="Main navigation"
    >
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent-purple">
          <GitBranch size={16} className="text-white" />
        </div>
        <span className="font-display text-md font-bold text-text-code tracking-tight">
          ContribQuest
        </span>
      </div>

      {/* User card */}
      {user && (
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
          <div className="relative shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user.avatar_url}
              alt={user.display_name}
              className="h-10 w-10 rounded-full border-2 border-accent-purple"
            />
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-bg-overlay px-1.5 py-px font-mono text-2xs text-text-code whitespace-nowrap">
              LVL {user.current_level}
            </span>
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-text-primary">{user.display_name}</p>
            <p className="font-mono text-xs text-text-muted">{user.total_xp.toLocaleString()} XP</p>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="px-4 py-3">
        <Link
          href="/quests"
          className="flex w-full items-center justify-center gap-2 rounded-md bg-accent-purple-vivid px-4 py-2 text-sm font-bold text-[#3C0091] hover:opacity-90 transition-opacity"
        >
          <Plus size={15} aria-hidden="true" />
          Start New Quest
        </Link>
      </div>

      {/* Primary nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-2" aria-label="Primary">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-all mb-0.5',
                'border-r-2',
                active
                  ? 'bg-[rgba(94,106,210,0.05)] border-accent-purple text-text-primary'
                  : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
              )}
              aria-current={active ? 'page' : undefined}
            >
              <Icon size={16} aria-hidden="true" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer nav */}
      <div className="border-t border-border px-3 py-3">
        {FOOTER_ITEMS.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-all"
          >
            <Icon size={16} aria-hidden="true" />
            {label}
          </Link>
        ))}
      </div>
    </aside>
  )
}
