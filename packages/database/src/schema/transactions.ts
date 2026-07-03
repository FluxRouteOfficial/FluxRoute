import { pgTable, uuid, varchar, text, numeric, integer, timestamp, jsonb, date, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users.js';
import { services, serviceEndpoints } from './services.js';

export const callLogs = pgTable('call_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  // Null for BYO / unauthenticated negotiate; set for managed-mode calls.
  userId: uuid('user_id').references(() => users.id),
  serviceId: uuid('service_id').notNull().references(() => services.id),
  endpointId: uuid('endpoint_id').references(() => serviceEndpoints.id),
  callId: uuid('call_id').notNull().unique().defaultRandom(),
  amountSol: numeric('amount_sol', { precision: 18, scale: 9 }),
  amountUsdc: numeric('amount_usdc', { precision: 18, scale: 6 }),
  currency: varchar('currency', { length: 4 }).notNull().$type<'sol' | 'usdc'>(),
  txSignature: varchar('tx_signature', { length: 128 }),
  status: varchar('status', { length: 20 }).notNull().default('pending').$type<'pending' | 'paid' | 'fulfilled' | 'failed'>(),
  latencyMs: integer('latency_ms'),
  requestParams: jsonb('request_params'),
  responseStatus: integer('response_status'),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (t) => ({
  userIdx: index('call_logs_user_idx').on(t.userId),
  serviceIdx: index('call_logs_service_idx').on(t.serviceId),
  callIdIdx: index('call_logs_call_id_idx').on(t.callId),
  txSignatureIdx: uniqueIndex('call_logs_tx_signature_unique_idx').on(t.txSignature),
  statusIdx: index('call_logs_status_idx').on(t.status),
  createdAtIdx: index('call_logs_created_at_idx').on(t.createdAt),
}));

export const spendLedger = pgTable('spend_ledger', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  date: date('date').notNull(),
  totalSol: numeric('total_sol', { precision: 18, scale: 9 }).notNull().default('0'),
  totalUsdc: numeric('total_usdc', { precision: 18, scale: 6 }).notNull().default('0'),
  callCount: integer('call_count').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (t) => ({
  userDateIdx: uniqueIndex('spend_ledger_user_date_unique_idx').on(t.userId, t.date),
}));

export const earningsLedger = pgTable('earnings_ledger', {
  id: uuid('id').defaultRandom().primaryKey(),
  providerId: uuid('provider_id').notNull().references(() => users.id),
  date: date('date').notNull(),
  totalSol: numeric('total_sol', { precision: 18, scale: 9 }).notNull().default('0'),
  totalUsdc: numeric('total_usdc', { precision: 18, scale: 6 }).notNull().default('0'),
  callCount: integer('call_count').notNull().default(0),
  platformFeeSol: numeric('platform_fee_sol', { precision: 18, scale: 9 }).notNull().default('0'),
  platformFeeUsdc: numeric('platform_fee_usdc', { precision: 18, scale: 6 }).notNull().default('0'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (t) => ({
  providerDateIdx: uniqueIndex('earnings_ledger_provider_date_unique_idx').on(t.providerId, t.date),
}));

export const callLogsRelations = relations(callLogs, ({ one }) => ({
  user: one(users, { fields: [callLogs.userId], references: [users.id] }),
  service: one(services, { fields: [callLogs.serviceId], references: [services.id] }),
  endpoint: one(serviceEndpoints, { fields: [callLogs.endpointId], references: [serviceEndpoints.id] }),
}));

export const spendLedgerRelations = relations(spendLedger, ({ one }) => ({
  user: one(users, { fields: [spendLedger.userId], references: [users.id] }),
}));

export const earningsLedgerRelations = relations(earningsLedger, ({ one }) => ({
  provider: one(users, { fields: [earningsLedger.providerId], references: [users.id] }),
}));
