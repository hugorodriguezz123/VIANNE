interface LogoProps {
  className?: string
}

// Logotipo tipográfico: Cinzel + degradado magenta, mismo espíritu del logo original.
export function Logo({ className = '' }: LogoProps) {
  return (
    <span
      className={`inline-flex items-baseline font-display font-bold uppercase tracking-display select-none ${className}`}
    >
      <span className="text-gradient" style={{letterSpacing: 0}}>Vianne</span>
      <span className="text-primary-bright -ml-[0.18em]"></span>
    </span>
  )
}
