import { Star, GitFork } from 'lucide-react'
import { TagChip } from '@/components/ui/tag-chip'
import { Button } from '@/components/ui/button'
import { ProgressBar } from '@/components/ui/progress-bar'
import { cn } from '@/lib/utils'
import type { Repository, RepositoryAnalysis } from '@/lib/types'

interface RepoCardProps {
  repo: Repository
  analysis?: Pick<RepositoryAnalysis, 'beginner_score' | 'tech_stack'>
  onExplore?: (fullName: string) => void
  className?: string
}

export function RepoCard({ repo, analysis, onExplore, className }: RepoCardProps) {
  return (
    <article
      className={cn(
        'flex flex-col rounded-xl border border-border bg-bg-surface overflow-hidden',
        className
      )}
    >
      {/* Card header */}
      <div className="flex items-center justify-between gap-2 bg-bg-elevated px-4 py-3 border-b border-border">
        <span className="text-sm font-bold text-text-primary truncate">{repo.full_name}</span>
        <div className="flex items-center gap-3 shrink-0 text-text-muted">
          <span className="flex items-center gap-1 font-mono text-xs">
            <Star size={11} aria-hidden="true" /> {formatCount(repo.star_count)}
          </span>
          <span className="flex items-center gap-1 font-mono text-xs">
            <GitFork size={11} aria-hidden="true" /> {formatCount(repo.fork_count)}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3 p-4 flex-1">
        {/* Language tags */}
        <div className="flex flex-wrap gap-1.5">
          {repo.primary_language && <TagChip>{repo.primary_language}</TagChip>}
          {analysis?.tech_stack?.slice(0, 2).map((t) => (
            <TagChip key={t}>{t}</TagChip>
          ))}
        </div>

        {/* Stats */}
        {analysis && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="font-mono text-2xs uppercase text-text-muted mb-1">Beginner Score</p>
              <ProgressBar value={analysis.beginner_score} showPercent variant="green" height="sm" />
            </div>
            <div>
              <p className="font-mono text-2xs uppercase text-text-muted mb-1">Open Issues</p>
              <span className="font-mono text-sm font-bold text-text-primary">
                {repo.open_issue_count}
              </span>
            </div>
          </div>
        )}

        {/* Description */}
        {repo.description && (
          <p className="text-sm text-text-secondary line-clamp-2">{repo.description}</p>
        )}
      </div>

      {/* CTA */}
      <div className="px-4 pb-4">
        <Button
          variant="outline"
          size="md"
          className="w-full"
          onClick={() => onExplore?.(repo.full_name)}
          aria-label={`Explore ${repo.full_name}`}
        >
          Explore Codebase
        </Button>
      </div>
    </article>
  )
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}
