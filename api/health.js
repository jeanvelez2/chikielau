import { Redis } from '@upstash/redis';
import { safeCompare } from './_lib/config.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  if (!safeCompare(req.headers.authorization || '', `Bearer ${process.env.CRON_SECRET}`)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const redis = Redis.fromEnv();
    await redis.ping();
    return res.status(200).json({ status: 'ok', redis: 'connected', timestamp: new Date().toISOString() });
  } catch (err) {
    return res.status(503).json({ status: 'error', redis: 'disconnected' });
  }
}
