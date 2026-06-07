import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-md font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-purple disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary:   'bg-accent-purple-vivid text-[#3C0091] hover:opacity-90',
        secondary: 'bg-[rgba(208,188,255,0.1)] text-text-code border border-[rgba(208,188,255,0.3)] hover:bg-[rgba(208,188,255,0.15)]',
        outline:   'bg-transparent text-text-primary border border-border hover:border-border hover:bg-bg-elevated',
        ghost:     'bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-elevated',
        danger:    'bg-[rgba(239,68,68,0.1)] text-accent-red border border-[rgba(239,68,68,0.2)] hover:bg-[rgba(239,68,68,0.15)]',
      },
      size: {
        sm: 'px-3 py-1.5 text-sm uppercase tracking-wider',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-2.5 text-md',
      },
    },
    defaultVariants: {
      variant: 'outline',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
)
Button.displayName = 'Button'
