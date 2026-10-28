/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

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
    plugins: [react()],
    base: normalizeBase(env.VITE_BASE_PATH),
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/tests/setup.ts'],
    },
  };
});
