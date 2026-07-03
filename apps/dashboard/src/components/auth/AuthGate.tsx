'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const TOKEN_KEY = 'fluxroute-auth-token';

export function getStoredToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function storeToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  window.localStorage.removeItem(TOKEN_KEY);
}

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      router.replace(`/login?next=${encodeURIComponent(pathname || '/dashboard')}`);
      return;
    }
    setAuthorized(true);
  }, [pathname, router]);

  if (!authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
        <div className="h-10 w-10 animate-pulse rounded-xl border border-line bg-panel" aria-label="Checking session" />
      </div>
    );
  }

  return <>{children}</>;
}
