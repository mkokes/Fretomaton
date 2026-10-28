/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

// Ensure the base path has leading and trailing slashes ('/fretomaton' -> '/fretomaton/')
const normalizeBase = (base: string | undefined) => {
  const trimmed = (base ?? '').trim().replace(/^\/+|\/+$/g, '');
  return trimmed ? `/${trimmed}/` : '/';
};

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // VITE_BASE_PATH comes from the environment (CI) or .env (rsync deploys)
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon-180x180.png'],
        manifest: {
          name: 'Fretomaton - Fretboard Template Builder',
          short_name: 'Fretomaton',
          description:
            'Printable 1:1 fretboard templates and bridge compensation for guitars, basses, and ukuleles',
          theme_color: '#242424',
          background_color: '#242424',
          display: 'standalone',
          icons: [
            { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
            { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
            { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
            {
              src: 'maskable-icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
      }),
    ],
    base: normalizeBase(env.VITE_BASE_PATH),
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/tests/setup.ts'],
    },
  };
});
