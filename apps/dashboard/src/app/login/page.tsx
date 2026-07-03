'use client';

import { FormEvent, useMemo, useState } from 'react';
import { Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, KeyRound, LogIn, UserPlus } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { storeToken } from '@/components/auth/AuthGate';
import { cn } from '@/lib/utils';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.fluxroute.xyz';

type Mode = 'login' | 'register';

function LoginContent() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') || '/dashboard';
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const title = mode === 'login' ? 'Sign in to FluxRoute' : 'Create your FluxRoute account';
  const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';

  const formValid = useMemo(() => {
    return email.includes('@') && password.length >= (mode === 'register' ? 8 : 1);
  }, [email, mode, password]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formValid) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          ...(mode === 'register' && displayName.trim() ? { displayName: displayName.trim() } : {}),
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success || !json.data?.token) {
        throw new Error(typeof json.error === 'string' ? json.error : 'Authentication failed');
      }
      storeToken(json.data.token);
      router.replace(next.startsWith('/dashboard') ? next : '/dashboard');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-canvas">
      <header className="flex h-16 items-center justify-between border-b border-line px-5 md:px-8">
        <Link href="https://fluxroute.xyz" aria-label="FluxRoute home" className="rounded-md">
          <Logo />
        </Link>
        <ThemeToggle />
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 px-5 py-10 lg:grid-cols-[1fr_26rem]">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-3 py-1 text-xs font-medium text-faint">
            <KeyRound size={14} />
            Protected dashboard
          </span>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-ink md:text-5xl">
            Sign in before accessing provider, wallet, and API-key controls.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-dim">
            The dashboard is private. Public visitors can read the product site and docs, but operational pages require an authenticated FluxRoute account.
          </p>
        </div>

        <div className="rounded-lg border border-line bg-panel p-5 shadow-sm">
          <div className="mb-5 grid grid-cols-2 rounded-md bg-panel-2 p-1">
            {(['login', 'register'] as Mode[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setMode(item);
                  setError(null);
                }}
                className={cn(
                  'inline-flex h-9 items-center justify-center gap-2 rounded text-sm font-medium transition-colors',
                  mode === item ? 'bg-panel text-ink shadow-sm' : 'text-faint hover:text-ink'
                )}
              >
                {item === 'login' ? <LogIn size={15} /> : <UserPlus size={15} />}
                {item === 'login' ? 'Sign in' : 'Create'}
              </button>
            ))}
          </div>

          <h2 className="text-xl font-semibold text-ink">{title}</h2>
          <p className="mt-1 text-sm text-faint">
            {mode === 'login' ? 'Use your FluxRoute account credentials.' : 'Create an account backed by the FluxRoute API.'}
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            {mode === 'register' && (
              <div>
                <label htmlFor="display-name" className="label">Display name</label>
                <input
                  id="display-name"
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  className="input"
                  placeholder="FluxRoute Builder"
                  autoComplete="name"
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="label">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="input"
                placeholder="you@company.com"
                autoComplete="email"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="label">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="input"
                placeholder={mode === 'register' ? 'At least 8 characters' : 'Your password'}
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                required
              />
            </div>

            {error && (
              <div className="rounded-md border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!formValid || loading}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-brand px-4 text-sm font-semibold text-brand-contrast transition-colors hover:bg-brand-strong disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Connecting...' : mode === 'login' ? 'Sign in' : 'Create account'}
              <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-canvas px-4">
          <div className="h-10 w-10 animate-pulse rounded-xl border border-line bg-panel" aria-label="Loading login" />
        </main>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
