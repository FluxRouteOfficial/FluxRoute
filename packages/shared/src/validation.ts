import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  displayName: z.string().min(2).max(100).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const createServiceSchema = z.object({
  serviceId: z.string().regex(/^[a-z0-9-]+$/).min(3).max(50),
  name: z.string().min(2).max(100),
  description: z.string().max(500),
  category: z.enum(['image', 'text', 'data', 'compute', 'finance', 'audio', 'search', 'code']),
  baseUrl: z.string().url(),
  // Solana base58 address that receives per-call payments (32–44 chars).
  providerWallet: z.string().regex(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/, 'Invalid Solana address'),
  priceSol: z.string().regex(/^\d+(\.\d{1,9})?$/, 'Invalid SOL amount'),
  priceUsdc: z.string().regex(/^\d+(\.\d{1,6})?$/, 'Invalid USDC amount'),
});

export const updateServiceSchema = createServiceSchema
  .omit({ serviceId: true })
  .partial()
  .refine((value) => Object.keys(value).length > 0, 'At least one field is required');

export const listServicesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  category: createServiceSchema.shape.category.optional(),
  search: z.string().trim().min(1).max(100).optional(),
});

export const endpointPathSchema = z
  .string()
  .regex(/^\/[A-Za-z0-9._~!$&'()*+,;=:@/-]*$/, 'Endpoint path must be an absolute path')
  .refine((path) => !path.startsWith('//'), 'Endpoint path must not be protocol-relative');

export const createEndpointSchema = z.object({
  path: endpointPathSchema,
  method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
  description: z.string().max(500).optional(),
  paramsSchema: z.unknown().optional(),
});

export const callServiceSchema = z.object({
  serviceId: z.string(),
  endpoint: endpointPathSchema,
  params: z.record(z.unknown()).optional(),
});

const decimalAmountSchema = z.string().regex(/^\d+(\.\d{1,9})?$/, 'Invalid decimal amount');

export const budgetConfigSchema = z.object({
  dailyLimitSol: decimalAmountSchema.nullable().optional(),
  monthlyLimitSol: decimalAmountSchema.nullable().optional(),
  dailyLimitUsdc: decimalAmountSchema.nullable().optional(),
  monthlyLimitUsdc: decimalAmountSchema.nullable().optional(),
  hitlThresholdSol: decimalAmountSchema.nullable().optional(),
  hitlThresholdUsdc: decimalAmountSchema.nullable().optional(),
  hitlWebhookUrl: z.string().url().startsWith('https://').nullable().optional(),
  hitlEmail: z.string().email().nullable().optional(),
});
