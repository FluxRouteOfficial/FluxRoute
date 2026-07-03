import Link from 'next/link';
import { LogoMark } from '@/components/Logo';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-canvas px-6 text-center">
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-line bg-panel shadow-elevate">
        <LogoMark className="h-8 w-8" />
      </span>
      <p className="font-mono text-sm uppercase tracking-[0.2em] text-brand">Error 404</p>
      <h1 className="text-2xl font-semibold text-ink">Page not found</h1>
      <p className="max-w-sm text-sm text-dim">This page isn&apos;t part of your dashboard.</p>
      <Link
        href="/dashboard"
        className="mt-2 rounded-md bg-brand px-5 py-2.5 text-sm font-medium text-brand-contrast transition-colors hover:bg-brand-strong"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
