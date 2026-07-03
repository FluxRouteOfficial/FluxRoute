CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255),
	"wallet_address" varchar(44),
	"wallet_mode" varchar(10) DEFAULT 'managed' NOT NULL,
	"display_name" varchar(100),
	"is_active" boolean DEFAULT true NOT NULL,
	"is_provider" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "api_keys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"key_hash" varchar(128) NOT NULL,
	"key_prefix" varchar(12) NOT NULL,
	"name" varchar(100) NOT NULL,
	"last_used_at" timestamp,
	"is_active" boolean DEFAULT true NOT NULL,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "managed_wallets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"wallet_address" varchar(44) NOT NULL,
	"encrypted_key" text NOT NULL,
	"sol_balance" numeric(18, 9) DEFAULT '0' NOT NULL,
	"usdc_balance" numeric(18, 6) DEFAULT '0' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "managed_wallets_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "budget_configs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"daily_limit_sol" numeric(18, 9),
	"monthly_limit_sol" numeric(18, 9),
	"daily_limit_usdc" numeric(18, 6),
	"monthly_limit_usdc" numeric(18, 6),
	"hitl_threshold_sol" numeric(18, 9),
	"hitl_threshold_usdc" numeric(18, 6),
	"hitl_webhook_url" text,
	"hitl_email" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "budget_configs_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider_id" uuid NOT NULL,
	"service_id" varchar(100) NOT NULL,
	"name" varchar(200) NOT NULL,
	"description" text,
	"category" varchar(50) NOT NULL,
	"base_url" text NOT NULL,
	"provider_wallet" varchar(44) NOT NULL,
	"price_sol" numeric(18, 9) NOT NULL,
	"price_usdc" numeric(18, 6) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"total_calls" integer DEFAULT 0 NOT NULL,
	"avg_latency_ms" integer DEFAULT 0 NOT NULL,
	"success_rate" numeric(5, 2) DEFAULT '100.00' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "services_service_id_unique" UNIQUE("service_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "service_endpoints" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service_id" uuid NOT NULL,
	"path" varchar(500) NOT NULL,
	"method" varchar(10) NOT NULL,
	"description" text,
	"params_schema" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "call_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"service_id" uuid NOT NULL,
	"endpoint_id" uuid,
	"call_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"amount_sol" numeric(18, 9),
	"amount_usdc" numeric(18, 6),
	"currency" varchar(4) NOT NULL,
	"tx_signature" varchar(128),
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"latency_ms" integer,
	"request_params" jsonb,
	"response_status" integer,
	"error_message" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "call_logs_call_id_unique" UNIQUE("call_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "spend_ledger" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"date" date NOT NULL,
	"total_sol" numeric(18, 9) DEFAULT '0' NOT NULL,
	"total_usdc" numeric(18, 6) DEFAULT '0' NOT NULL,
	"call_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "earnings_ledger" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider_id" uuid NOT NULL,
	"date" date NOT NULL,
	"total_sol" numeric(18, 9) DEFAULT '0' NOT NULL,
	"total_usdc" numeric(18, 6) DEFAULT '0' NOT NULL,
	"call_count" integer DEFAULT 0 NOT NULL,
	"platform_fee_sol" numeric(18, 9) DEFAULT '0' NOT NULL,
	"platform_fee_usdc" numeric(18, 6) DEFAULT '0' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "managed_wallets" ADD CONSTRAINT "managed_wallets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "budget_configs" ADD CONSTRAINT "budget_configs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "services" ADD CONSTRAINT "services_provider_id_users_id_fk" FOREIGN KEY ("provider_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "service_endpoints" ADD CONSTRAINT "service_endpoints_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "call_logs" ADD CONSTRAINT "call_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "call_logs" ADD CONSTRAINT "call_logs_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "call_logs" ADD CONSTRAINT "call_logs_endpoint_id_service_endpoints_id_fk" FOREIGN KEY ("endpoint_id") REFERENCES "service_endpoints"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "spend_ledger" ADD CONSTRAINT "spend_ledger_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "earnings_ledger" ADD CONSTRAINT "earnings_ledger_provider_id_users_id_fk" FOREIGN KEY ("provider_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users" ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_wallet_idx" ON "users" ("wallet_address");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "api_keys_user_idx" ON "api_keys" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "api_keys_prefix_idx" ON "api_keys" ("key_prefix");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "managed_wallets_user_idx" ON "managed_wallets" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "budget_configs_user_idx" ON "budget_configs" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "services_provider_idx" ON "services" ("provider_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "services_category_idx" ON "services" ("category");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "services_service_id_idx" ON "services" ("service_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "service_endpoints_service_idx" ON "service_endpoints" ("service_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "call_logs_user_idx" ON "call_logs" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "call_logs_service_idx" ON "call_logs" ("service_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "call_logs_call_id_idx" ON "call_logs" ("call_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "call_logs_tx_signature_unique_idx" ON "call_logs" ("tx_signature");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "call_logs_status_idx" ON "call_logs" ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "call_logs_created_at_idx" ON "call_logs" ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "spend_ledger_user_date_unique_idx" ON "spend_ledger" ("user_id","date");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "earnings_ledger_provider_date_unique_idx" ON "earnings_ledger" ("provider_id","date");
