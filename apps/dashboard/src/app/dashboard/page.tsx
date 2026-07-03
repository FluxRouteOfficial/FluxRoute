'use client';

import { Activity, Gauge, Layers, Wallet } from 'lucide-react';
import { PageHeader, StatCard } from '@/components/ui';

const stats = [
  { label: 'Total calls today', value: '0', icon: Activity },
  { label: 'SOL spent today', value: '0', icon: Wallet },
  { label: 'Active services', value: '0', icon: Layers },
  { label: 'Avg latency', value: '-', icon: Gauge },
];

export default function DashboardPage() {
  return (
    <div>
      <PageHeader title="Overview" description="Activity appears here after authenticated agents execute paid calls." />

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="card flex min-h-[260px] flex-col items-center justify-center px-6 py-16 text-center">
        <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg border border-line bg-panel-2 text-faint">
          <Activity size={22} />
        </span>
        <h2 className="text-sm font-semibold text-ink">No calls recorded</h2>
        <p className="mt-2 max-w-md text-sm text-dim">
          Connect the MCP server with a real FluxRoute API key and execute a verified payment call to populate this view.
        </p>
      </div>
    </div>
  );
}
