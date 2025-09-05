import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/admin/',
  server: {
    proxy: {
      '/api': {
        target: 'https://portalapp.digidine.us',
        changeOrigin: true,
        secure: true,  // Set to true for HTTPS
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})