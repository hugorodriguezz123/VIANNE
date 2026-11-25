import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { WhatsAppIcon } from '../ui/WhatsAppIcon'
import { Logo } from '../ui/Logo'
import { WHATSAPP_NUMBER } from '../../data/config'

const navLinks = [
  { label: 'Catálogo', href: '#catalogo' },
  { label: 'Nosotros', href: '#confianza' },
]

const whatsAppHref = `https://wa.me/${WHATSAPP_NUMBER}`

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header className="sticky top-3 z-50 px-3 sm:px-6">
        <nav
          className={`relative max-w-5xl mx-auto h-14 flex items-center justify-between pl-5 pr-2.5 rounded-full transition-all duration-300 ${
            scrolled ? 'glass-strong shadow-card' : 'glass'
          }`}
        >
          <a href="#" aria-label="VIANNE inicio" className="flex-shrink-0">
            <Logo className="text-lg" />
          </a>

          <ul className="hidden md:flex items-center gap-1 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="font-sans text-sm text-text-muted hover:text-text hover:bg-white/5 px-4 py-2 rounded-full transition-colors tracking-wide"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href={whatsAppHref}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 font-sans font-semibold text-xs px-5 py-2.5 rounded-full bg-primary text-white shadow-glow-sm hover:bg-primary-bright hover:shadow-glow active:scale-[0.98] transition-all duration-200"
            >
              <WhatsAppIcon size={14} />
              WhatsApp
            </a>
            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Abrir menú"
              className="md:hidden text-text-muted hover:text-text hover:bg-white/5 transition-colors p-2.5 rounded-full"
            >
              <Menu size={20} />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 glass-strong border-l border-white/10 rounded-l-3xl flex flex-col p-6"
            >
              <div className="flex items-center justify-between mb-10">
                <Logo className="text-lg" />
                <button
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Cerrar menú"
                  className="text-text-muted hover:text-text hover:bg-white/5 transition-colors p-2 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
              <ul className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={() => setDrawerOpen(false)}
                      className="font-heading text-xl text-text hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <a
                  href={whatsAppHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 font-sans font-semibold text-sm px-6 py-3.5 rounded-full bg-primary text-white shadow-glow-sm hover:bg-primary-bright transition-colors"
                >
                  <WhatsAppIcon size={16} />
                  Escríbenos por WhatsApp
                </a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
