# VIANNE — Catálogo de productos

Tienda en línea de productos íntimos para Colombia. Muestra el catálogo, cada producto abre un detalle con galería de fotos, precio y stock, y el botón **Comprar** lleva a WhatsApp con un mensaje listo para pedir el producto.

## Stack

- **Vite + React + TypeScript**
- **Tailwind CSS** — tokens de diseño en `tailwind.config.ts`
- **Framer Motion** — animaciones
- **lucide-react** — íconos
- **Gestor de paquetes:** npm (Node 22+)

## Comandos

```bash
npm install
npm run dev        # servidor de desarrollo en http://localhost:5173
npm run build      # build de producción → dist/
npm run preview    # previsualizar el build
npm run catalogo   # importar el catálogo desde src/assets/catalogo (fotos + details.txt)
npm run productos  # importar productos desde productos.csv
```

## ⚙️ Configuración obligatoria

El número de WhatsApp de la tienda se define en el archivo `.env` (raíz del proyecto). Si no existe, cópialo desde `.env.example`:

```bash
VITE_WHATSAPP_NUMBER=573027558300   # código de país (57) + número, sin '+'
```

Después de cambiarlo, reinicia el servidor (`pnpm dev`). En el hosting (Vercel, Netlify, etc.) agrega la misma variable `VITE_WHATSAPP_NUMBER` en su configuración, porque se inserta al compilar.

> Si la variable falta, `build` se detiene con un error a propósito, para no publicar la página con los botones de WhatsApp rotos.

## 🚀 Despliegue en Vercel

La configuración está en `vercel.json`: Vite, `npm run build`, salida en `dist/`, caché de un año para `/assets/*` (los nombres llevan hash) y cabeceras de seguridad básicas.

1. Sube el proyecto a GitHub. `.gitignore` excluye `node_modules`, `dist`, `.env`, `.claude`, `.vercel`, logs, etc.
2. En [vercel.com/new](https://vercel.com/new), importa el repositorio. Vercel lee `vercel.json` y no hay que cambiar nada en *Build & Output Settings*.
3. **Antes del primer deploy**, en *Environment Variables* agrega:

   | Nombre | Valor | Entornos |
   |---|---|---|
   | `VITE_WHATSAPP_NUMBER` | `573027558300` | Production, Preview, Development |

4. Pulsa **Deploy**. Cada `git push` a la rama principal vuelve a publicar la página.

Si cambias la variable en Vercel, haz **Redeploy**: el número se inserta al compilar.

**Gestor de paquetes:** Vercel usa el que indique el lockfile del repositorio. Hoy es `package-lock.json` (npm). Si pasas a pnpm (`pnpm install` crea `pnpm-lock.yaml`), borra `package-lock.json` para que solo quede un lockfile.

## 🗂️ Cómo actualizar el catálogo desde la carpeta (recomendado)

El catálogo vive dentro del proyecto, en `src/assets/catalogo/`. Cada producto es una subcarpeta con sus fotos y un `details.txt`:

```
Conjunto Lencería Toscana     ← primera línea: nombre
Precio: 70.000
Tallas disponibles: XS-S      ← también acepta "Solo M", "XS - S", "Talla única",
                                 o las tallas en la línea siguiente
Descuento 55.000              ← opcional: precio en PROMO (o "Descuento 20%")
Últimas unidades              ← opcional: etiqueta "¡Últimas unidades!"
Agotado                       ← opcional: sello "Agotado" y sin botón de WhatsApp (va al final)
Color negro                   ← opcional
Incluye esposas               ← cualquier otra línea aparece como detalle
```

**Promociones:** si el txt tiene una línea `Descuento`, el producto sale **primero** en el catálogo, con la etiqueta **PROMO -X%**, el precio anterior tachado y un filtro **Promos**. El mensaje de WhatsApp envía el precio promo. Para quitar la promo, borra la línea y vuelve a ejecutar el comando.

**Categorías automáticas** según el nombre: Babydolls y batas (babydoll, bata), Accesorios (arnés, esposas, collar, antifaz), Sets (set…, con liguero) y Conjuntos (el resto).

**Nombres de fotos:** el comando renombra solo las fotos a `vianne-<modelo>-<número>.jpg` (ej. `WhatsApp Image 2026-11-18 at 10.28.49 PM.jpeg` → `vianne-noir-1.jpg`), respetando el orden. Puedes agregar fotos con cualquier nombre: se numeran después de las existentes. La `-1` es la foto principal.

Las fotos repetidas dentro de una carpeta (mismo contenido con otro nombre) se omiten con un aviso. Bórralas de la carpeta.

Para agregar, editar o quitar productos, cambia la carpeta y ejecuta:

```bash
pnpm catalogo        # o: npm run catalogo
```

El comando genera `productos.csv` y lo importa. Las fotos no se copian: se quedan en `src/assets/catalogo/` y Vite las incluye al compilar, con nombres limpios en `dist/assets/img/`. La primera foto de cada carpeta, ordenada por nombre de archivo, es la principal. ⚠️ Sobrescribe `productos.csv`.

## 📦 Cómo actualizar los productos (CSV)

Los productos **no se editan en el código**: se editan en `productos.csv` (raíz del proyecto) y se importan con un comando.

1. Abre `productos.csv` en Excel, Google Sheets o un editor de texto.
2. Agrega, edita o elimina filas (precio, stock, fotos, etc.).
3. Ejecuta:

   ```bash
   npm run productos
   ```

4. Recarga la página. Listo.

El script valida los datos (precios, stock, imágenes, ids duplicados) y muestra los errores en español si algo está mal.

### Columnas del CSV

| Columna | Descripción |
|---|---|
| `id` | Identificador único (ej: `p1`, `bata-encaje`) |
| `nombre` | Nombre del producto |
| `categoria` | Categoría en español (los filtros se generan solos) |
| `precio` | Precio en COP, sin símbolo. Acepta `85000` o `85.000` |
| `precio_promo` | (Opcional) Precio con descuento. Si tiene valor, el producto sale primero con la etiqueta PROMO |
| `stock` | Unidades disponibles. `0` = se muestra como **Agotado** (no se puede comprar) |
| `tallas` | (Opcional) Tallas separadas por `\|` — ej: `S\|M\|L`. El cliente debe elegir una antes de comprar |
| `descripcion` | Texto descriptivo que aparece en el detalle |
| `detalles` | Lista separada por `\|` — ej: `Tallas S a XL\|Seda natural\|Lavado a mano` |
| `imagenes` | URLs o rutas separadas por `\|`. La primera es la foto principal |

- El separador puede ser `;` (recomendado, es el de Excel en Colombia) o `,` — se detecta solo.
- Si el producto tiene **3 o menos unidades**, se muestra la etiqueta "¡Últimas unidades!" (umbral configurable en `src/data/config.ts`).

### Fotos en el CSV

En la columna `imagenes` se aceptan tres tipos de ruta:

```
catalogo/Set Lencería Romance/foto1.jpeg   ← foto dentro de src/assets/catalogo (la que usa `catalogo`)
/otra-carpeta/foto.jpg                     ← archivo en public/
https://ejemplo.com/foto.jpg               ← URL externa
```

Recomendado: fotos verticales 600×800 (proporción 3:4).

> 💡 El botón **Comprar por WhatsApp** envía nombre, talla elegida, precio y el enlace de la foto principal en el mensaje (WhatsApp muestra la vista previa). Para que las fotos locales se vean en WhatsApp, la página debe estar publicada en internet (las URLs externas funcionan siempre).

## Estructura de la página

1. `AnnouncementBar` — barra superior (empaque discreto / envíos)
2. `Navbar` — fija, con botón de WhatsApp y menú móvil
3. `Hero` — presentación con fotos de productos destacados (tomadas del catálogo)
4. `TrustStrip` — 3 sellos de confianza
5. `Catalog` — **sección principal**: filtros por categoría, buscador, grilla de productos y modal de detalle con galería + compra por WhatsApp
6. `Footer` — contacto y enlaces

## Tokens de diseño

Colores y fuentes en `tailwind.config.ts`:

| Token | Valor |
|---|---|
| `bg` | `#0A0A0A` |
| `bg-pure` | `#000000` |
| `surface` | `#161016` |
| `primary` | `#E0119D` |
| `primary-bright` | `#FF4FC7` |
| `text` | `#F5F5F5` |
| `text-muted` | `#A1A1AA` |
| `border` | `#2A2A2A` |

## Logo

- `src/assets/logo.png`: logo original (1080×1350, fondo negro).
- `src/assets/logo-texto.png`: versión recortada al texto con fondo transparente. Es la que usa el footer, para que el logo se vea grande.

Si cambias el logo, reemplaza `logo-texto.png` por una versión recortada al texto (sin márgenes) y con fondo transparente.
