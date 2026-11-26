import { WHATSAPP_NUMBER } from '../data/config'
import { hasPromo, type Product } from '../data/products'

const copFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
})

export function formatCOP(value: number): string {
  return copFormatter.format(value)
}

// wa.me no permite adjuntar imágenes directamente: se envía la URL absoluta de la
// foto principal y WhatsApp muestra su vista previa en el chat (no enlaza a la página).
export function buildWhatsAppUrl(product: Product, size?: string): string {
  const photoUrl = new URL(product.images[0], window.location.href).href
  const message = [
    '¡Hola VIANNE! 💖 Quiero comprar este artículo:',
    '',
    `*${product.name}*`,
    ...(size ? [`Talla: *${size}*`] : []),
    ...(hasPromo(product)
      ? [`Precio PROMO: *${formatCOP(product.salePrice)}* (antes ${formatCOP(product.price)})`]
      : [`Precio: *${formatCOP(product.price)}*`]),
    '',
    photoUrl,
    '',
    '¿Está disponible?',
  ].join('\n')
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
