'use client';

import { useState } from 'react';
import { Activity, DollarSign, Plus, TrendingUp, X } from 'lucide-react';
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
    <div>
      <PageHeader
        title="Provider dashboard"
        description="Publish services, track earnings, and manage payouts."
        action={
          <button
            onClick={() => setShowCreate((v) => !v)}
            className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-contrast transition-colors hover:bg-brand-strong"
          >
            {showCreate ? <X size={16} /> : <Plus size={16} />}
            {showCreate ? 'Cancel' : 'Register service'}
          </button>
        }
      />

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {earningsStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {showCreate && (
        <form className="mb-8 animate-fade-in rounded-lg border border-line bg-panel p-6">
          <h2 className="mb-4 text-sm font-semibold text-ink">Register new service</h2>
          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            className="rounded-md border border-line px-4 py-2 text-sm font-medium text-dim"
          >
            API connection required
          </button>
        </form>
      )}

      <div className="card flex min-h-[260px] flex-col items-center justify-center px-6 py-16 text-center">
        <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg border border-line bg-panel-2 text-faint">
          <Activity size={22} />
        </span>
        <h2 className="text-sm font-semibold text-ink">No provider services</h2>
        <p className="mt-2 max-w-md text-sm text-dim">
          Registered services appear here after an authenticated provider creates them through the API.
        </p>
      </div>
    </div>
  );
}
