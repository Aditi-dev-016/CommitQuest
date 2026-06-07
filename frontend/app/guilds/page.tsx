'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { guilds as guildsApi } from '@/lib/api'
import { queryKeys } from '@/lib/query-keys'
import { AppShell } from '@/components/layout/app-shell'
import { Button } from '@/components/ui/button'
import { TagChip } from '@/components/ui/tag-chip'
import { Badge } from '@/components/ui/badge'
import { useAppStore } from '@/lib/store'
import { Users, Search, X } from 'lucide-react'
import type { Guild } from '@/lib/types'

const ACTIVITY_VARIANT: Record<Guild['tier'], 'green' | 'amber' | 'default' | 'purple'> = {
  high_activity: 'green',
  active:        'purple',
  steady:        'amber',
  new:           'default',
}

const ACTIVITY_LABEL: Record<Guild['tier'], string> = {
  high_activity: 'HIGH ACTIVITY',
  active:        'ACTIVE',
  steady:        'STEADY',
  new:           'NEW',
}

export default function GuildsPage() {
  const [search, setSearch]           = useState('')
  const [selected, setSelected]       = useState<Guild | null>(null)
  const queryClient                   = useQueryClient()
  const addToast                      = useAppStore((s) => s.addToast)

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.guilds({ q: search || undefined }),
    queryFn: () => guildsApi.list({ q: search || undefined }).then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  })

  const joinMutation = useMutation({
    mutationFn: (id: string) => guildsApi.join(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.guilds() })
      addToast({ title: 'Guild Joined', body: `Welcome to ${selected?.name}!` })
    },
  })

  return (
    <AppShell title="Guild Hall">
      <div className="flex flex-col gap-6">
        {/* Header + search */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-text-primary">Guild Discovery</h1>
            <p className="text-sm text-text-secondary mt-0.5">Find your community and collaborate on open source.</p>
          </div>
          <div className="relative w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" aria-hidden="true" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search guilds…"
              className="w-full rounded-md border border-border bg-bg-nested py-2 pl-8 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-purple transition-colors"
              aria-label="Search guilds"
            />
          </div>
        </div>

        <div className="flex gap-6">
          {/* Guild grid */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="grid grid-cols-2 gap-4 animate-pulse">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-40 rounded-xl bg-bg-surface border border-border" />
                ))}
              </div>
            ) : !data?.length ? (
              <div className="rounded-xl border border-border bg-bg-surface p-12 text-center">
                <p className="text-text-muted">No guilds found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {data.map((guild) => (
                  <button
                    key={guild.id}
                    onClick={() => setSelected(guild)}
                    className={`text-left rounded-xl border p-5 transition-all hover:border-[rgba(94,106,210,0.4)] ${
                      selected?.id === guild.id
                        ? 'border-accent-purple bg-[rgba(94,106,210,0.05)]'
                        : 'border-border bg-bg-surface'
                    }`}
                    aria-pressed={selected?.id === guild.id}
                    aria-label={`Select guild: ${guild.name}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bg-elevated border border-border">
                          <Users size={16} className="text-accent-purple" aria-hidden="true" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-text-primary">{guild.name}</p>
                          <p className="font-mono text-xs text-text-muted">
                            {guild.member_count.toLocaleString()} members
                          </p>
                        </div>
                      </div>
                      <Badge variant={ACTIVITY_VARIANT[guild.tier]}>{ACTIVITY_LABEL[guild.tier]}</Badge>
                    </div>
                    <p className="text-xs text-text-secondary line-clamp-2 mb-3">{guild.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {guild.tags.slice(0, 3).map((t) => <TagChip key={t}>{t}</TagChip>)}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Detail panel */}
          {selected && (
            <aside className="w-80 shrink-0" aria-label={`Guild detail: ${selected.name}`}>
              <div className="rounded-xl border border-border bg-bg-surface p-5 sticky top-20">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bg-elevated border border-border">
                      <Users size={16} className="text-accent-purple" aria-hidden="true" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-text-primary">{selected.name}</h2>
                      <p className="font-mono text-xs text-text-muted">{selected.member_count.toLocaleString()} members</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="text-text-muted hover:text-text-primary transition-colors"
                    aria-label="Close guild detail"
                  >
                    <X size={16} />
                  </button>
                </div>

                <p className="text-sm text-text-secondary mb-4">{selected.description}</p>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {selected.tags.map((t) => <TagChip key={t}>{t}</TagChip>)}
                </div>

                <Button
                  variant="primary"
                  size="md"
                  className="w-full shadow-glow-purple"
                  onClick={() => joinMutation.mutate(selected.id)}
                  disabled={joinMutation.isPending}
                  aria-label={`Join guild: ${selected.name}`}
                >
                  {joinMutation.isPending ? 'Joining…' : 'Join Guild'}
                </Button>
              </div>
            </aside>
          )}
        </div>
      </div>
    </AppShell>
  )
}
