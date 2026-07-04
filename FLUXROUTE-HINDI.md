# फ्लक्सरूट (FluxRoute) — पूरा परिचय

> **एक लाइन में:** FluxRoute एक Solana ब्लॉकचेन पर बना पेमेंट राउटिंग लेयर है जो AI agents को — MCP (Model Context Protocol) के ज़रिए — किसी भी paid HTTP microservice को call करने देता है। Agent पहले SOL या USDC से pay करता है, फिर service का response पाता है।

---

## 1. यह प्रोजेक्ट क्या करता है?

कल्पना करो कि तुम्हारे पास एक AI agent है (जैसे Claude, Cline, या कोई और LLM-based agent) और वह agent किसी third-party service का इस्तेमाल करना चाहता है — जैसे:

- किसी image को resize करना
- किसी text को summarize करना
- किसी video को transcode करना
- कोई data enrichment API call करना

**Problem:** Agent के पास आमतौर पर कोई payment method नहीं होता। वह न तो क्रेडिट कार्ड रखता है, न ही किसी API का billing account.

**Solution (FluxRoute):** Agent को एक MCP server मिलता है। वह MCP server FluxRoute API से बात करता है। API agent को बताती है — "इस service की price इतनी SOL/USDC है, इसे pay करो।" Agent एक Solana ट्रांज़ैक्शन भेजता है। API उसे on-chain verify करती है, और फिर provider service को request proxy करके response agent को दे देती है।

**यह पूरा system x402 नामक protocol पर आधारित है** — जो HTTP 402 (Payment Required) status code का उपयोग करके payment नेगोशिएट करता है।

---

## 2. मुख्य हिस्से (Architecture)

पूरा प्रोजेक्ट एक **npm workspaces monorepo** है — यानी सब कुछ एक ही रिपॉज़िटरी में है, लेकिन अलग-अलग पैकेजों में बँटा है:

```
fluxroute-landing/      → मार्केटिंग और डॉक्यूमेंटेशन वेबसाइट (Next.js)
apps/
  api/                  → Fastify REST API — सबसे अहम हिस्सा
  dashboard/            → यूज़र के लिए वेब डैशबोर्ड (Next.js)
  mcp-server/           → MCP stdio server — AI agents इससे जुड़ते हैं
packages/
  database/             → Drizzle ORM schema, migrations, seed data
  shared/               → Zod schemas, fee math, constants — सब पैकेज शेयर करते हैं
  provider-sdk/         → Provider (service वालों) के लिए x402 helpers
tests/                  → सारे tests (Vitest)
```

### Production Architecture Flow

```
AI Agent (Claude/Cline)
       │
       ▼  (stdio MCP)
FluxRoute MCP Server
       │
       ▼  (HTTPS + API Key)
FluxRoute API (Fastify)
       │
       ├──► PostgreSQL (users, services, ledgers)
       ├──► Redis (payment cache, rate limiting)
       ├──► Solana RPC (transaction verification)
       └──► Provider HTTP Service (actual work करने वाली API)
```

---

## 3. पेमेंट फ्लो — कैसे काम करता है? (x402 Protocol)

यह पूरे system का सबसे महत्वपूर्ण हिस्सा है। इसे **तीन फेज़** में समझो:

### Phase 1: Negotiate (भाव-ताव)

1. Agent कहता है: "मुझे service X call करनी है"
2. FluxRoute API database में service ढूँढती है, उसकी price निकालती है
3. API एक unique `callId` बनाती है और HTTP 402 के साथ यह जवाब देती है:

```json
{
  "protocol": "exact",
  "network": "solana-mainnet",
  "currency": "SOL",
  "amount": "0.001",
  "payTo": "ProviderKaSolanaAddress...",
  "memo": "call_abc123...",
  "expires": 1719876543210
}
```

इसका मतलब: "इतने SOL भेजो इस address पर, memo में यह callId लिखो, और 5 मिनट के अंदर।"

### Phase 2: Pay (भुगतान)

4. Agent (या उसकी तरफ से कोई wallet) एक Solana transaction बनाता है:
   - `amount` SOL/USDC भेजता है `payTo` address पर
   - `memo` field में `callId` डालता है
   - Transaction sign करके Solana network पर submit करता है

### Phase 3: Execute (सेवा लेना)

5. Agent API को बताता है: "मैंने pay कर दिया — यह रहा `txSignature` और `callId`"
6. API यह चेक करती है:
   - क्या transaction真的 confirmed है? (Solana RPC से fetch करके)
   - क्या सही amount भेजा गया?
   - क्या सही address पर भेजा?
   - क्या memo में callId है?
   - क्या यह transaction पहले इस्तेमाल नहीं हुआ? (replay protection)
7. सब सही होने पर API provider की real service पर request proxy करती है
8. Provider का response agent को लौटा दिया जाता है
9. API ledger में रिकॉर्ड करती है: consumer का spend, provider की earnings, और platform fee

### Important: पैसा कहाँ जाता है?

- **Consumer** (AI agent वाला) → सीधे **Provider** के Solana wallet को pay करता है
- **FluxRoute** कभी funds अपने पास नहीं रखता (non-custodial)
- **Platform fee (2%)** provider की earnings से cut होती है — consumer को extra charge नहीं

---

## 4. API Endpoints — पूरी लिस्ट

### Health
| Method | Path | क्या करता है |
|--------|------|-------------|
| GET | `/api/health` | Server चालू है या नहीं |

### Auth
| Method | Path | क्या करता है |
|--------|------|-------------|
| POST | `/api/auth/register` | नया account बनाएँ (email + password) |
| POST | `/api/auth/login` | Login करें, JWT token पाएँ |
| POST | `/api/auth/wallet-auth` | Solana wallet से sign करके login करें |
| POST | `/api/auth/api-keys` | नया API key बनाएँ (`fr_live_...`) |
| GET | `/api/auth/api-keys` | अपने सारे API keys देखें |
| DELETE | `/api/auth/api-keys/:id` | API key delete करें |
| GET | `/api/auth/me` | अपना profile देखें |

### Services (Registry)
| Method | Path | क्या करता है |
|--------|------|-------------|
| GET | `/api/services` | सारी services देखें (paginated, filterable) |
| GET | `/api/services/categories` | Categories with counts |
| GET | `/api/services/:serviceId` | एक service के details + endpoints |
| POST | `/api/services` | New service register करें (provider बनें) |
| PUT | `/api/services/:serviceId` | Service update करें |
| DELETE | `/api/services/:serviceId` | Service delete करें |
| POST | `/api/services/:serviceId/endpoints` | Service में endpoint जोड़ें |

### Payments (मुख्य फ्लो)
| Method | Path | क्या करता है |
|--------|------|-------------|
| POST | `/api/payments/negotiate` | **Phase 1:** Price पूछें → HTTP 402 + payment details |
| POST | `/api/payments/verify` | **Phase 2a:** Transaction verify करें |
| GET | `/api/payments/status/:callId` | Payment status check करें |
| POST | `/api/payments/execute` | **Phase 2b:** Verify करें + proxy करें + ledger में रिकॉर्ड करें |

### Wallet / Budget
| Method | Path | क्या करता है |
|--------|------|-------------|
| GET | `/api/wallet/balance` | Managed wallet balance देखें |
| GET | `/api/wallet/budget` | Budget config + आज का spend देखें |
| PUT | `/api/wallet/budget` | Daily/monthly limits set करें |
| GET | `/api/wallet/spend-history` | Spend history देखें |

---

## 5. MCP Server — AI Agents के लिए

MCP server एक **stdio server** है जो AI agents (Claude Desktop, Cline, आदि) को FluxRoute से जोड़ता है। यह **तीन tools** expose करता है:

### 1. `FLUXROUTE_list_services`
सारी available services दिखाता है — category और search से filter कर सकते हो।

### 2. `FLUXROUTE_call`
दो-फेज़ वाला call:
- बिना `tx_signature` भेजोगे → negotiate करेगा, payment details लौटाएगा
- `call_id` + `tx_signature` दोगे → verify करेगा, provider को call करेगा, result लौटाएगा

### 3. `FLUXROUTE_budget`
अपना current budget/spending status check करेगा।

### Setup for Claude Desktop / Cline

```json
{
  "mcpServers": {
    "FluxRoute": {
      "command": "npx",
      "args": ["-y", "@fluxroute/mcp"],
      "env": {
        "FLUXROUTE_API_KEY": "fr_live_tumhari_key_yahan",
        "FLUXROUTE_API_URL": "https://api.fluxroute.xyz"
      }
    }
  }
}
```

---

## 6. Database — 9 Tables (पूरी संरचना)

| Table | Key Columns | क्या store करता है |
|-------|-------------|-------------------|
| `users` | id, email, passwordHash, walletAddress, isProvider | Users और providers के accounts |
| `api_keys` | id, userId, keyHash, keyPrefix, isActive | API keys (bcrypt से hashed) |
| `managed_wallets` | id, userId, walletAddress, encryptedKey, solBalance | Managed wallets (हमारे द्वारा manage किए गए) |
| `budget_configs` | id, userId, dailyLimitSol, monthlyLimitSol, hitlThresholdSol | Spending limits और HITL thresholds |
| `services` | id, providerId, serviceId, name, priceSol, priceUsdc, baseUrl, isActive | Registered services |
| `service_endpoints` | id, serviceId, path, method, description, paramsSchema | Service के endpoints |
| `call_logs` | id, userId, callId, amountSol, amountUsdc, txSignature, status | हर call का log (pending → paid → fulfilled/failed) |
| `spend_ledger` | id, userId, date, totalSol, totalUsdc, callCount | Daily spend per user |
| `earnings_ledger` | id, providerId, date, totalSol, totalUsdc, platformFeeSol, callCount | Daily earnings per provider |

**Key Constraints:**
- `txSignature` unique — एक transaction दो बार use नहीं हो सकता
- `callId` unique — हर call का अपना unique ID
- `(userId, date)` unique spend ledger — एक user का एक दिन का एक ही ledger row
- `(providerId, date)` unique earnings ledger — एक provider का एक दिन का एक ही ledger row

---

## 7. Provider SDK — Service Providers के लिए

Provider SDK एक npm package है (`@fluxroute/provider-sdk`) जो service providers को यह आसानी देता है कि वे FluxRoute के साथ integrate हो सकें।

### Express Middleware Example

```ts
import { requirePayment } from '@fluxroute/provider-sdk';

const app = express();
app.post('/api/resize', requirePayment({
  serviceId: 'img-resize',
  priceSol: '0.001',
  walletAddress: 'provider_wallet_address...',
}), (req, res) => {
  // यहाँ तक पहुँचने से पहले payment verify हो चुकी है
  res.json({ success: true, result: '...' });
});
```

यह middleware:
1. अगर `x-payment-response` header नहीं है → HTTP 402 लौटाता है (payment required)
2. अगर header है → payment verify करता है → फिर आगे बढ़ने देता है

Provider SDK खुद Solana transaction fetch करके verify करता है कि सही amount उसके wallet पर आया है।

---

## 8. Fee Model

| Item | Value |
|------|-------|
| Platform Fee | **2%** (provider की earnings से cut) |
| Consumer pays | Provider की listed price (कोई extra नहीं) |
| Provider gets | Listed price − 2% platform fee |
| SOL precision | 9 decimal places |
| USDC precision | 6 decimal places |

**Example:** अगर एक service की price 0.001 SOL है:
- Consumer pays: **0.001 SOL**
- Platform fee (2%): **0.00002 SOL**
- Provider gets: **0.00098 SOL**

---

## 9. Local Development Setup

### Requirements
- Node.js 20+, npm 10+
- PostgreSQL 15+
- Redis 7+
- Solana RPC endpoint (production के लिए)
- RS256 JWT key pair

### Steps

```bash
# 1. Repo clone करो और dependencies install करो
git clone https://github.com/FluxRouteOfficial/FluxRoute.git
cd FluxRoute
npm install
cd fluxroute-landing && npm install && cd ..

# 2. Environment variables set करो
cp .env.example .env.local

# 3. JWT keys generate करो (source control के बाहर)
mkdir -p apps/api/keys
openssl genrsa -out apps/api/keys/private.pem 2048
openssl rsa -in apps/api/keys/private.pem -pubout -out apps/api/keys/public.pem

# 4. Database और Redis start करो
docker compose up -d postgres redis

# 5. Packages build करो
npm run build:packages

# 6. Migrations चलाओ और seed data डालो
npm run migrate
npm run seed

# 7. Services start करो (अलग-अलग terminals में)
npm run dev:api       # API on port 4000
npm run dev:dashboard # Dashboard on port 3000
npm run dev:mcp       # MCP server on stdio
cd fluxroute-landing && npm run dev  # Landing site
```

---

## 10. Environment Variables — Explained

### API (सबसे important)

| Variable | Required? | क्या है? |
|----------|-----------|----------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `REDIS_URL` | ✅ | Redis connection string |
| `JWT_PRIVATE_KEY` / `JWT_PRIVATE_KEY_PATH` | ✅ | RS256 private key (JWT sign करने के लिए) |
| `JWT_PUBLIC_KEY` / `JWT_PUBLIC_KEY_PATH` | ✅ | RS256 public key (JWT verify करने के लिए) |
| `SOLANA_RPC_URL` | ✅ | Solana RPC endpoint (Helius, QuickNode, etc.) |
| `USDC_MINT` | ✅ | USDC-SPL token mint address |
| `CORS_ORIGIN` | ✅ | Allowed origins (comma-separated) |
| `API_PORT` | ❌ (default 4000) | Server port |
| `PROXY_TIMEOUT_MS` | ❌ (default 15000) | Provider proxy timeout |
| `ALLOW_INSECURE_PROVIDER_URLS` | ❌ (default false) | Local dev में HTTP allow करने के लिए |

### Frontends

| Variable | कहाँ? | क्या है? |
|----------|-------|----------|
| `NEXT_PUBLIC_API_URL` | Dashboard | API का URL |
| `NEXT_PUBLIC_SITE_URL` | Landing | Site URL (SEO के लिए) |

### MCP Server

| Variable | क्या है? |
|----------|----------|
| `FLUXROUTE_API_KEY` | API se minted key |
| `FLUXROUTE_API_URL` | API base URL |
| `FLUXROUTE_WALLET_MODE` | `managed` या `byo` |

---

## 11. Security — कैसे सुरक्षित है?

| Feature | Description |
|---------|-------------|
| **Passwords** | bcrypt (cost 12) — slow hash, brute-force resistant |
| **API Keys** | bcrypt hashed + `fr_live_` prefix से lookup |
| **JWTs** | RS256 signed (asymmetric — private key से sign, public से verify) |
| **CORS** | Exact origin matching — sirf allowed domains से requests accept |
| **Provider URLs** | HTTPS mandatory (default) — man-in-the-middle से बचाव |
| **Payment Verification** | On-chain transaction fetch + amount/recipient/memo/replay चेक |
| **Replay Protection** | `tx_signature` unique constraint — एक transaction दो बार use नहीं |
| **Idempotency** | Fulfilled call को दोबारा execute नहीं कर सकते |
| **Rate Limiting** | 100 req/min per client |
| **Security Headers** | HSTS, X-Content-Type-Options, X-Frame-Options, etc. |

---

## 12. कौन-कौन इसका इस्तेमाल कर सकता है?

1. **AI Agents / LLMs** — Claude, Cline, और कोई भी MCP-compatible agent जिसे paid services call करनी हैं
2. **Developers** — जो अपनी API को "AI-accessible" बनाना चाहते हैं (providers)
3. **Enterprises** — जो अपने internal microservices को AI agents के लिए expose करना चाहते हैं, साथ ही payment/billing track रखना चाहते हैं

---

## 13. Deployment (Production)

### Next.js Apps (Landing + Dashboard)
- **Vercel** पर deploy करो
- Landing root: `fluxroute-landing/`
- Dashboard root: `apps/dashboard/`

### API (Fastify)
- **Railway** ya koi bhi Node/Docker host
- Requirements: managed Postgres, managed Redis, Solana RPC, JWT keys, TLS

Production deploy से पहले जाँचो:
- [ ] Database migrations चल गए
- [ ] Non-default secrets set हैं
- [ ] Quota-backed Solana RPC provider use कर रहे हो
- [ ] `ALLOW_INSECURE_PROVIDER_URLS=false`
- [ ] Health check pass कर रहा है: `GET /api/health`

---

## 14. Testing

```bash
# Lint
npm run lint

# TypeScript type checking
npm run typecheck

# Tests (Vitest)
npm test

# Build all
npm run build
```

Tests cover:
- **Fee math** — SOL/USDC rounding, 2% calculation, edge cases
- **Validation** — All Zod schemas (registration, services, budget, etc.)
- **Provider SDK** — Payment required format, middleware behavior
- **Migrations** — Table creation, constraints, uniqueness

---

## 15. Quick Summary (एक नज़र में)

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│  AI Agent   │────►│ FluxRoute    │────►│  Provider    │
│  (Claude)   │     │  MCP + API   │     │  Service     │
│             │     │              │     │              │
│  1. कॉल करे │     │  2. 402 भेजे │     │  6. काम करे │
│  3. SOL pay │     │  4. Verify   │     │              │
│  7. Result  │◄────│  5. Proxy    │◄────│              │
│    पाए      │     │  8. Ledger   │     │              │
└─────────────┘     └──────────────┘     └──────────────┘
                         │
                    ┌────┴────┐
                    │ Solana  │
                    │  Chain  │
                    └─────────┘
```

**तीन शब्दों में:** Agent → Pay (SOL/USDC) → Use Service.

No credit card. No API billing setup. Sirf Solana wallet और एक मिनट का time।
