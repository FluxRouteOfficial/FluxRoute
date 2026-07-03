export interface ProviderConfig {
  serviceId: string;
  priceSol: number;
  priceUsdc?: number;
  network?: 'mainnet-beta' | 'devnet';
  solanaRpcUrl?: string;
  walletAddress: string;
}

export interface PaymentVerification {
  verified: boolean;
  txSignature: string;
  payer: string;
  amount: number;
  currency: 'SOL' | 'USDC-SPL';
  callId: string;
}
