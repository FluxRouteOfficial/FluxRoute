'use client';

import { useState } from 'react';
import { Key, Save, Bell, Wallet } from 'lucide-react';
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
    <div className="space-y-8">
      <PageHeader title="Settings" description="Manage your account configuration, budget limits, and notification preferences." />

      <div className="max-w-2xl space-y-6">
        {/* API Key section */}
        <div className="card">
          <div className="flex items-center gap-3 border-b border-line px-5 py-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand">
              <Key size={16} />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-ink">API Authentication</h2>
              <p className="text-xs text-faint">Generate and manage your FluxRoute API keys</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center px-5 py-10 text-center">
            <p className="text-sm font-medium text-ink">No API keys configured</p>
            <p className="mt-1 text-xs text-faint">API key management requires a connected backend.</p>
          </div>
        </div>

        {/* Budget controls */}
        <div className="card">
          <div className="flex items-center gap-3 border-b border-line px-5 py-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-500/10 text-accent-600">
              <Wallet size={16} />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-ink">Budget controls</h2>
              <p className="text-xs text-faint">Set daily and monthly spending limits</p>
            </div>
          </div>
          <div className="p-5">
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
          </div>
        </div>

        {/* Notifications */}
        <div className="card">
          <div className="flex items-center gap-3 border-b border-line px-5 py-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand">
              <Bell size={16} />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-ink">Review notifications</h2>
              <p className="text-xs text-faint">Optional alerts for high-value transactions</p>
            </div>
          </div>
          <div className="p-5 space-y-4">
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
        </div>

        <div className="flex items-center justify-between rounded-xl border border-line bg-panel-2/50 p-4">
          <div className="flex items-center gap-3">
            <Save size={16} className="text-faint" />
            <p className="text-sm text-faint">Changes are saved locally until the API backend is connected.</p>
          </div>
          <button
            type="button"
            disabled
            className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg border border-line bg-panel-2 px-4 py-2 text-sm font-medium text-faint"
          >
            API connection required
          </button>
        </div>
      </div>
    </div>
  );
}
