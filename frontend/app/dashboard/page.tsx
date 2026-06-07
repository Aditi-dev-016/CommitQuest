'use client'

import { useQuery } from '@tanstack/react-query'
import { dashboard } from '@/lib/api'
import { queryKeys } from '@/lib/query-keys'
import { AppShell } from '@/components/layout/app-shell'
import { QuestCard } from '@/components/cards/quest-card'
import { RepoCard } from '@/components/cards/repo-card'
import { ProgressBar } from '@/components/ui/progress-bar'
import { StatCard } from '@/components/ui/stat-card'
import { Zap, Map, Trophy, GitBranch, Flame } from 'lucide-react'
import Link from 'next/link'
import type { WorldRegion } from '@/lib/types'

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: () => dashboard.get().then((r) => r.data),
    staleTime: 2 * 60 * 1000,
  })

  if (isLoading) return <AppShell title="Dashboard"><DashboardSkeleton /></AppShell>
  if (error || !data) return <AppShell title="Dashboard"><p className="text-text-muted">Failed to load dashboard.</p></AppShell>

  const { contributor: user, active_quests, recommended_repos, recent_achievements, world_map } = data
  const xpToNext = 5000
  const xpPct = Math.round(((user.total_xp % xpToNext) / xpToNext) * 100)

  return (
    <AppShell title="Dashboard">
      <div className="flex flex-col gap-8">

        {/* ── Hero card ─────────────────────────────────────────────────────── */}
        <section
          className="rounded-xl border border-border bg-bg-surface p-8"
          aria-label="Your progression"
        >
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="relative shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.avatar_url}
                alt={user.display_name}
                className="h-24 w-24 rounded-xl border-2 border-accent-purple"
              />
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-bg-overlay px-2 py-0.5 font-mono text-xs font-bold text-text-code">
                LVL {user.current_level}
              </span>
            </div>

            {/* Main info */}
            <div className="flex-1 min-w-0">
              <h2 className="font-display text-2xl font-bold text-text-primary">{user.display_name}</h2>
              <div className="mt-1 flex items-center gap-4 text-sm text-text-secondary">
                <span className="flex items-center gap-1">
                  <Flame size={13} className="text-accent-amber" aria-hidden="true" />
                  <strong className="font-mono text-text-primary">{user.streak_count}</strong> day streak
                </span>
                <span className="flex items-center gap-1">
                  <Zap size={13} className="text-accent-purple" aria-hidden="true" />
                  <strong className="font-mono text-text-primary">{user.total_xp.toLocaleString()}</strong> XP total
                </span>
              </div>
              <div className="mt-4 max-w-sm">
                <ProgressBar
                  value={xpPct}
                  label="XP Progression"
                  showPercent
                  variant="xp"
                  height="md"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Active quests ─────────────────────────────────────────────────── */}
        <section aria-labelledby="active-quests-heading">
          <div className="flex items-center justify-between mb-4">
            <h2 id="active-quests-heading" className="flex items-center gap-2 text-md font-bold text-text-primary">
              <Zap size={16} className="text-accent-purple" aria-hidden="true" />
              Active Quests
            </h2>
            <Link href="/quests" className="text-sm text-accent-purple-light hover:underline">
              View Quest Board →
            </Link>
          </div>

          {active_quests.length === 0 ? (
            <div className="rounded-xl border border-border bg-bg-surface p-8 text-center">
              <p className="text-text-secondary mb-3">No active quests yet.</p>
              <Link href="/quests" className="text-sm font-semibold text-accent-purple-light hover:underline">
                Browse the Mission Board →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {active_quests.map((q) => (
                <QuestCard key={q.id} quest={q} progress={q.progress} />
              ))}
            </div>
          )}
        </section>

        {/* ── Recommended Repos ─────────────────────────────────────────────── */}
        {recommended_repos.length > 0 && (
          <section aria-labelledby="repos-heading">
            <h2 id="repos-heading" className="flex items-center gap-2 text-md font-bold text-text-primary mb-4">
              <GitBranch size={16} className="text-accent-purple" aria-hidden="true" />
              Recommended Repositories
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {recommended_repos.map((repo) => (
                <RepoCard key={repo.id} repo={repo} analysis={repo.analysis} />
              ))}
            </div>
          </section>
        )}

        {/* ── World Map ─────────────────────────────────────────────────────── */}
        <section aria-labelledby="world-map-heading">
          <h2 id="world-map-heading" className="flex items-center gap-2 text-md font-bold text-text-primary mb-4">
            <Map size={16} className="text-accent-purple" aria-hidden="true" />
            Open Source World Map
          </h2>
          <div className="rounded-xl border border-border bg-bg-surface p-6">
            <div className="flex gap-4 overflow-x-auto pb-2">
              {world_map.map((region) => (
                <WorldRegionNode key={region.id} region={region} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Bottom row ────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Achievements */}
          {recent_achievements.length > 0 && (
            <section aria-labelledby="achievements-heading" className="rounded-xl border border-border bg-bg-surface p-6">
              <h2 id="achievements-heading" className="flex items-center gap-2 text-sm font-bold text-text-primary mb-4">
                <Trophy size={15} className="text-accent-amber" aria-hidden="true" />
                Recent Achievements
              </h2>
              <div className="flex gap-4 flex-wrap">
                {recent_achievements.map((a) => (
                  <div key={a.id} className="flex flex-col items-center gap-1">
                    <div className="h-14 w-14 rounded-full border-2 border-accent-amber bg-bg-elevated flex items-center justify-center">
                      <Trophy size={20} className="text-accent-amber" aria-hidden="true" />
                    </div>
                    <span className="font-mono text-2xs uppercase text-text-muted text-center max-w-16 leading-tight">
                      {a.name}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Contribution stats */}
          <section aria-labelledby="stats-heading" className="rounded-xl border border-border bg-bg-surface p-6">
            <h2 id="stats-heading" className="text-sm font-bold text-text-primary mb-4">
              Contribution Analytics
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Total XP" value={user.total_xp.toLocaleString()} valueColor="text-accent-purple-light" />
              <StatCard label="Streak" value={`${user.streak_count}d`} valueColor="text-accent-amber" />
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  )
}

function WorldRegionNode({ region }: { region: WorldRegion }) {
  const statusColor =
    region.status === 'explored'    ? 'border-[rgba(78,222,163,0.4)] text-accent-green' :
    region.status === 'in_progress' ? 'border-[rgba(94,106,210,0.4)] text-accent-purple' :
                                      'border-border text-text-muted opacity-50'

  return (
    <Link
      href={region.learning_path_id ? `/academy/${region.learning_path_id}` : '/academy'}
      className={`flex shrink-0 flex-col items-center gap-2 rounded-xl border-2 bg-bg-nested p-4 w-36 hover:opacity-80 transition-opacity ${statusColor}`}
      aria-label={`${region.name} — ${region.status === 'locked' ? region.lock_reason : `${region.progress_pct}% explored`}`}
    >
      <Map size={20} aria-hidden="true" />
      <span className="text-xs font-semibold text-center leading-tight">{region.name}</span>
      <span className="font-mono text-2xs text-text-muted text-center">
        {region.status === 'locked'
          ? region.lock_reason ?? 'Locked'
          : `${region.progress_pct}% Explored`}
      </span>
    </Link>
  )
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-8 animate-pulse">
      <div className="h-40 rounded-xl bg-bg-surface border border-border" />
      <div className="h-60 rounded-xl bg-bg-surface border border-border" />
      <div className="h-60 rounded-xl bg-bg-surface border border-border" />
    </div>
  )
}
