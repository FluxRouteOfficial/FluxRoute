'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Code2,
  Home,
  Layers,
  LogOut,
  Menu,
  Settings,
  Wallet,
  X,
} from 'lucide-react';
import { Logo, LogoMark } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';

const marketingUrl = process.env.NEXT_PUBLIC_MARKETING_URL || 'https://fluxroute.vercel.app';

const navSections = [
  {
    title: 'Consume',
    items: [
      { href: '/dashboard', label: 'Overview', icon: Home },
      { href: '/dashboard/services', label: 'Services', icon: Layers },
      { href: '/dashboard/wallet', label: 'Wallet', icon: Wallet },
      { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
    ],
  },
  {
    title: 'Build',
    items: [
      { href: '/dashboard/provider', label: 'Provider', icon: Code2 },
      { href: '/dashboard/settings', label: 'Settings', icon: Settings },
    ],
  },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex-1 space-y-6 overflow-y-auto p-4 scrollbar-none">
      {navSections.map((section) => (
        <div key={section.title}>
          <p className="px-3 pb-2 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-faint">
            {section.title}
          </p>
          <div className="space-y-1">
            {section.items.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                    active
                      ? 'bg-brand/10 font-medium text-brand'
                      : 'text-dim hover:bg-panel-2 hover:text-ink'
                  )}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-brand" />
                  )}
                  <item.icon size={18} strokeWidth={active ? 2 : 1.75} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

function WalletChip() {
  return (
    <div className="mx-4 mb-3 rounded-lg border border-line bg-panel-2/60 p-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-faint">Wallet</span>
        <span className="inline-flex items-center gap-1 text-xs text-faint">
          <span className="h-1.5 w-1.5 rounded-full bg-faint" />
          Not connected
        </span>
      </div>
      <p className="mt-1 font-mono text-sm font-semibold text-ink">0 SOL</p>
      <p className="font-mono text-xs text-faint">Sign in to load balances</p>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-canvas">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 flex-col border-r border-line bg-panel/60 backdrop-blur lg:flex">
        <div className="flex h-16 items-center border-b border-line px-6">
          <Link href={marketingUrl} aria-label="FluxRoute home" className="rounded-md">
            <Logo />
          </Link>
        </div>
        <NavLinks />
        <WalletChip />
        <div className="border-t border-line p-4">
          <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-faint transition-colors hover:bg-panel-2 hover:text-ink">
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-surface-950/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-72 animate-fade-in flex-col border-r border-line bg-panel">
            <div className="flex h-16 items-center justify-between border-b border-line px-6">
              <Link href={marketingUrl} aria-label="FluxRoute home" className="rounded-md" onClick={() => setMobileOpen(false)}>
                <Logo />
              </Link>
              <button onClick={() => setMobileOpen(false)} aria-label="Close" className="text-dim">
                <X size={20} />
              </button>
            </div>
            <NavLinks onNavigate={() => setMobileOpen(false)} />
            <WalletChip />
          </aside>
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-line bg-canvas/80 px-4 backdrop-blur md:px-8">
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line text-dim"
            >
              <Menu size={18} />
            </button>
            <Link href={marketingUrl} aria-label="FluxRoute home" className="rounded-md">
              <LogoMark className="h-7 w-7" />
            </Link>
          </div>
          <div className="hidden text-sm text-faint lg:block">
            Solana mainnet - <span className="text-faint">configure API auth</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand to-brand-strong" aria-hidden />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="mx-auto max-w-6xl animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
}
