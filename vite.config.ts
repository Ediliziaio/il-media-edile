import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // Base assoluta: con il pre-rendering le pagine vivono in sottocartelle
  // (es. /news/articolo/index.html) e gli asset devono risolversi da /assets/...
  base: '/',
  // inspectAttr inietta attributi di debug `code-path` negli elementi: utile in
  // dev, ma NON deve finire nell'HTML di produzione (bloat + esposizione sorgente).
  // Attivo solo con `vite` (dev server), escluso da `vite build`.
  plugins: [...(command === 'serve' ? [inspectAttr()] : []), react()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Split per vendor (non per rotta): le rotte devono restare nello
        // stesso albero di server e client per un'idratazione corretta.
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler|react-router)[\\/]/.test(id)) return 'react'
          return 'vendor'
        },
      },
    },
  },
}));
