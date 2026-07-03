FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/database/package.json packages/database/
COPY packages/shared/package.json packages/shared/
COPY packages/provider-sdk/package.json packages/provider-sdk/
COPY apps/api/package.json apps/api/
COPY apps/dashboard/package.json apps/dashboard/
COPY apps/mcp-server/package.json apps/mcp-server/

RUN npm ci

COPY packages/ packages/
COPY apps/api/ apps/api/
COPY tsconfig.json ./

RUN npm run build -w @fluxroute/shared && npm run build -w @fluxroute/database && npm run build -w @fluxroute/api

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 FluxRoute

COPY --from=builder /app/ ./

USER FluxRoute
EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s CMD wget -qO- http://localhost:4000/api/health || exit 1
CMD ["node", "apps/api/dist/index.js"]
