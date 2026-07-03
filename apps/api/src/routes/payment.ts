import { FastifyInstance } from 'fastify';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import {
  db,
  services,
  callLogs,
  spendLedger,
  earningsLedger,
} from '@fluxroute/database';
import { and, eq } from 'drizzle-orm';
import { redis } from '../lib/redis.js';
import { verifyToken } from '../lib/jwt.js';
import { callServiceSchema, computeFeeSplit, type PaymentRequired } from '@fluxroute/shared';

const RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
const connection = new Connection(RPC_URL, 'confirmed');

// Mainnet USDC SPL mint (override via env for devnet).
const USDC_MINT = process.env.USDC_MINT || 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

const PROXY_TIMEOUT_MS = Number(process.env.PROXY_TIMEOUT_MS) || 15_000;
const MAX_PROVIDER_PAYLOAD_BYTES = Number(process.env.MAX_PROVIDER_PAYLOAD_BYTES) || 64 * 1024;

interface OnChainCheck {
  ok: boolean;
  reason?: string;
  received: number;
  payer: string;
}

/**
 * Verify that an on-chain transaction paid `minAmount` of `currency` to
 * `recipient`, and that its memo references `callId`. Returns the amount
 * received (in whole SOL/USDC units) and the payer address.
 */
async function verifyOnChainPayment(params: {
  txSignature: string;
  recipient: string;
  minAmount: number;
  currency: 'sol' | 'usdc';
  callId: string;
}): Promise<OnChainCheck> {
  const { txSignature, recipient, minAmount, currency, callId } = params;

  const tx = await connection.getTransaction(txSignature, {
    commitment: 'confirmed',
    maxSupportedTransactionVersion: 0,
  });

  if (!tx || !tx.meta) return { ok: false, reason: 'Transaction not found on chain', received: 0, payer: '' };
  if (tx.meta.err) return { ok: false, reason: 'Transaction failed on chain', received: 0, payer: '' };

  const keys = tx.transaction.message.getAccountKeys().staticAccountKeys;
  const payer = keys[0]?.toBase58() ?? '';

  // Memo must reference the call id to bind the payment to this request.
  const memoMatches = tx.meta.logMessages?.some((m) => m.includes(callId)) ?? false;
  if (!memoMatches) return { ok: false, reason: 'Transaction memo does not reference callId', received: 0, payer };

  let received = 0;

  if (currency === 'sol') {
    const idx = keys.findIndex((k) => k.toBase58() === recipient);
    if (idx === -1) return { ok: false, reason: 'Recipient not present in transaction', received: 0, payer };
    received = ((tx.meta.postBalances[idx] || 0) - (tx.meta.preBalances[idx] || 0)) / LAMPORTS_PER_SOL;
  } else {
    // USDC-SPL: compare the recipient-owned token balance for the USDC mint.
    const pre = tx.meta.preTokenBalances ?? [];
    const post = tx.meta.postTokenBalances ?? [];
    const postBal = post.find((b) => b.owner === recipient && b.mint === USDC_MINT);
    if (!postBal) return { ok: false, reason: 'Recipient USDC token balance not found', received: 0, payer };
    const preBal = pre.find((b) => b.owner === recipient && b.mint === USDC_MINT);
    const preAmt = Number(preBal?.uiTokenAmount.uiAmount ?? 0);
    const postAmt = Number(postBal.uiTokenAmount.uiAmount ?? 0);
    received = postAmt - preAmt;
  }

  if (received + 1e-12 < minAmount) {
    return { ok: false, reason: `Insufficient payment: received ${received}, required ${minAmount}`, received, payer };
  }

  return { ok: true, received, payer };
}

/** Upsert a per-day spend ledger row for a managed-mode user. */
async function recordSpend(userId: string, currency: 'sol' | 'usdc', amount: string) {
  const date = new Date().toISOString().slice(0, 10);
  const [existing] = await db
    .select()
    .from(spendLedger)
    .where(and(eq(spendLedger.userId, userId), eq(spendLedger.date, date)))
    .limit(1);

  if (existing) {
    await db
      .update(spendLedger)
      .set({
        totalSol: String(Number(existing.totalSol) + (currency === 'sol' ? Number(amount) : 0)),
        totalUsdc: String(Number(existing.totalUsdc) + (currency === 'usdc' ? Number(amount) : 0)),
        callCount: existing.callCount + 1,
        updatedAt: new Date(),
      })
      .where(eq(spendLedger.id, existing.id));
  } else {
    await db.insert(spendLedger).values({
      userId,
      date,
      totalSol: currency === 'sol' ? amount : '0',
      totalUsdc: currency === 'usdc' ? amount : '0',
      callCount: 1,
    });
  }
}

/** Upsert a per-day earnings ledger row for a provider, tracking the platform fee. */
async function recordEarnings(
  providerId: string,
  currency: 'sol' | 'usdc',
  providerNet: string,
  platformFee: string
) {
  const date = new Date().toISOString().slice(0, 10);
  const [existing] = await db
    .select()
    .from(earningsLedger)
    .where(and(eq(earningsLedger.providerId, providerId), eq(earningsLedger.date, date)))
    .limit(1);

  if (existing) {
    await db
      .update(earningsLedger)
      .set({
        totalSol: String(Number(existing.totalSol) + (currency === 'sol' ? Number(providerNet) : 0)),
        totalUsdc: String(Number(existing.totalUsdc) + (currency === 'usdc' ? Number(providerNet) : 0)),
        platformFeeSol: String(Number(existing.platformFeeSol) + (currency === 'sol' ? Number(platformFee) : 0)),
        platformFeeUsdc: String(Number(existing.platformFeeUsdc) + (currency === 'usdc' ? Number(platformFee) : 0)),
        callCount: existing.callCount + 1,
        updatedAt: new Date(),
      })
      .where(eq(earningsLedger.id, existing.id));
  } else {
    await db.insert(earningsLedger).values({
      providerId,
      date,
      totalSol: currency === 'sol' ? providerNet : '0',
      totalUsdc: currency === 'usdc' ? providerNet : '0',
      platformFeeSol: currency === 'sol' ? platformFee : '0',
      platformFeeUsdc: currency === 'usdc' ? platformFee : '0',
      callCount: 1,
    });
  }
}

function buildProviderUrl(baseUrl: string, endpoint?: string) {
  const base = new URL(baseUrl);
  if (base.protocol !== 'https:' && process.env.ALLOW_INSECURE_PROVIDER_URLS !== 'true') {
    throw new Error('Provider baseUrl must use https');
  }
  if (base.username || base.password) {
    throw new Error('Provider baseUrl must not include credentials');
  }

  const path = callServiceSchema.shape.endpoint.parse(endpoint || '/');
  const target = new URL(path, base);
  if (target.origin !== base.origin) {
    throw new Error('Provider endpoint must stay on the registered provider origin');
  }
  return target.toString();
}

export async function paymentRoutes(app: FastifyInstance) {
  // POST /negotiate - return x402 payment requirements and pre-create a call log.
  app.post('/negotiate', async (req, reply) => {
    try {
      const { serviceId, currency = 'sol' } = req.body as {
        serviceId: string; endpoint?: string; currency?: 'sol' | 'usdc';
      };

      if (!serviceId) return reply.status(400).send({ success: false, error: 'serviceId is required' });
      if (currency !== 'sol' && currency !== 'usdc') {
        return reply.status(400).send({ success: false, error: "currency must be 'sol' or 'usdc'" });
      }

      const [service] = await db.select().from(services).where(eq(services.serviceId, serviceId)).limit(1);
      if (!service) return reply.status(404).send({ success: false, error: 'Service not found' });
      if (!service.isActive) return reply.status(409).send({ success: false, error: 'Service is not active' });

      // Associate the call with the authenticated user when a token is present
      // (managed mode). Anonymous BYO callers leave userId null.
      let userId: string | null = null;
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith('Bearer ')) {
        try {
          const payload = await verifyToken(authHeader.slice(7));
          userId = (payload.sub as string) ?? null;
        } catch {
          /* anonymous negotiate is allowed */
        }
      }

      const amount = currency === 'usdc' ? service.priceUsdc : service.priceSol;
      const callId = crypto.randomUUID();

      const paymentRequired: PaymentRequired = {
        protocol: 'exact',
        network: 'solana-mainnet',
        currency: currency === 'usdc' ? 'USDC-SPL' : 'SOL',
        amount,
        payTo: service.providerWallet,
        memo: callId,
        expires: Date.now() + 300_000, // 5 minutes
      };

      await db.insert(callLogs).values({
        userId,
        serviceId: service.id,
        callId,
        currency,
        amountSol: currency === 'sol' ? amount : null,
        amountUsdc: currency === 'usdc' ? amount : null,
        status: 'pending',
      });

      return reply.status(402).send({ success: true, data: { ...paymentRequired, callId } });
    } catch (err: any) {
      req.log.error(err);
      return reply.status(500).send({ success: false, error: 'Internal server error' });
    }
  });

  // POST /verify - verify a Solana transaction and mark the call paid.
  app.post('/verify', async (req, reply) => {
    try {
      const { callId, txSignature } = req.body as { callId: string; txSignature: string };
      if (!callId || !txSignature) {
        return reply.status(400).send({ success: false, error: 'callId and txSignature are required' });
      }

      const [log] = await db.select().from(callLogs).where(eq(callLogs.callId, callId)).limit(1);
      if (!log) return reply.status(404).send({ success: false, error: 'Call not found' });

      const [service] = await db.select().from(services).where(eq(services.id, log.serviceId)).limit(1);
      if (!service) return reply.status(404).send({ success: false, error: 'Service not found' });

      const minAmount = Number(log.currency === 'usdc' ? log.amountUsdc : log.amountSol);
      const check = await verifyOnChainPayment({
        txSignature,
        recipient: service.providerWallet,
        minAmount,
        currency: log.currency,
        callId,
      });

      if (!check.ok) return reply.status(400).send({ success: false, error: check.reason });

      await db.update(callLogs).set({ txSignature, status: 'paid' }).where(eq(callLogs.callId, callId));
      await redis.set(
        `payment:${callId}`,
        JSON.stringify({ txSignature, status: 'paid', verifiedAt: new Date().toISOString() }),
        'EX',
        86400
      );

      return { success: true, data: { callId, txSignature, status: 'paid', payer: check.payer } };
    } catch (err: any) {
      req.log.error(err);
      return reply.status(500).send({ success: false, error: 'Internal server error' });
    }
  });

  // GET /status/:callId - check payment status (Redis fast-path, DB fallback).
  app.get('/status/:callId', async (req, reply) => {
    try {
      const { callId } = req.params as { callId: string };
      const cached = await redis.get(`payment:${callId}`);
      if (cached) return { success: true, data: JSON.parse(cached) };

      const [log] = await db.select().from(callLogs).where(eq(callLogs.callId, callId)).limit(1);
      if (!log) return reply.status(404).send({ success: false, error: 'Call not found' });

      return { success: true, data: { callId: log.callId, status: log.status, txSignature: log.txSignature } };
    } catch (err: any) {
      req.log.error(err);
      return reply.status(500).send({ success: false, error: 'Internal server error' });
    }
  });

  // POST /execute - verify payment, proxy to the provider, audit, and settle ledgers.
  app.post('/execute', async (req, reply) => {
    const startedAt = Date.now();
    try {
      const { callId, txSignature, endpoint, params } = req.body as {
        callId: string; txSignature: string; endpoint?: string; params?: Record<string, unknown>;
      };

      if (!callId || !txSignature) {
        return reply.status(400).send({ success: false, error: 'callId and txSignature are required' });
      }

      const [log] = await db.select().from(callLogs).where(eq(callLogs.callId, callId)).limit(1);
      if (!log) return reply.status(404).send({ success: false, error: 'Call not found' });

      // Idempotency: never proxy or settle the same call twice.
      if (log.status === 'fulfilled') {
        return reply.status(409).send({ success: false, error: 'Call already fulfilled' });
      }

      const [service] = await db.select().from(services).where(eq(services.id, log.serviceId)).limit(1);
      if (!service) return reply.status(404).send({ success: false, error: 'Service not found' });

      // Guard against tx-signature replay across calls.
      const existingTx = await db.select().from(callLogs).where(eq(callLogs.txSignature, txSignature)).limit(1);
      if (existingTx.length && existingTx[0].callId !== callId) {
        return reply.status(409).send({ success: false, error: 'Transaction signature already used' });
      }

      const charged = log.currency === 'usdc' ? log.amountUsdc : log.amountSol;
      if (charged == null) {
        return reply.status(409).send({ success: false, error: 'Call has no recorded amount' });
      }
      const minAmount = Number(charged);

      const check = await verifyOnChainPayment({
        txSignature,
        recipient: service.providerWallet,
        minAmount,
        currency: log.currency,
        callId,
      });

      if (!check.ok) {
        await db.update(callLogs)
          .set({ status: 'failed', txSignature, errorMessage: check.reason })
          .where(eq(callLogs.callId, callId));
        return reply.status(402).send({ success: false, error: check.reason });
      }

      await db.update(callLogs).set({ status: 'paid', txSignature }).where(eq(callLogs.callId, callId));

      // Proxy the request to the provider's real API.
      let targetUrl: string;
      try {
        targetUrl = buildProviderUrl(service.baseUrl, endpoint);
      } catch (err: any) {
        return reply.status(400).send({ success: false, error: err.message || 'Invalid provider endpoint' });
      }

      const providerPayload = JSON.stringify(params ?? {});
      if (Buffer.byteLength(providerPayload) > MAX_PROVIDER_PAYLOAD_BYTES) {
        return reply.status(413).send({ success: false, error: 'Provider request payload is too large' });
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), PROXY_TIMEOUT_MS);

      let providerStatus = 0;
      let providerBody: unknown = null;
      try {
        const providerRes = await fetch(targetUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-FluxRoute-Verified': 'true',
            'X-Call-ID': callId,
          },
          body: providerPayload,
          signal: controller.signal,
        });
        providerStatus = providerRes.status;
        const text = await providerRes.text();
        try { providerBody = JSON.parse(text); } catch { providerBody = text; }
      } catch (proxyErr: any) {
        clearTimeout(timeout);
        const latencyMs = Date.now() - startedAt;
        await db.update(callLogs)
          .set({ status: 'failed', latencyMs, errorMessage: `Provider unreachable: ${proxyErr?.message ?? 'error'}` })
          .where(eq(callLogs.callId, callId));
        return reply.status(502).send({ success: false, error: 'Provider request failed' });
      }
      clearTimeout(timeout);

      const latencyMs = Date.now() - startedAt;
      const providerOk = providerStatus >= 200 && providerStatus < 300;

      // Settle ledgers only on a successful fulfilment.
      if (providerOk) {
        const { providerNet, platformFee } = computeFeeSplit(charged, log.currency);
        if (log.userId) await recordSpend(log.userId, log.currency, charged);
        await recordEarnings(service.providerId, log.currency, providerNet, platformFee);
        await db.update(services)
          .set({ totalCalls: service.totalCalls + 1, updatedAt: new Date() })
          .where(eq(services.id, service.id));
      }

      await db.update(callLogs)
        .set({
          status: providerOk ? 'fulfilled' : 'failed',
          latencyMs,
          responseStatus: providerStatus,
          requestParams: params ?? null,
          errorMessage: providerOk ? null : `Provider returned ${providerStatus}`,
        })
        .where(eq(callLogs.callId, callId));

      await redis.set(
        `payment:${callId}`,
        JSON.stringify({ txSignature, status: providerOk ? 'fulfilled' : 'failed', verifiedAt: new Date().toISOString() }),
        'EX',
        86400
      );

      if (!providerOk) {
        return reply.status(502).send({ success: false, error: `Provider returned ${providerStatus}`, data: providerBody });
      }

      return {
        success: true,
        data: { callId, status: 'fulfilled', latencyMs, response: providerBody },
      };
    } catch (err: any) {
      req.log.error(err);
      return reply.status(500).send({ success: false, error: 'Internal server error' });
    }
  });
}
