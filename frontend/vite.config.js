import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Proxy /api to serverless functions (requires vercel dev or express)
      // Option 1: Use Vercel CLI for local serverless testing
      //   '/api': 'http://localhost:3000', // vercel dev runs on 3000
      // Option 2: Use Express server (legacy)
      '/api': 'http://localhost:3001',
    },
  },
})

