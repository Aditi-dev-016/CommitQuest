import { cn } from '@/lib/utils'

interface TagChipProps {
  children: React.ReactNode
  className?: string
}

export function TagChip({ children, className }: TagChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm bg-bg-overlay px-2 py-1 font-mono text-xs text-text-secondary',
        className
      )}
    >
      {children}
    </span>
  )
}
