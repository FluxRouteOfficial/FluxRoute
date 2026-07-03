import Redis from 'ioredis';
export const redis = new (Redis as any)(process.env.REDIS_URL || 'redis://localhost:6379');
