import { Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { ProviderConfig, PaymentVerification } from './types.js';

export async function verifyPayment(
  config: ProviderConfig,
  txSignature: string,
  expectedCallId: string
): Promise<PaymentVerification> {
  const connection = new Connection(config.solanaRpcUrl || 'https://api.mainnet-beta.solana.com');
  const tx = await connection.getTransaction(txSignature, { commitment: 'confirmed', maxSupportedTransactionVersion: 0 });

  if (!tx?.meta) {
    return { verified: false, txSignature, payer: '', amount: 0, currency: 'SOL', callId: expectedCallId };
  }

  const keys = tx.transaction.message.getAccountKeys().staticAccountKeys;
  const walletIndex = keys.findIndex((k) => k.toBase58() === config.walletAddress);

  if (walletIndex === -1) {
    return { verified: false, txSignature, payer: '', amount: 0, currency: 'SOL', callId: expectedCallId };
  }

  const received = ((tx.meta.postBalances[walletIndex] || 0) - (tx.meta.preBalances[walletIndex] || 0)) / LAMPORTS_PER_SOL;
  const payer = keys[0].toBase58();

  return { verified: received >= config.priceSol, txSignature, payer, amount: received, currency: 'SOL', callId: expectedCallId };
}
