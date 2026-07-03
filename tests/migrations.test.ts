import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const migrationsFolder = resolve(here, '../packages/database/migrations');

interface Journal {
  version: string;
  dialect: string;
  entries: { idx: number; tag: string; breakpoints: boolean }[];
}

const journal = JSON.parse(
  readFileSync(resolve(migrationsFolder, 'meta/_journal.json'), 'utf-8')
) as Journal;

describe('migration journal', () => {
  it('declares exactly one initial migration', () => {
    expect(journal.entries).toHaveLength(1);
    expect(journal.entries[0].tag).toBe('0000_init_schema');
  });

  it('points at an existing, readable SQL file', () => {
    const sql = readFileSync(resolve(migrationsFolder, `${journal.entries[0].tag}.sql`), 'utf-8');
    expect(sql.length).toBeGreaterThan(100);
  });
});

describe('initial migration SQL', () => {
  const sql = readFileSync(resolve(migrationsFolder, '0000_init_schema.sql'), 'utf-8');
  // The runtime migrator splits on this exact marker.
  const statements = sql.split('--> statement-breakpoint').map((s) => s.trim()).filter(Boolean);

  it('splits into many discrete statements', () => {
    expect(statements.length).toBeGreaterThan(10);
  });

  it('creates every core table', () => {
    for (const table of [
      'users',
      'api_keys',
      'managed_wallets',
      'budget_configs',
      'services',
      'service_endpoints',
      'call_logs',
      'spend_ledger',
      'earnings_ledger',
    ]) {
      expect(sql).toContain(`"${table}"`);
    }
  });

  it('includes the hardened columns (password_hash, provider_wallet)', () => {
    expect(sql).toContain('"password_hash"');
    expect(sql).toContain('"provider_wallet"');
  });

  it('enforces replay and daily-ledger uniqueness in the database', () => {
    expect(sql).toContain('"call_logs_tx_signature_unique_idx"');
    expect(sql).toContain('"spend_ledger_user_date_unique_idx"');
    expect(sql).toContain('"earnings_ledger_provider_date_unique_idx"');
  });

  it('makes call_logs.user_id nullable (no NOT NULL on that column)', () => {
    const callLogsBlock = sql.slice(sql.indexOf('"call_logs"'));
    expect(callLogsBlock).toMatch(/"user_id"\s+uuid,/);
  });
});
