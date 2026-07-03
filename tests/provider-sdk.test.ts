import { describe, it, expect, vi } from 'vitest';
import { FluxRouteProvider, requirePayment } from '@fluxroute/provider-sdk';

const config = {
  serviceId: 'img-resize',
  priceSol: 0.001,
  walletAddress: 'So11111111111111111111111111111111111111112',
  network: 'mainnet-beta' as const,
};

describe('FluxRouteProvider.getPaymentRequired', () => {
  it('builds a well-formed x402 payment requirement', () => {
    const provider = new FluxRouteProvider(config);
    const out = provider.getPaymentRequired('call-123');

    expect(out.status).toBe(402);
    expect(out.accepts).toHaveLength(1);
    const accept = out.accepts[0];
    expect(accept.protocol).toBe('exact');
    expect(accept.network).toBe('solana-mainnet-beta');
    expect(accept.currency).toBe('SOL');
    expect(accept.amount).toBe('0.001');
    expect(accept.payTo).toBe(config.walletAddress);
    expect(accept.memo).toBe('call_id:call-123');
    expect(accept.expires).toBeGreaterThan(Math.floor(Date.now() / 1000));
  });
});

describe('requirePayment middleware', () => {
  it('responds 402 with payment instructions when no payment header is present', async () => {
    const mw = requirePayment(config);
    const json = vi.fn();
    const status = vi.fn(() => ({ json }));
    const req: any = { headers: {} };
    const res: any = { status };
    const next = vi.fn();

    await mw(req, res, next);

    expect(status).toHaveBeenCalledWith(402);
    expect(next).not.toHaveBeenCalled();
    const body = json.mock.calls[0][0];
    expect(body.accepts[0].payTo).toBe(config.walletAddress);
    expect(body.accepts[0].amount).toBe('0.001');
  });

  it('rejects an unparseable payment header with 400', async () => {
    const mw = requirePayment(config);
    const json = vi.fn();
    const status = vi.fn(() => ({ json }));
    const req: any = { headers: { 'x-payment-response': '{not json' } };
    const res: any = { status };
    const next = vi.fn();

    await mw(req, res, next);

    expect(status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });
});
