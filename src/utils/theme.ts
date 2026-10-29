// Theme preference: follow the OS ("system") or force light/dark via <html data-theme>.
// An inline script in index.html applies the stored choice before first paint;
// keep its storage key, attribute and colors in sync with this file.

export type ThemePreference = 'system' | 'light' | 'dark';

export const THEME_STORAGE_KEY = 'fretomaton-theme';
export const THEME_COLORS = { light: '#FFFFFF', dark: '#242424' } as const;

const listeners = new Set<() => void>();

export function getThemePreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    // Storage can be unavailable (private mode, blocked site data).
  }
  return 'system';
}

function applyPreference(preference: ThemePreference) {
  const root = document.documentElement;
  if (preference === 'system') {
    delete root.dataset.theme;
  } else {
    root.dataset.theme = preference;
  }
  // Browser chrome color: the media-specific tags handle "system"; a forced theme overrides both.
  document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((meta) => {
    const scheme = meta.media.includes('dark') ? 'dark' : 'light';
    meta.content = THEME_COLORS[preference === 'system' ? scheme : preference];
  });
}

export function setThemePreference(preference: ThemePreference) {
  try {
    if (preference === 'system') {
      localStorage.removeItem(THEME_STORAGE_KEY);
    } else {
      localStorage.setItem(THEME_STORAGE_KEY, preference);
    }
  } catch {
    // Still apply for this page view.
  }
  applyPreference(preference);
  listeners.forEach((listener) => listener());
}

export function subscribeTheme(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
