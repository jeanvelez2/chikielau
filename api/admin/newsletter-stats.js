import { Redis } from '@upstash/redis';
import { adminAuth } from '../_lib/config.js';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  if (!adminAuth(req)) return res.status(401).json({ error: 'Unauthorized' });
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  res.setHeader('Cache-Control', 'no-store');

  const { id } = req.query;
  if (!id || id.length > 64) return res.status(400).json({ error: 'Newsletter ID required' });

  try {
    const total = await redis.hget(`newsletter-opens:${id}`, 'total') || 0;
    const unique = await redis.scard(`newsletter-opens:${id}:unique`) || 0;
    return res.status(200).json({ success: true, opens: { total: Number(total), unique: Number(unique) } });
  } catch (error) {
    console.error('Stats error:', error);
    return res.status(500).json({ error: 'Failed to fetch stats' });
  }
}
