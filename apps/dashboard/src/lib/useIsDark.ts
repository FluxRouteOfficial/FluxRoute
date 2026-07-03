'use client';

import { useEffect, useState } from 'react';

/**
 * Tracks whether the document is in dark mode by observing the `dark` class on
 * <html>. Useful for libraries (e.g. recharts) that need concrete colour values
 * rather than CSS variables.
 */
export function useIsDark(): boolean {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const el = document.documentElement;
    const update = () => setIsDark(el.classList.contains('dark'));
    update();
    const observer = new MutationObserver(update);
    observer.observe(el, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return isDark;
}
