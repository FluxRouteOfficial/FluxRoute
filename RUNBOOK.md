# FluxRoute Runbook

## Production URLs

- Landing: `https://fluxroute.xyz`
- Dashboard: `https://dashboard.fluxroute.xyz`
- API: `https://api.fluxroute.xyz`
- GitHub: `https://github.com/FluxRouteOfficial/FluxRoute`

## Deploy

1. Merge to `main` after CI passes.
2. Vercel deploys landing from `fluxroute-landing` and dashboard from `apps/dashboard`.
3. Railway deploys `apps/api` from the repo Dockerfile once the project is linked and secrets are configured.
4. Run database migrations after provisioning or schema changes:

```bash
npm run build:packages
npm run migrate
```

## Required Production Environment

API service:

```env
DATABASE_URL=
REDIS_URL=
API_PORT=4000
JWT_PRIVATE_KEY=
JWT_PUBLIC_KEY=
JWT_ISSUER=fluxroute.xyz
JWT_EXPIRY=1h
SOLANA_RPC_URL=
SOLANA_NETWORK=mainnet-beta
USDC_MINT=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
CORS_ORIGIN=https://fluxroute.xyz,https://www.fluxroute.xyz,https://dashboard.fluxroute.xyz
ALLOW_INSECURE_PROVIDER_URLS=false
```

Landing:

```env
NEXT_PUBLIC_SITE_URL=https://fluxroute.xyz
```

Dashboard:

```env
NEXT_PUBLIC_API_URL=https://api.fluxroute.xyz
NEXT_PUBLIC_MARKETING_URL=https://fluxroute.xyz
```

## DNS

- `fluxroute.xyz` points to the landing Vercel project.
- `www.fluxroute.xyz` redirects to `fluxroute.xyz`.
- `dashboard.fluxroute.xyz` points to the dashboard Vercel project.
- `api.fluxroute.xyz` must point to the Railway API service.

## Rollback

- Vercel: promote the last known-good deployment from the Vercel project dashboard.
- Railway: redeploy the previous successful deployment or roll back to the last known-good commit.
- Database: migrations are forward-only. Restore from a managed Postgres backup if a destructive migration reaches production.

## Health Checks

- Landing: `GET https://fluxroute.xyz/api/health`
- Dashboard: `GET https://dashboard.fluxroute.xyz/dashboard`
- API: `GET https://api.fluxroute.xyz/api/health`

## Incident Response

- If API is down, check Railway deploy logs, health endpoint, Postgres connectivity, Redis connectivity, and required env vars.
- If dashboard registry fails, check `NEXT_PUBLIC_API_URL`, browser CORS errors, and API `/api/services`.
- If payment verification fails, check Solana RPC status, transaction confirmation, recipient wallet, amount, token mint, and memo/call id.
- If an API key is compromised, call the authenticated revoke endpoint or deactivate the row in `api_keys`.

## Secret Rotation

- Rotate the Railway token shared in chat immediately after deployment.
- Rotate JWT keys by generating a new RS256 pair, updating Railway env vars, redeploying, and forcing users to reauthenticate.
- Rotate Solana RPC keys from the provider dashboard and update `SOLANA_RPC_URL`.
