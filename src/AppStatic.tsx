import { Routes, Route } from 'react-router'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { CookieBanner } from '@/components/CookieBanner'
import Home from '@/pages/Home'
import ArticlePage from '@/pages/ArticlePage'
import CategoryPage from '@/pages/CategoryPage'
import ClassifichePage from '@/pages/ClassifichePage'
import TagPage from '@/pages/TagPage'
import SearchPage from '@/pages/SearchPage'
import StaticPage from '@/pages/StaticPage'
import NewsletterPage from '@/pages/NewsletterPage'

/**
 * Variante di App per il rendering server-side (pre-rendering):
 * stesse rotte di App.tsx ma con import diretti — niente React.lazy/Suspense,
 * che renderToString non saprebbe risolvere. Le rotte vanno tenute
 * allineate a quelle di App.tsx.
 */
export default function AppStatic() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col">
      <Header />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cerca" element={<SearchPage />} />
          <Route path="/classifiche" element={<ClassifichePage />} />
          <Route path="/newsletter" element={<NewsletterPage />} />
          <Route path="/tag/:tag" element={<TagPage />} />
          <Route path="/chi-siamo" element={<StaticPage page="chi-siamo" />} />
          <Route path="/contatti" element={<StaticPage page="contatti" />} />
          <Route path="/privacy" element={<StaticPage page="privacy" />} />
          <Route path="/cookie-policy" element={<StaticPage page="cookie-policy" />} />
          <Route path="/:categorySlug" element={<CategoryPage />} />
          <Route path="/:categorySlug/:slug" element={<ArticlePage />} />
        </Routes>
      </div>
      <Footer />
      <CookieBanner />
    </div>
  )
}
