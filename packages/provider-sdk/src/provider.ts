import { ProviderConfig } from './types.js';
import { requirePayment } from './middleware.js';

export class FluxRouteProvider {
  private config: ProviderConfig;

  constructor(config: ProviderConfig) {
    this.config = config;
  }

  requirePayment() {
    return requirePayment(this.config);
  }

  getPaymentRequired(callId: string) {
    return {
      status: 402,
      accepts: [{
        protocol: 'exact' as const,
        network: `solana-${this.config.network || 'mainnet-beta'}`,
        currency: 'SOL',
        amount: String(this.config.priceSol),
        payTo: this.config.walletAddress,
        memo: `call_id:${callId}`,
        expires: Math.floor(Date.now() / 1000) + 300,
      }],
    };
  }
}
