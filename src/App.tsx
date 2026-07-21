import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { CookieBanner } from '@/components/CookieBanner'
import Home from '@/pages/Home'

// Code-splitting: le pagine interne si caricano solo quando servono
const ArticlePage = lazy(() => import('@/pages/ArticlePage'))
const CategoryPage = lazy(() => import('@/pages/CategoryPage'))
const ClassifichePage = lazy(() => import('@/pages/ClassifichePage'))
const TagPage = lazy(() => import('@/pages/TagPage'))
const SearchPage = lazy(() => import('@/pages/SearchPage'))
const StaticPage = lazy(() => import('@/pages/StaticPage'))
const NewsletterPage = lazy(() => import('@/pages/NewsletterPage'))

function PageFallback() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 animate-pulse" aria-busy="true">
      <div className="h-8 w-2/3 bg-neutral-200 rounded mb-4" />
      <div className="h-4 w-1/3 bg-neutral-100 rounded mb-8" />
      <div className="h-64 bg-neutral-100 rounded-xl" />
    </div>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col">
      <Header />
      <div className="flex-1">
        <Suspense fallback={<PageFallback />}>
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
        </Suspense>
      </div>
      <Footer />
      <CookieBanner />
    </div>
  )
}
