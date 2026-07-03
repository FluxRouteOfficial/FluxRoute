'use client';

import { Wallet } from 'lucide-react';
import { PageHeader, StatusPill } from '@/components/ui';

export default function WalletPage() {
  return (
    <div>
      <PageHeader title="Wallet" description="Balances, budgets, and settlement activity for authenticated accounts." />

      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-medium text-dim">Managed wallet</h2>
            <StatusPill tone="neutral">not connected</StatusPill>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-panel-2 p-4">
              <p className="mb-1 text-xs text-faint">SOL balance</p>
              <p className="font-mono text-xl font-semibold text-ink">0 SOL</p>
            </div>
            <div className="rounded-lg bg-panel-2 p-4">
              <p className="mb-1 text-xs text-faint">USDC balance</p>
              <p className="font-mono text-xl font-semibold text-ink">0 USDC</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="mb-4 text-sm font-medium text-dim">Budget controls</h2>
          <p className="text-sm text-faint">No budget configuration is loaded.</p>
        </div>
      </div>

      <div className="card flex min-h-[240px] flex-col items-center justify-center px-6 py-16 text-center">
        <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg border border-line bg-panel-2 text-faint">
          <Wallet size={22} />
        </span>
        <h2 className="text-sm font-semibold text-ink">No wallet activity</h2>
        <p className="mt-2 max-w-md text-sm text-dim">
          Wallet balances and settlement history require an authenticated account and a configured wallet backend.
        </p>
      </div>
    </div>
  );
}
