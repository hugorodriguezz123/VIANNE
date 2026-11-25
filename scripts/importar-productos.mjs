#!/usr/bin/env node
/**
 * Importador de productos VIANNE
 *
 * Lee `productos.csv` (en la raíz del proyecto) y genera `src/data/products.json`,
 * que es el archivo que consume la página.
 *
 * Uso:
 *   npm run productos              → usa productos.csv
 *   npm run productos -- otro.csv  → usa otro archivo
 *
 * Formato del CSV (separador ; o ,):
 *   id;nombre;categoria;precio;stock;tallas;descripcion;detalles;imagenes
 *
 *   - precio:   en pesos colombianos, sin símbolo. Acepta 85000 o 85.000
 *   - stock:    número entero. 0 = agotado (se muestra pero no se puede comprar)
 *   - tallas:   (opcional) lista separada por | (ej: "S|M|L"). El cliente elige una antes de comprar
 *   - detalles: lista separada por | (ej: "Talla S a XL|Seda natural|Lavado a mano")
 *   - imagenes: URLs o rutas separadas por |. La primera es la foto principal.
 *               Fotos del catálogo: catalogo/<carpeta>/<foto> (dentro de src/assets/catalogo)
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const csvPath = resolve(root, process.argv[2] ?? 'productos.csv')
const outPath = resolve(root, 'src/data/products.json')

if (!existsSync(csvPath)) {
  console.error(`✖ No se encontró el archivo: ${csvPath}`)
  process.exit(1)
}

const raw = readFileSync(csvPath, 'utf8').replace(/^﻿/, '')

// Detecta el separador según la cabecera (Excel en Colombia suele usar ;)
const headerLine = raw.slice(0, raw.indexOf('\n'))
const delimiter = (headerLine.match(/;/g) ?? []).length >= (headerLine.match(/,/g) ?? []).length ? ';' : ','

/** Parser CSV con soporte de comillas dobles y saltos de línea dentro de campos. */
function parseCSV(text, sep) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        field += ch
      }
    } else if (ch === '"') {
      inQuotes = true
    } else if (ch === sep) {
      row.push(field)
      field = ''
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++
      row.push(field)
      field = ''
      if (row.some((f) => f.trim() !== '')) rows.push(row)
      row = []
    } else {
      field += ch
    }
  }
  row.push(field)
  if (row.some((f) => f.trim() !== '')) rows.push(row)
  return rows
}

const rows = parseCSV(raw, delimiter)
const headers = rows.shift().map((h) => h.trim().toLowerCase())

const REQUIRED = ['id', 'nombre', 'categoria', 'precio', 'stock', 'descripcion', 'detalles', 'imagenes']
const missing = REQUIRED.filter((h) => !headers.includes(h))
if (missing.length) {
  console.error(`✖ Faltan columnas en el CSV: ${missing.join(', ')}`)
  console.error(`  Cabecera esperada: ${REQUIRED.join(delimiter)}`)
  process.exit(1)
}

const col = Object.fromEntries(headers.map((h, i) => [h, i]))
const parsePrice = (s) => Number(String(s).replace(/[^\d]/g, ''))

const errors = []
const seenIds = new Set()
const products = []

rows.forEach((r, idx) => {
  const line = idx + 2 // +1 por cabecera, +1 porque las filas empiezan en 1
  const get = (name) => (r[col[name]] ?? '').trim()

  const id = get('id')
  const name = get('nombre')
  const category = get('categoria')
  const price = parsePrice(get('precio'))
  const stock = parseInt(get('stock'), 10)
  const description = get('descripcion')
  const sizes = (col.tallas === undefined ? '' : get('tallas')).split('|').map((t) => t.trim()).filter(Boolean)
  const details = get('detalles').split('|').map((d) => d.trim()).filter(Boolean)
  const images = get('imagenes').split('|').map((u) => u.trim()).filter(Boolean)

  if (!id) errors.push(`Línea ${line}: falta el id`)
  else if (seenIds.has(id)) errors.push(`Línea ${line}: id duplicado "${id}"`)
  seenIds.add(id)
  if (!name) errors.push(`Línea ${line}: falta el nombre`)
  if (!category) errors.push(`Línea ${line}: falta la categoría`)
  if (!Number.isFinite(price) || price <= 0) errors.push(`Línea ${line}: precio inválido "${get('precio')}"`)
  if (!Number.isInteger(stock) || stock < 0) errors.push(`Línea ${line}: stock inválido "${get('stock')}"`)
  if (images.length === 0) errors.push(`Línea ${line}: se necesita al menos una imagen`)

  products.push({ id, name, category, price, stock, sizes, description, details, images })
})

if (errors.length) {
  console.error('✖ Errores en el CSV — corrige y vuelve a ejecutar:\n')
  errors.forEach((e) => console.error(`  • ${e}`))
  process.exit(1)
}

writeFileSync(outPath, JSON.stringify(products, null, 2) + '\n', 'utf8')

const agotados = products.filter((p) => p.stock === 0).length
const categorias = [...new Set(products.map((p) => p.category))]
console.log(`✔ ${products.length} productos importados → src/data/products.json`)
console.log(`  Categorías: ${categorias.join(', ')}`)
if (agotados) console.log(`  Agotados: ${agotados}`)
console.log('\n  Recarga la página (o reinicia npm run dev) para ver los cambios.')
