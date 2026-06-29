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
      '/': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        bypass(req) {
          const pathname = req.url?.split('?')[0] ?? '';
          if (pathname === '/') {
            return null;
          }
          return '/index.html';
        },
      },
      '/tools': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        bypass(req) {
          const url = req.url ?? '';
          if (url.startsWith('/tools/image-generator')) {
            return '/index.html';
          }
        },
      },
      '/l': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
