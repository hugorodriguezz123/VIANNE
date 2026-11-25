import { Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Product } from '../../data/products'
import { LOW_STOCK_THRESHOLD } from '../../data/config'
import { formatCOP } from '../../lib/format'

interface ProductCardProps {
  product: Product
  onSelect: (product: Product) => void
}

export function ProductCard({ product, onSelect }: ProductCardProps) {
  const soldOut = product.stock === 0
  const lowStock = !soldOut && product.stock <= LOW_STOCK_THRESHOLD

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="group relative h-full flex flex-col bg-surface/70 backdrop-blur-sm border border-white/5 rounded-3xl overflow-hidden hover:border-primary-soft hover:shadow-glow-lg transition-all duration-300"
    >
      <button
        onClick={() => onSelect(product)}
        aria-label={`Ver detalles de ${product.name}`}
        className="flex flex-col h-full text-left p-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset rounded-3xl"
      >
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              soldOut ? 'opacity-40 grayscale' : ''
            }`}
          />

          {soldOut && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="glass-strong rounded-full font-display text-[11px] tracking-display uppercase text-text px-4 py-2">
                Agotado
              </span>
            </div>
          )}

          {lowStock && (
            <span className="absolute top-2.5 left-2.5 font-sans text-[11px] font-semibold uppercase tracking-wider text-white bg-primary shadow-glow-sm px-3 py-1.5 rounded-full">
              ¡Últimas {product.stock}!
            </span>
          )}

          {!soldOut && (
            <span className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 glass-strong text-text text-xs font-sans px-3.5 py-2 rounded-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200">
              <Eye size={14} className="text-primary-bright" />
              Ver detalles
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5 px-2.5 pt-3.5 pb-2">
          <span className="font-sans text-[11px] text-text-muted uppercase tracking-widest">
            {product.category}
          </span>
          <h3 className="font-heading text-base md:text-lg text-text leading-snug group-hover:text-primary-bright transition-colors">
            {product.name}
          </h3>
          <span className="font-sans font-semibold text-primary-bright text-sm md:text-base mt-0.5">
            {formatCOP(product.price)}
          </span>
          {product.sizes.length > 0 && (
            <span className="font-sans text-[11px] text-text-muted tracking-wide">
              Tallas: {product.sizes.join(' · ')}
            </span>
          )}
        </div>
      </button>
    </motion.article>
  )
}
