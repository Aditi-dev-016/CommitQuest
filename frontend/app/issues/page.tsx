'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { issues as issuesApi } from '@/lib/api'
import { queryKeys } from '@/lib/query-keys'
import { AppShell } from '@/components/layout/app-shell'
import { DifficultyBadge } from '@/components/ui/badge'
import { TagChip } from '@/components/ui/tag-chip'
import { Clock } from 'lucide-react'
import Link from 'next/link'
import type { IssueFilters } from '@/lib/types'

const DIFFICULTIES = ['all', 'easy', 'medium', 'hard'] as const
const LANGUAGES = ['all', 'TypeScript', 'Python', 'Rust', 'Go', 'JavaScript', 'Java'] as const

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime()
  const days = Math.floor(diff / 86_400_000)
  if (days === 0) return 'today'
  if (days === 1) return '1 day ago'
  if (days < 30) return `${days} days ago`
  return `${Math.floor(days / 30)}mo ago`
}

export default function IssuesPage() {
  const [difficulty, setDifficulty] = useState<string>('all')
  const [language, setLanguage]     = useState<string>('all')

  const filters: IssueFilters = {
    difficulty: difficulty === 'all' ? undefined : difficulty,
    language:   language   === 'all' ? undefined : language,
  }

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.issues(filters),
    queryFn: () => issuesApi.list(filters).then((r) => r.data),
    staleTime: 10 * 60 * 1000,
  })

  return (
    <AppShell title="Issue Finder">
      <div className="flex gap-6">
        {/* Filters */}
        <aside className="w-56 shrink-0" aria-label="Issue filters">
          <div className="rounded-xl border border-border bg-bg-surface p-5 flex flex-col gap-5 sticky top-20">
            <FilterGroup
              label="Difficulty"
              options={DIFFICULTIES}
              value={difficulty}
              onChange={setDifficulty}
            />
            <FilterGroup
              label="Language"
              options={LANGUAGES}
              value={language}
              onChange={setLanguage}
            />
          </div>
        </aside>

        {/* Issue list */}
        <main className="flex-1 min-w-0">
          <div className="mb-5">
            <h1 className="text-xl font-bold text-text-primary">Open Issues</h1>
            {!isLoading && (
              <p className="text-sm text-text-secondary mt-0.5">
                {data?.length ?? 0} issue{data?.length !== 1 ? 's' : ''} found
              </p>
            )}
          </div>

          {isLoading ? (
            <div className="flex flex-col gap-3 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-20 rounded-xl bg-bg-surface border border-border" />
              ))}
            </div>
          ) : !data?.length ? (
            <div className="rounded-xl border border-border bg-bg-surface p-12 text-center">
              <p className="text-text-muted mb-2">No issues match your filters.</p>
              <button
                onClick={() => { setDifficulty('all'); setLanguage('all') }}
                className="text-sm text-accent-purple-light hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {data.map((issue) => (
                <Link
                  key={issue.id}
                  href={`/issues/${issue.id}`}
                  className="flex items-start gap-4 rounded-xl border border-border bg-bg-surface p-4 hover:border-[rgba(94,106,210,0.3)] transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <DifficultyBadge difficulty={issue.difficulty} />
                      {issue.is_good_first_issue && (
                        <DifficultyBadge difficulty="good_first_issue" />
                      )}
                    </div>
                    <p className="text-sm font-semibold text-text-primary line-clamp-1">{issue.title}</p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {issue.repository?.full_name ?? 'Unknown repo'}
                    </p>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-1.5">
                    {issue.repository?.primary_language && (
                      <TagChip>{issue.repository.primary_language}</TagChip>
                    )}
                    <span className="flex items-center gap-1 font-mono text-xs text-text-muted">
                      <Clock size={10} aria-hidden="true" />
                      {timeAgo(issue.created_at)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </AppShell>
  )
}

function FilterGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: readonly string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <p className="font-mono text-2xs uppercase tracking-wider text-text-muted mb-2">{label}</p>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`flex w-full rounded-md px-3 py-1.5 text-sm mb-1 capitalize transition-colors ${
            value === opt
              ? 'bg-[rgba(94,106,210,0.1)] text-text-primary'
              : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}
