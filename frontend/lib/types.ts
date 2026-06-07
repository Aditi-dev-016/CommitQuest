// ─── Core domain types ────────────────────────────────────────────────────────

export interface Contributor {
  id: string
  github_id: number
  username: string
  display_name: string
  avatar_url: string
  bio?: string
  experience_level: 'beginner' | 'intermediate' | 'advanced' | 'maintainer'
  total_xp: number
  current_level: number
  streak_count: number
  last_active_date?: string
  created_at: string
}

export interface Quest {
  id: string
  type: 'daily' | 'standard' | 'featured' | 'milestone'
  category: 'explore' | 'read' | 'code' | 'review' | 'community'
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  xp_reward: number
  prerequisite_id?: string
  issue_id?: string
  repository_id?: string
  active_from?: string
  active_until?: string
}

export interface QuestProgress {
  id: string
  contributor_id: string
  quest_id: string
  status: 'locked' | 'available' | 'active' | 'submitted' | 'complete' | 'failed'
  pr_url?: string
  completed_at?: string
  xp_awarded?: number
}

export interface QuestWithProgress extends Quest {
  progress?: QuestProgress
}

export interface Repository {
  id: string
  github_id: number
  owner: string
  name: string
  full_name: string
  description?: string
  html_url: string
  primary_language?: string
  star_count: number
  fork_count: number
  open_issue_count: number
}

export interface RepositoryAnalysis {
  id: string
  repository_id: string
  beginner_score: number
  documentation_score: number
  complexity_score: number
  setup_difficulty_score: number
  community_score: number
  summary_text: string
  tech_stack: string[]
  good_first_issue_count: number
  help_wanted_count: number
  expires_at: string
  created_at: string
  repository: Repository
}

export interface Issue {
  id: string
  repository_id: string
  github_number: number
  title: string
  body?: string
  html_url: string
  state: 'open' | 'closed'
  labels: string[]
  difficulty: 'easy' | 'medium' | 'hard' | 'unknown'
  is_good_first_issue: boolean
  is_help_wanted: boolean
  author: string
  created_at: string
  repository?: Repository
}

export interface IssueExplanation {
  id: string
  issue_id: string
  plain_english: string
  required_concepts: string[]
  skills_needed: string[]
  files_involved: string[]
  suggested_steps: string
}

export interface Achievement {
  id: string
  slug: string
  name: string
  description: string
  icon_url?: string
  tier: 'bronze' | 'silver' | 'gold' | 'legendary'
  xp_reward: number
  unlocked_at?: string
}

export interface Guild {
  id: string
  slug: string
  name: string
  description: string
  specialty: string
  tags: string[]
  icon_url?: string
  tier: 'active' | 'high_activity' | 'steady' | 'new'
  member_count: number
}

export interface GuildMessage {
  id: string
  guild_id: string
  contributor_id: string
  body: string
  reactions: Record<string, number>
  created_at: string
  contributor?: Pick<Contributor, 'username' | 'display_name' | 'avatar_url' | 'current_level'>
}

export interface LearningPath {
  id: string
  slug: string
  title: string
  description: string
  region: string
  order_index: number
  lessons?: Lesson[]
}

export interface Lesson {
  id: string
  path_id: string
  title: string
  type: 'article' | 'video' | 'quiz'
  content?: string
  xp_reward: number
  order_index: number
  duration_mins: number
  completed_at?: string
}

export interface WorldRegion {
  id: string
  name: string
  slug: string
  status: 'explored' | 'in_progress' | 'locked'
  progress_pct: number
  lock_reason?: string
  learning_path_id?: string
}

export interface DashboardData {
  contributor: Contributor
  active_quests: QuestWithProgress[]
  recommended_repos: (Repository & { analysis?: Pick<RepositoryAnalysis, 'beginner_score'> })[]
  recent_achievements: Achievement[]
  world_map: WorldRegion[]
}

// ─── API response wrapper ──────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
  meta?: PaginationMeta
  error?: ApiError
}

export interface PaginationMeta {
  page: number
  per_page: number
  total: number
  total_pages: number
}

export interface ApiError {
  code: string
  message: string
  details?: unknown
}

export interface IssueFilters {
  language?: string
  difficulty?: string
  label?: string
  repo?: string
  page?: number
  per_page?: number
}
