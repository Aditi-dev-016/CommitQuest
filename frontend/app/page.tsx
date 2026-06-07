import { GitBranch, Zap, Map, Users } from 'lucide-react'
import Link from 'next/link'

const FEATURES = [
  {
    icon: Map,
    title: 'Quest System',
    desc: 'Earn XP by exploring repos, submitting PRs, and completing learning challenges.',
  },
  {
    icon: Zap,
    title: 'AI-Powered Insights',
    desc: 'Get plain-English explanations of issues and AI-generated architecture maps.',
  },
  {
    icon: Users,
    title: 'Guild Community',
    desc: 'Join guilds, collaborate on quests, and learn from fellow contributors.',
  },
]

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-bg-page px-4">
      {/* Subtle grid overlay */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col items-center gap-8 max-w-lg text-center">
        {/* Logo + wordmark */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-purple shadow-glow-purple">
            <GitBranch size={20} className="text-white" />
          </div>
          <span className="font-display text-2xl font-bold text-text-code">ContribQuest</span>
        </div>

        {/* Hero */}
        <div>
          <h1 className="font-display text-5xl font-bold text-text-canvas leading-tight">
            Level Up Through Open Source
          </h1>
          <p className="mt-4 text-md text-text-secondary">
            Discover beginner-friendly repositories, earn XP for contributions, and build your
            open-source career — all in one gamified platform.
          </p>
        </div>

        {/* GitHub OAuth CTA */}
        <Link
          href="/api/auth/github"
          className="flex w-full max-w-xs items-center justify-center gap-3 rounded-md bg-accent-purple-vivid px-6 py-3 text-sm font-bold text-[#3C0091] hover:opacity-90 transition-opacity"
          aria-label="Sign in with GitHub"
        >
          <GitHubIcon />
          Sign in with GitHub
        </Link>

        {/* Feature highlights */}
        <div className="grid grid-cols-3 gap-4 mt-4 w-full text-left">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-xl border border-border bg-bg-surface p-4">
              <Icon size={18} className="text-accent-purple mb-2" aria-hidden="true" />
              <p className="text-sm font-semibold text-text-primary mb-1">{title}</p>
              <p className="text-xs text-text-secondary leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

function GitHubIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}
