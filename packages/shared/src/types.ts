export interface ServiceInfo {
  id: string;
  serviceId: string;
  name: string;
  description: string;
  category: string;
  baseUrl: string;
  priceSol: string;
  priceUsdc: string;
  isActive: boolean;
  totalCalls: number;
}

export interface CallRequest {
  serviceId: string;
  endpoint: string;
  params: Record<string, unknown>;
}

export interface PaymentRequired {
  protocol: 'exact';
  network: 'solana-mainnet';
  currency: 'SOL' | 'USDC-SPL';
  amount: string;
  payTo: string;
  memo: string;
  expires: number;
}

export interface PaymentResponse {
  txSignature: string;
  payer: string;
  network: 'solana-mainnet';
}

export interface BudgetStatus {
  dailySpentSol: string;
  dailyLimitSol: string | null;
  monthlySpentSol: string;
  monthlyLimitSol: string | null;
  remaining: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
