import { Routes, Route } from 'react-router'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { CookieBanner } from '@/components/CookieBanner'
import Home from '@/pages/Home'
import ArticlePage from '@/pages/ArticlePage'
import CategoryPage from '@/pages/CategoryPage'
import ProduttoriPage from '@/pages/ProduttoriPage'
import DatiPage from '@/pages/DatiPage'
import ClassifichePage from '@/pages/ClassifichePage'
import SearchPage from '@/pages/SearchPage'
import StaticPage from '@/pages/StaticPage'
import NewsletterPage from '@/pages/NewsletterPage'
import NotFound from '@/pages/NotFound'

/**
 * Sorgente UNICA delle rotte: usata sia dal client (main.tsx) sia dal
 * pre-rendering server (entry-server.tsx).
 *
 * Import diretti, niente React.lazy/Suspense: il client deve produrre
 * esattamente lo stesso albero del server, altrimenti l'idratazione fallisce
 * (React error #418) e l'HTML pre-renderizzato viene scartato e ri-renderizzato
 * da zero — con danno su LCP/CLS. Il code-splitting si fa per vendor
 * (vite.config.ts -> manualChunks), non per rotta.
 */
export default function App() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col">
      <Header />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cerca" element={<SearchPage />} />
          <Route path="/classifiche" element={<ClassifichePage />} />
          <Route path="/produttori" element={<ProduttoriPage />} />
          <Route path="/dati" element={<DatiPage />} />
          <Route path="/newsletter" element={<NewsletterPage />} />
          <Route path="/chi-siamo" element={<StaticPage page="chi-siamo" />} />
          <Route path="/contatti" element={<StaticPage page="contatti" />} />
          <Route path="/privacy" element={<StaticPage page="privacy" />} />
          <Route path="/cookie-policy" element={<StaticPage page="cookie-policy" />} />
          <Route path="/:categorySlug" element={<CategoryPage />} />
          <Route path="/:categorySlug/:slug" element={<ArticlePage />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
      <CookieBanner />
    </div>
  )
}
