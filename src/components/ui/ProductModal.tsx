import { useEffect, useState } from 'react'
import { X, ChevronLeft, ChevronRight, Check, PackageX, Ruler } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Product } from '../../data/products'
import { LOW_STOCK_THRESHOLD } from '../../data/config'
import { formatCOP, buildWhatsAppUrl } from '../../lib/format'
import { WhatsAppIcon } from './WhatsAppIcon'

interface ProductModalProps {
  product: Product
  onClose: () => void
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const [imageIndex, setImageIndex] = useState(0)
  const soldOut = product.stock === 0
  const lowStock = !soldOut && product.stock <= LOW_STOCK_THRESHOLD
  const images = product.images
  const sizes = product.sizes
  // Si solo hay una talla, queda seleccionada de una vez
  const [size, setSize] = useState<string | null>(sizes.length === 1 ? sizes[0] : null)
  const [sizeError, setSizeError] = useState(false)
  const needsSize = sizes.length > 0 && !size

  const chooseSize = (s: string) => {
    setSize(s)
    setSizeError(false)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') setImageIndex((i) => (i - 1 + images.length) % images.length)
      if (e.key === 'ArrowRight') setImageIndex((i) => (i + 1) % images.length)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [images.length, onClose])

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.98 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative w-full sm:max-w-4xl max-h-[92vh] sm:max-h-[88vh] bg-surface/90 backdrop-blur-xl border border-white/10 shadow-card overflow-y-auto scrollbar-thin rounded-t-4xl sm:rounded-4xl"
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-4 right-4 z-10 glass-strong text-text-muted hover:text-text hover:border-primary-soft p-2.5 rounded-full transition-colors"
        >
          <X size={18} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-2 p-2.5 md:p-3">
          {/* Galería */}
          <div className="relative">
            <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-bg-pure">
              <img
                src={images[imageIndex]}
                alt={`${product.name} — foto ${imageIndex + 1} de ${images.length}`}
                className={`w-full h-full object-contain ${soldOut ? 'opacity-40 grayscale' : ''}`}
              />
              {soldOut && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="glass-strong rounded-full font-display text-sm tracking-display uppercase text-text px-5 py-2.5">
                    Agotado
                  </span>
                </div>
              )}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setImageIndex((i) => (i - 1 + images.length) % images.length)}
                    aria-label="Foto anterior"
                    className="absolute left-3 top-1/2 -translate-y-1/2 glass-strong text-text p-2.5 rounded-full hover:bg-primary hover:border-primary transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setImageIndex((i) => (i + 1) % images.length)}
                    aria-label="Foto siguiente"
                    className="absolute right-3 top-1/2 -translate-y-1/2 glass-strong text-text p-2.5 rounded-full hover:bg-primary hover:border-primary transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>
                  <span className="absolute bottom-3 left-1/2 -translate-x-1/2 glass-strong rounded-full px-3 py-1 font-sans text-[11px] text-text-muted">
                    {imageIndex + 1} / {images.length}
                  </span>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 pt-2.5 overflow-x-auto scrollbar-thin">
                {images.map((img, i) => (
                  <button
                    key={img}
                    onClick={() => setImageIndex(i)}
                    aria-label={`Ver foto ${i + 1}`}
                    className={`flex-shrink-0 w-16 aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all ${
                      i === imageIndex
                        ? 'border-primary shadow-glow-sm'
                        : 'border-transparent opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Información */}
          <div className="flex flex-col gap-5 p-4 pt-6 md:p-7">
            <div className="flex flex-col gap-2.5">
              <span className="font-display text-[11px] tracking-display uppercase text-primary">
                {product.category}
              </span>
              <h2 className="font-heading text-3xl md:text-4xl text-text leading-[1.1] tracking-tight">
                {product.name}
              </h2>
              <span className="font-sans font-semibold text-gradient text-2xl mt-1">
                {formatCOP(product.price)}
              </span>
            </div>

            {soldOut ? (
              <span className="inline-flex items-center gap-2 self-start font-sans text-xs font-semibold uppercase tracking-wider text-text-muted glass px-4 py-2 rounded-full">
                <PackageX size={14} />
                Agotado por ahora
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 self-start font-sans text-xs font-semibold uppercase tracking-wider text-primary-bright bg-primary/10 border border-primary-soft px-4 py-2 rounded-full">
                <Check size={14} />
                {lowStock ? `¡Solo quedan ${product.stock} unidades!` : 'Disponible'}
              </span>
            )}

            {product.description && (
              <p className="font-sans text-sm md:text-base text-text-muted leading-relaxed">
                {product.description}
              </p>
            )}

            {sizes.length > 0 && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 font-display text-[11px] tracking-display uppercase text-text">
                    <Ruler size={14} className="text-primary-bright" />
                    {sizes.length === 1 ? 'Talla disponible' : 'Elige tu talla'}
                  </span>
                  {size && (
                    <span className="font-sans text-xs text-text-muted">
                      Seleccionada: <strong className="text-primary-bright">{size}</strong>
                    </span>
                  )}
                </div>
                <div
                  role="radiogroup"
                  aria-label="Talla"
                  className={`flex flex-wrap gap-2 rounded-2xl transition-shadow ${
                    sizeError ? 'ring-2 ring-primary ring-offset-4 ring-offset-surface' : ''
                  }`}
                >
                  {sizes.map((s) => {
                    const active = s === size
                    return (
                      <button
                        key={s}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        disabled={soldOut}
                        onClick={() => chooseSize(s)}
                        className={`min-w-[3.25rem] font-sans font-semibold text-sm px-4 py-2.5 rounded-xl border transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${
                          active
                            ? 'bg-primary text-white border-primary shadow-glow-sm'
                            : 'glass text-text hover:border-primary-soft'
                        }`}
                      >
                        {s}
                      </button>
                    )
                  })}
                </div>
                {sizeError && (
                  <p role="alert" className="font-sans text-xs text-primary-bright">
                    Selecciona una talla para continuar con tu compra.
                  </p>
                )}
              </div>
            )}

            {product.details.length > 0 && (
              <ul className="flex flex-col gap-2.5">
                {product.details.map((detail) => (
                  <li key={detail} className="flex items-start gap-3 font-sans text-sm text-text">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 border border-primary-soft flex items-center justify-center mt-0.5">
                      <Check size={11} className="text-primary-bright" />
                    </span>
                    {detail}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-auto pt-5 flex flex-col gap-3">
              {soldOut ? (
                <span className="inline-flex items-center justify-center gap-2 font-sans font-semibold text-base px-8 py-4 rounded-full glass text-text-muted cursor-not-allowed">
                  <PackageX size={18} />
                  Agotado
                </span>
              ) : needsSize ? (
                <button
                  type="button"
                  onClick={() => setSizeError(true)}
                  className="inline-flex items-center justify-center gap-2 font-sans font-semibold tracking-wide text-base px-8 py-4 rounded-full bg-primary/40 text-white/80 border border-primary-soft hover:bg-primary/50 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                >
                  <WhatsAppIcon size={18} />
                  Elige una talla para comprar
                </button>
              ) : (
                <a
                  href={buildWhatsAppUrl(product, size ?? undefined)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 font-sans font-semibold tracking-wide text-base px-8 py-4 rounded-full bg-primary text-white shadow-glow hover:bg-primary-bright hover:shadow-glow-lg hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                >
                  <WhatsAppIcon size={18} />
                  Comprar por WhatsApp
                </a>
              )}
              <p className="font-sans text-xs text-text-muted text-center">
                Empaque discreto · Envíos a toda Colombia · Pago contraentrega en el área metropolitana de Bucaramanga
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
