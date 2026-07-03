import { pgTable, uuid, varchar, text, numeric, timestamp, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users.js';

export const managedWallets = pgTable('managed_wallets', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  walletAddress: varchar('wallet_address', { length: 44 }).notNull(),
  encryptedKey: text('encrypted_key').notNull(),
  solBalance: numeric('sol_balance', { precision: 18, scale: 9 }).notNull().default('0'),
  usdcBalance: numeric('usdc_balance', { precision: 18, scale: 6 }).notNull().default('0'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (t) => ({
  userIdx: index('managed_wallets_user_idx').on(t.userId),
}));

export const budgetConfigs = pgTable('budget_configs', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  dailyLimitSol: numeric('daily_limit_sol', { precision: 18, scale: 9 }),
  monthlyLimitSol: numeric('monthly_limit_sol', { precision: 18, scale: 9 }),
  dailyLimitUsdc: numeric('daily_limit_usdc', { precision: 18, scale: 6 }),
  monthlyLimitUsdc: numeric('monthly_limit_usdc', { precision: 18, scale: 6 }),
  hitlThresholdSol: numeric('hitl_threshold_sol', { precision: 18, scale: 9 }),
  hitlThresholdUsdc: numeric('hitl_threshold_usdc', { precision: 18, scale: 6 }),
  hitlWebhookUrl: text('hitl_webhook_url'),
  hitlEmail: varchar('hitl_email', { length: 255 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (t) => ({
  userIdx: index('budget_configs_user_idx').on(t.userId),
}));

export const managedWalletsRelations = relations(managedWallets, ({ one }) => ({
  user: one(users, { fields: [managedWallets.userId], references: [users.id] }),
}));

export const budgetConfigsRelations = relations(budgetConfigs, ({ one }) => ({
  user: one(users, { fields: [budgetConfigs.userId], references: [users.id] }),
}));
