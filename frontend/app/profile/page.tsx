'use client'

import { useQuery } from '@tanstack/react-query'
import { contributors, achievements as achApi } from '@/lib/api'
import { queryKeys } from '@/lib/query-keys'
import { AppShell } from '@/components/layout/app-shell'
import { ProgressBar } from '@/components/ui/progress-bar'
import { StatCard } from '@/components/ui/stat-card'
import { useAppStore } from '@/lib/store'
import { Trophy, Flame, Zap, Share2, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const XP_PER_LEVEL = 5000

export default function ProfilePage() {
  const user = useAppStore((s) => s.user)

  const { data: profile, isLoading } = useQuery({
    queryKey: queryKeys.user,
    queryFn: () => contributors.me().then((r) => r.data),
    initialData: user ?? undefined,
  })

  const { data: achievements } = useQuery({
    queryKey: queryKeys.achievements,
    queryFn: () => achApi.list().then((r) => r.data),
  })

  if (isLoading || !profile) {
    return (
      <AppShell title="Profile">
        <div className="max-w-4xl mx-auto animate-pulse flex flex-col gap-6">
          <div className="h-48 rounded-xl bg-bg-surface border border-border" />
          <div className="h-32 rounded-xl bg-bg-surface border border-border" />
        </div>
      </AppShell>
    )
  }

  const xpIntoLevel = profile.total_xp % XP_PER_LEVEL
  const xpPct       = Math.round((xpIntoLevel / XP_PER_LEVEL) * 100)
  const unlocked    = achievements?.filter((a) => a.unlocked_at) ?? []

  return (
    <AppShell title="Profile">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">

        {/* Profile header card */}
        <div className="rounded-xl border border-border bg-bg-surface p-8">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="relative shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.avatar_url}
                alt={profile.display_name}
                className="h-28 w-28 rounded-xl border-2 border-accent-purple shadow-glow-purple"
              />
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-bg-overlay px-2 py-0.5 font-mono text-xs font-bold text-text-code">
                {profile.streak_count}d streak
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h1 className="font-display text-4xl font-bold text-text-primary">
                    {profile.display_name}
                  </h1>
                  <div className="mt-1 flex items-center gap-3 text-sm text-text-secondary">
                    <span className="font-mono font-bold text-text-code">LVL {profile.current_level}</span>
                    <span className="text-border">|</span>
                    <span className="capitalize">{profile.experience_level}</span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="ghost" size="sm" aria-label="Share profile">
                    <Share2 size={13} aria-hidden="true" /> Share
                  </Button>
                  <Button variant="outline" size="sm" aria-label="Edit profile">
                    <Edit2 size={13} aria-hidden="true" /> Edit
                  </Button>
                </div>
              </div>

              {profile.bio && (
                <p className="mt-3 text-sm text-text-secondary leading-relaxed max-w-lg">{profile.bio}</p>
              )}

              {/* XP bar */}
              <div className="mt-4 max-w-sm">
                <ProgressBar
                  value={xpPct}
                  label="Experience to Next Level"
                  showPercent
                  variant="xp"
                  height="md"
                />
                <p className="font-mono text-xs text-text-muted mt-1">
                  {xpIntoLevel.toLocaleString()} / {XP_PER_LEVEL.toLocaleString()} XP
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <section aria-labelledby="stats-heading">
          <h2 id="stats-heading" className="text-sm font-bold text-text-primary mb-3">Lifetime Stats</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="Total XP"    value={profile.total_xp.toLocaleString()} valueColor="text-accent-purple-light" />
            <StatCard label="Level"       value={profile.current_level} valueColor="text-text-code" />
            <StatCard label="Streak"      value={`${profile.streak_count}d`} valueColor="text-accent-amber" />
            <StatCard label="Achievements" value={unlocked.length} valueColor="text-accent-amber" />
          </div>
        </section>

        {/* Recent achievements */}
        {unlocked.length > 0 && (
          <section aria-labelledby="ach-heading">
            <h2 id="ach-heading" className="flex items-center gap-2 text-sm font-bold text-text-primary mb-3">
              <Trophy size={15} className="text-accent-amber" aria-hidden="true" />
              Achievements
            </h2>
            <div className="rounded-xl border border-border bg-bg-surface p-5">
              <div className="flex flex-wrap gap-4">
                {unlocked.slice(0, 10).map((a) => (
                  <div key={a.id} className="flex flex-col items-center gap-1.5" title={a.description}>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-accent-amber bg-bg-elevated shadow-[0_0_8px_rgba(250,204,21,0.3)]">
                      <Trophy size={16} className="text-accent-amber" aria-hidden="true" />
                    </div>
                    <span className="font-mono text-2xs uppercase text-text-muted text-center max-w-14 leading-tight">
                      {a.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </AppShell>
  )
}
