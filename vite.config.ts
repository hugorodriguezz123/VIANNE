import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const IMAGE_RE = /\.(jpe?g|png|webp|gif|svg)$/i

// "WhatsApp Image 2026-11-18 at 10.28.49 PM (3).jpeg" → "whatsapp-image-2026-11-18-at-10-28-49-pm-3"
const slugify = (s: string) =>
  s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export default defineConfig(({ command, mode }) => {
  // Al compilar (local o en Vercel) el número de WhatsApp es obligatorio:
  // sin él, todos los botones de compra quedarían rotos.
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  if (command === 'build' && !env.VITE_WHATSAPP_NUMBER?.replace(/\D/g, '')) {
    throw new Error(
      'Falta la variable VITE_WHATSAPP_NUMBER. Agrégala en el archivo .env (local) ' +
        'o en Vercel → Settings → Environment Variables (ej: 573027558300).',
    )
  }

  return {
    plugins: [react()],
    build: {
      // Las fotos del catálogo nunca se incrustan en el JS: el mensaje de WhatsApp necesita su URL.
      assetsInlineLimit: (file: string) => (file.includes('/assets/catalogo/') ? false : undefined),
      rollupOptions: {
        output: {
          // Nombres de imagen limpios (sin espacios ni paréntesis) en dist/assets/img
          assetFileNames: (info) => {
            const name = info.name ?? 'asset'
            if (!IMAGE_RE.test(name)) return 'assets/[name]-[hash][extname]'
            const base = name.replace(/^.*[\\/]/, '').replace(IMAGE_RE, '')
            return `assets/img/${slugify(base) || 'img'}-[hash][extname]`
          },
        },
      },
    },
  }
})
