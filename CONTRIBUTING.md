# Contributing

## Local Checks

Run these before handing off changes:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

For the standalone landing site:

```bash
cd fluxroute-landing
npm run lint
npm run build
```

## Code Standards

- Keep shared request/response validation in `packages/shared`.
- Add tests for security-sensitive validation and payment logic.
- Do not commit generated keys, `.env*`, build outputs, or local helper scripts.
- Prefer small migrations with explicit indexes/constraints.
- Avoid unsupported marketing or compliance claims in UI copy.
