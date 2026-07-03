import { FastifyInstance } from 'fastify';
import { db, users, apiKeys } from '@fluxroute/database';
import { eq, and } from 'drizzle-orm';
import { registerSchema, loginSchema } from '@fluxroute/shared';
import { API_KEY_PREFIX } from '@fluxroute/shared';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import { PublicKey } from '@solana/web3.js';
import nacl from 'tweetnacl';
import { signToken } from '../lib/jwt.js';
import { authenticate } from '../middleware/auth.js';

export async function authRoutes(app: FastifyInstance) {
  // POST /register
  app.post('/register', async (req, reply) => {
    try {
      const body = registerSchema.parse(req.body);
      const existing = await db.select().from(users).where(eq(users.email, body.email)).limit(1);
      if (existing.length) return reply.status(409).send({ success: false, error: 'Email already registered' });

      const passwordHash = await bcrypt.hash(body.password, 12);
      const [user] = await db.insert(users).values({
        email: body.email,
        passwordHash,
        displayName: body.displayName || null,
      }).returning();

      const token = await signToken({ sub: user.id, email: user.email });
      return { success: true, data: { token, user: { id: user.id, email: user.email, displayName: user.displayName } } };
    } catch (err: any) {
      if (err.name === 'ZodError') return reply.status(400).send({ success: false, error: err.errors });
      req.log.error(err);
      return reply.status(500).send({ success: false, error: 'Internal server error' });
    }
  });

  // POST /login
  app.post('/login', async (req, reply) => {
    try {
      const body = loginSchema.parse(req.body);
      const [user] = await db.select().from(users).where(eq(users.email, body.email)).limit(1);
      if (!user) return reply.status(401).send({ success: false, error: 'Invalid credentials' });

      if (!user.passwordHash || !(await bcrypt.compare(body.password, user.passwordHash))) {
        return reply.status(401).send({ success: false, error: 'Invalid credentials' });
      }

      const token = await signToken({ sub: user.id, email: user.email });
      return { success: true, data: { token, user: { id: user.id, email: user.email, displayName: user.displayName } } };
    } catch (err: any) {
      if (err.name === 'ZodError') return reply.status(400).send({ success: false, error: err.errors });
      req.log.error(err);
      return reply.status(500).send({ success: false, error: 'Internal server error' });
    }
  });

  // POST /wallet-auth
  app.post('/wallet-auth', async (req, reply) => {
    try {
      const { walletAddress, signedMessage, nonce } = req.body as {
        walletAddress: string;
        signedMessage: string;
        nonce: string;
      };

      if (!walletAddress || !signedMessage || !nonce) {
        return reply.status(400).send({ success: false, error: 'Missing walletAddress, signedMessage, or nonce' });
      }

      // Verify the signature
      const message = new TextEncoder().encode(`Sign in to FluxRoute: ${nonce}`);
      const signature = Buffer.from(signedMessage, 'base64');
      const pubkey = new PublicKey(walletAddress);
      const verified = nacl.sign.detached.verify(message, signature, pubkey.toBytes());

      if (!verified) return reply.status(401).send({ success: false, error: 'Invalid signature' });

      // Upsert user
      let [user] = await db.select().from(users).where(eq(users.walletAddress, walletAddress)).limit(1);
      if (!user) {
        [user] = await db.insert(users).values({
          email: `${walletAddress.slice(0, 8)}@wallet.fluxroute.xyz`,
          walletAddress,
          walletMode: 'byo',
        }).returning();
      }

      const token = await signToken({ sub: user.id, email: user.email, wallet: walletAddress });
      return { success: true, data: { token, user: { id: user.id, walletAddress: user.walletAddress, displayName: user.displayName } } };
    } catch (err: any) {
      req.log.error(err);
      return reply.status(500).send({ success: false, error: 'Internal server error' });
    }
  });

  // POST /api-keys (authenticated)
  app.post('/api-keys', { preHandler: [authenticate] }, async (req, reply) => {
    try {
      const { name } = req.body as { name: string };
      if (!name) return reply.status(400).send({ success: false, error: 'Name is required' });

      const userId = (req as any).user.sub;
      const rawKey = `${API_KEY_PREFIX}${nanoid(32)}`;
      const keyPrefix = rawKey.slice(0, 12);
      const keyHash = await bcrypt.hash(rawKey, 10);

      const [apiKey] = await db.insert(apiKeys).values({
        userId,
        keyHash,
        keyPrefix,
        name,
      }).returning();

      return { success: true, data: { id: apiKey.id, key: rawKey, prefix: keyPrefix, name: apiKey.name, createdAt: apiKey.createdAt } };
    } catch (err: any) {
      req.log.error(err);
      return reply.status(500).send({ success: false, error: 'Internal server error' });
    }
  });

  // GET /api-keys (authenticated)
  app.get('/api-keys', { preHandler: [authenticate] }, async (req, reply) => {
    try {
      const userId = (req as any).user.sub;
      const keys = await db.select({
        id: apiKeys.id,
        keyPrefix: apiKeys.keyPrefix,
        name: apiKeys.name,
        isActive: apiKeys.isActive,
        lastUsedAt: apiKeys.lastUsedAt,
        createdAt: apiKeys.createdAt,
      }).from(apiKeys).where(and(eq(apiKeys.userId, userId), eq(apiKeys.isActive, true)));

      return { success: true, data: keys };
    } catch (err: any) {
      req.log.error(err);
      return reply.status(500).send({ success: false, error: 'Internal server error' });
    }
  });

  // DELETE /api-keys/:id (authenticated)
  app.delete('/api-keys/:id', { preHandler: [authenticate] }, async (req, reply) => {
    try {
      const userId = (req as any).user.sub;
      const { id } = req.params as { id: string };

      const [key] = await db.select().from(apiKeys).where(and(eq(apiKeys.id, id), eq(apiKeys.userId, userId))).limit(1);
      if (!key) return reply.status(404).send({ success: false, error: 'API key not found' });

      await db.update(apiKeys).set({ isActive: false }).where(eq(apiKeys.id, id));
      return { success: true, data: { message: 'API key deactivated' } };
    } catch (err: any) {
      req.log.error(err);
      return reply.status(500).send({ success: false, error: 'Internal server error' });
    }
  });

  // GET /me (authenticated)
  app.get('/me', { preHandler: [authenticate] }, async (req, reply) => {
    try {
      const userId = (req as any).user.sub;
      const [user] = await db.select({
        id: users.id,
        email: users.email,
        walletAddress: users.walletAddress,
        walletMode: users.walletMode,
        displayName: users.displayName,
        isProvider: users.isProvider,
        createdAt: users.createdAt,
      }).from(users).where(eq(users.id, userId)).limit(1);

      if (!user) return reply.status(404).send({ success: false, error: 'User not found' });
      return { success: true, data: user };
    } catch (err: any) {
      req.log.error(err);
      return reply.status(500).send({ success: false, error: 'Internal server error' });
    }
  });
}
