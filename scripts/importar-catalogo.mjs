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
 *   Tallas disponibles: S-M-L     ← línea con "talla" (acepta "Solo M", "XS - S"…)
 *   Color negro                   ← opcional: línea con "color"
 *   Incluye esposas               ← cualquier otra línea se muestra como detalle
 *
 * ⚠ Sobrescribe productos.csv. Si prefieres editar el CSV a mano, no vuelvas a
 *   ejecutar este comando (o haz una copia antes).
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from 'node:fs'
import { resolve, dirname, join, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const catalogDir = resolve(root, 'src/assets/catalogo')
const csvPath = resolve(root, 'productos.csv')

// Stock por defecto (el catálogo no trae unidades). Ajusta en productos.csv si quieres.
const DEFAULT_STOCK = 10
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
  const found = after.toUpperCase().match(/\b(XXXL|XXL|XL|XXS|XS|S|M|L)\b/g) ?? []
  return [...new Set(found)].sort((a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b))
}

function categoryFor(name) {
  const n = slugify(name)
  if (/(babydoll|bodydoll|bata)/.test(n)) return 'Babydolls y batas'
  if (/^set/.test(n)) return 'Sets'
  return 'Conjuntos'
}

function parseDetails(text, folder) {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
  if (lines.length === 0) throw new Error(`details.txt vacío en "${folder}"`)

  let name = lines[0].replace(/\s+/g, ' ')
  let price = 0
  let sizes = []
  let color = ''
  const extras = []

  for (const line of lines.slice(1)) {
    if (/precio/i.test(line)) price = Number(line.replace(/[^\d]/g, ''))
    else if (/talla/i.test(line)) sizes = parseSizes(line)
    else if (/^color\b/i.test(line)) color = line.replace(/^color\s*:?\s*/i, '')
    else if (COLORS.includes(line.toLowerCase())) color = line
    else extras.push(capitalize(line.replace(/\s+/g, ' ')))
  }

  // Si el txt no trae color, se toma del nombre de la carpeta (ej. "conj. lenceria Ambar Negro")
  const folderColor = COLORS.find((c) => slugify(folder).split('-').includes(c)) ?? ''
  if (!color) color = folderColor
  // Se agrega el color al nombre cuando la carpeta lo indica y el nombre no lo tiene
  if (folderColor && !slugify(name).includes(folderColor)) name = `${name} ${capitalize(folderColor)}`

  return { name, price, sizes, color: color ? capitalize(color.toLowerCase()) : '', extras }
}

const folders = readdirSync(catalogDir).filter((f) => statSync(join(catalogDir, f)).isDirectory())
const errors = []
const items = []

for (const folder of folders.sort((a, b) => a.localeCompare(b, 'es'))) {
  const dir = join(catalogDir, folder)
  const txt = readdirSync(dir).find((f) => f.toLowerCase().endsWith('.txt'))
  const photos = readdirSync(dir)
    .filter((f) => IMAGE_EXT.has(extname(f).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, 'es', { numeric: true }))

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
const rows = [['id', 'nombre', 'categoria', 'precio', 'stock', 'tallas', 'descripcion', 'detalles', 'imagenes']]

for (const it of items) {
  const id = slugify(it.folder)
  const images = it.photos.map((photo) => `catalogo/${it.folder}/${photo}`)

  const details = [...(it.color ? [`Color ${it.color.toLowerCase()}`] : []), ...it.extras]
  rows.push([
    id,
    it.name,
    categoryFor(it.name),
    String(it.price),
    String(DEFAULT_STOCK),
    it.sizes.join('|'),
    '',
    details.join('|'),
    images.join('|'),
  ])
}

writeFileSync(csvPath, '\uFEFF' + rows.map((r) => r.map(csvEscape).join(';')).join('\r\n') + '\r\n', 'utf8')

const totalPhotos = items.reduce((n, it) => n + it.photos.length, 0)
console.log(`✔ ${items.length} productos leídos de src/assets/catalogo (${totalPhotos} fotos)`)
console.log(`  productos.csv generado\n`)

execFileSync(process.execPath, [resolve(root, 'scripts/importar-productos.mjs')], { stdio: 'inherit' })
