'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { X, Zap } from 'lucide-react'

export function ToastContainer() {
  const { toasts, removeToast } = useAppStore()

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
      ))}
    </div>
  )
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: { id: string; title: string; body?: string; xp?: number }
  onDismiss: () => void
}) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <div
      className={cn(
        'pointer-events-auto flex items-start gap-3 rounded-xl border border-border bg-bg-nested p-4 shadow-elevated',
        'animate-in slide-in-from-right-4 fade-in duration-300 w-80'
      )}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text-primary truncate">{toast.title}</p>
        {toast.body && (
          <p className="text-sm text-text-secondary mt-0.5 truncate">{toast.body}</p>
        )}
        {toast.xp != null && (
          <span className="inline-flex items-center gap-1 mt-1 font-mono text-xs text-text-code">
            <Zap size={11} /> +{toast.xp} XP
          </span>
        )}
      </div>
      <button
        onClick={onDismiss}
        className="text-text-muted hover:text-text-primary transition-colors shrink-0"
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </div>
  )
}
