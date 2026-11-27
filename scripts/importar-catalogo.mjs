#!/usr/bin/env node
/**
 * Importador del catálogo desde carpetas — VIANNE
 *
 * Lee la carpeta del catálogo `src/assets/catalogo/` (una subcarpeta por
 * producto, con sus fotos y un `details.txt`) y genera `productos.csv`.
 * Después ejecuta el importador del CSV (`npm run productos`).
 *
 * Las fotos NO se copian: se quedan en src/assets/catalogo y Vite las incluye
 * al compilar. En el CSV quedan como rutas `catalogo/<carpeta>/<foto>`.
 *
 * Uso:
 *   pnpm catalogo   (o npm run catalogo)
 *
 * Formato de details.txt (el orden de las líneas no importa, salvo el nombre):
 *   Conjunto Lencería Noir        ← primera línea: nombre
 *   Precio: 60.000                ← línea con "precio"
 *   Tallas disponibles: S-M-L     ← línea con "talla" (acepta "Solo M", "XS - S", "Talla única",
 *                                   o las tallas en la línea siguiente)
 *   Descuento 55.000              ← opcional: precio en promoción (también acepta "Descuento 20%").
 *                                   Los productos en promo se muestran primero con etiqueta PROMO
 *   Black Friday                  ← opcional: si "Black Friday" aparece en el txt o en la carpeta, el
 *                                   descuento se muestra con la etiqueta BLACK FRIDAY
 *   Últimas unidades              ← opcional: muestra la etiqueta "¡Últimas unidades!" (o "Última unidad talla S")
 *   Agotado                       ← opcional: se muestra "Agotado" y no se puede pedir por WhatsApp
 *   Color negro                   ← opcional: línea con "color"
 *   Incluye esposas               ← cualquier otra línea se muestra como detalle
 *
 * ⚠ Sobrescribe productos.csv. Si prefieres editar el CSV a mano, no vuelvas a
 *   ejecutar este comando (o haz una copia antes).
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, statSync, renameSync } from 'node:fs'
import { resolve, dirname, join, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const catalogDir = resolve(root, 'src/assets/catalogo')
const csvPath = resolve(root, 'productos.csv')

// Stock por defecto (el catálogo no trae unidades). Ajusta en productos.csv si quieres.
const DEFAULT_STOCK = 10
// Stock que se asigna cuando el txt dice "Últimas unidades" (≤ LOW_STOCK_THRESHOLD de config.ts)
const LAST_UNITS_STOCK = 3
const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp'])
const SIZE_ORDER = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
const COLORS = ['blanco', 'negro', 'rojo', 'vinotinto', 'azul', 'rosa', 'rosado', 'lila', 'morado', 'verde', 'nude', 'beige', 'dorado', 'plateado', 'fucsia']

if (!existsSync(catalogDir)) {
  console.error(`✖ No se encontró la carpeta del catálogo: ${catalogDir}`)
  process.exit(1)
}

const slugify = (s) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)

function parseSizes(line) {
  const after = line.replace(/^.*?talla(s)?(\s+disponibles?)?\s*:?/i, '')
  if (/(^|\s)[uú]nica/i.test(after)) return ['Única']
  const found = after.toUpperCase().match(/\b(XXXL|XXL|XL|XXS|XS|S|M|L)\b/g) ?? []
  return [...new Set(found)].sort((a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b))
}

const isSizesOnly = (line) => /^[\s\-–,/y]*((XXXL|XXL|XL|XXS|XS|S|M|L)[\s\-–,/y]*)+$/i.test(line)

function categoryFor(name) {
  const n = slugify(name)
  if (/(babydoll|bodydoll|bata)/.test(n)) return 'Babydolls y batas'
  if (/(arnes|esposas|antifaz|collar|accesorio)/.test(n)) return 'Accesorios'
  if (/^set|liguero/.test(n)) return 'Sets'
  return 'Conjuntos'
}

// "Descuento 55.000" → 55000 · "Descuento 20%" → 20 % sobre el precio (redondeado a la centena)
function parseDiscount(line, price) {
  const pct = line.match(/(\d+(?:[.,]\d+)?)\s*%/)
  if (pct) return Math.round((price * (1 - Number(pct[1].replace(',', '.')) / 100)) / 100) * 100
  return Number(line.replace(/[^\d]/g, ''))
}

function parseDetails(text, folder) {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
  if (lines.length === 0) throw new Error(`details.txt vacío en "${folder}"`)

  let name = lines[0].replace(/\s+/g, ' ')
  let rest = lines.slice(1)
  // Nombre partido en dos líneas ("Conjunto Lencería" / "Moka") → se unen
  if (slugify(name).split('-').every((w) => FILLER_WORDS.has(w)) && rest[0] && !/precio|talla|\d/i.test(rest[0])) {
    name = `${name} ${rest[0].replace(/\s+/g, ' ')}`
    rest = rest.slice(1)
  }
  const blackFriday = /black\s*friday/i.test(`${folder}
${text}`)
  let price = 0
  let sizes = []
  let color = ''
  let discountLine = ''
  let lastUnits = false
  let soldOut = false
  let expectSizes = false
  const extras = []

  for (const line of rest) {
    // "Tallas disponibles" sin tallas → vienen en la línea siguiente
    if (expectSizes && isSizesOnly(line)) {
      sizes = parseSizes(`talla ${line}`)
      expectSizes = false
      continue
    }
    expectSizes = false

    // "Última unidad talla S" → últimas unidades + talla
    if (/[uú]ltimas?\s+unidad(es)?/i.test(line)) lastUnits = true

    if (/descuento|promo|oferta/i.test(line)) discountLine = line
    else if (/precio/i.test(line)) price = Number(line.replace(/[^\d]/g, ''))
    else if (/talla/i.test(line)) {
      sizes = parseSizes(line)
      expectSizes = sizes.length === 0
    } else if (/[uú]ltimas\s+unidades/i.test(line)) lastUnits = true
    else if (/^(agotado|agotada|sin\s+stock|no\s+disponible)\.?$/i.test(line)) soldOut = true
    else if (/^color\b/i.test(line)) color = line.replace(/^color\s*:?\s*/i, '')
    else if (COLORS.includes(line.toLowerCase())) color = line
    else extras.push(capitalize(line.replace(/\s+/g, ' ')))
  }

  // Si el txt no trae color, se toma del nombre de la carpeta (ej. "conj. lenceria Ambar Negro")
  const folderColor = COLORS.find((c) => slugify(folder).split('-').includes(c)) ?? ''
  if (!color) color = folderColor
  // Se agrega el color al nombre cuando la carpeta lo indica y el nombre no lo tiene
  if (folderColor && !slugify(name).includes(folderColor)) name = `${name} ${capitalize(folderColor)}`

  const salePrice = discountLine ? parseDiscount(discountLine, price) : 0

  return { name, price, salePrice, blackFriday: blackFriday && salePrice > 0, lastUnits, soldOut, sizes, color: color ? capitalize(color.toLowerCase()) : '', extras }
}

// ── Nombres de fotos amigables ──────────────────────────────────────────────
// "conj. lenceria Noir/WhatsApp Image 2026-11-18 at 10.28.49 PM (3).jpeg" → "vianne-noir-1.jpg"
// Se respeta el orden actual (la primera sigue siendo la principal) y las fotos nuevas
// se numeran a continuación de las que ya estaban renombradas.
const FILLER_WORDS = new Set(['conj', 'conjunto', 'lenceria', 'set', 'con', 'liguero', 'en', 'de', 'sexy'])

function photoBaseName(folder) {
  const spaced = folder.replace(/lencer[ií]a(?=\p{Lu})/gu, 'lenceria ') // "lenceriaToscana"
  const words = slugify(spaced).split('-').filter((w) => w && !FILLER_WORDS.has(w))
  return `vianne-${words.join('-') || slugify(folder)}`
}

function renamePhotos(dir, folder, photos) {
  const base = photoBaseName(folder)
  const plan = photos
    .map((from, i) => ({ from, to: `${base}-${i + 1}${extname(from).toLowerCase().replace('.jpeg', '.jpg')}` }))
    .filter(({ from, to }) => from !== to)
  if (plan.length === 0) return

  const taken = plan.find(({ to }) => existsSync(join(dir, to)) && !photos.includes(to))
  if (taken) {
    warnings.push(`"${folder}": no se renombraron las fotos porque ya existe "${taken.to}"`)
    return
  }
  // Dos pasos (nombre temporal → final) para no pisar archivos al reordenar
  plan.forEach(({ from }, i) => renameSync(join(dir, from), join(dir, `.renombrando-${i}`)))
  plan.forEach(({ to }, i) => renameSync(join(dir, `.renombrando-${i}`), join(dir, to)))
  plan.forEach(({ from, to }) => (photos[photos.indexOf(from)] = to))
  renamed += plan.length
}

let renamed = 0

const folders = readdirSync(catalogDir).filter((f) => statSync(join(catalogDir, f)).isDirectory())
const errors = []
const warnings = []
const items = []

for (const folder of folders.sort((a, b) => a.localeCompare(b, 'es'))) {
  const dir = join(catalogDir, folder)
  const txt = readdirSync(dir).find((f) => f.toLowerCase().endsWith('.txt'))
  // Fotos ordenadas por nombre; se omiten las repetidas (mismo contenido con otro nombre)
  const seen = new Set()
  const photos = readdirSync(dir)
    .filter((f) => IMAGE_EXT.has(extname(f).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, 'es', { numeric: true }))
    .filter((f) => {
      const hash = createHash('md5').update(readFileSync(join(dir, f))).digest('hex')
      if (seen.has(hash)) {
        warnings.push(`"${folder}": la foto "${f}" está repetida, se omite`)
        return false
      }
      seen.add(hash)
      return true
    })
  renamePhotos(dir, folder, photos)

  if (!txt) {
    errors.push(`"${folder}": falta el archivo .txt con los datos`)
    continue
  }
  if (photos.length === 0) {
    errors.push(`"${folder}": no tiene fotos`)
    continue
  }

  try {
    const info = parseDetails(readFileSync(join(dir, txt), 'utf8').replace(/^\uFEFF/, ''), folder)
    if (!info.price) errors.push(`"${folder}": no se encontró el precio`)
    if (info.sizes.length === 0) errors.push(`"${folder}": no se encontraron tallas`)
    if (info.salePrice && (info.salePrice <= 0 || info.salePrice >= info.price))
      errors.push(`"${folder}": el descuento (${info.salePrice}) debe ser menor que el precio (${info.price})`)
    items.push({ folder, dir, photos, ...info })
  } catch (e) {
    errors.push(e.message)
  }
}

if (errors.length) {
  console.error('✖ Errores en el catálogo — corrige y vuelve a ejecutar:\n')
  errors.forEach((e) => console.error(`  • ${e}`))
  process.exit(1)
}

// Si dos productos quedan con el mismo nombre (ej. mismo modelo en otro color), se agrega el color.
const nameCount = items.reduce((acc, it) => ((acc[it.name] = (acc[it.name] ?? 0) + 1), acc), {})
for (const it of items) {
  if (nameCount[it.name] > 1 && it.color && !slugify(it.name).includes(slugify(it.color))) {
    it.name = `${it.name} ${it.color}`
  }
}

const csvEscape = (v) => (/[;"\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v)
const rows = [['id', 'nombre', 'categoria', 'precio', 'precio_promo', 'black_friday', 'stock', 'tallas', 'descripcion', 'detalles', 'imagenes']]

for (const it of items) {
  const id = slugify(it.folder)
  const images = it.photos.map((photo) => `catalogo/${it.folder}/${photo}`)

  const details = [...(it.color ? [`Color ${it.color.toLowerCase()}`] : []), ...it.extras]
  rows.push([
    id,
    it.name,
    categoryFor(it.name),
    String(it.price),
    it.salePrice ? String(it.salePrice) : '',
    it.blackFriday ? 'si' : '',
    String(it.soldOut ? 0 : it.lastUnits ? LAST_UNITS_STOCK : DEFAULT_STOCK),
    it.sizes.join('|'),
    '',
    details.join('|'),
    images.join('|'),
  ])
}

writeFileSync(csvPath, '\uFEFF' + rows.map((r) => r.map(csvEscape).join(';')).join('\r\n') + '\r\n', 'utf8')

const totalPhotos = items.reduce((n, it) => n + it.photos.length, 0)
console.log(`✔ ${items.length} productos leídos de src/assets/catalogo (${totalPhotos} fotos)`)
if (renamed) console.log(`  ${renamed} fotos renombradas (vianne-<modelo>-<n>.jpg)`)
warnings.forEach((w) => console.log(`  ⚠ ${w}`))
const agotados = items.filter((it) => it.soldOut)
if (agotados.length) console.log(`  Agotados: ${agotados.map((it) => it.name).join(', ')}`)
const promos = items.filter((it) => it.salePrice)
if (promos.length) console.log(`  En promo: ${promos.map((it) => it.name + (it.blackFriday ? ' (Black Friday)' : '')).join(', ')}`)
console.log(`  productos.csv generado\n`)

execFileSync(process.execPath, [resolve(root, 'scripts/importar-productos.mjs')], { stdio: 'inherit' })
