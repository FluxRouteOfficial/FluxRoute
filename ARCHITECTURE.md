# Architecture

## System Shape

FluxRoute is organized as an npm workspaces monorepo plus a standalone landing
site. The production path is:

```text
AI agent -> MCP server -> Fastify API -> PostgreSQL / Redis / Solana RPC
                                      -> provider HTTP service
```

## Core Services

- `apps/api`: Owns authentication, service registry, payment negotiation,
  payment verification, provider proxying, and wallet/budget reads.
- `apps/mcp-server`: Exposes FluxRoute operations as MCP tools and talks to the
  API with `FLUXROUTE_API_KEY`.
- `apps/dashboard`: Next.js UI shell for registry, wallet, provider, settings,
  and analytics workflows.
- `packages/database`: Drizzle schema and migration runner.
- `packages/shared`: Zod contracts and fee math used by API, tests, and SDK.
- `packages/provider-sdk`: Provider-side middleware for x402 payment responses.

## Payment Flow

1. Caller requests `POST /api/payments/negotiate` with a service ID.
2. API creates a pending call log and returns HTTP 402-compatible payment data.
3. Caller submits a Solana transaction with the returned call ID as memo.
4. Caller requests `POST /api/payments/execute` with `callId` and signature.
5. API verifies recipient, amount, memo, transaction success, and replay status.
6. API proxies a bounded JSON payload to the registered provider URL.
7. On success, API records spend, earnings, provider net, and platform fee.

## Data Model

Main tables:

- `users`
- `api_keys`
- `managed_wallets`
- `budget_configs`
- `services`
- `service_endpoints`
- `call_logs`
- `spend_ledger`
- `earnings_ledger`

Important constraints:

- Unique service IDs and call IDs.
- Unique transaction signatures for replay protection.
- Unique daily spend ledger rows per user.
- Unique daily earnings ledger rows per provider.

## Trust Boundaries

- Browser clients are controlled by `CORS_ORIGIN`.
- Provider URLs are untrusted; execution validates endpoint paths and enforces
  same-origin URL construction.
- Solana RPC is an external dependency and must be production-grade.
- MCP clients authenticate with API keys.
- Dashboard auth is not yet production complete.
