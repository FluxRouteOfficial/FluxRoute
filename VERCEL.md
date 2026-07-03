# Vercel Deployment

FluxRoute has two Next.js apps. Deploy them as separate Vercel projects.

## Public Site

Use these Vercel settings:

- Root Directory: `fluxroute-landing`
- Build Command: `npm run build`
- Output: Next.js default

Environment variables:

- `NEXT_PUBLIC_SITE_URL`

## Dashboard

Use these Vercel settings:

- Root Directory: `apps/dashboard`
- Build Command: `npm run build`
- Output: Next.js default

Environment variables:

- `NEXT_PUBLIC_API_URL`

## API

The API is a Fastify service and is not a Vercel static frontend deployment.
Deploy it on a Node/container host with PostgreSQL, Redis, JWT keys, and Solana
RPC configured from `.env.example`.
