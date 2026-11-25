import { Sparkles } from 'lucide-react'

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  subtitle?: string
  centered?: boolean
}

export function SectionHeading({ eyebrow, title, subtitle, centered = false }: SectionHeadingProps) {
  const align = centered ? 'text-center items-center' : 'text-left items-start'
  return (
    <div className={`flex flex-col gap-4 ${align}`}>
      {eyebrow && (
        <span className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 font-display text-[11px] tracking-display uppercase text-primary">
          <Sparkles size={12} />
          {eyebrow}
        </span>
      )}
      <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-text leading-[1.08] tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="font-sans text-text-muted text-base md:text-lg leading-relaxed max-w-xl">
          {subtitle}
        </p>
      )}
    </div>
  )
}
