// No edites los productos aquí: edita el catálogo (src/assets/catalogo) y ejecuta
// `pnpm catalogo`, o edita productos.csv y ejecuta `pnpm productos`.
import data from './products.json'

export type Product = {
  id: string
  name: string
  category: string
  price: number
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

export const products: Product[] = data.map((p) => ({ ...p, images: p.images.map(resolveImage) }))

export const categories: string[] = [...new Set(products.map((p) => p.category))]
