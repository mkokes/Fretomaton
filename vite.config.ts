/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Set base path for subfolder deployment
  // This will make all asset paths relative to /fretomaton/
  base: process.env.NODE_ENV === 'production' ? '/fretomaton/' : '/',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
  },
})
