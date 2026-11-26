import { motion } from 'framer-motion'
import { Sparkles, Package, HandCoins } from 'lucide-react'
import { Button } from '../ui/Button'
import { WhatsAppIcon } from '../ui/WhatsAppIcon'
import { products } from '../../data/products'
import { WHATSAPP_NUMBER } from '../../data/config'
import { Price, PromoBadge } from '../ui/Price'

const scrollToCatalog = (e?: React.MouseEvent) => {
  e?.preventDefault()
  document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })
}

export function Hero() {
  const featured = products.filter((p) => p.stock > 0).slice(0, 2)

  return (
    <section className="relative flex items-center bg-bg overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute right-[-10%] top-1/3 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-primary opacity-[0.08] blur-[140px]" />
        <div className="absolute left-1/4 bottom-0 w-[400px] h-[300px] rounded-full bg-primary opacity-[0.05] blur-[100px]" />
        <div className="absolute left-[-5%] top-0 w-[300px] h-[300px] rounded-full bg-primary-bright opacity-[0.04] blur-[90px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex flex-col items-start gap-8"
          >
            <span className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 font-display text-[11px] tracking-display uppercase text-primary">
              <Sparkles size={12} />
              Tienda íntima · Colombia
            </span>
            <h1 className="font-heading text-6xl md:text-7xl lg:text-8xl text-text leading-[1.02] tracking-tight">
              ¡Siéntete
              <br />
              <em className="not-italic text-gradient glow-text">increíble!</em>
            </h1>
            <p className="font-sans text-lg md:text-xl text-text-muted leading-relaxed max-w-lg">
              Lencería femenina y accesorios para explorar tu sensualidad. Descubre conjuntos,
              corsets, juguetes íntimos, lubricantes y mucho más. Compra fácil por WhatsApp y
              recibe tus pedidos con empaque discreto y pago contraentrega en Bucaramanga y
              Colombia 🇨🇴
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => scrollToCatalog()}
              >
                Ver catálogo
              </Button>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 font-sans font-semibold tracking-wide text-base px-9 py-4 rounded-full glass text-text hover:border-primary/50 hover:text-primary-bright hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <WhatsAppIcon size={18} />
                Escríbenos
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
            className="relative hidden sm:flex items-center justify-center"
          >
            <div className="absolute inset-0 rounded-full bg-primary opacity-10 blur-[90px]" />
            <div className="relative flex items-center justify-center">
              {featured[1] && (
                <a
                  href="#catalogo"
                  onClick={scrollToCatalog}
                  aria-label="Ver el catálogo"
                  className="group absolute -right-8 lg:-right-12 top-12 w-48 lg:w-56 aspect-[3/4] rounded-3xl overflow-hidden border border-white/10 shadow-card rotate-6 opacity-90 hover:opacity-100 hover:rotate-3 hover:border-primary-soft transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <img
                    src={featured[1].images[0]}
                    alt={featured[1].name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </a>
              )}
              {featured[0] && (
                <a
                  href="#catalogo"
                  onClick={scrollToCatalog}
                  aria-label="Ver el catálogo"
                  className="group relative block w-64 lg:w-80 aspect-[3/4] rounded-4xl overflow-hidden border border-primary-soft shadow-glow-lg -rotate-2 hover:rotate-0 hover:-translate-y-1 transition-transform duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <img
                    src={featured[0].images[0]}
                    alt={featured[0].name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <PromoBadge product={featured[0]} className="absolute top-3 left-3" />
                  <div className="absolute bottom-3 left-3 right-3 glass-strong rounded-2xl px-4 py-3">
                    <p className="font-heading text-sm text-text leading-snug truncate">
                      {featured[0].name}
                    </p>
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <Price product={featured[0]} />
                      <span className="font-sans text-[11px] text-text-muted group-hover:text-text transition-colors">
                        Ver catálogo →
                      </span>
                    </div>
                  </div>
                </a>
              )}
              <div className="absolute -left-6 lg:-left-12 top-6 glass-strong rounded-full px-4 py-2.5 flex items-center gap-2 shadow-card">
                <Package size={14} className="text-primary" />
                <span className="font-sans text-xs font-medium text-text">Empaque discreto</span>
              </div>
              <div className="absolute -left-10 lg:-left-20 bottom-24 glass-strong rounded-full px-4 py-2.5 flex items-center gap-2 shadow-card pointer-events-none">
                <HandCoins size={14} className="text-primary" />
                <span className="font-sans text-xs font-medium text-text">Pago contraentrega · Bucaramanga</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
