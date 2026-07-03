export const config = {
  apiKey: process.env.FLUXROUTE_API_KEY || '',
  apiUrl: process.env.FLUXROUTE_API_URL || 'http://localhost:4000',
  walletMode: (process.env.FLUXROUTE_WALLET_MODE || 'managed') as 'managed' | 'byo',
};
