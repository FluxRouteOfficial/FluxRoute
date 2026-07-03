"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Clipboard, Search } from "lucide-react";
import { cn } from "@/lib/utils";

type Section = {
  id: string;
  title: string;
  group: string;
  summary: string;
  body: string[];
  code?: string;
  related?: string[];
};

const sections: Section[] = [
  {
    id: "introduction",
    group: "Getting Started",
    title: "Introduction",
    summary: "FluxRoute is a Solana-native MCP routing layer for paid AI microservices.",
    body: [
      "Agents connect through one MCP-facing integration, discover registered provider services, negotiate a per-call payment, and execute the provider request after on-chain verification.",
      "The current implementation includes a Fastify API, service registry, x402-style payment negotiation, SOL and USDC-SPL verification, provider proxying, ledgers, a dashboard shell, an MCP stdio server, and provider SDK helpers.",
    ],
    related: ["quickstart", "architecture"],
  },
  {
    id: "quickstart",
    group: "Getting Started",
    title: "Quickstart",
    summary: "Run the monorepo locally with Postgres, Redis, JWT keys, and the API.",
    body: [
      "Install root workspaces, start Postgres and Redis, build packages, run migrations, then start the API, dashboard, MCP server, and landing app as separate processes.",
      "Production requires a deployed API URL. Until api.fluxroute.xyz is live, dashboard registry calls will show an API-unavailable empty state.",
    ],
    code: `npm install
cd fluxroute-landing && npm install && cd ..
docker compose up -d postgres redis
npm run build:packages
npm run migrate
npm run dev:api`,
    related: ["authentication", "mcp-setup"],
  },
  {
    id: "authentication",
    group: "Getting Started",
    title: "Authentication and API keys",
    summary: "JWT auth protects account routes; generated API keys are shown once and stored hashed.",
    body: [
      "Email/password registration and login issue RS256 JWTs. API keys are created under authenticated accounts, stored as bcrypt hashes, and revoked through a soft deactivate path.",
      "Wallet authentication verifies a signed nonce message. Nonces are caller-supplied today, so production should add server-issued nonce storage before treating wallet login as hardened.",
    ],
    code: `POST /api/auth/register
POST /api/auth/login
POST /api/auth/api-keys
GET  /api/auth/api-keys
DELETE /api/auth/api-keys/:id`,
    related: ["security", "api-reference"],
  },
  {
    id: "mcp-setup",
    group: "Getting Started",
    title: "MCP setup",
    summary: "The MCP stdio server exposes service listing, paid calls, and budget lookup tools.",
    body: [
      "Configure an MCP client to launch the FluxRoute MCP server with a FluxRoute API key and API URL. The server calls the REST API for discovery, payment negotiation, execution, and budget checks.",
    ],
    code: `{
  "mcpServers": {
    "FluxRoute": {
      "command": "node",
      "args": ["apps/mcp-server/dist/index.js"],
      "env": {
        "FLUXROUTE_API_URL": "https://api.fluxroute.xyz",
        "FLUXROUTE_API_KEY": "fr_live_..."
      }
    }
  }
}`,
    related: ["payment-flow", "api-reference"],
  },
  {
    id: "architecture",
    group: "Core Concepts",
    title: "Architecture",
    summary: "Vercel serves the public apps; Railway should serve the API, Postgres, and Redis.",
    body: [
      "The landing and dashboard are separate Next.js apps. The API is a Fastify service with Drizzle/Postgres persistence and Redis payment-status caching.",
      "Canonical production domains are fluxroute.xyz, dashboard.fluxroute.xyz, and api.fluxroute.xyz. Vercel preview URLs are deployment surfaces, not public product URLs.",
    ],
    related: ["service-registry", "security"],
  },
  {
    id: "service-registry",
    group: "Core Concepts",
    title: "Service registry",
    summary: "Providers register HTTPS services with category, pricing, wallet, and endpoint metadata.",
    body: [
      "Public registry reads list active services and categories. Provider writes require authentication and provider access. Ownership checks guard service updates, deletes, and endpoint creation.",
      "Dashboard registry cards are live API results only. If the API is offline or empty, the dashboard shows an empty/error state rather than fabricated data.",
    ],
    code: `GET    /api/services
GET    /api/services/categories
GET    /api/services/:serviceId
POST   /api/services
PUT    /api/services/:serviceId
DELETE /api/services/:serviceId`,
    related: ["payment-flow", "api-reference"],
  },
  {
    id: "payment-flow",
    group: "Core Concepts",
    title: "SOL and USDC-SPL payment flow",
    summary: "Payment negotiation creates a call id; verification binds the transaction memo to that call.",
    body: [
      "Negotiation returns a 402 response payload with protocol, network, currency, amount, provider wallet, memo/call id, and expiry. Verification checks transaction success, recipient, amount, token mint for USDC, and memo reference.",
      "Execution prevents transaction replay, re-verifies the payment, proxies to the provider HTTPS origin, and records spend/earnings ledgers only after successful provider fulfillment.",
    ],
    code: `POST /api/payments/negotiate
POST /api/payments/verify
GET  /api/payments/status/:callId
POST /api/payments/execute`,
    related: ["security", "provider-sdk"],
  },
  {
    id: "provider-sdk",
    group: "SDK and API",
    title: "Provider SDK",
    summary: "Provider helpers generate payment requirements and Express-style middleware responses.",
    body: [
      "The SDK helps provider apps return x402-style payment instructions. It does not custody funds or replace on-chain verification by the FluxRoute API.",
    ],
    code: `import { FluxRouteProvider } from "@fluxroute/provider-sdk";

const provider = new FluxRouteProvider({
  serviceId: "image-resizer",
  priceSol: 0.001,
  walletAddress: "So11111111111111111111111111111111111111112",
  network: "mainnet-beta"
});`,
    related: ["payment-flow", "api-reference"],
  },
  {
    id: "api-reference",
    group: "SDK and API",
    title: "API reference",
    summary: "Implemented REST routes are grouped under /api/auth, /api/services, /api/payments, and /api/wallet.",
    body: [
      "Protected routes accept Bearer JWTs or active FluxRoute API keys, depending on the caller surface. Validation is handled by shared Zod schemas where implemented.",
      "Webhook delivery, hosted checkout, managed wallet key generation, and full dashboard CRUD are not production-complete in this repository and should be treated as roadmap items.",
    ],
    related: ["authentication", "service-registry", "payment-flow"],
  },
  {
    id: "security",
    group: "Platform",
    title: "Security model",
    summary: "Production security depends on strict CORS, RS256 keys, hashed API keys, TLS providers, Redis, and reliable RPC.",
    body: [
      "The API sets secure baseline headers, enforces Fastify rate limiting, hashes passwords and API keys, rejects insecure provider URLs by default, and stores unique transaction signatures.",
      "Before public launch, rotate the shared Railway token, use a production Solana RPC endpoint, deploy api.fluxroute.xyz, and add server-issued wallet login nonces.",
    ],
    related: ["production-checklist", "troubleshooting"],
  },
  {
    id: "production-checklist",
    group: "Platform",
    title: "Production checklist",
    summary: "A launch requires DNS, Railway API deployment, migrations, Vercel envs, and smoke tests.",
    body: [
      "Landing and dashboard domains currently resolve. API DNS is not live until api.fluxroute.xyz points to the Railway service and the service has Postgres, Redis, JWT keys, and Solana RPC configured.",
      "Run lint, typecheck, tests, builds, route smoke tests, API health checks, and browser checks after every production deploy.",
    ],
    code: `npm run lint
npm run typecheck
npm test
npm run build
cd fluxroute-landing && npm run lint && npm run build`,
    related: ["troubleshooting", "architecture"],
  },
  {
    id: "troubleshooting",
    group: "Platform",
    title: "Troubleshooting",
    summary: "Most production failures show up as unavailable registry data, CORS errors, or failed payment verification.",
    body: [
      "If the dashboard registry is empty with an API error, verify NEXT_PUBLIC_API_URL, CORS_ORIGIN, API health, Postgres migrations, and Redis connectivity.",
      "If payment verification fails, verify the transaction is confirmed, the memo includes the call id, the recipient wallet matches the provider wallet, and the Solana RPC endpoint can fetch the transaction.",
    ],
    related: ["production-checklist", "payment-flow"],
  },
];

const groups = Array.from(new Set(sections.map((section) => section.group)));

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div className="relative mt-5 overflow-hidden rounded-lg border border-line bg-surface-950 text-surface-100">
      <button
        type="button"
        onClick={copy}
        className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/5 text-white/70 transition-colors hover:text-white"
        aria-label="Copy code"
      >
        {copied ? <Check size={15} /> : <Clipboard size={15} />}
      </button>
      <pre className="overflow-x-auto p-5 pr-14 text-sm leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function DocsClient() {
  const [query, setQuery] = useState("");

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        document.getElementById("docs-search")?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sections;
    return sections.filter((section) =>
      [section.title, section.group, section.summary, ...section.body].join(" ").toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)]">
      <aside className="lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)] lg:overflow-y-auto">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
          <input
            id="docs-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search docs..."
            className="h-11 w-full rounded-md border border-line bg-panel pl-9 pr-16 text-sm text-ink outline-none transition-colors placeholder:text-faint focus:border-brand"
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded border border-line bg-panel-2 px-1.5 py-0.5 text-[0.65rem] text-faint">
            Ctrl K
          </kbd>
        </div>

        <nav className="mt-6 space-y-6" aria-label="Docs">
          {groups.map((group) => (
            <div key={group}>
              <p className="px-2 text-xs font-semibold uppercase tracking-[0.12em] text-faint">{group}</p>
              <div className="mt-2 space-y-1">
                {sections.filter((section) => section.group === group).map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block rounded-md px-2 py-1.5 text-sm text-dim transition-colors hover:bg-panel-2 hover:text-ink"
                  >
                    {section.title}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      <main id="main-content" className="min-w-0 space-y-10">
        {filtered.length === 0 ? (
          <div className="rounded-lg border border-line bg-panel p-8 text-center">
            <p className="text-sm font-semibold text-ink">No docs match that search.</p>
            <p className="mt-1 text-sm text-faint">Try API, payment, MCP, security, or production.</p>
          </div>
        ) : (
          filtered.map((section) => (
            <section id={section.id} key={section.id} className="scroll-mt-24 rounded-lg border border-line bg-panel p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand">{section.group}</p>
              <h2 className="mt-2 text-2xl font-semibold text-ink">{section.title}</h2>
              <p className="mt-3 text-base leading-relaxed text-dim">{section.summary}</p>
              <div className="mt-5 space-y-3">
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="text-sm leading-relaxed text-dim">
                    {paragraph}
                  </p>
                ))}
              </div>
              {section.code && <CodeBlock code={section.code} />}
              {section.related && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {section.related.map((id) => {
                    const related = sections.find((item) => item.id === id);
                    return related ? (
                      <a
                        key={id}
                        href={`#${id}`}
                        className={cn(
                          "rounded-md border border-line px-3 py-1.5 text-xs font-medium text-dim",
                          "transition-colors hover:border-brand/40 hover:text-ink"
                        )}
                      >
                        {related.title}
                      </a>
                    ) : null;
                  })}
                </div>
              )}
            </section>
          ))
        )}
      </main>
    </div>
  );
}
