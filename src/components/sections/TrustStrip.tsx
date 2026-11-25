import { Package, ShieldCheck, Truck, HandCoins } from 'lucide-react'
import { Reveal } from '../ui/Reveal'

const badges = [
  { icon: Package, title: 'Empaque discreto', desc: 'Sin logos ni nombres por fuera. Tu privacidad primero.' },
  { icon: HandCoins, title: 'Pago contraentrega', desc: 'Pagas al recibir en Bucaramanga, Floridablanca, Girón y Piedecuesta.' },
  { icon: Truck, title: 'Envíos a toda Colombia', desc: 'Despachamos a cualquier ciudad del país.' },
  { icon: ShieldCheck, title: 'Atención personalizada', desc: 'Te asesoramos directamente por WhatsApp.' },
]

export function TrustStrip() {
  return (
    <section id="confianza" className="bg-bg scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {badges.map(({ icon: Icon, title, desc }, i) => (
            <Reveal key={title} delay={i * 0.1}>
              <li className="h-full glass rounded-3xl p-6 flex items-start gap-4 hover:border-primary-soft transition-colors duration-300">
                <div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-primary/10 border border-primary-soft flex items-center justify-center">
                  <Icon size={19} className="text-primary" />
                </div>
                <div>
                  <p className="font-sans font-semibold text-sm text-text">{title}</p>
                  <p className="font-sans text-xs text-text-muted leading-relaxed mt-1">{desc}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
