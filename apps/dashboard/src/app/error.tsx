'use client';

import { RotateCw, TriangleAlert } from 'lucide-react';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-canvas px-6 text-center">
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-line bg-panel text-brand shadow-elevate">
        <TriangleAlert size={24} strokeWidth={1.75} />
      </span>
      <h1 className="text-2xl font-semibold text-ink">Something went wrong</h1>
      <p className="max-w-sm text-sm text-dim">An unexpected error occurred while loading the dashboard.</p>
      <button
        onClick={reset}
        className="mt-2 inline-flex items-center gap-2 rounded-md bg-brand px-5 py-2.5 text-sm font-medium text-brand-contrast transition-colors hover:bg-brand-strong"
      >
        <RotateCw size={16} />
        Try again
      </button>
    </div>
  );
}
