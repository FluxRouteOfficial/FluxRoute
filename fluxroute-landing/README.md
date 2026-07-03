# FluxRoute Landing Page

Standalone Next.js marketing site for FluxRoute.

## Tech Stack

- Next.js 14
- Tailwind CSS
- Framer Motion
- TypeScript

## Quick Start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Project Structure

```text
src/app             Next.js App Router pages and API routes
src/app/api/health  Health check endpoint
src/components      Reusable UI components
```

## Build

```bash
npm run lint
npm run build
npm start
```

## Environment Variables

| Variable | Description | Default |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Site URL for SEO, sitemap, and Open Graph tags | `https://fluxroute.io` |
