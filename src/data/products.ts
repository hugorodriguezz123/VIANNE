// No edites los productos aquí: edita el catálogo (src/assets/catalogo) y ejecuta
// `pnpm catalogo`, o edita productos.csv y ejecuta `pnpm productos`.
import data from './products.json'

export type Product = {
  id: string
  name: string
  category: string
  price: number
  /** Precio con descuento (promo). null = sin promoción */
  salePrice: number | null
  /** El descuento es de Black Friday (etiqueta especial) */
  blackFriday: boolean
  stock: number
  sizes: string[]
  description: string
  details: string[]
  images: string[]
}

// Fotos del catálogo: Vite las incluye en el build y devuelve su URL final.
const catalogImages = import.meta.glob<string>('../assets/catalogo/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', {
  eager: true,
  query: '?url',
  import: 'default',
})

// En el CSV las fotos del catálogo se escriben como `catalogo/<carpeta>/<foto>`.
// URLs externas (https://…) o rutas de public/ (/…) se usan tal cual.
function resolveImage(path: string): string {
  if (/^(https?:)?\/\//.test(path) || path.startsWith('/')) return path
  const url = catalogImages[`../assets/${path}`]
  if (!url) console.warn(`VIANNE: no se encontró la foto "${path}" en src/assets/catalogo`)
  return url ?? path
}

// Orden: Black Friday primero, luego promociones, agotados al final; el resto conserva el orden del catálogo.
const rank = (p: { salePrice: number | null; blackFriday: boolean; stock: number }) =>
  p.stock === 0 ? 3 : p.salePrice === null ? 2 : p.blackFriday ? 0 : 1
export const products: Product[] = data
  .map((p) => ({ ...p, images: p.images.map(resolveImage) }))
  .sort((a, b) => rank(a) - rank(b))

export const hasPromo = (p: Product): p is Product & { salePrice: number } => p.salePrice !== null

/** Precio que paga el cliente (promo si existe). */
export const finalPrice = (p: Product): number => p.salePrice ?? p.price

/** Porcentaje de descuento redondeado, ej. 21 */
export const discountPercent = (p: Product): number =>
  p.salePrice === null ? 0 : Math.round((1 - p.salePrice / p.price) * 100)

export const categories: string[] = [...new Set(products.map((p) => p.category))]
