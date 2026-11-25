import { useState } from 'react'
import { X, Package, Truck, HandCoins } from 'lucide-react'

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="relative bg-gradient-to-r from-primary/5 via-primary/15 to-primary/5 border-b border-white/5 backdrop-blur-sm pl-4 pr-10 py-2.5 flex items-center justify-center gap-6 text-xs font-sans text-text-muted">
      <span className="flex items-center gap-1.5 text-center">
        <HandCoins size={13} className="text-primary flex-shrink-0" />
        Pago contraentrega en Bucaramanga y su área metropolitana
      </span>
      <span className="hidden md:block w-px h-3 bg-border" />
      <span className="hidden md:flex items-center gap-1.5">
        <Package size={13} className="text-primary" />
        Empaque discreto
      </span>
      <span className="hidden lg:block w-px h-3 bg-border" />
      <span className="hidden lg:flex items-center gap-1.5">
        <Truck size={13} className="text-primary" />
        Envíos a toda Colombia
      </span>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Cerrar anuncio"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  )
}
