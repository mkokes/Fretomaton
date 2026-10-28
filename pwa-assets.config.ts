import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config';

// The source icon has a dark #1e2023 backdrop, so pad with the same color
const background = '#1e2023';

export default defineConfig({
  preset: {
    ...minimal2023Preset,
    maskable: { ...minimal2023Preset.maskable, padding: 0.1, resizeOptions: { background } },
    apple: { ...minimal2023Preset.apple, resizeOptions: { background } },
  },
  images: ['public/fretomaton.png'],
});
