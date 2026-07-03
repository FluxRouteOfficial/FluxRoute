import { pgTable, uuid, varchar, text, boolean, numeric, integer, timestamp, jsonb, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users.js';

export const services = pgTable('services', {
  id: uuid('id').defaultRandom().primaryKey(),
  providerId: uuid('provider_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  serviceId: varchar('service_id', { length: 100 }).notNull().unique(),
  name: varchar('name', { length: 200 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 50 }).notNull(),
  baseUrl: text('base_url').notNull(),
  // Solana address (base58) that receives per-call payments for this service.
  providerWallet: varchar('provider_wallet', { length: 44 }).notNull(),
  priceSol: numeric('price_sol', { precision: 18, scale: 9 }).notNull(),
  priceUsdc: numeric('price_usdc', { precision: 18, scale: 6 }).notNull(),
  isActive: boolean('is_active').notNull().default(true),
  totalCalls: integer('total_calls').notNull().default(0),
  avgLatencyMs: integer('avg_latency_ms').notNull().default(0),
  successRate: numeric('success_rate', { precision: 5, scale: 2 }).notNull().default('100.00'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (t) => ({
  providerIdx: index('services_provider_idx').on(t.providerId),
  categoryIdx: index('services_category_idx').on(t.category),
  serviceIdIdx: index('services_service_id_idx').on(t.serviceId),
}));

export const serviceEndpoints = pgTable('service_endpoints', {
  id: uuid('id').defaultRandom().primaryKey(),
  serviceId: uuid('service_id').notNull().references(() => services.id, { onDelete: 'cascade' }),
  path: varchar('path', { length: 500 }).notNull(),
  method: varchar('method', { length: 10 }).notNull(),
  description: text('description'),
  paramsSchema: jsonb('params_schema'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (t) => ({
  serviceIdx: index('service_endpoints_service_idx').on(t.serviceId),
}));

export const servicesRelations = relations(services, ({ one, many }) => ({
  provider: one(users, { fields: [services.providerId], references: [users.id] }),
  endpoints: many(serviceEndpoints),
}));

export const serviceEndpointsRelations = relations(serviceEndpoints, ({ one }) => ({
  service: one(services, { fields: [serviceEndpoints.serviceId], references: [services.id] }),
}));
