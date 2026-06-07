import { cn } from '@/lib/utils'

type Difficulty = 'easy' | 'medium' | 'hard' | 'good_first_issue' | 'help_wanted' | 'documentation' | 'unknown'

const difficultyStyles: Record<Difficulty, string> = {
  easy:             'bg-[rgba(78,222,163,0.1)] border-[rgba(78,222,163,0.2)] text-accent-green',
  medium:           'bg-[rgba(245,158,11,0.1)] border-[rgba(245,158,11,0.2)] text-accent-amber',
  hard:             'bg-[rgba(239,68,68,0.1)] border-[rgba(239,68,68,0.2)] text-accent-red',
  good_first_issue: 'bg-[rgba(78,222,163,0.1)] border-[rgba(78,222,163,0.2)] text-accent-green',
  help_wanted:      'bg-[rgba(245,158,11,0.1)] border-[rgba(245,158,11,0.2)] text-accent-amber',
  documentation:    'bg-[rgba(208,188,255,0.1)] border-[rgba(208,188,255,0.2)] text-text-code',
  unknown:          'bg-bg-overlay border-border text-text-muted',
}

const difficultyLabels: Record<Difficulty, string> = {
  easy:             'EASY',
  medium:           'MEDIUM',
  hard:             'HARD',
  good_first_issue: 'GOOD FIRST ISSUE',
  help_wanted:      'HELP WANTED',
  documentation:    'DOCUMENTATION',
  unknown:          'UNKNOWN',
}

interface DifficultyBadgeProps {
  difficulty: Difficulty
  className?: string
}

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center border px-2 py-0.5 font-mono text-2xs uppercase tracking-widest rounded-sm',
        difficultyStyles[difficulty] ?? difficultyStyles.unknown,
        className
      )}
    >
      {difficultyLabels[difficulty] ?? difficulty.toUpperCase()}
    </span>
  )
}

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'purple' | 'green' | 'amber' | 'red'
  className?: string
}

const variantStyles: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-bg-overlay border-border text-text-secondary',
  purple:  'bg-[rgba(208,188,255,0.1)] border-[rgba(208,188,255,0.2)] text-text-code',
  green:   'bg-[rgba(78,222,163,0.1)] border-[rgba(78,222,163,0.2)] text-accent-green',
  amber:   'bg-[rgba(245,158,11,0.1)] border-[rgba(245,158,11,0.2)] text-accent-amber',
  red:     'bg-[rgba(239,68,68,0.1)] border-[rgba(239,68,68,0.2)] text-accent-red',
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center border px-2 py-0.5 font-mono text-2xs uppercase tracking-widest rounded-sm',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
