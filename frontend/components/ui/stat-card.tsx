import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string | number
  valueColor?: string
  className?: string
}

export function StatCard({ label, value, valueColor, className }: StatCardProps) {
  return (
    <div
      className={cn(
        'rounded-md border border-border bg-bg-page p-4 flex flex-col gap-1',
        className
      )}
    >
      <span className="font-mono text-2xs uppercase tracking-wider text-text-muted">{label}</span>
      <span className={cn('font-mono text-3xl font-bold', valueColor ?? 'text-text-primary')}>
        {value}
      </span>
    </div>
  )
}
