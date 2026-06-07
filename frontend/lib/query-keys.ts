import type { IssueFilters } from './types'

export const queryKeys = {
  user:          ['user'] as const,
  dashboard:     ['dashboard'] as const,
  repos:         ['repos'] as const,
  repoAnalysis:  (url: string) => ['repos', 'analysis', url] as const,
  repoExplorer:  (owner: string, repo: string) => ['repos', 'explorer', owner, repo] as const,
  issues:        (filters: IssueFilters) => ['issues', filters] as const,
  issue:         (id: string) => ['issues', id] as const,
  issueExplain:  (id: string) => ['issues', id, 'explain'] as const,
  quests:        (params?: object) => ['quests', params] as const,
  quest:         (id: string) => ['quests', id] as const,
  achievements:  ['achievements'] as const,
  guilds:        (params?: object) => ['guilds', params] as const,
  guild:         (id: string) => ['guilds', id] as const,
  guildMessages: (id: string) => ['guilds', id, 'messages'] as const,
  learningPaths: ['academy', 'paths'] as const,
  lessons:       (pathId: string) => ['academy', 'paths', pathId, 'lessons'] as const,
  profile:       (username: string) => ['profile', username] as const,
}
