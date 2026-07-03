import { cn } from '@/lib/utils';

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden role="img">
      <rect width="32" height="32" rx="8" fill="rgb(var(--brand))" />
      <path
        d="M16 16 L24 9 M16 16 L24 23 M16 16 L8 16"
        stroke="rgb(var(--brand-contrast))"
        strokeOpacity="0.55"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="24" cy="9" r="2.1" fill="rgb(var(--brand-contrast))" />
      <circle cx="24" cy="23" r="2.1" fill="rgb(var(--brand-contrast))" />
      <circle cx="8" cy="16" r="2.1" fill="rgb(var(--brand-contrast))" />
      <circle cx="16" cy="16" r="3.4" fill="rgb(var(--brand-contrast))" />
      <circle cx="16" cy="16" r="1.5" fill="rgb(var(--brand))" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark className="h-7 w-7 shrink-0" />
      <span className="text-[1.05rem] font-semibold tracking-tight text-ink">FluxRoute</span>
    </span>
  );
}
