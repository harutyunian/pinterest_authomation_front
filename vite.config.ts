import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/tools-assets': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/sitemap.xml': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/robots.txt': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/tools': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        bypass(req) {
          const url = req.url ?? '';
          if (url.startsWith('/tools/image-generator')) {
            // Skip proxy so Vite serves the React SPA route.
            return false;
          }
        },
      },
      '^/l/': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
