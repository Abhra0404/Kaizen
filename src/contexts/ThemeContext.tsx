import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { ThemeOption } from '@/constants';

interface ThemeContextValue {
  /** The user's chosen theme preference: Light | Dark | System */
  theme: ThemeOption;
  /** Whether dark mode is currently active (resolved from theme + system pref) */
  isDark: boolean;
  /** Update the theme preference */
  setTheme: (theme: ThemeOption) => void;
  /** Convenience toggle between Light and Dark (ignores System) */
  toggleDark: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function resolveTheme(): ThemeOption {
  if (typeof window === 'undefined') return 'Light';
  const stored = localStorage.getItem('theme');
  if (stored === 'dark') return 'Dark';
  if (stored === 'light') return 'Light';
  return 'Light';
}

function applyDark(isDark: boolean) {
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

function resolveIsDark(theme: ThemeOption): boolean {
  if (theme === 'Dark') return true;
  if (theme === 'Light') return false;
  // System
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeOption>(resolveTheme);
  const [isDark, setIsDark] = useState(() => resolveIsDark(theme));

  const setTheme = useCallback((next: ThemeOption) => {
    setThemeState(next);
    const dark = resolveIsDark(next);
    setIsDark(dark);
    applyDark(dark);

    if (next === 'Dark') localStorage.setItem('theme', 'dark');
    else if (next === 'Light') localStorage.setItem('theme', 'light');
    else localStorage.setItem('theme', 'system');
  }, []);

  const toggleDark = useCallback(() => {
    setTheme(isDark ? 'Light' : 'Dark');
  }, [isDark, setTheme]);

  // Apply on mount
  useEffect(() => {
    applyDark(isDark);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Listen for OS preference changes when in System mode
  useEffect(() => {
    if (theme !== 'System') return;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      setIsDark(e.matches);
      applyDark(e.matches);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  const value = useMemo(
    () => ({ theme, isDark, setTheme, toggleDark }),
    [theme, isDark, setTheme, toggleDark],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
