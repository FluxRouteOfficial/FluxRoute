# FluxRoute

FluxRoute is a Solana-native routing layer for AI agents that need to call paid
HTTP microservices through one MCP-facing integration. The API negotiates x402
payment requirements, verifies SOL or USDC-SPL payments on-chain, proxies the
verified request to the provider, and records spend/earnings ledgers.

## Monorepo Layout

```text
apps/api              Fastify REST API for auth, registry, payments, wallet data
apps/dashboard        Next.js dashboard shell for consumers and providers
apps/mcp-server       MCP stdio server for agent integrations
packages/database     Drizzle schema, migration runner, seed script
packages/shared       Shared Zod schemas, constants, fee math, types
packages/provider-sdk Provider-side x402 helpers and middleware
fluxroute-landing     Standalone Next.js marketing site
tests                 Vitest coverage for shared logic, SDK, migrations
```

## Requirements

- Node.js 20+ and npm 10+
- PostgreSQL 15+
- Redis 7+
- Solana RPC endpoint
- RS256 JWT key pair supplied through environment variables or runtime files

## Local Setup

```bash
npm install
cd fluxroute-landing && npm install && cd ..
cp .env.example .env.local
```

Generate local JWT keys outside source control:

```bash
mkdir -p apps/api/keys
openssl genrsa -out apps/api/keys/private.pem 2048
openssl rsa -in apps/api/keys/private.pem -pubout -out apps/api/keys/public.pem
```

Start dependencies and prepare the database:

```bash
docker compose up -d postgres redis
npm run build:packages
npm run migrate -w @fluxroute/database
npm run seed -w @fluxroute/database
```

Run services:

```bash
npm run dev:api
npm run dev:dashboard
npm run dev:mcp
cd fluxroute-landing && npm run dev
```

## Required Environment

See `.env.example` for the full list. Production must set:

- `DATABASE_URL`
- `REDIS_URL`
- `JWT_PRIVATE_KEY` and `JWT_PUBLIC_KEY`, or `JWT_PRIVATE_KEY_PATH` and `JWT_PUBLIC_KEY_PATH`
- `JWT_ISSUER`
- `SOLANA_RPC_URL`
- `USDC_MINT`
- `CORS_ORIGIN`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_SITE_URL`

Optional hardening knobs:

- `PROXY_TIMEOUT_MS`
- `MAX_PROVIDER_PAYLOAD_BYTES`
- `ALLOW_INSECURE_PROVIDER_URLS=false`

## Testing And Build

```bash
npm run lint
npm run typecheck
npm test
npm run build
cd fluxroute-landing && npm run lint && npm run build
```

`npm test` builds shared packages first and then runs Vitest. The test suite
covers fee math, shared validation, provider SDK behavior, and migration safety.

## Database Migrations

Migrations live in `packages/database/migrations`. From a clean environment:

```bash
npm run build -w @fluxroute/database
npm run migrate -w @fluxroute/database
```

The initial migration creates users, API keys, managed wallets, budget configs,
services, endpoints, call logs, spend ledgers, and earnings ledgers. It enforces
unique transaction signatures and one ledger row per user/provider per day.

## Deployment

Docker Compose is provided for a single-host deployment:

```bash
JWT_PRIVATE_KEY="$(cat private.pem)" \
JWT_PUBLIC_KEY="$(cat public.pem)" \
SOLANA_RPC_URL="https://your-rpc.example" \
CORS_ORIGIN="https://dashboard.example.com" \
docker compose up --build
```

Before exposing production traffic:

- Run database migrations against the production database.
- Set non-default Postgres credentials and managed secrets.
- Use a private, quota-backed Solana RPC provider.
- Set `CORS_ORIGIN` to exact deployed frontend origins.
- Keep `ALLOW_INSECURE_PROVIDER_URLS=false`.
- Put the API behind TLS and platform-level request logging/metrics.

## Security Notes

- Passwords are stored as bcrypt hashes.
- JWTs use RS256.
- API keys are stored as bcrypt hashes and checked for active/expired state.
- Payment execution verifies on-chain recipient, amount, memo, and replay status.
- Provider proxying rejects protocol-relative endpoints and requires HTTPS unless
  explicitly disabled for local development.
- Generated PEM keys, `.env*`, logs, build artifacts, and local helper scripts
  are ignored by Git.

## Deployment On Vercel

For the public marketing site, create a Vercel project with Root Directory set
to `fluxroute-landing`.

For the dashboard, create a separate Vercel project with Root Directory set to
`apps/dashboard` and set `NEXT_PUBLIC_API_URL` to the deployed API URL.

The Fastify API requires PostgreSQL, Redis, JWT keys, and a Solana RPC endpoint.
Deploy it on a Node server/container platform, then point the dashboard and MCP
server at that API.
