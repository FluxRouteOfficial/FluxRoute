# FluxRoute Production Audit

Audit date: 2026-07-03

## Current Architecture

- **Landing site:** Next.js app in `fluxroute-landing`, deployed on Vercel. Verified `https://fluxroute.xyz/` returned HTTP 200.
- **Dashboard:** Next.js app in `apps/dashboard`, deployed on Vercel. Verified `https://dashboard.fluxroute.xyz/dashboard` returned HTTP 200.
- **API:** Fastify app in `apps/api`, Docker-ready, requires Postgres, Redis, JWT keys, and Solana RPC. `https://api.fluxroute.xyz/api/health` does not resolve yet.
- **Database:** Drizzle/Postgres schema and migration runner in `packages/database`.
- **Cache:** Redis is used for payment status cache and rate limiting support.
- **MCP server:** Stdio MCP server in `apps/mcp-server`; calls REST API for service listing, paid call execution, and budget lookup.
- **Provider SDK:** TypeScript helpers in `packages/provider-sdk` for x402-style payment requirement responses.

## Route Map

- Landing: `/`, `/docs`, `/privacy`, `/terms`, `/api/health`, `/robots.txt`, `/sitemap.xml`.
- Dashboard: `/dashboard`, `/dashboard/services`, `/dashboard/wallet`, `/dashboard/analytics`, `/dashboard/provider`, `/dashboard/settings`.
- API: `/api/health`, `/api/auth/register`, `/api/auth/login`, `/api/auth/wallet-auth`, `/api/auth/api-keys`, `/api/auth/me`, `/api/services`, `/api/services/categories`, `/api/services/:serviceId`, `/api/services/:serviceId/endpoints`, `/api/payments/negotiate`, `/api/payments/verify`, `/api/payments/status/:callId`, `/api/payments/execute`, `/api/wallet/balance`, `/api/wallet/budget`, `/api/wallet/spend-history`.

## Verified Live State

- `https://fluxroute.xyz/`: HTTP 200.
- `https://dashboard.fluxroute.xyz/dashboard`: HTTP 200.
- `https://api.fluxroute.xyz/api/health`: DNS unresolved.
- Railway CLI token provided in chat was rejected by Railway as unauthorized in both supported token modes: `RAILWAY_TOKEN` and `RAILWAY_API_TOKEN`.
- No `.github` workflow existed before this audit.

## Broken Or Incomplete Items

- API backend is not live at the canonical API domain.
- Dashboard service registry cannot load production data until `NEXT_PUBLIC_API_URL` points to a live API and CORS allows the dashboard domain.
- Cloudflare DNS for `api.fluxroute.xyz` is missing or not propagated.
- Railway deployment cannot be completed with the currently supplied token.
- Production Solana RPC URL has not been supplied.
- Vercel-to-GitHub auto deploy previously failed because the GitHub app did not have repository access.
- Dashboard has no real logged-in session flow or route protection in the frontend shell; server-side API auth exists.
- Wallet auth accepts caller-provided nonces; production should add server-issued nonce persistence to reduce replay risk.
- Docs were minimal and did not expose an actual `/docs` route.

## Placeholder Or Risky Claims

- Dashboard cards correctly show zero/empty states, but settings forms are still local-only until API integration is connected.
- Managed wallet language exists in legal/docs; the database has managed wallet rows, but key generation/custody operations are not production-complete.
- Webhook/HITL fields exist in schema/settings, but webhook delivery is not implemented.

## Security Review

- Good: bcrypt password hashes, bcrypt API key hashes, RS256 JWT, Zod validation, Fastify rate limit, secure headers, HTTPS-only provider URLs by default, transaction signature uniqueness, payment memo binding.
- Needs work: server-issued wallet auth nonces, request IDs in logs, production error monitoring, API readiness check that includes Postgres/Redis, Railway secret rotation, Cloudflare API/DNS verification, stricter preview environment separation.
- Dependency audit is not clean. Remaining fixes require breaking upgrades across Next.js, Drizzle ORM, Fastify, Solana web3 transitive dependencies, and MCP SDK.
- Secrets are ignored by `.gitignore`; generated PEM files are not tracked.

## SEO And Domain Findings

- Canonical domain must be `https://fluxroute.xyz`.
- Previous code had fallback references to `fluxroute.io`, localhost, and placeholder domains. Production-facing defaults have been updated to `fluxroute.xyz`, `dashboard.fluxroute.xyz`, and `api.fluxroute.xyz`.
- Sitemap now includes `/docs`.
- Private dashboard routes now export noindex metadata and dashboard responses include explicit security headers.

## Priority Order

1. Deploy API to Railway with valid token, Postgres, Redis, JWT keys, and Solana RPC.
2. Add Cloudflare DNS for `api.fluxroute.xyz` and verify TLS.
3. Update Vercel dashboard env to `NEXT_PUBLIC_API_URL=https://api.fluxroute.xyz`.
4. Run migrations on Railway Postgres.
5. Smoke test API health, registry, auth, payment negotiation, dashboard registry, and CORS.
6. Add server-issued wallet login nonces and request IDs.
7. Expand dashboard authenticated UI and protected routes only after API auth/session integration is real.
