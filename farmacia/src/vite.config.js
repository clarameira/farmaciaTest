import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/farmacia/', // <<--- isso é importante para GitHub Pages
  plugins: [react()]
})