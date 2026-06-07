'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CheckCircle2, ChevronRight } from 'lucide-react'

const EXPERIENCE_LEVELS = [
  { value: 'beginner',     label: 'Absolute Beginner',     desc: 'Never contributed to open source' },
  { value: 'intermediate', label: 'Some Experience',        desc: 'Made a few PRs or commits' },
  { value: 'advanced',     label: 'Regular Contributor',    desc: 'Active in open source projects' },
  { value: 'maintainer',   label: 'Maintainer',             desc: 'You maintain your own projects' },
] as const

const TECHNOLOGIES = [
  'Python', 'JavaScript', 'TypeScript', 'Rust', 'Go', 'Java',
  'C++', 'React', 'Vue', 'Node.js', 'Django', 'FastAPI',
  'Docker', 'Kubernetes', 'CSS', 'GraphQL',
] as const

const GOALS = [
  'Get my first PR merged',
  'Prepare for GSoC',
  'Hacktoberfest',
  'Learn Git & GitHub',
  'Build portfolio',
  'Help open source',
  'Land a job',
  'Learn a new language',
] as const

type Step = 1 | 2 | 3 | 4 | 5

export default function OnboardingPage() {
  const router                    = useRouter()
  const [step, setStep]           = useState<Step>(1)
  const [experience, setExp]      = useState('')
  const [techs, setTechs]         = useState<string[]>([])
  const [goals, setGoals]         = useState<string[]>([])

  function toggleSet(arr: string[], setArr: (v: string[]) => void, val: string) {
    setArr(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val])
  }

  function canAdvance() {
    if (step === 2) return !!experience
    if (step === 3) return techs.length >= 3
    if (step === 4) return goals.length >= 1
    return true
  }

  async function handleFinish() {
    // Would call PATCH /contributors/me with onboarding data
    router.push('/dashboard')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-page px-4">
      <div className="w-full max-w-lg">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8" aria-label={`Step ${step} of 5`} role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={5}>
          {([1, 2, 3, 4, 5] as Step[]).map((s) => (
            <div
              key={s}
              className={cn(
                'h-2 rounded-full transition-all',
                s === step ? 'w-6 bg-accent-purple' :
                s < step   ? 'w-2 bg-accent-green' :
                             'w-2 bg-bg-overlay'
              )}
              aria-hidden="true"
            />
          ))}
        </div>

        <div className="rounded-xl border border-border bg-bg-surface p-8">
          {step === 1 && (
            <div className="text-center">
              <h1 className="font-display text-3xl font-bold text-text-canvas mb-3">Welcome to ContribQuest</h1>
              <p className="text-text-secondary mb-6 text-sm">
                We'll personalize your experience based on a few quick questions.
              </p>
              <ul className="text-left space-y-2 mb-8 text-sm text-text-secondary">
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-accent-green" aria-hidden="true" /> AI-matched open-source opportunities</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-accent-green" aria-hidden="true" /> Earn XP for every contribution</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-accent-green" aria-hidden="true" /> Join guilds and learn with peers</li>
              </ul>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="font-display text-xl font-bold text-text-primary mb-5">What's your experience level?</h2>
              <div className="grid grid-cols-2 gap-3">
                {EXPERIENCE_LEVELS.map(({ value, label, desc }) => (
                  <button
                    key={value}
                    onClick={() => setExp(value)}
                    className={cn(
                      'text-left rounded-xl border p-4 transition-all',
                      experience === value
                        ? 'border-accent-purple bg-[rgba(94,106,210,0.08)]'
                        : 'border-border hover:border-[rgba(94,106,210,0.3)]'
                    )}
                    aria-pressed={experience === value}
                  >
                    <p className="text-sm font-semibold text-text-primary">{label}</p>
                    <p className="text-xs text-text-muted mt-1">{desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="font-display text-xl font-bold text-text-primary mb-1">What technologies interest you?</h2>
              <p className="text-xs text-text-muted mb-5">Select at least 3</p>
              <div className="flex flex-wrap gap-2">
                {TECHNOLOGIES.map((t) => (
                  <button
                    key={t}
                    onClick={() => toggleSet(techs, setTechs, t)}
                    className={cn(
                      'rounded-md border px-3 py-1.5 text-sm transition-all',
                      techs.includes(t)
                        ? 'border-accent-purple bg-[rgba(94,106,210,0.08)] text-text-primary'
                        : 'border-border text-text-secondary hover:border-[rgba(94,106,210,0.3)]'
                    )}
                    aria-pressed={techs.includes(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="font-display text-xl font-bold text-text-primary mb-5">What are your contribution goals?</h2>
              <div className="flex flex-wrap gap-2">
                {GOALS.map((g) => (
                  <button
                    key={g}
                    onClick={() => toggleSet(goals, setGoals, g)}
                    className={cn(
                      'rounded-md border px-3 py-1.5 text-sm transition-all',
                      goals.includes(g)
                        ? 'border-accent-green bg-[rgba(78,222,163,0.08)] text-accent-green'
                        : 'border-border text-text-secondary hover:border-[rgba(78,222,163,0.2)]'
                    )}
                    aria-pressed={goals.includes(g)}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h2 className="font-display text-xl font-bold text-text-primary mb-5">You're all set!</h2>
              <div className="rounded-xl border border-border bg-bg-nested p-4 space-y-3 text-sm">
                <div><span className="text-text-muted">Experience:</span> <span className="capitalize text-text-primary ml-2">{experience}</span></div>
                <div><span className="text-text-muted">Technologies:</span> <span className="text-text-primary ml-2">{techs.join(', ')}</span></div>
                <div><span className="text-text-muted">Goals:</span> <span className="text-text-primary ml-2">{goals.join(', ')}</span></div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <Button variant="ghost" size="md" onClick={() => setStep((s) => (s - 1) as Step)}>
                Back
              </Button>
            ) : <div />}

            {step < 5 ? (
              <Button
                variant="primary"
                size="md"
                onClick={() => setStep((s) => (s + 1) as Step)}
                disabled={!canAdvance()}
              >
                Continue <ChevronRight size={15} aria-hidden="true" />
              </Button>
            ) : (
              <Button variant="primary" size="md" onClick={handleFinish}>
                Start My Journey 🚀
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
