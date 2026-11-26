import { useMemo, useState } from 'react'
import { Search, SearchX, Tag } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import { products, categories, hasPromo, type Product } from '../../data/products'
import { SectionHeading } from '../ui/SectionHeading'
import { ProductCard } from '../ui/ProductCard'
import { ProductModal } from '../ui/ProductModal'
import { Reveal } from '../ui/Reveal'

const ALL = 'Todos'
const PROMOS = 'Promos'
const promoCount = products.filter(hasPromo).length

export function Catalog() {
  const [activeCategory, setActiveCategory] = useState(ALL)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Product | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter((p) => {
      const matchesCategory =
        activeCategory === ALL || (activeCategory === PROMOS ? hasPromo(p) : p.category === activeCategory)
      const haystack = [p.name, p.description, ...p.details, ...p.sizes.map((s) => `talla ${s}`)].join(' ').toLowerCase()
      const matchesQuery = !q || haystack.includes(q)
      return matchesCategory && matchesQuery
    })
  }, [activeCategory, query])

  return (
    <section id="catalogo" className="relative bg-bg py-20 lg:py-28 scroll-mt-24 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[-10%] top-1/4 w-[500px] h-[500px] rounded-full bg-primary opacity-[0.04] blur-[130px]" />
        <div className="absolute right-[-5%] bottom-0 w-[400px] h-[400px] rounded-full bg-primary opacity-[0.05] blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="flex justify-center">
          <SectionHeading
            eyebrow="Catálogo"
            title="Nuestros productos"
            subtitle="Toca cualquier producto para ver sus fotos, detalles y comprarlo por WhatsApp."
            centered
          />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-12 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {[ALL, ...(promoCount > 0 ? [PROMOS] : []), ...categories].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`inline-flex items-center gap-1.5 font-sans text-sm px-5 py-2.5 rounded-full border transition-all duration-200 ${
                    activeCategory === cat
                      ? 'bg-primary text-white border-primary shadow-glow-sm'
                      : cat === PROMOS
                        ? 'bg-primary/10 border-primary-soft text-primary-bright hover:bg-primary/20'
                        : 'glass text-text-muted hover:border-primary-soft hover:text-text'
                  }`}
                >
                  {cat === PROMOS && <Tag size={13} />}
                  {cat}
                  {cat === PROMOS && (
                    <span className="font-semibold text-[11px] opacity-80">({promoCount})</span>
                  )}
                </button>
              ))}
            </div>

            <div className="relative lg:w-72">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar producto…"
                aria-label="Buscar producto"
                className="w-full glass rounded-full pl-11 pr-5 py-3 font-sans text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-primary/60 transition-colors"
              />
            </div>
          </div>
        </Reveal>

        {filtered.length > 0 ? (
          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-7">
            {filtered.map((product, i) => (
              <Reveal key={product.id} delay={Math.min(i * 0.05, 0.3)} className="h-full">
                <ProductCard product={product} onSelect={setSelected} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-16 flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-3xl glass flex items-center justify-center">
              <SearchX size={22} className="text-primary" />
            </div>
            <p className="font-heading text-xl text-text">No encontramos productos</p>
            <p className="font-sans text-sm text-text-muted max-w-sm">
              Intenta con otra palabra o cambia de categoría.
            </p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  )
}
