import { FastifyInstance } from 'fastify';
import { db, managedWallets, budgetConfigs, spendLedger } from '@fluxroute/database';
import { and, desc, eq } from 'drizzle-orm';
import { budgetConfigSchema } from '@fluxroute/shared';
import { authenticate } from '../middleware/auth.js';

export async function walletRoutes(app: FastifyInstance) {
  // GET /balance (authenticated)
  app.get('/balance', { preHandler: [authenticate] }, async (req, reply) => {
    try {
      const userId = (req as any).user.sub;
      const [wallet] = await db.select().from(managedWallets).where(eq(managedWallets.userId, userId)).limit(1);

      if (!wallet) return { success: true, data: { solBalance: '0', usdcBalance: '0', walletAddress: null } };

      return {
        success: true,
        data: {
          walletAddress: wallet.walletAddress,
          solBalance: wallet.solBalance,
          usdcBalance: wallet.usdcBalance,
          updatedAt: wallet.updatedAt,
        },
      };
    } catch (err: any) {
      req.log.error(err);
      return reply.status(500).send({ success: false, error: 'Internal server error' });
    }
  });

  // GET /budget (authenticated)
  app.get('/budget', { preHandler: [authenticate] }, async (req, reply) => {
    try {
      const userId = (req as any).user.sub;
      const [config] = await db.select().from(budgetConfigs).where(eq(budgetConfigs.userId, userId)).limit(1);

      // Get current day spend
      const today = new Date().toISOString().slice(0, 10);
      const [todaySpend] = await db.select().from(spendLedger)
        .where(and(eq(spendLedger.userId, userId), eq(spendLedger.date, today)))
        .limit(1);

      return {
        success: true,
        data: {
          config: config || null,
          currentSpend: todaySpend ? { dailySol: todaySpend.totalSol, dailyUsdc: todaySpend.totalUsdc, calls: todaySpend.callCount } : { dailySol: '0', dailyUsdc: '0', calls: 0 },
        },
      };
    } catch (err: any) {
      req.log.error(err);
      return reply.status(500).send({ success: false, error: 'Internal server error' });
    }
  });

  // PUT /budget (authenticated)
  app.put('/budget', { preHandler: [authenticate] }, async (req, reply) => {
    try {
      const userId = (req as any).user.sub;
      const body = budgetConfigSchema.parse(req.body);

      const [existing] = await db.select().from(budgetConfigs).where(eq(budgetConfigs.userId, userId)).limit(1);

      if (existing) {
        const [updated] = await db.update(budgetConfigs)
          .set({ ...body, updatedAt: new Date() })
          .where(eq(budgetConfigs.userId, userId))
          .returning();
        return { success: true, data: updated };
      } else {
        const [created] = await db.insert(budgetConfigs)
          .values({ userId, ...body })
          .returning();
        return { success: true, data: created };
      }
    } catch (err: any) {
      if (err.name === 'ZodError') return reply.status(400).send({ success: false, error: err.errors });
      req.log.error(err);
      return reply.status(500).send({ success: false, error: 'Internal server error' });
    }
  });

  // GET /spend-history (authenticated)
  app.get('/spend-history', { preHandler: [authenticate] }, async (req, reply) => {
    try {
      const userId = (req as any).user.sub;
      const { page = '1', limit = '30' } = req.query as Record<string, string>;
      const offset = (Number(page) - 1) * Number(limit);

      const rows = await db.select().from(spendLedger)
        .where(eq(spendLedger.userId, userId))
        .orderBy(desc(spendLedger.date))
        .limit(Number(limit))
        .offset(offset);

      return { success: true, data: { entries: rows, pagination: { page: Number(page), limit: Number(limit) } } };
    } catch (err: any) {
      req.log.error(err);
      return reply.status(500).send({ success: false, error: 'Internal server error' });
    }
  });
}
