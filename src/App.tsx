import { AnnouncementBar } from './components/layout/AnnouncementBar'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { Hero } from './components/sections/Hero'
import { TrustStrip } from './components/sections/TrustStrip'
import { Catalog } from './components/sections/Catalog'

export default function App() {
  return (
    <div className="min-h-screen bg-bg">
      <AnnouncementBar />
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <Catalog />
      </main>
      <Footer />
    </div>
  )
}
