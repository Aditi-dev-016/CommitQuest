'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { quests as questsApi } from '@/lib/api'
import { queryKeys } from '@/lib/query-keys'
import { AppShell } from '@/components/layout/app-shell'
import { QuestCard } from '@/components/cards/quest-card'
import { useAppStore } from '@/lib/store'

const DIFFICULTY_FILTERS = ['all', 'easy', 'medium', 'hard'] as const

export default function QuestsPage() {
  const [difficulty, setDifficulty] = useState<string>('all')
  const [type, setType] = useState<string>('all')
  const queryClient = useQueryClient()
  const addToast = useAppStore((s) => s.addToast)
  const addPendingXP = useAppStore((s) => s.addPendingXP)

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.quests({ type: type === 'all' ? undefined : type }),
    queryFn: () => questsApi.list({ type: type === 'all' ? undefined : type }).then((r) => r.data),
  })

  const startMutation = useMutation({
    mutationFn: (id: string) => questsApi.start(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quests() })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard })
      addToast({ title: 'Quest Started', body: 'Good luck! Track your progress on the dashboard.' })
    },
  })

  const filtered = (data ?? []).filter((q) =>
    difficulty === 'all' ? true : q.difficulty === difficulty
  )

  return (
    <AppShell title="Quest Board">
      <div className="flex gap-6">
        {/* Filter sidebar */}
        <aside className="w-56 shrink-0" aria-label="Quest filters">
          <div className="rounded-xl border border-border bg-bg-surface p-5 flex flex-col gap-5">
            <div>
              <p className="font-mono text-2xs uppercase text-text-muted mb-3 tracking-wider">Quest Type</p>
              {['all', 'daily', 'standard', 'featured'].map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-1.5 text-sm mb-1 transition-colors ${
                    type === t
                      ? 'bg-[rgba(94,106,210,0.1)] text-text-primary'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                  }`}
                >
                  <span className="capitalize">{t}</span>
                </button>
              ))}
            </div>

            <div>
              <p className="font-mono text-2xs uppercase text-text-muted mb-3 tracking-wider">Difficulty</p>
              {DIFFICULTY_FILTERS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`flex w-full items-center rounded-md px-3 py-1.5 text-sm mb-1 transition-colors capitalize ${
                    difficulty === d
                      ? 'bg-[rgba(94,106,210,0.1)] text-text-primary'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0">
          <div className="mb-5">
            <h1 className="text-xl font-bold text-text-primary">Available Quests</h1>
            <p className="text-sm text-text-secondary mt-0.5">
              {filtered.length} quest{filtered.length !== 1 ? 's' : ''} available
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 rounded-xl bg-bg-surface border border-border" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-border bg-bg-surface p-12 text-center">
              <p className="text-text-muted">No quests match your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {filtered.map((quest) => (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  onStart={(id) => startMutation.mutate(id)}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </AppShell>
  )
}
