export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/v1'

export const XP_PER_LEVEL = 5000 // simplified flat curve for now

export const DIFFICULTY_LABELS = {
  easy:   'EASY',
  medium: 'MEDIUM',
  hard:   'HARD',
} as const

export const QUEST_TYPES = {
  daily:     'daily',
  standard:  'standard',
  featured:  'featured',
  milestone: 'milestone',
} as const

export const NAV_ITEMS = [
  { href: '/dashboard',   label: 'Dashboard',            icon: 'Map' },
  { href: '/quests',      label: 'Quest Board',           icon: 'Bookmark' },
  { href: '/explore',     label: 'Repository Explorer',   icon: 'GitBranch' },
  { href: '/academy',     label: 'Learning Academy',      icon: 'GraduationCap' },
  { href: '/guilds',      label: 'Guild Hall',            icon: 'Users' },
  { href: '/achievements',label: 'Achievements',          icon: 'Trophy' },
  { href: '/profile',     label: 'Profile',               icon: 'User' },
] as const
