'use client';

import { Activity, ArrowRight, Gauge, Layers, Wallet, Zap } from 'lucide-react';
import { PageHeader, StatCard } from '@/components/ui';
import { cn } from '@/lib/utils';

const stats = [
  { label: 'Total calls today', value: '0', icon: Activity },
  { label: 'SOL spent today', value: '0', icon: Wallet },
  { label: 'Active services', value: '0', icon: Layers },
  { label: 'Avg latency', value: '—', icon: Gauge },
];

const quickstartSteps = [
  {
    number: '01',
    title: 'Get your API key',
    description: 'Generate a FluxRoute API key from the settings page to authenticate your agents.',
    gradient: 'from-brand/20 to-brand/5',
  },
  {
    number: '02',
    title: 'Connect your MCP server',
    description: 'Configure your MCP server to use the FluxRoute endpoint with your API key.',
    gradient: 'from-accent-500/20 to-accent-500/5',
  },
  {
    number: '03',
    title: 'Execute a payment call',
    description: 'Run a verified payment call to see your first transaction appear in real time.',
    gradient: 'from-brand-strong/20 to-brand-strong/5',
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Overview"
        description="Monitor your agent activity, spending, and service performance across the FluxRoute network."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Empty state */}
        <div className="card relative flex flex-col items-center justify-center overflow-hidden px-6 py-14 text-center lg:col-span-3">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand/[0.03] to-transparent" />
          <div className="relative">
            <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-line bg-panel-2 shadow-sm">
              <Zap size={24} className="text-faint" />
            </span>
            <h2 className="text-base font-semibold text-ink">No calls recorded yet</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-dim">
              Activity, metrics, and logs will appear here once your agents start making authenticated calls through the FluxRoute network.
            </p>
          </div>
        </div>

        {/* Quickstart guide */}
        <div className="card divide-y divide-line overflow-hidden lg:col-span-2">
          <div className="px-5 py-4">
            <h3 className="text-sm font-semibold text-ink">Quickstart</h3>
          </div>
          {quickstartSteps.map((step, i) => (
            <div
              key={step.number}
              className={cn(
                'group relative px-5 py-4 transition-colors hover:bg-panel-2/50',
              )}
            >
              <div className="flex items-start gap-4">
                <span className="relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-xs font-bold text-brand" style={{
                  backgroundImage: `linear-gradient(to bottom right, ${step.gradient.split(' ')[0].replace('from-', '').replace('/20', '')}, ${step.gradient.split(' ')[1].replace('to-', '').replace('/5', '')})`
                }}>
                  {step.number}
                </span>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-medium text-ink">{step.title}</h4>
                  <p className="mt-0.5 text-xs leading-relaxed text-faint">{step.description}</p>
                </div>
                <ArrowRight size={14} className="mt-1.5 flex-shrink-0 text-faint opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
