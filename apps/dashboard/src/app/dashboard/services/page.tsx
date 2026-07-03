'use client';

import { useEffect, useMemo, useState } from 'react';
import { PackageSearch, Search } from 'lucide-react';
import { PageHeader, StatusPill } from '@/components/ui';
import { cn } from '@/lib/utils';

const categories = ['all', 'image', 'text', 'data', 'compute', 'finance', 'audio', 'search', 'code'];
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

type RegistryService = {
  id: string;
  serviceId: string;
  name: string;
  category: string;
  priceSol: string;
  totalCalls: number;
  isActive: boolean;
};

type RegistryResponse = {
  success: boolean;
  data?: {
    services: RegistryService[];
  };
  error?: unknown;
};

export default function ServicesPage() {
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [services, setServices] = useState<RegistryService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadServices() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ limit: '100' });
        if (category !== 'all') params.set('category', category);
        if (search.trim()) params.set('search', search.trim());
        const res = await fetch(`${apiUrl}/api/services?${params.toString()}`, {
          signal: controller.signal,
        });
        const json = (await res.json()) as RegistryResponse;
        if (!res.ok || !json.success) {
          throw new Error(typeof json.error === 'string' ? json.error : 'Unable to load services');
        }
        setServices(json.data?.services ?? []);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setError((err as Error).message);
          setServices([]);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadServices();
    return () => controller.abort();
  }, [category, search]);

  const emptyTitle = useMemo(() => {
    if (loading) return 'Loading services';
    if (error) return 'Service registry unavailable';
    if (search || category !== 'all') return 'No services match your filters';
    return 'No services registered';
  }, [category, error, loading, search]);

  return (
    <div>
      <PageHeader title="Service registry" description="Browse live services returned by the FluxRoute API." />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
          <input
            type="text"
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-9"
            aria-label="Search services"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                'rounded-md px-3 py-1.5 text-xs capitalize transition-colors',
                category === cat
                  ? 'bg-brand text-brand-contrast'
                  : 'bg-panel-2 text-dim hover:text-ink'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {services.length === 0 ? (
        <div className="card relative flex flex-col items-center justify-center overflow-hidden py-20 text-center">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand/[0.02] to-transparent" />
          <div className="relative">
            <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-line bg-panel-2 shadow-sm">
              <PackageSearch size={24} className="text-faint" />
            </span>
            <p className="text-base font-semibold text-ink">{emptyTitle}</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-faint">
              {error || 'Create a provider service through the authenticated API to make it appear here.'}
            </p>
            {(search || category !== 'all') && (
              <button
                onClick={() => {
                  setSearch('');
                  setCategory('all');
                }}
                className="mt-6 inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-panel-2"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.id}
              className="card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-elevate"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="font-mono text-xs font-medium text-faint">{service.serviceId}</span>
                <StatusPill tone={service.isActive ? 'success' : 'neutral'}>
                  {service.isActive ? 'active' : 'inactive'}
                </StatusPill>
              </div>
              <h3 className="text-sm font-semibold text-ink">{service.name}</h3>
              <span className="text-xs capitalize text-faint">{service.category}</span>
              <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
                <span className="font-mono text-sm text-ink">
                  {service.priceSol} SOL<span className="text-faint">/call</span>
                </span>
                <span className="text-xs text-faint">{service.totalCalls.toLocaleString()} calls</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
