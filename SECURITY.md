# Security Notes

## Secrets

Do not commit `.env`, `.env.local`, PEM files, API keys, wallet private keys, or
provider credentials. The API accepts JWT keys as inline PEM environment
variables or runtime file paths.

## API Hardening

- Configure `CORS_ORIGIN` with exact frontend origins.
- Keep `ALLOW_INSECURE_PROVIDER_URLS=false` outside local development.
- Use a private Solana RPC endpoint with rate limits and alerting.
- Put the API behind TLS and platform-level DDoS protection.
- Rotate API keys and JWT keys on a documented schedule.

## Payment Safety

Payment execution verifies transaction success, recipient, amount, memo, and
signature replay before proxying provider requests. Database uniqueness protects
against race-condition replay of transaction signatures.

## Remaining Work

The dashboard needs production auth protection and the managed-wallet path needs
real encryption, key custody procedures, withdrawals, and reconciliation before
handling user funds.
