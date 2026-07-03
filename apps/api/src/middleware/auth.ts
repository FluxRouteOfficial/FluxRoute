import { FastifyRequest, FastifyReply } from 'fastify';
import { verifyToken } from '../lib/jwt.js';
import { db, apiKeys } from '@fluxroute/database';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function authenticate(req: FastifyRequest, reply: FastifyReply) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return reply.status(401).send({ success: false, error: 'Missing authorization' });

  if (authHeader.startsWith('Bearer ')) {
    try {
      const payload = await verifyToken(authHeader.slice(7));
      (req as any).user = payload;
    } catch {
      return reply.status(401).send({ success: false, error: 'Invalid token' });
    }
  } else if (authHeader.startsWith('ApiKey ')) {
    const key = authHeader.slice(7);
    const prefix = key.slice(0, 12);
    const rows = await db.select().from(apiKeys).where(eq(apiKeys.keyPrefix, prefix)).limit(1);
    const row = rows[0];
    const expired = row?.expiresAt ? row.expiresAt.getTime() <= Date.now() : false;
    if (!row || !row.isActive || expired || !await bcrypt.compare(key, row.keyHash)) {
      return reply.status(401).send({ success: false, error: 'Invalid API key' });
    }
    await db.update(apiKeys).set({ lastUsedAt: new Date() }).where(eq(apiKeys.id, row.id));
    (req as any).user = { sub: row.userId };
  } else {
    return reply.status(401).send({ success: false, error: 'Invalid auth scheme' });
  }
}
