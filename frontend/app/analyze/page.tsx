'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { analyze as analyzeApi } from '@/lib/api'
import { AppShell } from '@/components/layout/app-shell'
import { Button } from '@/components/ui/button'
import { ProgressBar } from '@/components/ui/progress-bar'
import { TagChip } from '@/components/ui/tag-chip'
import { StatCard } from '@/components/ui/stat-card'
import { DifficultyBadge } from '@/components/ui/badge'
import { Search, AlertCircle, Loader2, Star, GitFork, Users, AlertTriangle } from 'lucide-react'
import type { RepositoryAnalysis } from '@/lib/types'

const GITHUB_REPO_RE = /^https?:\/\/github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)\/?$/

export default function AnalyzePage() {
  const [url, setUrl] = useState('')
  const [urlError, setUrlError] = useState('')
  const [jobId, setJobId] = useState<string | null>(null)
  const [report, setReport] = useState<RepositoryAnalysis | null>(null)

  // Submit mutation
  const submitMutation = useMutation({
    mutationFn: (repoUrl: string) => analyzeApi.submit(repoUrl).then((r) => r.data),
    onSuccess: (data) => {
      if (data.cached) {
        const match = url.match(GITHUB_REPO_RE)
        if (match) loadCached(match[1], match[2])
      } else {
        setJobId(data.job_id)
      }
    },
  })

  // Poll job status
  const { data: jobData } = useQuery({
    queryKey: ['analyze-job', jobId],
    queryFn: () => jobId ? analyzeApi.poll(jobId).then((r) => r.data) : null,
    enabled: !!jobId,
    refetchInterval: (q) => {
      const status = q.state.data?.status
      if (!status || status === 'complete' || status === 'error') return false
      return 2000
    },
  })

  useEffect(() => {
    if (jobData?.status === 'complete' && jobData.result) {
      setReport(jobData.result)
      setJobId(null)
    }
  }, [jobData])

  async function loadCached(owner: string, repo: string) {
    const res = await analyzeApi.report(owner, repo)
    setReport(res.data)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setUrlError('')
    setReport(null)
    if (!GITHUB_REPO_RE.test(url)) {
      setUrlError('Please enter a valid GitHub repository URL (e.g., https://github.com/owner/repo)')
      return
    }
    submitMutation.mutate(url)
  }

  const isAnalyzing = submitMutation.isPending || (!!jobId && jobData?.status !== 'error')

  return (
    <AppShell title="Repository Intelligence">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">

        {/* Search bar */}
        <form
          onSubmit={handleSubmit}
          className="flex gap-3 rounded-xl border border-border bg-bg-surface p-4"
          aria-label="Analyze repository"
        >
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-code pointer-events-none" aria-hidden="true" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste GitHub Repository URL (e.g., github.com/owner/repo)"
              className="w-full rounded-md border border-border bg-bg-nested py-2.5 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-purple transition-colors"
              aria-label="Repository URL"
              aria-invalid={!!urlError}
              aria-describedby={urlError ? 'url-error' : undefined}
            />
          </div>
          <Button type="submit" variant="secondary" size="md" disabled={isAnalyzing}>
            {isAnalyzing ? <Loader2 size={15} className="animate-spin" aria-hidden="true" /> : null}
            {isAnalyzing ? 'Analyzing…' : 'Analyze'}
          </Button>
        </form>

        {/* Validation error */}
        {urlError && (
          <div id="url-error" role="alert" className="flex items-center gap-2 text-sm text-accent-red">
            <AlertCircle size={14} aria-hidden="true" />
            {urlError}
          </div>
        )}

        {/* API error */}
        {submitMutation.error && (
          <div role="alert" className="rounded-xl border border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.1)] p-4 flex items-center gap-3 text-sm text-accent-red">
            <AlertTriangle size={16} aria-hidden="true" />
            {(submitMutation.error as Error).message ?? 'Failed to analyze repository.'}
          </div>
        )}

        {/* Loading indicator */}
        {isAnalyzing && (
          <div className="rounded-xl border border-border bg-bg-surface p-8 flex flex-col items-center gap-4" aria-live="polite" aria-busy="true">
            <Loader2 size={32} className="animate-spin text-accent-purple" aria-hidden="true" />
            <p className="text-sm text-text-secondary">Analyzing repository structure and issues…</p>
            <ProgressBar value={jobData?.status === 'processing' ? 60 : 20} variant="xp" height="sm" className="max-w-xs" />
          </div>
        )}

        {/* Report */}
        {report && <AnalysisReport report={report} />}
      </div>
    </AppShell>
  )
}

function AnalysisReport({ report }: { report: RepositoryAnalysis }) {
  const repo = report.repository

  return (
    <div className="grid grid-cols-5 gap-6">
      {/* Left column (3/5) */}
      <div className="col-span-3 flex flex-col gap-5">
        {/* Repo overview */}
        <div className="rounded-xl border border-border bg-bg-surface overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-accent-purple to-accent-green" aria-hidden="true" />
          <div className="p-6">
            <div className="flex items-start justify-between gap-3 mb-4">
              <h2 className="font-display text-3xl font-bold text-text-primary">{repo.full_name}</h2>
              <span className="shrink-0 rounded-full border border-[rgba(78,222,163,0.3)] bg-[rgba(78,222,163,0.1)] px-3 py-1 font-mono text-xs text-accent-green">
                Active Project
              </span>
            </div>
            {repo.description && (
              <p className="text-sm text-text-secondary mb-5">{repo.description}</p>
            )}
            <div className="grid grid-cols-4 gap-3">
              <StatCard label="Stars" value={fmt(repo.star_count)} />
              <StatCard label="Forks" value={fmt(repo.fork_count)} />
              <StatCard label="Open Issues" value={repo.open_issue_count} />
              <StatCard label="Good First" value={report.good_first_issue_count} valueColor="text-accent-green" />
            </div>
          </div>
        </div>

        {/* Beginner friendliness */}
        <div className="rounded-xl border border-border bg-bg-surface p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold text-text-primary">Beginner Friendliness</h3>
            <span className="font-mono text-sm font-bold text-accent-green">
              {report.beginner_score}/100
            </span>
          </div>
          <div className="flex flex-col gap-4">
            <ProgressBar value={report.documentation_score} label="Documentation Quality" showPercent variant="green" />
            <ProgressBar value={100 - report.setup_difficulty_score} label="Setup Ease" showPercent variant="xp" />
            <ProgressBar value={100 - report.complexity_score} label="Code Accessibility" showPercent variant="xp" />
            <ProgressBar value={report.community_score} label="Community Activity" showPercent variant="amber" />
          </div>
        </div>
      </div>

      {/* Right column (2/5) */}
      <div className="col-span-2 flex flex-col gap-5">
        {/* Tech stack */}
        <div className="rounded-xl border border-border bg-bg-surface p-5">
          <h3 className="text-sm font-bold text-text-primary mb-3">Technology Stack</h3>
          <div className="flex flex-wrap gap-2">
            {report.tech_stack.map((t) => <TagChip key={t}>{t}</TagChip>)}
          </div>
        </div>

        {/* Summary */}
        {report.summary_text && (
          <div className="rounded-xl border border-border bg-bg-surface p-5">
            <h3 className="text-sm font-bold text-text-primary mb-2">AI Summary</h3>
            <p className="text-sm text-text-secondary leading-relaxed">{report.summary_text}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function fmt(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}
