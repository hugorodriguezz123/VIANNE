import { PackageX } from 'lucide-react'

interface SoldOutOverlayProps {
  size?: 'sm' | 'lg'
}

/** Sello "Agotado" que cubre la foto del producto. */
export function SoldOutOverlay({ size = 'sm' }: SoldOutOverlayProps) {
  const large = size === 'lg'
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/55 backdrop-blur-[2px]">
      <span
        className={`inline-flex items-center gap-2 -rotate-6 rounded-full border-2 border-primary bg-black/80 font-display font-bold uppercase tracking-display text-white shadow-glow ${
          large ? 'text-lg px-7 py-3' : 'text-xs md:text-sm px-4 py-2'
        }`}
      >
        <PackageX size={large ? 20 : 15} className="text-primary-bright" />
        Agotado
      </span>
    </div>
  )
}
