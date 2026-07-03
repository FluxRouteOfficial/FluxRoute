'use client';

import { ArrowUpRight, History, Wallet } from 'lucide-react';
import { PageHeader, StatusPill } from '@/components/ui';

export default function WalletPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Wallet"
        description="Balances, budgets, and settlement activity."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="text-sm font-semibold text-ink">Managed wallet</h2>
            <StatusPill tone="neutral">not connected</StatusPill>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-gradient-to-br from-accent-500/10 to-accent-500/5 p-4 ring-1 ring-accent-500/10">
                <p className="mb-1 text-xs font-medium text-faint">SOL balance</p>
                <p className="font-mono text-2xl font-bold tracking-tight text-ink">0 SOL</p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-accent-500/10 to-accent-500/5 p-4 ring-1 ring-accent-500/10">
                <p className="mb-1 text-xs font-medium text-faint">USDC balance</p>
                <p className="font-mono text-2xl font-bold tracking-tight text-ink">0 USDC</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3 rounded-lg bg-panel-2 p-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <ArrowUpRight size={16} />
              </div>
              <div>
                <p className="text-xs font-medium text-ink">Deposit SOL</p>
                <p className="text-[0.625rem] text-faint">Send SOL to your managed wallet address</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="border-b border-line px-5 py-4">
            <h2 className="text-sm font-semibold text-ink">Budget controls</h2>
          </div>
          <div className="flex flex-col items-center justify-center px-5 py-10 text-center">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-panel-2 text-faint">
              <Wallet size={18} />
            </div>
            <p className="text-sm font-medium text-ink">Not configured</p>
            <p className="mt-1 text-xs text-faint">Set daily and monthly limits in Settings.</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="border-b border-line px-5 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink">Transaction history</h2>
            <span className="text-xs text-faint">Last 30 days</span>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
          <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-panel-2 text-faint">
            <History size={22} />
          </span>
          <h3 className="text-sm font-semibold text-ink">No transactions yet</h3>
          <p className="mt-1 max-w-xs text-xs text-faint">
            Settlement and payment activity will appear here after your first transaction.
          </p>
        </div>
      </div>
    </div>
  );
}
