'use client'

import { useQuery } from '@tanstack/react-query'
import { achievements as achievementsApi } from '@/lib/api'
import { queryKeys } from '@/lib/query-keys'
import { AppShell } from '@/components/layout/app-shell'
import { Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Achievement } from '@/lib/types'

const TIER_STYLES: Record<Achievement['tier'], { border: string; glow: string; label: string }> = {
  bronze:    { border: 'border-[#FB923C]',  glow: 'shadow-[0_0_12px_rgba(251,146,60,0.4)]',   label: 'Bronze' },
  silver:    { border: 'border-[#94A3B8]',  glow: 'shadow-[0_0_12px_rgba(148,163,184,0.4)]',  label: 'Silver' },
  gold:      { border: 'border-[#FACC15]',  glow: 'shadow-[0_0_12px_rgba(250,204,21,0.4)]',   label: 'Gold' },
  legendary: { border: 'border-accent-purple-vivid', glow: 'shadow-glow-purple', label: 'Legendary' },
}

export default function AchievementsPage() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.achievements,
    queryFn: () => achievementsApi.list().then((r) => r.data),
  })

  const unlocked = data?.filter((a) => a.unlocked_at) ?? []
  const locked   = data?.filter((a) => !a.unlocked_at) ?? []

  return (
    <AppShell title="Achievements">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        {/* Summary */}
        <div className="rounded-xl border border-border bg-bg-surface p-6 flex items-center gap-4">
          <Trophy size={28} className="text-accent-amber" aria-hidden="true" />
          <div>
            <h1 className="text-xl font-bold text-text-primary">Achievement Showcase</h1>
            {!isLoading && (
              <p className="text-sm text-text-secondary mt-0.5">
                {unlocked.length} / {data?.length ?? '…'} unlocked
              </p>
            )}
          </div>
        </div>

        {isLoading ? (
          <AchievementGrid count={12} loading />
        ) : (
          <>
            {/* Unlocked */}
            {unlocked.length > 0 && (
              <section aria-labelledby="unlocked-heading">
                <h2 id="unlocked-heading" className="text-sm font-bold text-text-primary mb-4">Unlocked</h2>
                <AchievementGrid achievements={unlocked} />
              </section>
            )}

            {/* Locked */}
            {locked.length > 0 && (
              <section aria-labelledby="locked-heading">
                <h2 id="locked-heading" className="text-sm font-bold text-text-muted mb-4">Locked</h2>
                <AchievementGrid achievements={locked} dimmed />
              </section>
            )}
          </>
        )}
      </div>
    </AppShell>
  )
}

function AchievementGrid({
  achievements,
  dimmed,
  loading,
  count = 0,
}: {
  achievements?: Achievement[]
  dimmed?: boolean
  loading?: boolean
  count?: number
}) {
  const items = loading ? Array.from({ length: count }) : achievements ?? []

  return (
    <div className="grid grid-cols-4 gap-4 sm:grid-cols-6 md:grid-cols-8">
      {items.map((a, i) => {
        if (loading || !a) {
          return (
            <div key={i} className="flex flex-col items-center gap-2 animate-pulse">
              <div className="h-14 w-14 rounded-full bg-bg-surface border-2 border-border" />
              <div className="h-2 w-12 rounded bg-bg-surface" />
            </div>
          )
        }

        const ach = a as Achievement
        const tier = TIER_STYLES[ach.tier]
        const isUnlocked = !!ach.unlocked_at

        return (
          <div
            key={ach.id}
            title={`${ach.name}: ${ach.description}`}
            className={cn('flex flex-col items-center gap-2', dimmed && 'opacity-40')}
          >
            <div
              className={cn(
                'flex h-14 w-14 items-center justify-center rounded-full border-2 bg-bg-elevated transition-all',
                isUnlocked ? [tier.border, tier.glow] : 'border-border'
              )}
              aria-label={ach.name}
            >
              <Trophy
                size={20}
                className={isUnlocked ? 'text-accent-amber' : 'text-text-muted'}
                aria-hidden="true"
              />
            </div>
            <span className="font-mono text-2xs uppercase text-center text-text-muted leading-tight max-w-16">
              {ach.name}
            </span>
          </div>
        )
      })}
    </div>
  )
}
