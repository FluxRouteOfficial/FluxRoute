'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'fluxroute-theme';

export function ThemeToggle({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    document.documentElement.style.colorScheme = next ? 'dark' : 'light';
    try {
      localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light');
    } catch {
      /* storage unavailable */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={mounted ? `Switch to ${isDark ? 'light' : 'dark'} mode` : 'Toggle theme'}
      className={cn(
        'relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-line text-dim transition-colors hover:border-line-strong hover:text-ink',
        className
      )}
    >
      <Sun
        size={16}
        className={cn('absolute transition-all duration-300', mounted && isDark ? 'scale-100 opacity-100' : 'scale-0 opacity-0')}
      />
      <Moon
        size={16}
        className={cn('absolute transition-all duration-300', mounted && !isDark ? 'scale-100 opacity-100' : 'scale-0 opacity-0')}
      />
    </button>
  );
}
