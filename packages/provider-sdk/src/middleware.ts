import { randomUUID } from 'crypto';
import { ProviderConfig } from './types.js';
import { verifyPayment } from './verify.js';

export function requirePayment(config: ProviderConfig) {
  return async (req: any, res: any, next: any) => {
    const paymentHeader = req.headers['x-payment-response'];

    if (!paymentHeader) {
      const callId = randomUUID();
      return res.status(402).json({
        accepts: [{
          protocol: 'exact',
          network: `solana-${config.network || 'mainnet-beta'}`,
          currency: 'SOL',
          amount: String(config.priceSol),
          payTo: config.walletAddress,
          memo: `call_id:${callId}`,
          expires: Math.floor(Date.now() / 1000) + 300,
        }],
      });
    }

    try {
      const payment = JSON.parse(paymentHeader);
      const callId = req.headers['x-call-id'] || '';
      const verification = await verifyPayment(config, payment.txSignature, callId);

      if (!verification.verified) {
        return res.status(402).json({ error: 'Payment verification failed' });
      }

      req.payment = verification;
      next();
    } catch {
      return res.status(400).json({ error: 'Invalid payment header' });
    }
  };
}
