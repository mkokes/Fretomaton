import { useSyncExternalStore } from 'react';
import { Monitor, Moon, Sun, type LucideIcon } from 'lucide-react';
import {
  getThemePreference,
  setThemePreference,
  subscribeTheme,
  type ThemePreference,
} from '../utils/theme';

const OPTIONS: { value: ThemePreference; label: string; Icon: LucideIcon }[] = [
  { value: 'system', label: 'Match system theme', Icon: Monitor },
  { value: 'light', label: 'Light theme', Icon: Sun },
  { value: 'dark', label: 'Dark theme', Icon: Moon },
];

export function ThemeToggle() {
  const preference = useSyncExternalStore(subscribeTheme, getThemePreference);

  return (
    <fieldset className="inline-flex gap-0.5 rounded-full border border-base-300 bg-base-200 p-0.5">
      <legend className="sr-only">Color theme</legend>
      {OPTIONS.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          className={`btn btn-circle btn-sm ${preference === value ? 'btn-primary' : 'btn-ghost'}`}
          aria-label={label}
          aria-pressed={preference === value}
          title={label}
          onClick={() => setThemePreference(value)}
        >
          <Icon className="w-4 h-4" aria-hidden="true" />
        </button>
      ))}
    </fieldset>
  );
}
