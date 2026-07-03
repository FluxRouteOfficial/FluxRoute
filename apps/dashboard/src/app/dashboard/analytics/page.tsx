'use client';

import { Activity, Coins, Gauge } from 'lucide-react';
import { PageHeader, StatCard } from '@/components/ui';

const summary = [
  { label: 'Total spend (7d)', value: '0 SOL', icon: Coins },
  { label: 'Total calls (7d)', value: '0', icon: Activity },
  { label: 'Avg latency', value: '-', icon: Gauge },
];

export default function AnalyticsPage() {
  return (
    <div>
      <PageHeader title="Analytics" description="Spend, throughput, and latency from verified calls." />

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {summary.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="card flex min-h-[360px] flex-col items-center justify-center px-6 py-16 text-center">
        <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg border border-line bg-panel-2 text-faint">
          <Gauge size={22} />
        </span>
        <h2 className="text-sm font-semibold text-ink">No analytics data yet</h2>
        <p className="mt-2 max-w-md text-sm text-dim">
          Analytics are generated from database call logs after payment verification and provider execution.
        </p>
      </div>
    </div>
  );
}
