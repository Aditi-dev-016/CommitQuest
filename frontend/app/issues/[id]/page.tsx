'use client'

import { useParams, useRouter } from 'next/navigation'
import { useQuery, useMutation } from '@tanstack/react-query'
import { issues as issuesApi, quests as questsApi } from '@/lib/api'
import { queryKeys } from '@/lib/query-keys'
import { AppShell } from '@/components/layout/app-shell'
import { DifficultyBadge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TagChip } from '@/components/ui/tag-chip'
import { useAppStore } from '@/lib/store'
import {
  ExternalLink, FileCode, Lightbulb, ListChecks,
  Loader2, AlertTriangle, BookOpen,
} from 'lucide-react'

export default function IssueExplainerPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const addToast = useAppStore((s) => s.addToast)
  const setActiveQuestIssue = useAppStore((s) => s.setActiveQuestIssue)

  const { data: issue, isLoading: loadingIssue } = useQuery({
    queryKey: queryKeys.issue(id),
    queryFn: () => issuesApi.get(id).then((r) => r.data),
  })

  const { data: explanation, isLoading: loadingExplain, error: explainError } = useQuery({
    queryKey: queryKeys.issueExplain(id),
    queryFn: () => issuesApi.explain(id).then((r) => r.data),
    enabled: !!issue,
    staleTime: 60 * 60 * 1000,
  })

  const startMutation = useMutation({
    mutationFn: () => questsApi.start(id), // issue-linked quest id
    onSuccess: () => {
      if (issue) setActiveQuestIssue(issue)
      addToast({ title: 'Quest Added', body: 'Issue added to your Active Quests.', xp: 0 })
      router.push('/quests')
    },
  })

  if (loadingIssue) {
    return (
      <AppShell title="Issue Explainer">
        <div className="animate-pulse flex flex-col gap-4">
          <div className="h-10 w-2/3 rounded-lg bg-bg-surface" />
          <div className="h-64 rounded-xl bg-bg-surface" />
        </div>
      </AppShell>
    )
  }

  if (!issue) {
    return (
      <AppShell title="Issue Explainer">
        <p className="text-text-muted">Issue not found.</p>
      </AppShell>
    )
  }

  return (
    <AppShell title="Issue Explainer">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        {/* Issue header */}
        <div className="rounded-xl border border-border bg-bg-surface p-6">
          <div className="flex items-start gap-3 mb-3 flex-wrap">
            <DifficultyBadge difficulty={issue.difficulty} />
            {issue.is_good_first_issue && <DifficultyBadge difficulty="good_first_issue" />}
            {issue.labels.map((l) => <TagChip key={l}>{l}</TagChip>)}
          </div>
          <h1 className="text-xl font-bold text-text-primary mb-1">{issue.title}</h1>
          <p className="text-sm text-text-muted mb-4">
            {issue.repository?.full_name} · #{issue.github_number} opened by {issue.author}
          </p>
          {issue.body && (
            <div className="rounded-md border border-border bg-bg-nested p-4 text-sm text-text-secondary leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
              {issue.body}
            </div>
          )}
          <a
            href={issue.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-xs text-accent-purple-light hover:underline"
          >
            View on GitHub <ExternalLink size={11} aria-hidden="true" />
          </a>
        </div>

        {/* AI Explanation */}
        {explainError ? (
          <div
            role="alert"
            className="rounded-xl border border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.1)] p-5 flex items-center gap-3 text-sm text-accent-red"
          >
            <AlertTriangle size={16} aria-hidden="true" />
            AI explanation unavailable. See raw issue body above.
          </div>
        ) : loadingExplain ? (
          <ExplainerSkeleton />
        ) : explanation ? (
          <div className="flex flex-col gap-5">
            {/* Plain English */}
            <ExplainerSection icon={<Lightbulb size={16} className="text-accent-amber" aria-hidden="true" />} title="What's the problem?">
              <p className="text-sm text-text-secondary leading-relaxed">{explanation.plain_english}</p>
            </ExplainerSection>

            {/* Files involved */}
            {explanation.files_involved.length > 0 && (
              <ExplainerSection icon={<FileCode size={16} className="text-text-code" aria-hidden="true" />} title="Files likely involved">
                <div className="flex flex-col gap-1.5">
                  {explanation.files_involved.map((f) => (
                    <code key={f} className="font-mono text-xs text-text-code bg-bg-nested rounded px-2 py-1">
                      {f}
                    </code>
                  ))}
                </div>
              </ExplainerSection>
            )}

            {/* Suggested steps */}
            {explanation.suggested_steps && (
              <ExplainerSection icon={<ListChecks size={16} className="text-accent-green" aria-hidden="true" />} title="Suggested first steps">
                <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                  {explanation.suggested_steps}
                </p>
              </ExplainerSection>
            )}

            {/* Skills needed */}
            {explanation.skills_needed.length > 0 && (
              <ExplainerSection icon={<BookOpen size={16} className="text-accent-purple-light" aria-hidden="true" />} title="Skills you'll use">
                <div className="flex flex-wrap gap-2">
                  {explanation.skills_needed.map((s) => <TagChip key={s}>{s}</TagChip>)}
                </div>
              </ExplainerSection>
            )}
          </div>
        ) : null}

        {/* CTA */}
        <Button
          variant="primary"
          size="lg"
          onClick={() => startMutation.mutate()}
          disabled={startMutation.isPending}
          className="self-start"
          aria-label={`Start contributing to: ${issue.title}`}
        >
          {startMutation.isPending && <Loader2 size={15} className="animate-spin" aria-hidden="true" />}
          Start Contributing
        </Button>
      </div>
    </AppShell>
  )
}

function ExplainerSection({
  icon, title, children,
}: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-bg-surface p-5">
      <h2 className="flex items-center gap-2 text-sm font-bold text-text-primary mb-3">
        {icon}
        {title}
      </h2>
      {children}
    </div>
  )
}

function ExplainerSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-bg-surface p-6 animate-pulse flex flex-col gap-3" aria-busy="true" aria-label="Loading AI explanation">
      <div className="h-4 w-32 rounded bg-bg-elevated" />
      <div className="h-3 w-full rounded bg-bg-elevated" />
      <div className="h-3 w-5/6 rounded bg-bg-elevated" />
      <div className="h-3 w-4/6 rounded bg-bg-elevated" />
    </div>
  )
}
