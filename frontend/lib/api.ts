import { API_BASE_URL } from './constants'
import type {
  ApiResponse,
  Contributor,
  DashboardData,
  RepositoryAnalysis,
  Issue,
  IssueExplanation,
  IssueFilters,
  Quest,
  QuestProgress,
  Achievement,
  Guild,
  GuildMessage,
  LearningPath,
  Lesson,
  PaginationMeta,
} from './types'

// ─── Fetch helper ──────────────────────────────────────────────────────────────

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body?.error?.message ?? `API error ${res.status}`)
  }

  return res.json()
}

// ─── Auth ──────────────────────────────────────────────────────────────────────

export const auth = {
  githubCallback: (code: string, state: string) =>
    apiFetch<{ token: string; contributor: Contributor }>('/auth/github/callback', {
      method: 'POST',
      body: JSON.stringify({ code, state }),
    }),
  logout: () => apiFetch<null>('/auth/logout', { method: 'POST' }),
}

// ─── Contributor ──────────────────────────────────────────────────────────────

export const contributors = {
  me: () => apiFetch<Contributor>('/contributors/me'),
  update: (body: { display_name?: string; bio?: string }) =>
    apiFetch<Contributor>('/contributors/me', { method: 'PATCH', body: JSON.stringify(body) }),
  getByUsername: (username: string) =>
    apiFetch<Contributor>(`/contributors/${username}`),
  myAchievements: () =>
    apiFetch<Achievement[]>('/contributors/me/achievements'),
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export const dashboard = {
  get: () => apiFetch<DashboardData>('/dashboard'),
}

// ─── Repository Analysis ──────────────────────────────────────────────────────

export const analyze = {
  submit: (url: string) =>
    apiFetch<{ job_id: string; cached: boolean }>('/analyze', {
      method: 'POST',
      body: JSON.stringify({ url }),
    }),
  poll: (jobId: string) =>
    apiFetch<{ status: 'pending' | 'processing' | 'complete' | 'error'; result?: RepositoryAnalysis }>(
      `/analyze/${jobId}`
    ),
  report: (owner: string, repo: string) =>
    apiFetch<RepositoryAnalysis>(`/analyze/report/${owner}/${repo}`),
}

// ─── Issues ───────────────────────────────────────────────────────────────────

export const issues = {
  list: (filters: IssueFilters = {}) => {
    const params = new URLSearchParams(
      Object.entries(filters)
        .filter(([, v]) => v != null)
        .map(([k, v]) => [k, String(v)])
    )
    return apiFetch<Issue[]>(`/issues?${params}`)
  },
  get: (id: string) => apiFetch<Issue>(`/issues/${id}`),
  explain: (id: string) => apiFetch<IssueExplanation>(`/issues/${id}/explain`),
}

// ─── Quests ───────────────────────────────────────────────────────────────────

export const quests = {
  list: (params: { type?: string; status?: string; page?: number } = {}) => {
    const search = new URLSearchParams(
      Object.entries(params)
        .filter(([, v]) => v != null)
        .map(([k, v]) => [k, String(v)])
    )
    return apiFetch<Quest[]>(`/quests?${search}`)
  },
  get: (id: string) => apiFetch<Quest>(`/quests/${id}`),
  start: (id: string) =>
    apiFetch<QuestProgress>(`/quests/${id}/start`, { method: 'POST' }),
  submit: (id: string, pr_url?: string) =>
    apiFetch<{ data: QuestProgress; xp_awarded: number; achievements_unlocked: Achievement[] }>(
      `/quests/${id}/submit`,
      { method: 'POST', body: JSON.stringify({ pr_url }) }
    ),
}

// ─── Achievements ─────────────────────────────────────────────────────────────

export const achievements = {
  list: () => apiFetch<Achievement[]>('/contributors/me/achievements'),
}

// ─── Learning Academy ─────────────────────────────────────────────────────────

export const academy = {
  paths: () => apiFetch<LearningPath[]>('/academy/paths'),
  path: (pathId: string) => apiFetch<LearningPath>(`/academy/paths/${pathId}`),
  lessons: (pathId: string) => apiFetch<Lesson[]>(`/academy/paths/${pathId}/lessons`),
  completeLesson: (lessonId: string, quiz_answers?: number[]) =>
    apiFetch<{ xp_awarded: number }>(`/academy/lessons/${lessonId}/complete`, {
      method: 'POST',
      body: JSON.stringify({ quiz_answers }),
    }),
}

// ─── Guilds ───────────────────────────────────────────────────────────────────

export const guilds = {
  list: (params: { q?: string; tag?: string; sort?: string } = {}) => {
    const search = new URLSearchParams(
      Object.entries(params)
        .filter(([, v]) => v != null)
        .map(([k, v]) => [k, String(v)])
    )
    return apiFetch<Guild[]>(`/guilds?${search}`)
  },
  get: (id: string) => apiFetch<Guild>(`/guilds/${id}`),
  join: (id: string) => apiFetch<{ success: boolean }>(`/guilds/${id}/join`, { method: 'POST' }),
  messages: (id: string, page = 1) =>
    apiFetch<GuildMessage[]>(`/guilds/${id}/messages?page=${page}`),
  postMessage: (id: string, body: string) =>
    apiFetch<GuildMessage>(`/guilds/${id}/messages`, {
      method: 'POST',
      body: JSON.stringify({ body }),
    }),
}

// ─── Gamification ─────────────────────────────────────────────────────────────

export const gamification = {
  leaderboard: (scope: 'global' | 'guild' = 'global', guild_id?: string) => {
    const params = guild_id ? `?scope=${scope}&guild_id=${guild_id}` : `?scope=${scope}`
    return apiFetch<Array<{ contributor: Contributor; rank: number; total_xp: number }>>(
      `/gamification/leaderboard${params}`
    )
  },
}
