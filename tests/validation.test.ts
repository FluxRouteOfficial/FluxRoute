import { describe, it, expect } from 'vitest';
import {
  budgetConfigSchema,
  callServiceSchema,
  createEndpointSchema,
  createServiceSchema,
  listServicesQuerySchema,
  registerSchema,
  updateServiceSchema,
} from '@fluxroute/shared';

describe('registerSchema', () => {
  it('accepts a valid registration', () => {
    const r = registerSchema.safeParse({ email: 'dev@fluxroute.io', password: 'supersecret' });
    expect(r.success).toBe(true);
  });

  it('rejects a short password', () => {
    const r = registerSchema.safeParse({ email: 'dev@fluxroute.io', password: 'short' });
    expect(r.success).toBe(false);
  });

  it('rejects an invalid email', () => {
    const r = registerSchema.safeParse({ email: 'not-an-email', password: 'supersecret' });
    expect(r.success).toBe(false);
  });
});

describe('createServiceSchema', () => {
  const base = {
    serviceId: 'img-resize',
    name: 'Image Resizer',
    description: 'Resize images on the fly',
    category: 'image',
    baseUrl: 'https://api.imgtools.io',
    providerWallet: 'So11111111111111111111111111111111111111112',
    priceSol: '0.001',
    priceUsdc: '0.05',
  };

  it('accepts a valid service', () => {
    expect(createServiceSchema.safeParse(base).success).toBe(true);
  });

  it('rejects a non-base58 provider wallet', () => {
    const r = createServiceSchema.safeParse({ ...base, providerWallet: '0xabc0OIl' });
    expect(r.success).toBe(false);
  });

  it('rejects an unknown category', () => {
    const r = createServiceSchema.safeParse({ ...base, category: 'Image' });
    expect(r.success).toBe(false);
  });

  it('rejects a malformed SOL price', () => {
    const r = createServiceSchema.safeParse({ ...base, priceSol: '1.2.3' });
    expect(r.success).toBe(false);
  });

  it('rejects an invalid base URL', () => {
    const r = createServiceSchema.safeParse({ ...base, baseUrl: 'not a url' });
    expect(r.success).toBe(false);
  });
});

describe('budgetConfigSchema', () => {
  it('accepts nullable limits', () => {
    const r = budgetConfigSchema.safeParse({ dailyLimitSol: null, monthlyLimitSol: '10' });
    expect(r.success).toBe(true);
  });

  it('rejects invalid or non-HTTPS webhook URLs', () => {
    const r = budgetConfigSchema.safeParse({ hitlWebhookUrl: 'ftp://bad' });
    const bad = budgetConfigSchema.safeParse({ hitlWebhookUrl: 'not-a-url' });
    expect(bad.success).toBe(false);
    expect(r.success).toBe(false);
  });
});

describe('registry and endpoint validation', () => {
  it('bounds service listing pagination', () => {
    expect(listServicesQuerySchema.safeParse({ page: '1', limit: '100' }).success).toBe(true);
    expect(listServicesQuerySchema.safeParse({ page: '0', limit: '20' }).success).toBe(false);
    expect(listServicesQuerySchema.safeParse({ page: '1', limit: '101' }).success).toBe(false);
  });

  it('rejects endpoint URLs that could escape the provider origin', () => {
    expect(callServiceSchema.safeParse({ serviceId: 'svc', endpoint: '/v1/run' }).success).toBe(true);
    expect(callServiceSchema.safeParse({ serviceId: 'svc', endpoint: 'https://evil.example' }).success).toBe(false);
    expect(createEndpointSchema.safeParse({ path: '//evil.example/path', method: 'POST' }).success).toBe(false);
  });

  it('requires at least one service update field', () => {
    expect(updateServiceSchema.safeParse({ name: 'Updated Service' }).success).toBe(true);
    expect(updateServiceSchema.safeParse({}).success).toBe(false);
  });
});
