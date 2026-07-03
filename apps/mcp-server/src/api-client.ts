import { config } from './config.js';

export async function apiRequest(path: string, options: RequestInit = {}) {
  const res = await fetch(`${config.apiUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `ApiKey ${config.apiKey}`,
      ...options.headers,
    },
  });
  return res.json() as Promise<{ success: boolean; data?: any; error?: string }>;
}
