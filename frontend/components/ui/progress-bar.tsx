import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number        // 0–100
  label?: string
  showPercent?: boolean
  variant?: 'xp' | 'default' | 'green' | 'amber'
  height?: 'sm' | 'md' | 'lg'
  className?: string
}

const heightMap = { sm: 'h-1.5', md: 'h-2', lg: 'h-3' }

const fillMap = {
  xp:      'bg-gradient-to-r from-accent-purple to-accent-green shadow-[0_0_8px_rgba(94,106,210,0.6)]',
  default: 'bg-accent-purple',
  green:   'bg-accent-green',
  amber:   'bg-accent-amber',
}

export function ProgressBar({
  value,
  label,
  showPercent,
  variant = 'xp',
  height = 'md',
  className,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, value))

  return (
    <div className={cn('w-full', className)}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="font-mono text-2xs uppercase text-text-muted tracking-wider">{label}</span>}
          {showPercent && <span className="font-mono text-2xs text-text-secondary">{pct}%</span>}
        </div>
      )}
      <div
        className={cn(
          'w-full rounded-full border border-border bg-bg-overlay overflow-hidden',
          heightMap[height]
        )}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn('h-full rounded-full transition-all duration-500', fillMap[variant])}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
