import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Static Fontsource packages register the plain family names (Inter, JetBrains Mono) that the
// mk-styleguide tokens ask for; the -variable packages would register 'Inter Variable' instead.
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
