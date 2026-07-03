# Deployment Guide

## Preflight

1. Provision PostgreSQL 15+ and Redis 7+.
2. Provision a Solana RPC endpoint.
3. Generate RS256 JWT keys and store them in the deployment secret manager.
4. Set all required environment variables from `.env.example`.
5. Run `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`.

## Database

```bash
npm run build -w @fluxroute/database
npm run migrate -w @fluxroute/database
```

Run migrations before starting API replicas.

## Docker Compose

```bash
docker compose up --build
```

For production, replace all default database credentials, inject secrets through
the hosting platform, and terminate TLS in front of the API and dashboard.

## Health Checks

- API: `GET /api/health`
- Landing: `GET /api/health` inside `fluxroute-landing`

## Rollback

Keep database backups before migrations. This repo currently has a single
initial migration and no automated down migrations; rollback should restore from
backup and redeploy the previous image.
