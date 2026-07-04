import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Permet d'accéder au site via un tunnel (ngrok, cloudflared...) : Vite
    // refuse par défaut les Host headers inconnus.
    allowedHosts: true,
    // Le front et l'API sont ainsi servis sur la même origine : un seul
    // tunnel à exposer, pas de CORS à gérer côté démo.
    proxy: {
      '/api': {
        target: 'http://localhost:8001',
        changeOrigin: true,
      },
    },
  },
})
