import { Tag } from 'lucide-react'
import { hasPromo, discountPercent, type Product } from '../../data/products'
import { formatCOP } from '../../lib/format'

interface PriceProps {
  product: Product
  size?: 'sm' | 'lg'
  className?: string
}

/** Precio del producto. Si está en promo: precio promo + precio anterior tachado. */
export function Price({ product, size = 'sm', className = '' }: PriceProps) {
  const large = size === 'lg'

  if (!hasPromo(product)) {
    return (
      <span
        className={`font-sans font-semibold ${
          large ? 'text-gradient text-2xl' : 'text-primary-bright text-sm md:text-base'
        } ${className}`}
      >
        {formatCOP(product.price)}
      </span>
    )
  }

  return (
    <span className={`inline-flex flex-wrap items-baseline gap-x-2 gap-y-0.5 ${className}`}>
      <span className={`font-sans font-bold text-primary-bright ${large ? 'text-2xl md:text-3xl' : 'text-sm md:text-base'}`}>
        {formatCOP(product.salePrice)}
      </span>
      <s className={`font-sans text-text-muted ${large ? 'text-base' : 'text-xs'}`} aria-label={`Antes ${formatCOP(product.price)}`}>
        {formatCOP(product.price)}
      </s>
    </span>
  )
}

/** Etiqueta "PROMO -21%" */
export function PromoBadge({ product, className = '' }: { product: Product; className?: string }) {
  if (!hasPromo(product)) return null
  return (
    <span
      className={`inline-flex items-center gap-1 font-sans text-[11px] font-bold uppercase tracking-wider text-white bg-gradient-to-r from-primary to-primary-bright shadow-glow-sm px-3 py-1.5 rounded-full ${className}`}
    >
      <Tag size={11} />
      Promo -{discountPercent(product)}%
    </span>
  )
}
