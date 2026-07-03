import { pgTable, uuid, varchar, text, boolean, timestamp, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  // bcrypt hash of the account password. Null for wallet-only (BYO) accounts.
  passwordHash: varchar('password_hash', { length: 255 }),
  walletAddress: varchar('wallet_address', { length: 44 }),
  walletMode: varchar('wallet_mode', { length: 10 }).notNull().default('managed').$type<'managed' | 'byo'>(),
  displayName: varchar('display_name', { length: 100 }),
  isActive: boolean('is_active').notNull().default(true),
  isProvider: boolean('is_provider').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (t) => ({
  emailIdx: index('users_email_idx').on(t.email),
  walletIdx: index('users_wallet_idx').on(t.walletAddress),
}));

export const apiKeys = pgTable('api_keys', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  keyHash: varchar('key_hash', { length: 128 }).notNull(),
  keyPrefix: varchar('key_prefix', { length: 12 }).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  lastUsedAt: timestamp('last_used_at'),
  isActive: boolean('is_active').notNull().default(true),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (t) => ({
  userIdx: index('api_keys_user_idx').on(t.userId),
  prefixIdx: index('api_keys_prefix_idx').on(t.keyPrefix),
}));

export const usersRelations = relations(users, ({ many }) => ({
  apiKeys: many(apiKeys),
}));

export const apiKeysRelations = relations(apiKeys, ({ one }) => ({
  user: one(users, { fields: [apiKeys.userId], references: [users.id] }),
}));
