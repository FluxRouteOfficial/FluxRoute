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
  ExternalLink,
} from 'lucide-react';
import { Logo, LogoMark } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AuthGate, clearToken } from '@/components/auth/AuthGate';
import { cn } from '@/lib/utils';

const marketingUrl = process.env.NEXT_PUBLIC_MARKETING_URL || 'https://fluxroute.xyz';

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
    <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4 scrollbar-none">
      {navSections.map((section) => (
        <div key={section.title}>
          <p className="px-3 pb-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.15em] text-faint">
            {section.title}
          </p>
          <div className="space-y-0.5">
            {section.items.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                    active
                      ? 'bg-brand text-white shadow-sm shadow-brand/20'
                      : 'text-faint hover:bg-panel-2 hover:text-ink'
                  )}
                >
                  <item.icon size={17} strokeWidth={active ? 2.5 : 1.75} />
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
    <div className="mx-3 mb-2 rounded-xl border border-line bg-gradient-to-b from-panel-2/80 to-panel-2/40 p-3.5">
      <div className="flex items-center justify-between">
        <span className="text-[0.625rem] font-semibold uppercase tracking-wider text-faint">Wallet</span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-faint/10 px-2 py-0.5 text-[0.625rem] font-medium text-faint">
          <span className="h-1.5 w-1.5 rounded-full bg-faint" />
          Not connected
        </span>
      </div>
      <p className="mt-2 font-mono text-lg font-bold tracking-tight text-ink">0 SOL</p>
      <p className="mt-0.5 font-mono text-[0.625rem] text-faint">Sign in to load balances</p>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  function signOut() {
    clearToken();
    window.location.href = '/login';
  }

  return (
    <AuthGate>
      <div className="flex h-screen overflow-hidden bg-canvas">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-line bg-panel/40 backdrop-blur-xl lg:flex">
        <div className="flex h-16 items-center border-b border-line px-5">
          <Link href={marketingUrl} aria-label="FluxRoute home" className="rounded-md transition-opacity hover:opacity-80">
            <Logo />
          </Link>
        </div>
        <div className="flex flex-1 flex-col overflow-hidden pt-3">
          <NavLinks />
        </div>
        <div className="space-y-2 p-3">
          <WalletChip />
          <Link
            href={marketingUrl}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-faint transition-colors hover:bg-panel-2 hover:text-ink"
          >
            <ExternalLink size={14} />
            Marketing site
          </Link>
          <button
            type="button"
            onClick={signOut}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-faint transition-colors hover:bg-panel-2 hover:text-ink"
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-surface-950/50 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-72 animate-slide-in flex-col border-r border-line bg-panel">
            <div className="flex h-16 items-center justify-between border-b border-line px-5">
              <Link href={marketingUrl} aria-label="FluxRoute home" className="rounded-md" onClick={() => setMobileOpen(false)}>
                <Logo />
              </Link>
              <button onClick={() => setMobileOpen(false)} aria-label="Close" className="rounded-md p-1.5 text-dim transition-colors hover:bg-panel-2 hover:text-ink">
                <X size={18} />
              </button>
            </div>
            <div className="flex flex-1 flex-col overflow-hidden pt-3">
              <NavLinks onNavigate={() => setMobileOpen(false)} />
            </div>
            <div className="space-y-2 p-3">
              <WalletChip />
              <button
                type="button"
                onClick={signOut}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-faint transition-colors hover:bg-panel-2 hover:text-ink"
              >
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          </aside>
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-line bg-canvas/90 px-4 backdrop-blur-xl md:px-8">
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line text-dim transition-colors hover:bg-panel-2 hover:text-ink"
            >
              <Menu size={17} />
            </button>
            <Link href={marketingUrl} aria-label="FluxRoute home" className="rounded-md">
              <LogoMark className="h-7 w-7" />
            </Link>
          </div>
          <div className="hidden items-center gap-2 text-sm text-faint lg:flex">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-2.5 py-0.5 text-[0.625rem] font-medium text-brand">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              Solana mainnet
            </span>
            <span className="text-faint">&middot;</span>
            <span className="text-faint">configure API auth</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <div className="h-8 w-8 overflow-hidden rounded-full ring-2 ring-line transition-shadow hover:ring-brand/40">
              <div className="h-full w-full bg-gradient-to-br from-brand to-brand-strong" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl animate-fade-in px-4 py-6 md:px-8 md:py-8">{children}</div>
        </main>
      </div>
      </div>
    </AuthGate>
  );
}
