'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { academy as academyApi } from '@/lib/api'
import { queryKeys } from '@/lib/query-keys'
import { AppShell } from '@/components/layout/app-shell'
import { ProgressBar } from '@/components/ui/progress-bar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/lib/store'
import {
  GraduationCap, ChevronDown, ChevronUp, CheckCircle2,
  Lock, Clock, Zap,
} from 'lucide-react'
import type { LearningPath, Lesson } from '@/lib/types'

export default function AcademyPage() {
  const { data: paths, isLoading } = useQuery({
    queryKey: queryKeys.learningPaths,
    queryFn: () => academyApi.paths().then((r) => r.data),
  })

  return (
    <AppShell title="Learning Academy">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="rounded-xl border border-border bg-bg-surface p-6">
          <div className="flex items-center gap-3 mb-2">
            <GraduationCap size={22} className="text-accent-purple-light" aria-hidden="true" />
            <h1 className="font-display text-xl font-bold text-text-primary">Learning Academy</h1>
          </div>
          <p className="text-sm text-text-secondary">
            Structured learning paths to level up your open-source contribution skills.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-3 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 rounded-xl bg-bg-surface border border-border" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {(paths ?? []).map((path) => (
              <LearningPathCard key={path.id} path={path} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}

function LearningPathCard({ path }: { path: LearningPath }) {
  const [open, setOpen] = useState(false)
  const queryClient    = useQueryClient()
  const addToast       = useAppStore((s) => s.addToast)
  const addPendingXP   = useAppStore((s) => s.addPendingXP)

  const { data: lessons, isLoading } = useQuery({
    queryKey: queryKeys.lessons(path.id),
    queryFn: () => academyApi.lessons(path.id).then((r) => r.data),
    enabled: open,
  })

  const completeMutation = useMutation({
    mutationFn: (lessonId: string) => academyApi.completeLesson(lessonId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lessons(path.id) })
      addToast({ title: 'Lesson Complete', xp: res.data.xp_awarded })
      addPendingXP(res.data.xp_awarded)
    },
  })

  const completed = lessons?.filter((l) => l.completed_at).length ?? 0
  const total     = lessons?.length ?? 0
  const pct       = total > 0 ? Math.round((completed / total) * 100) : 0

  const statusVariant = pct === 100 ? 'green' : pct > 0 ? 'amber' : 'default'
  const statusLabel   = pct === 100 ? 'COMPLETED' : pct > 0 ? 'IN PROGRESS' : 'NOT STARTED'

  return (
    <div
      className={`rounded-xl border bg-bg-surface overflow-hidden transition-colors ${
        pct > 0 && pct < 100
          ? 'border-[rgba(208,188,255,0.3)] shadow-[inset_4px_0_0_#D0BCFF]'
          : 'border-border'
      }`}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 p-5 text-left hover:bg-bg-elevated transition-colors"
        aria-expanded={open}
        aria-controls={`path-lessons-${path.id}`}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-sm font-bold text-text-primary">{path.title}</span>
            <Badge variant={statusVariant}>{statusLabel}</Badge>
          </div>
          <p className="text-xs text-text-secondary line-clamp-1">{path.description}</p>
        </div>
        {pct > 0 && (
          <div className="w-24 shrink-0">
            <ProgressBar value={pct} variant={pct === 100 ? 'green' : 'xp'} height="sm" />
          </div>
        )}
        {open ? <ChevronUp size={16} className="shrink-0 text-text-muted" aria-hidden="true" /> : <ChevronDown size={16} className="shrink-0 text-text-muted" aria-hidden="true" />}
      </button>

      {open && (
        <div id={`path-lessons-${path.id}`} className="border-t border-border">
          {isLoading ? (
            <div className="p-4 animate-pulse flex flex-col gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-10 rounded-md bg-bg-elevated" />
              ))}
            </div>
          ) : (
            <ul className="p-2">
              {(lessons ?? []).map((lesson, idx) => (
                <LessonRow
                  key={lesson.id}
                  lesson={lesson}
                  index={idx}
                  onComplete={() => completeMutation.mutate(lesson.id)}
                  completing={completeMutation.isPending}
                />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

function LessonRow({
  lesson,
  index,
  onComplete,
  completing,
}: {
  lesson: Lesson
  index: number
  onComplete: () => void
  completing: boolean
}) {
  const isDone   = !!lesson.completed_at
  const isLocked = false // unlock logic: index > 0 && !prevLesson.completed_at

  return (
    <li
      className={`flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors ${
        isDone
          ? 'text-text-secondary'
          : isLocked
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:bg-bg-elevated cursor-pointer'
      }`}
    >
      {/* Status icon */}
      {isDone ? (
        <CheckCircle2 size={16} className="text-accent-green shrink-0" aria-label="Completed" />
      ) : isLocked ? (
        <Lock size={16} className="text-text-muted shrink-0" aria-label="Locked" />
      ) : (
        <div className="h-4 w-4 rounded-full border-2 border-accent-purple shrink-0" aria-hidden="true" />
      )}

      {/* Title */}
      <span className={`flex-1 text-sm ${isDone ? 'line-through' : 'text-text-primary'}`}>
        {lesson.title}
      </span>

      {/* Meta */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="flex items-center gap-1 font-mono text-xs text-text-muted">
          <Clock size={10} aria-hidden="true" /> {lesson.duration_mins}m
        </span>
        <span className="flex items-center gap-1 font-mono text-xs text-text-code">
          <Zap size={10} aria-hidden="true" /> +{lesson.xp_reward}
        </span>
        {!isDone && !isLocked && (
          <Button
            size="sm"
            variant="secondary"
            onClick={onComplete}
            disabled={completing}
            aria-label={`Complete lesson: ${lesson.title}`}
          >
            Complete
          </Button>
        )}
      </div>
    </li>
  )
}
