import { FastifyInstance } from 'fastify';
import { db, services, serviceEndpoints, users } from '@fluxroute/database';
import { eq, and, ilike, count, type SQL } from 'drizzle-orm';
import { createEndpointSchema, createServiceSchema, listServicesQuerySchema, updateServiceSchema } from '@fluxroute/shared';
import { authenticate } from '../middleware/auth.js';

export async function registryRoutes(app: FastifyInstance) {
  // GET / - list services with pagination
  app.get('/', async (req, reply) => {
    try {
      const { page, limit, category, search } = listServicesQuerySchema.parse(req.query);
      const offset = (page - 1) * limit;

      const filters: SQL[] = [eq(services.isActive, true)];

      if (category) {
        filters.push(eq(services.category, category));
      }
      if (search) {
        filters.push(ilike(services.name, `%${search}%`));
      }

      const where = and(...filters);
      const rows = await db.select().from(services).where(where).limit(limit).offset(offset);
      const [{ total }] = await db.select({ total: count() }).from(services).where(where);

      return { success: true, data: { services: rows, pagination: { page, limit, total } } };
    } catch (err: any) {
      if (err.name === 'ZodError') return reply.status(400).send({ success: false, error: err.errors });
      req.log.error(err);
      return reply.status(500).send({ success: false, error: 'Internal server error' });
    }
  });

  // GET /categories - list all categories with counts
  app.get('/categories', async (req, reply) => {
    try {
      const rows = await db
        .select({ category: services.category, count: count() })
        .from(services)
        .where(eq(services.isActive, true))
        .groupBy(services.category);

      return { success: true, data: rows };
    } catch (err: any) {
      req.log.error(err);
      return reply.status(500).send({ success: false, error: 'Internal server error' });
    }
  });

  // GET /:serviceId - get single service with endpoints
  app.get('/:serviceId', async (req, reply) => {
    try {
      const { serviceId } = req.params as { serviceId: string };
      const [service] = await db.select().from(services).where(eq(services.serviceId, serviceId)).limit(1);
      if (!service) return reply.status(404).send({ success: false, error: 'Service not found' });

      const endpoints = await db.select().from(serviceEndpoints).where(eq(serviceEndpoints.serviceId, service.id));
      return { success: true, data: { ...service, endpoints } };
    } catch (err: any) {
      req.log.error(err);
      return reply.status(500).send({ success: false, error: 'Internal server error' });
    }
  });

  // POST / - create service (authenticated, provider only)
  app.post('/', { preHandler: [authenticate] }, async (req, reply) => {
    try {
      const userId = (req as any).user.sub;
      const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      if (!user?.isProvider) return reply.status(403).send({ success: false, error: 'Provider access required' });

      const body = createServiceSchema.parse(req.body);
      const existing = await db.select().from(services).where(eq(services.serviceId, body.serviceId)).limit(1);
      if (existing.length) return reply.status(409).send({ success: false, error: 'Service ID already exists' });

      const [service] = await db.insert(services).values({
        providerId: userId,
        serviceId: body.serviceId,
        name: body.name,
        description: body.description,
        category: body.category,
        baseUrl: body.baseUrl,
        providerWallet: body.providerWallet,
        priceSol: body.priceSol,
        priceUsdc: body.priceUsdc,
      }).returning();

      return reply.status(201).send({ success: true, data: service });
    } catch (err: any) {
      if (err.name === 'ZodError') return reply.status(400).send({ success: false, error: err.errors });
      req.log.error(err);
      return reply.status(500).send({ success: false, error: 'Internal server error' });
    }
  });

  // PUT /:serviceId - update service (authenticated, owner only)
  app.put('/:serviceId', { preHandler: [authenticate] }, async (req, reply) => {
    try {
      const userId = (req as any).user.sub;
      const { serviceId } = req.params as { serviceId: string };

      const [service] = await db.select().from(services).where(eq(services.serviceId, serviceId)).limit(1);
      if (!service) return reply.status(404).send({ success: false, error: 'Service not found' });
      if (service.providerId !== userId) return reply.status(403).send({ success: false, error: 'Not authorized' });

      const filtered = updateServiceSchema.parse(req.body);

      const [updated] = await db.update(services)
        .set({ ...filtered, updatedAt: new Date() })
        .where(eq(services.id, service.id))
        .returning();

      return { success: true, data: updated };
    } catch (err: any) {
      if (err.name === 'ZodError') return reply.status(400).send({ success: false, error: err.errors });
      req.log.error(err);
      return reply.status(500).send({ success: false, error: 'Internal server error' });
    }
  });

  // DELETE /:serviceId - soft delete (authenticated, owner only)
  app.delete('/:serviceId', { preHandler: [authenticate] }, async (req, reply) => {
    try {
      const userId = (req as any).user.sub;
      const { serviceId } = req.params as { serviceId: string };

      const [service] = await db.select().from(services).where(eq(services.serviceId, serviceId)).limit(1);
      if (!service) return reply.status(404).send({ success: false, error: 'Service not found' });
      if (service.providerId !== userId) return reply.status(403).send({ success: false, error: 'Not authorized' });

      await db.update(services).set({ isActive: false, updatedAt: new Date() }).where(eq(services.id, service.id));
      return { success: true, data: { message: 'Service deactivated' } };
    } catch (err: any) {
      req.log.error(err);
      return reply.status(500).send({ success: false, error: 'Internal server error' });
    }
  });

  // POST /:serviceId/endpoints - add endpoint to service
  app.post('/:serviceId/endpoints', { preHandler: [authenticate] }, async (req, reply) => {
    try {
      const userId = (req as any).user.sub;
      const { serviceId } = req.params as { serviceId: string };

      const [service] = await db.select().from(services).where(eq(services.serviceId, serviceId)).limit(1);
      if (!service) return reply.status(404).send({ success: false, error: 'Service not found' });
      if (service.providerId !== userId) return reply.status(403).send({ success: false, error: 'Not authorized' });

      const rawBody = req.body as Record<string, unknown>;
      const { path, method, description, paramsSchema } = createEndpointSchema.parse({
        ...rawBody,
        method: String(rawBody?.method ?? '').toUpperCase(),
      });

      const [endpoint] = await db.insert(serviceEndpoints).values({
        serviceId: service.id,
        path,
        method: method.toUpperCase(),
        description: description || null,
        paramsSchema: paramsSchema || null,
      }).returning();

      return reply.status(201).send({ success: true, data: endpoint });
    } catch (err: any) {
      if (err.name === 'ZodError') return reply.status(400).send({ success: false, error: err.errors });
      req.log.error(err);
      return reply.status(500).send({ success: false, error: 'Internal server error' });
    }
  });
}
