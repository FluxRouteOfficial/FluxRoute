'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/ui';

export default function SettingsPage() {
  const [budgetConfig, setBudgetConfig] = useState({
    dailyLimitSol: '5.0',
    monthlyLimitSol: '100.0',
    hitlThresholdSol: '1.0',
    hitlWebhookUrl: '',
    hitlEmail: '',
  });

  function update(key: keyof typeof budgetConfig, value: string) {
    setBudgetConfig((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div>
      <PageHeader title="Settings" description="Configure account budget fields after dashboard API persistence is connected." />

      <form
        className="max-w-2xl space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <section className="card p-6">
          <h2 className="mb-4 text-sm font-semibold text-ink">Budget controls</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="daily" className="label">Daily limit (SOL)</label>
              <input
                id="daily"
                type="text"
                inputMode="decimal"
                value={budgetConfig.dailyLimitSol}
                onChange={(e) => update('dailyLimitSol', e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label htmlFor="monthly" className="label">Monthly limit (SOL)</label>
              <input
                id="monthly"
                type="text"
                inputMode="decimal"
                value={budgetConfig.monthlyLimitSol}
                onChange={(e) => update('monthlyLimitSol', e.target.value)}
                className="input"
              />
            </div>
          </div>
        </section>

        <section className="card p-6">
          <h2 className="mb-1 text-sm font-semibold text-ink">Review metadata</h2>
          <p className="mb-4 text-sm text-dim">Optional notification fields for future review workflows.</p>
          <div className="space-y-4">
            <div>
              <label htmlFor="threshold" className="label">Review threshold (SOL)</label>
              <input
                id="threshold"
                type="text"
                inputMode="decimal"
                value={budgetConfig.hitlThresholdSol}
                onChange={(e) => update('hitlThresholdSol', e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label htmlFor="webhook" className="label">Webhook URL</label>
              <input
                id="webhook"
                type="url"
                value={budgetConfig.hitlWebhookUrl}
                onChange={(e) => update('hitlWebhookUrl', e.target.value)}
                placeholder="https://your-app.com/webhooks/FluxRoute"
                className="input"
              />
            </div>
            <div>
              <label htmlFor="email" className="label">Notification email</label>
              <input
                id="email"
                type="email"
                value={budgetConfig.hitlEmail}
                onChange={(e) => update('hitlEmail', e.target.value)}
                placeholder="you@example.com"
                className="input"
              />
            </div>
          </div>
        </section>

        <button
          type="button"
          disabled
          className="inline-flex cursor-not-allowed items-center gap-2 rounded-md border border-line bg-panel-2 px-4 py-2 text-sm font-medium text-faint"
        >
          API connection required
        </button>
      </form>
    </div>
  );
}
