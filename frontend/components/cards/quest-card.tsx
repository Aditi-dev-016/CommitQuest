import { Clock, Zap } from 'lucide-react'
import { DifficultyBadge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Quest, QuestProgress } from '@/lib/types'

interface QuestCardProps {
  quest: Quest
  progress?: QuestProgress
  onStart?: (questId: string) => void
  className?: string
}

export function QuestCard({ quest, progress, onStart, className }: QuestCardProps) {
  const status = progress?.status ?? 'available'
  const isActive = status === 'active'
  const isComplete = status === 'complete'

  return (
    <article
      className={cn(
        'flex flex-col gap-3 rounded-xl border border-border bg-bg-surface p-5 transition-colors hover:border-[rgba(94,106,210,0.3)]',
        className
      )}
    >
      {/* Header row */}
      <div className="flex items-center justify-between gap-2">
        <DifficultyBadge difficulty={quest.difficulty} />
        <span className="flex items-center gap-1 font-mono text-xs text-text-muted">
          <Clock size={11} aria-hidden="true" /> 30m est.
        </span>
      </div>

      {/* Title + description */}
      <div className="flex-1">
        <h3 className="text-sm font-bold text-text-primary line-clamp-2">{quest.title}</h3>
        <p className="mt-1 text-sm text-text-secondary line-clamp-2">{quest.description}</p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <span className="inline-flex items-center gap-1.5 font-mono text-sm font-bold text-text-code">
          <Zap size={13} aria-hidden="true" />
          {quest.xp_reward} XP
        </span>

        {isComplete ? (
          <span className="font-mono text-xs text-accent-green uppercase tracking-wider">Completed</span>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onStart?.(quest.id)}
            aria-label={`${isActive ? 'Continue' : 'Start'} quest: ${quest.title}`}
          >
            {isActive ? 'Continue' : 'Start Quest'}
          </Button>
        )}
      </div>
    </article>
  )
}
