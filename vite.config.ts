import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function inlineCriticalCss(): Plugin {
  return {
    name: 'inline-critical-css',
    enforce: 'post',
    generateBundle(_, bundle) {
      const html = bundle['index.html']
      if (!html || html.type !== 'asset' || typeof html.source !== 'string') return

      const cssEntry = Object.values(bundle).find((entry) => entry.type === 'asset' && entry.fileName.endsWith('.css'))
      if (!cssEntry || cssEntry.type !== 'asset') return

      const css = typeof cssEntry.source === 'string' ? cssEntry.source : new TextDecoder().decode(cssEntry.source)
      html.source = html.source.replace(/<link rel="stylesheet" crossorigin href="\/[^"]+\.css">/, `<style>${css}</style>`)
      delete bundle[cssEntry.fileName]
    },
  }
}

export default defineConfig({ plugins: [react(), tailwindcss(), inlineCriticalCss()] })
