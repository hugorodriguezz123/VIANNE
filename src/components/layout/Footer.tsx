import { Instagram, Facebook, HandCoins } from 'lucide-react'
import { WhatsAppIcon } from '../ui/WhatsAppIcon'
import { WHATSAPP_NUMBER, CASH_ON_DELIVERY_AREA } from '../../data/config'
import logo from '../../assets/logo-texto.png'

export function Footer() {
  return (
    <footer className="relative bg-bg-pure border-t border-white/5 rounded-t-4xl mt-8 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 -translate-x-1/2 -top-20 w-[600px] h-[200px] rounded-full bg-primary opacity-[0.05] blur-[100px]" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col gap-4">
            <img src={logo} alt="VIANNE" className="h-12 md:h-14 w-auto self-start" />
            <p className="font-sans text-sm text-text-muted leading-relaxed max-w-xs">
              Lencería íntima, bienestar y accesorios seleccionados.
              Pide por WhatsApp y recibe con entrega discreta en toda Colombia.
              Pago contraentrega en el {CASH_ON_DELIVERY_AREA}.
            </p>
            <div className="flex items-center gap-3 mt-2">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="glass rounded-full p-2.5 text-text-muted hover:text-primary hover:border-primary-soft transition-colors"
              >
                <WhatsAppIcon size={16} />
              </a>
              <a href="#" aria-label="Instagram" className="glass rounded-full p-2.5 text-text-muted hover:text-primary hover:border-primary-soft transition-colors">
                <Instagram size={16} />
              </a>
              <a href="#" aria-label="Facebook" className="glass rounded-full p-2.5 text-text-muted hover:text-primary hover:border-primary-soft transition-colors">
                <Facebook size={16} />
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-display text-xs tracking-display uppercase text-text">Tienda</h3>
            <ul className="flex flex-col gap-2.5">
              <li>
                <a href="#catalogo" className="font-sans text-sm text-text-muted hover:text-primary transition-colors">
                  Catálogo
                </a>
              </li>
              <li>
                <a href="#confianza" className="font-sans text-sm text-text-muted hover:text-primary transition-colors">
                  Nosotros
                </a>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-display text-xs tracking-display uppercase text-text">Contacto</h3>
            <ul className="flex flex-col gap-2.5">
              <li>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-sm text-text-muted hover:text-primary transition-colors inline-flex items-center gap-2"
                >
                  <WhatsAppIcon size={14} />
                  Pedidos por WhatsApp
                </a>
              </li>
              <li>
                <span className="font-sans text-sm text-text-muted inline-flex items-start gap-2">
                  <HandCoins size={14} className="text-primary mt-0.5 flex-shrink-0" />
                  Pago contraentrega en el {CASH_ON_DELIVERY_AREA}
                </span>
              </li>
              <li>
                <span className="font-sans text-sm text-text-muted">Envíos a toda Colombia 🇨🇴</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-sans text-xs text-text-muted">
            &copy; {new Date().getFullYear()} VIANNE. Todos los derechos reservados.
          </p>
          <p className="font-sans text-xs text-text-muted">
            Empaque discreto en cada pedido.
          </p>
        </div>
      </div>
    </footer>
  )
}
