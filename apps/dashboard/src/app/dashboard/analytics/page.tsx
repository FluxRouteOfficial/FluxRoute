'use client';

import { Activity, BarChart3, Coins, Gauge, TrendingUp } from 'lucide-react';
import { PageHeader, StatCard } from '@/components/ui';

const summary = [
  { label: 'Total spend (7d)', value: '0 SOL', icon: Coins },
  { label: 'Total calls (7d)', value: '0', icon: Activity },
  { label: 'Avg latency', value: '—', icon: Gauge },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="Analytics" description="Spend, throughput, and latency across all verified calls." />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {summary.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Chart placeholder */}
        <div className="card relative flex min-h-[340px] flex-col overflow-hidden">
          <div className="border-b border-line px-5 py-4">
            <h3 className="text-sm font-semibold text-ink">Call volume (7d)</h3>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
            <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-panel-2 text-faint">
              <BarChart3 size={22} />
            </span>
            <p className="text-sm font-medium text-ink">No data to chart</p>
            <p className="mt-1 max-w-xs text-xs text-faint">
              Call volume trends appear after your first verified agent transaction.
            </p>
          </div>
        </div>

        {/* Revenue placeholder */}
        <div className="card relative flex min-h-[340px] flex-col overflow-hidden">
          <div className="border-b border-line px-5 py-4">
            <h3 className="text-sm font-semibold text-ink">Revenue (7d)</h3>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
            <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-panel-2 text-faint">
              <TrendingUp size={22} />
            </span>
            <p className="text-sm font-medium text-ink">No revenue data</p>
            <p className="mt-1 max-w-xs text-xs text-faint">
              Provider earnings and payout history are displayed here once services begin processing calls.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
