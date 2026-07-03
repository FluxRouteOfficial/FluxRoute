'use client';

import { useState } from 'react';
import { Activity, DollarSign, Plus, TrendingUp, X, Package } from 'lucide-react';
import { PageHeader, StatCard } from '@/components/ui';

const earningsStats = [
  { label: 'Total earned (SOL)', value: '0', icon: DollarSign },
  { label: 'Total calls served', value: '0', icon: Activity },
  { label: 'Avg revenue/day', value: '0 SOL', icon: TrendingUp },
];

const categories = ['image', 'text', 'data', 'compute', 'finance', 'audio', 'search', 'code'];

export default function ProviderPage() {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Provider dashboard"
        description="Publish services, track earnings, and manage payouts."
        action={
          <button
            onClick={() => setShowCreate((v) => !v)}
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white shadow-sm shadow-brand/20 transition-all hover:bg-brand-strong hover:shadow-md hover:shadow-brand/30 active:scale-[0.98]"
          >
            {showCreate ? <X size={16} /> : <Plus size={16} />}
            {showCreate ? 'Cancel' : 'Register service'}
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {earningsStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {showCreate && (
        <div className="animate-fade-in rounded-xl border border-line bg-panel shadow-elevate">
          <div className="border-b border-line px-5 py-4">
            <h2 className="text-sm font-semibold text-ink">Register new service</h2>
          </div>
          <form className="p-5">
            <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="service-id">Service ID</label>
                <input id="service-id" type="text" placeholder="my-service-name" className="input" />
              </div>
              <div>
                <label className="label" htmlFor="display-name">Display name</label>
                <input id="display-name" type="text" placeholder="My Service" className="input" />
              </div>
              <div>
                <label className="label" htmlFor="base-url">Base URL</label>
                <input id="base-url" type="url" placeholder="https://api.example.com" className="input" />
              </div>
              <div>
                <label className="label" htmlFor="category">Category</label>
                <select id="category" className="input capitalize">
                  {categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label" htmlFor="price-sol">Price (SOL/call)</label>
                <input id="price-sol" type="text" inputMode="decimal" placeholder="0.001" className="input" />
              </div>
              <div>
                <label className="label" htmlFor="provider-wallet">Provider wallet</label>
                <input id="provider-wallet" type="text" placeholder="Solana address" className="input" />
              </div>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-line bg-panel-2 px-4 py-2 text-sm font-medium text-faint transition-colors hover:bg-panel-2 hover:text-ink"
            >
              API connection required
            </button>
          </form>
        </div>
      )}

      <div className="card relative flex flex-col items-center justify-center overflow-hidden px-6 py-16 text-center">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand/[0.02] to-transparent" />
        <div className="relative">
          <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-line bg-panel-2 shadow-sm">
            <Package size={24} className="text-faint" />
          </span>
          <h2 className="text-base font-semibold text-ink">No provider services</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-dim">
            Publish your first service by registering it through the API, or use the form above to get started.
          </p>
        </div>
      </div>
    </div>
  );
}
