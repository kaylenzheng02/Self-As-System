import { readFileSync } from 'node:fs'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

const FAVICON = '/src/assets/favicon.png'

function inlineFavicon() {
  return {
    name: 'inline-favicon',
    transformIndexHtml: {
      order: 'pre',
      handler: (html) =>
        html.replace(
          FAVICON,
          `data:image/png;base64,${readFileSync(`.${FAVICON}`).toString('base64')}`
        ),
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: mode === 'share' ? [react(), viteSingleFile(), inlineFavicon()] : [react()],
  build: mode === 'share' ? { outDir: 'share' } : {},
}))
