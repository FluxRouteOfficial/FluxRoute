import type { LucideIcon } from 'lucide-react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Page title + optional description and trailing action slot. */
export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">{title}</h1>
        {description && <p className="mt-1.5 text-sm leading-relaxed text-dim">{description}</p>}
      </div>
      {action}
    </div>
  );
}

/** Generic surface card. */
export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('card', className)}>{children}</div>;
}

/** KPI tile with icon, value, label and a directional change pill. */
export function StatCard({
  icon: Icon,
  label,
  value,
  change,
  positive = true,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
}) {
  return (
    <div className="group card p-5 transition-all duration-200 hover:border-line-strong hover:shadow-elevate">
      <div className="mb-3 flex items-center justify-between">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-brand/10 text-brand ring-1 ring-brand/5 transition-shadow group-hover:ring-brand/20">
          <Icon size={17} />
        </span>
        {change && (
          <span
            className={cn(
              'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium',
              positive ? 'bg-brand/12 text-brand' : 'bg-danger-soft text-danger'
            )}
          >
            {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {change}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold tracking-tight text-ink">{value}</p>
      <p className="mt-1 text-sm text-faint">{label}</p>
    </div>
  );
}

type Tone = 'success' | 'neutral' | 'danger';

/** Small status pill with a leading dot. */
export function StatusPill({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  const tones: Record<Tone, string> = {
    success: 'bg-brand/12 text-brand',
    neutral: 'bg-panel-2 text-faint',
    danger: 'bg-danger-soft text-danger',
  };
  const dot: Record<Tone, string> = {
    success: 'bg-brand',
    neutral: 'bg-faint',
    danger: 'bg-danger',
  };
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize', tones[tone])}>
      <span className={cn('h-1.5 w-1.5 rounded-full', dot[tone])} />
      {children}
    </span>
  );
}
