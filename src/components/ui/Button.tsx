import { type ButtonHTMLAttributes, forwardRef } from 'react'

type Variant = 'primary' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const base =
  'inline-flex items-center justify-center gap-2 font-sans font-semibold tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-50 disabled:pointer-events-none rounded-full'

const variants: Record<Variant, string> = {
  primary:
    'bg-primary text-white shadow-glow-sm hover:bg-primary-bright hover:shadow-glow hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0',
  outline:
    'border border-primary/60 text-primary hover:bg-primary hover:border-primary hover:text-white hover:shadow-glow-sm hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0',
  ghost:
    'text-text-muted hover:text-text hover:bg-white/5 active:scale-[0.98]',
}

const sizes: Record<Size, string> = {
  sm: 'text-xs px-5 py-2.5',
  md: 'text-sm px-7 py-3.5',
  lg: 'text-base px-9 py-4',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, ...props }, ref) => (
    <button
      ref={ref}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  ),
)

Button.displayName = 'Button'
