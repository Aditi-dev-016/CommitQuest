import { auth as firebaseAuth, db, githubProvider } from './firebase'
import { signInWithPopup, signOut, User } from 'firebase/auth'
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  orderBy,
  limit,
  serverTimestamp,
  increment
} from 'firebase/firestore'
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
  WorldRegion,
} from './types'

// ─── Fetch helper for AI backend endpoints ─────────────────────────────────────

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  
  if (firebaseAuth.currentUser) {
    const token = await firebaseAuth.currentUser.getIdToken();
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { ...headers, ...options.headers },
    ...options,
  })

  if (res.status === 401) {
    await signOut(firebaseAuth);
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error('Session expired. Please log in again.');
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body?.error?.message ?? `API error ${res.status}`)
  }

  return res.json()
}

// ─── Seed Data (Static Fallbacks) ──────────────────────────────────────────────

const SEED_QUESTS: Quest[] = [
  { id: 'git-101', type: 'standard', category: 'explore', title: 'Git Explorer', description: 'Analyze your first repository to understand its architecture map.', difficulty: 'easy', xp_reward: 100 },
  { id: 'first-pr', type: 'standard', category: 'code', title: 'First PR Submission', description: 'Link your first open pull request on a public repository.', difficulty: 'easy', xp_reward: 200 },
  { id: 'docs-hero', type: 'standard', category: 'read', title: 'Docs Hero', description: 'Complete 3 documentation lessons in the Learning Academy.', difficulty: 'medium', xp_reward: 150 },
  { id: 'daily-check', type: 'daily', category: 'community', title: 'Daily Scout', description: 'Browse the Issue Finder to explore contribution opportunities.', difficulty: 'easy', xp_reward: 50 },
];

const SEED_ACHIEVEMENTS: Achievement[] = [
  { id: 'first-steps', slug: 'first-steps', name: 'First Steps', description: 'Embark on your journey and sign in with GitHub.', tier: 'bronze', xp_reward: 50 },
  { id: 'repository-scout', slug: 'repository-scout', name: 'Repository Scout', description: 'Analyze your first repository.', tier: 'bronze', xp_reward: 50 },
  { id: 'quest-initiate', slug: 'quest-initiate', name: 'Quest Initiate', description: 'Complete your first quest.', tier: 'bronze', xp_reward: 100 },
  { id: 'guild-comrade', slug: 'guild-comrade', name: 'Guild Comrade', description: 'Join your first technology guild.', tier: 'bronze', xp_reward: 50 },
];

const SEED_GUILDS: Guild[] = [
  { id: 'javascript-guild', slug: 'javascript-guild', name: 'JS Wizards', description: 'A guild for modern JS, React, and Frontend sorcery.', specialty: 'JavaScript', tags: ['JS', 'React', 'Frontend'], tier: 'active', member_count: 42 },
  { id: 'python-guild', slug: 'python-guild', name: 'Py-Commanders', description: 'A guild focusing on Python, FastAPI, and AI integration.', specialty: 'Python', tags: ['Python', 'Backend', 'AI'], tier: 'high_activity', member_count: 38 },
];

const SEED_WORLD_MAP: WorldRegion[] = [
  { id: 'git-islands', name: 'Git Islands', slug: 'git-islands', status: 'explored', progress_pct: 100, learning_path_id: 'git-basics' },
  { id: 'js-jungle', name: 'JS Jungle', slug: 'js-jungle', status: 'in_progress', progress_pct: 45, learning_path_id: 'js-basics' },
  { id: 'react-ridge', name: 'React Ridge', slug: 'react-ridge', status: 'locked', progress_pct: 0, lock_reason: 'Requires JS Jungle completion' },
];

const SEED_PATHS: LearningPath[] = [
  { id: 'git-basics', slug: 'git-basics', title: 'Git Basics', description: 'Learn the fundamentals of open-source version control.', region: 'Git Islands', order_index: 0 },
  { id: 'js-basics', slug: 'js-basics', title: 'JavaScript Fundamentals', description: 'Master JS functions, scopes, and asynchronous patterns.', region: 'JS Jungle', order_index: 1 },
];

const SEED_LESSONS: Record<string, Lesson[]> = {
  'git-basics': [
    { id: 'lesson-git-1', path_id: 'git-basics', title: 'What is Git?', type: 'article', xp_reward: 20, order_index: 0, duration_mins: 5 },
    { id: 'lesson-git-2', path_id: 'git-basics', title: 'Forking vs Cloning', type: 'article', xp_reward: 20, order_index: 1, duration_mins: 7 },
  ],
  'js-basics': [
    { id: 'lesson-js-1', path_id: 'js-basics', title: 'Async/Await & Promises', type: 'article', xp_reward: 25, order_index: 0, duration_mins: 10 },
  ]
};

// ─── Helper: Get or Init Contributor Profile ────────────────────────────────────

async function getOrInitContributor(user: User): Promise<Contributor> {
  const userRef = doc(db, 'contributors', user.uid);
  const snap = await getDoc(userRef);

  if (snap.exists()) {
    return snap.data() as Contributor;
  }

  const screenName = (user as any).reloadUserInfo?.screenName || user.displayName || 'Contributor';
  const contributor: Contributor = {
    id: user.uid,
    github_id: parseInt(user.providerData[0]?.uid || '0'),
    username: screenName.toLowerCase(),
    display_name: user.displayName || screenName,
    avatar_url: user.photoURL || '',
    experience_level: 'beginner',
    total_xp: 50, // default starter bonus
    current_level: 1,
    streak_count: 1,
    created_at: new Date().toISOString(),
  };

  await setDoc(userRef, contributor);
  
  // Seed first achievement
  await setDoc(doc(db, `contributors/${user.uid}/achievements`, 'first-steps'), {
    id: 'first-steps',
    unlocked_at: new Date().toISOString(),
  });

  return contributor;
}

// ─── Auth ──────────────────────────────────────────────────────────────────────

export const auth = {
  githubCallback: async (code: string, state: string) => {
    // Standard Firebase Github sign-in popup
    const result = await signInWithPopup(firebaseAuth, githubProvider);
    const token = await result.user.getIdToken();
    const contributor = await getOrInitContributor(result.user);
    return { data: { token, contributor } };
  },
  logout: async () => {
    await signOut(firebaseAuth);
    return { data: null };
  },
}

// ─── Contributor ──────────────────────────────────────────────────────────────

export const contributors = {
  me: async () => {
    const user = firebaseAuth.currentUser;
    if (!user) throw new Error('Not authenticated');
    const c = await getOrInitContributor(user);
    return { data: c };
  },
  update: async (body: { display_name?: string; bio?: string }) => {
    const user = firebaseAuth.currentUser;
    if (!user) throw new Error('Not authenticated');
    const userRef = doc(db, 'contributors', user.uid);
    await updateDoc(userRef, body);
    const updated = (await getDoc(userRef)).data() as Contributor;
    return { data: updated };
  },
  getByUsername: async (username: string) => {
    const q = query(collection(db, 'contributors'), where('username', '==', username.toLowerCase()), limit(1));
    const snapshot = await getDocs(q);
    if (snapshot.empty) throw new Error('User not found');
    return { data: snapshot.docs[0].data() as Contributor };
  },
  myAchievements: async () => {
    const user = firebaseAuth.currentUser;
    if (!user) return { data: [] };
    const snap = await getDocs(collection(db, `contributors/${user.uid}/achievements`));
    const unlockedIds = snap.docs.map(d => d.id);
    const list = SEED_ACHIEVEMENTS.map(a => ({
      ...a,
      unlocked_at: unlockedIds.includes(a.id) ? new Date().toISOString() : undefined
    }));
    return { data: list };
  },
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export const dashboard = {
  get: async (): Promise<ApiResponse<DashboardData>> => {
    const user = firebaseAuth.currentUser;
    if (!user) throw new Error('Not authenticated');
    
    const c = await getOrInitContributor(user);
    
    // Fetch Active Quests
    const qSnap = await getDocs(
      query(collection(db, `contributors/${user.uid}/quest_progress`), where('status', '==', 'active'))
    );
    const activeProgresses = qSnap.docs.map(d => d.data() as QuestProgress);
    const active_quests = SEED_QUESTS.filter(sq =>
      activeProgresses.some(ap => ap.quest_id === sq.id)
    ).map(sq => ({
      ...sq,
      progress: activeProgresses.find(ap => ap.quest_id === sq.id)
    }));

    // Fetch Unlocked Achievements
    const achSnap = await getDocs(collection(db, `contributors/${user.uid}/achievements`));
    const unlockedIds = achSnap.docs.map(d => d.id);
    const recent_achievements = SEED_ACHIEVEMENTS.filter(a => unlockedIds.includes(a.id));

    // Fallback world map
    const world_map = SEED_WORLD_MAP;

    return {
      data: {
        contributor: c,
        active_quests,
        recommended_repos: [],
        recent_achievements,
        world_map,
      }
    };
  },
}

// ─── Repository Analysis (AI-powered backend proxy) ──────────────────────────

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

// ─── Issues (AI-powered backend proxy) ────────────────────────────────────────

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
  list: async (params: { type?: string; status?: string } = {}) => {
    const user = firebaseAuth.currentUser;
    if (!user) return { data: [] };

    const qSnap = await getDocs(collection(db, `contributors/${user.uid}/quest_progress`));
    const progMap = new Map(qSnap.docs.map(d => [d.data().quest_id, d.data() as QuestProgress]));

    let filtered = SEED_QUESTS;
    if (params.type) {
      filtered = filtered.filter(q => q.type === params.type);
    }

    const list = filtered.map(q => {
      const progress = progMap.get(q.id);
      return {
        ...q,
        progress: progress || {
          id: `${user.uid}_${q.id}`,
          contributor_id: user.uid,
          quest_id: q.id,
          status: 'available' as const,
        }
      };
    });

    return { data: list };
  },
  get: async (id: string) => {
    const found = SEED_QUESTS.find(q => q.id === id);
    if (!found) throw new Error('Quest not found');
    return { data: found };
  },
  start: async (id: string) => {
    const user = firebaseAuth.currentUser;
    if (!user) throw new Error('Not authenticated');

    const progressRef = doc(db, `contributors/${user.uid}/quest_progress`, id);
    const newProgress: QuestProgress = {
      id: `${user.uid}_${id}`,
      contributor_id: user.uid,
      quest_id: id,
      status: 'active',
    };
    await setDoc(progressRef, newProgress);
    return { data: newProgress };
  },
  submit: async (id: string, pr_url?: string) => {
    const user = firebaseAuth.currentUser;
    if (!user) throw new Error('Not authenticated');

    const quest = SEED_QUESTS.find(q => q.id === id);
    if (!quest) throw new Error('Quest not found');

    const progressRef = doc(db, `contributors/${user.uid}/quest_progress`, id);
    const xp_awarded = pr_url ? 150 : quest.xp_reward;

    const newProgress: QuestProgress = {
      id: `${user.uid}_${id}`,
      contributor_id: user.uid,
      quest_id: id,
      status: pr_url ? 'submitted' : 'complete',
      pr_url,
      completed_at: new Date().toISOString(),
      xp_awarded,
    };
    await setDoc(progressRef, newProgress);

    // Award XP
    const userRef = doc(db, 'contributors', user.uid);
    await updateDoc(userRef, {
      total_xp: increment(xp_awarded)
    });

    return {
      data: newProgress,
      xp_awarded,
      achievements_unlocked: [],
    };
  },
}

// ─── Achievements ─────────────────────────────────────────────────────────────

export const achievements = {
  list: async () => {
    const user = firebaseAuth.currentUser;
    if (!user) return { data: [] };
    const snap = await getDocs(collection(db, `contributors/${user.uid}/achievements`));
    const unlockedIds = snap.docs.map(d => d.id);
    const list = SEED_ACHIEVEMENTS.map(a => ({
      ...a,
      unlocked_at: unlockedIds.includes(a.id) ? new Date().toISOString() : undefined
    }));
    return { data: list };
  },
}

// ─── Learning Academy ─────────────────────────────────────────────────────────

export const academy = {
  paths: async () => {
    return { data: SEED_PATHS };
  },
  path: async (pathId: string) => {
    const found = SEED_PATHS.find(p => p.id === pathId);
    if (!found) throw new Error('Path not found');
    return { data: found };
  },
  lessons: async (pathId: string) => {
    const lessons = SEED_LESSONS[pathId] || [];
    const user = firebaseAuth.currentUser;
    if (!user) return { data: lessons };

    const snap = await getDocs(collection(db, `contributors/${user.uid}/lesson_progress`));
    const completedIds = snap.docs.map(d => d.id);

    const out = lessons.map(l => ({
      ...l,
      completed_at: completedIds.includes(l.id) ? new Date().toISOString() : undefined
    }));
    return { data: out };
  },
  completeLesson: async (lessonId: string, quiz_answers?: number[]) => {
    const user = firebaseAuth.currentUser;
    if (!user) throw new Error('Not authenticated');

    const progressRef = doc(db, `contributors/${user.uid}/lesson_progress`, lessonId);
    await setDoc(progressRef, {
      id: lessonId,
      completed_at: new Date().toISOString(),
    });

    // Find and award XP
    let xp = 20;
    for (const list of Object.values(SEED_LESSONS)) {
      const found = list.find(l => l.id === lessonId);
      if (found) {
        xp = found.xp_reward;
        break;
      }
    }

    const userRef = doc(db, 'contributors', user.uid);
    await updateDoc(userRef, {
      total_xp: increment(xp)
    });

    return { data: { xp_awarded: xp } };
  },
}

// ─── Guilds ───────────────────────────────────────────────────────────────────

export const guilds = {
  list: async (params: { q?: string; tag?: string } = {}) => {
    let list = SEED_GUILDS;
    if (params.q) {
      const queryStr = params.q.toLowerCase();
      list = list.filter(g => g.name.toLowerCase().includes(queryStr) || g.description.toLowerCase().includes(queryStr));
    }
    if (params.tag) {
      list = list.filter(g => g.tags.includes(params.tag!));
    }
    return { data: list };
  },
  get: async (id: string) => {
    const found = SEED_GUILDS.find(g => g.id === id);
    if (!found) throw new Error('Guild not found');
    return { data: found };
  },
  join: async (id: string) => {
    const user = firebaseAuth.currentUser;
    if (!user) throw new Error('Not authenticated');

    const memberRef = doc(db, `guilds/${id}/members`, user.uid);
    await setDoc(memberRef, {
      joined_at: new Date().toISOString()
    });

    // Award Guild Comrade Achievement
    await setDoc(doc(db, `contributors/${user.uid}/achievements`, 'guild-comrade'), {
      id: 'guild-comrade',
      unlocked_at: new Date().toISOString(),
    });

    return { data: { success: true } };
  },
  messages: async (id: string, page = 1) => {
    const snap = await getDocs(
      query(collection(db, `guilds/${id}/messages`), orderBy('created_at', 'desc'), limit(50))
    );
    const msgs = snap.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        guild_id: id,
        contributor_id: data.contributor_id,
        body: data.body,
        reactions: data.reactions || {},
        created_at: data.created_at?.toDate()?.toISOString() || new Date().toISOString(),
        contributor: data.contributor,
      } as GuildMessage;
    });
    return { data: msgs.reverse() };
  },
  postMessage: async (id: string, body: string) => {
    const user = firebaseAuth.currentUser;
    if (!user) throw new Error('Not authenticated');

    const c = await getOrInitContributor(user);
    const msgData = {
      contributor_id: user.uid,
      body,
      reactions: {},
      created_at: serverTimestamp(),
      contributor: {
        username: c.username,
        display_name: c.display_name,
        avatar_url: c.avatar_url,
        current_level: c.current_level,
      }
    };

    const docRef = await addDoc(collection(db, `guilds/${id}/messages`), msgData);
    
    return {
      data: {
        id: docRef.id,
        guild_id: id,
        contributor_id: user.uid,
        body,
        reactions: {},
        created_at: new Date().toISOString(),
        contributor: msgData.contributor,
      }
    };
  },
}

// ─── Gamification ─────────────────────────────────────────────────────────────

export const gamification = {
  leaderboard: async (scope: 'global' | 'guild' = 'global', guild_id?: string) => {
    // Return all users ordered by total_xp
    const snap = await getDocs(
      query(collection(db, 'contributors'), orderBy('total_xp', 'desc'), limit(25))
    );
    const list = snap.docs.map((d, index) => ({
      contributor: d.data() as Contributor,
      rank: index + 1,
      total_xp: d.data().total_xp || 0,
    }));
    return { data: list };
  },
}
